# Panduan Konfigurasi Firewall K3s Multi-Node (Ansible IaC)

Dokumen ini menjelaskan arsitektur keamanan firewall (UFW) pada cluster Kubernetes multi-node JadiSah (`k8s-master-01` dan `k8s-worker-1`), serta cara menjalankannya menggunakan Ansible.

---

## 1. Mengapa UFW Default Sering Memutus Jaringan Kubernetes?

Secara default, instalasi Ubuntu Linux dengan UFW mengaktifkan aturan:
```ini
# /etc/default/ufw
DEFAULT_FORWARD_POLICY="DROP"
```

Dalam arsitektur Kubernetes:
- Komunikasi antar-pod melintasi antarmuka virtual (`cni0` dan `flannel.1`).
- Ketika sebuah pod di node worker (`10.42.1.8`) mencoba menghubungi CoreDNS di node master (`10.43.0.10:53`), paket tersebut harus di-**forward** (diteruskan) oleh kernel Linux melintasi kartu jaringan fisik (`ens18`).
- Jika `DEFAULT_FORWARD_POLICY="DROP"`, kernel Linux akan **membuang (drop)** paket tersebut, menyebabkan error:
  `lookup ... on 10.43.0.10:53: read udp ...: i/o timeout`.

**Solusi yang Diterapkan oleh Ansible:**
1. Mengubah `DEFAULT_FORWARD_POLICY="ACCEPT"` di `/etc/default/ufw`.
2. Mengizinkan seluruh traffic antar antarmuka CNI (`cni0` dan `flannel.1`).
3. Mengizinkan seluruh traffic internal pada subnet LAN Proxmox (`192.168.1.0/24`).

---

## 2. Rincian Port Firewall K3s yang Dikonfigurasi

| Port / Protocol | Arah Traffic | Sumber / Tujuan | Keterangan |
| :--- | :---: | :---: | :--- |
| **22 / TCP** | Inbound | All / Management | Akses SSH remote management & Ansible |
| **Interface `tailscale0`** | Inbound / Outbound | Tailscale Mesh | Komunikasi aman antar node via VPN Tailscale |
| **Interface `cni0`** | Inbound / Outbound | Pods lokal | Jembatan virtual bridge container lokal node |
| **Interface `flannel.1`**| Inbound / Outbound | Cross-node pods | Jaringan overlay VXLAN antar pod lintas server |
| **Subnet `192.168.1.0/24`** | Inbound | Node internal LAN | Seluruh komunikasi antar master dan worker di LAN lokal |
| **8472 / UDP** | Inbound | All nodes | Flannel VXLAN overlay network (wajib untuk K3s) |
| **10250 / TCP** | Inbound | Master -> Worker | Kubelet API, container logs, dan `kubectl exec` |
| **6443 / TCP** | Inbound | Worker -> Master | K3s API Server (khusus grup `k3s_servers`) |
| **80, 443 / TCP** | Inbound | Public / Ingress | Traefik Ingress Controller HTTP & HTTPS |

---

## 3. Cara Menjalankan Playbook Ansible

Pastikan Anda berada di direktori `k8s-infra/ansible`:

```bash
cd k8s-infra/ansible

# 1. Jalankan syntax check
ansible-playbook playbooks/firewall.yml --syntax-check

# 2. Eksekusi konfigurasi firewall ke seluruh node (Master & Worker)
ansible-playbook playbooks/firewall.yml
```

> [!TIP]
> Jika Anda menggunakan SSH Jump Host untuk mengakses worker (karena IP Tailscale worker diubah), Ansible sudah otomatis menggunakan konfigurasi `ansible.cfg` dan inventory `hosts.yml`.

---

## 4. Verifikasi Status Firewall

Setelah playbook selesai dieksekusi, Anda dapat memverifikasi status UFW di masing-masing node:

```bash
# Cek status UFW di k8s-master-01 atau k8s-worker-1:
sudo ufw status verbose
```

Pastikan baris policy menampilkan:
```
Default: deny (incoming), allow (outgoing), allow (routed)
```

---

## 5. Mengaktifkan Kembali Node Worker (Uncordon)

Setelah firewall dikonfigurasi, aktifkan kembali penjadwalan pod ke worker:

```bash
# Aktifkan kembali node worker
kubectl uncordon k8s-worker-1

# Cek status node
kubectl get nodes -o wide
```
Node `k8s-worker-1` sekarang siap menerima pod kembali dan seluruh komunikasi antar-pod tidak akan mengalami DNS timeout lagi.

