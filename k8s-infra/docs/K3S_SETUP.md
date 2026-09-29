# Panduan Instalasi K3s dengan Ansible

Panduan ini ditujukan untuk menyiapkan node K3s menggunakan Ansible yang sudah kita buat, murni dari sisi Administrator tanpa perlu eksekusi manual di dalam server. 

## Struktur Eksekusi
1. **Preparation**: Menyiapkan OS, mematikan Swap, set Hostname.
2. **Tailscale Check**: Validasi Tailscale berjalan normal (Read-only, tidak akan memutuskan SSH).
3. **K3s Server**: Menginstall Kubernetes Master Node K3s.

## Langkah-langkah Menjalankan

### Langkah 1: Persiapan OS dan Validasi Tailscale
Jalankan perintah berikut di dalam WSL Anda:

```bash
cd /mnt/d/eksplor/JadiSah-Application/k8s-infra/ansible

# Matikan Swap dan siapkan package dasar
ansible-playbook playbooks/prepare.yml -K

# Validasi Tailscale aman (HANYA CEK STATUS, AMAN DARI PUTUS SSH)
ansible-playbook playbooks/tailscale.yml -K
```
*Catatan: Parameter `-K` digunakan agar Ansible menanyakan password sudo (jds).*

### Langkah 2: Instalasi K3s Master Node
Jika Langkah 1 berhasil tanpa error, lanjutkan menginstall Kubernetes:

```bash
cd /mnt/d/eksplor/JadiSah-Application/k8s-infra/ansible

ansible-playbook playbooks/k3s-server.yml -K
```

### Langkah 3: Validasi Cluster (Milestone 1)
Masuk ke server (`ssh -i ~/.ssh/jadi_sah jds@100.79.211.49`) dan jalankan perintah berikut untuk memastikan K3s berhasil terpasang:

```bash
# Pastikan node berstatus Ready dan INTERNAL-IP menggunakan IP Tailscale (100.79.211.49)
kubectl get nodes -o wide

# Pastikan pod bawaan K3s (CoreDNS, Traefik, Metrics, Local-Path) berjalan (Running)
kubectl get pods -A
```

## Troubleshooting
- Jika K3s gagal menyala, pastikan Swap benar-benar mati dengan `swapon --show` (harus kosong).
- File konfigurasi akses Kubernetes (*kubeconfig*) sudah dicopy otomatis ke `~/.kube/config` pada user `jds`. Anda bisa langsung menggunakan perintah `kubectl` tanpa `sudo`.
