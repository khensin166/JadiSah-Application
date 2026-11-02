# ☸️ Catatan Ilmu: Manajemen Node, Pod Scheduling, & Migrasi Workload di Kubernetes

Dokumen ini berisi rangkuman komprehensif mengenai arsitektur node di K3s, perbedaan pod *Stateless* vs *Stateful*, serta teknik simulasi dan operasional perpindahan (*rescheduling / eviction*) pods di cluster Kubernetes JadiSah.

---

## 1. Arsitektur Multi-Node di K3s

Di Kubernetes standar (Kubeadm), node master biasanya memiliki *taint* `NoSchedule` agar tidak menjalankan beban kerja aplikasi. Namun di **K3s**, node master dirancang lebih efisien:

```
┌────────────────────────────────────────────────────────┐
│              CLUSTER KUBERNETES JADISAH                │
├────────────────────────────┬───────────────────────────┤
│  k8s-master-01 (192.168.1.25) │  k8s-worker-1 (192.168.1.30)  │
│  - Control Plane (Master)  │  - Dedicated Worker       │
│  - Berfungsi juga sbg Worker│                           │
│  - Menjalankan Pods Beban   │  - Menjalankan Pods Beban │
└────────────────────────────┴───────────────────────────┘
```

* **`k8s-master-01`**: Otak cluster (API Server, Controller Manager, SQLite/Kine) **sekaligus Worker** yang dapat menjalankan pods aplikasi dan database.
* **`k8s-worker-1`**: Worker murni yang menjalankan `k3s-agent` (kubelet & containerd) untuk mengeksekusi kontainer.

### Memberikan Label Peran Worker
Agar kolom `ROLES` pada `kubectl get nodes` menampilkan label `worker` secara eksplisit:
```bash
# Label master sebagai worker juga
kubectl label node k8s-master-01 node-role.kubernetes.io/worker=worker

# Label worker dedicated
kubectl label node k8s-worker-1 node-role.kubernetes.io/worker=worker
```

---

## 2. Konsep Kunci: Pod Stateless vs Stateful

Ini adalah hal paling penting sebelum memindahkan beban kerja:

### A. Pod Stateless (Frontend, Backend, Staging DB Ephemeral)
* **Karakteristik**: Tidak menyimpan data permanen di disk lokal node (atau data hanya sementara di memori kontainer).
* **Perilaku Migrasi**: Sangat mudah dan aman dipindahkan kapan saja. Jika pod dimatikan di Master, pod pengganti langsung dibuat di Worker dalam hitungan 2–5 detik tanpa kendala penyimpanan.

### B. Pod Stateful (Database dengan PVC `local-path`)
* **Karakteristik**: Menggunakan `PersistentVolumeClaim` (PVC) dengan `storageClassName: local-path` (bawaan K3s).
* **Lokasi Data Fisik**: Data tersimpan di folder lokal host node terkait (misalnya `/var/lib/rancher/k3s/storage/pvc-...` di `k8s-master-01`).
* **Batasan Migrasi**:
  * PV `local-path` memiliki aturan `nodeAffinity` yang mengikatnya permanen ke node tempat data pertama kali dibuat.
  * Jika pod stateful dipaksa pindah ke node worker tanpa memindahkan disk fisiknya, pod akan berstatus **`Pending`** dengan error:
    ```text
    0/2 nodes are available: 1 node(s) had volume node-affinity conflict.
    ```
* **Solusi Jangka Panjang untuk Stateful Multi-Node**: Menggunakan Distributed Storage seperti **Longhorn**, **NFS Share**, atau **Ceph** yang membuat storage dapat dibaca/ditulis dari node manapun.

---

## 3. Metode Simulasi Perpindahan Pods

Berikut adalah metode yang umum dipraktikkan untuk mengatur dan memindahkan alokasi pods antar node:

### Metode 1: Simulasi Maintenance Server (`cordon` & `drain`)
Digunakan ketika sebuah node fisik/VM perlu di-restart, upgrade OS, atau dipelihara tanpa mematikan layanan aplikasi (*zero downtime*).

```bash
# 1. Kunci node agar scheduler tidak memasang pod baru ke node ini
kubectl cordon k8s-master-01

# 2. Evakuasi (usir) semua pod dari node master menuju worker
kubectl drain k8s-master-01 --ignore-daemonsets --delete-emptydir-data --force

# 3. Pantau proses evakuasi dan pembuatan pod baru di worker:
kubectl get pods -A -o wide -w

# 4. Setelah selesai maintenance, buka kembali node agar bisa menerima pod:
kubectl uncordon k8s-master-01
```

> **Catatan:**
> * `--ignore-daemonsets`: Mengabaikan pod sistem (seperti CNI Flannel/Traefik LB) yang wajib ada di setiap node.
> * `--delete-emptydir-data`: Mengizinkan pod yang memakai volume `emptyDir` sementara untuk di-evakuasi.

---

### Metode 2: Penempatan Terarah Menggunakan `nodeSelector`
Digunakan jika Anda ingin secara spesifik menentukan pod tertentu HANYA boleh berjalan di node tertentu (misalnya frontend di worker, database di master).

Tambahkan blok `nodeSelector` di dalam `spec.template.spec` pada manifest Deployment/StatefulSet:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: staging
spec:
  template:
    spec:
      nodeSelector:
        kubernetes.io/hostname: k8s-worker-1   # Mengunci ke worker-1
      containers:
      - name: frontend
        image: ...
```

Terapkan perubahan dan rolling restart:
```bash
kubectl apply -f manifest.yml
kubectl rollout restart deployment frontend -n staging
```

---

### Metode 3: Penjadwalan Dinamis (Affinity & Anti-Affinity)

Jika Anda memiliki 2 atau lebih replica pod (misal 2 replica Backend), Anda dapat mencegah kedua replica berjalan di node yang sama (*High Availability*):

```yaml
spec:
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app
              operator: In
              values:
              - backend
          topologyKey: "kubernetes.io/hostname"
```
*Dengan aturan ini, Scheduler otomatis membagi: 1 Pod Backend di Master, 1 Pod Backend di Worker.*

---

### Metode 4: Taints dan Tolerations
Digunakan untuk "menolak" pod biasa masuk ke node tertentu kecuali pod tersebut memiliki izin khusus (*toleration*).

* **Contoh Kasus**: Menandai VM Master hanya khusus Database:
  ```bash
  kubectl taint nodes k8s-master-01 dedicated=database:NoSchedule
  ```
* Pod biasa (frontend/backend) tidak akan bisa dijadwalkan di master dan otomatis lari ke `k8s-worker-1`.
* Untuk menghapus taint:
  ```bash
  kubectl taint nodes k8s-master-01 dedicated=database:NoSchedule-
  ```

---

## 4. Cheatsheet Pemantauan & Troubleshooting

| Perintah | Deskripsi |
| :--- | :--- |
| `kubectl get nodes -o wide` | Melihat seluruh node, IP internal, dan versi kernel/runtime |
| `kubectl get pods -A -o wide` | Melihat letak node tempat setiap pod berjalan (`NODE` column) |
| `kubectl get pods -w` | Menonton status transisi pod secara realtime (*Watching*) |
| `kubectl describe pod <nama-pod> -n <ns>` | Mengetahui alasan kenapa pod berstatus `Pending` / Gagal terjadwal di tab `Events` |
| `kubectl top nodes` | Melihat konsumsi CPU & RAM per node |
| `k9s` | Terminal UI interaktif untuk mengelola dan memonitor seluruh cluster |

---

## 5. Ringkasan Praktik Terbaik JadiSah
1. **Pemisahan Peran Ideal**:
   - `k8s-master-01` (RAM 31 GB, Disk 1 TB): Control Plane, Database PostgreSQL (`database`), Storage Volume, dan Sistem Logging/Monitoring.
   - `k8s-worker-1` (RAM 11 GB, Disk 200 GB): Pods Stateless Aplikasi (Frontend, Backend Go API), Ingress Controller, ArgoCD / CI Runners.
2. **Uji Coba Rolling**: Selalu gunakan namespace `staging` terlebih dahulu sebelum menguji pemindahan pod pada namespace `production`.

---

## 6. Tips & Trik: Mengakses Worker via Master (SSH Jump Host / Bastion)

### Kasus Nyata
Seringkali IP Tailscale worker berubah, offline, atau berbeda akun, sehingga laptop/workstation Anda tidak bisa langsung SSH ke IP Tailscale worker.

Karena kedua VM berada di satu jaringan LAN lokal fisik (`192.168.1.0/24`), Anda bisa menjadikan VM Master (`100.79.211.49`) sebagai **Batu Loncatan (Jump Host / Bastion)** untuk menjangkau Worker (`192.168.1.30`).

### A. SSH Sekali Jalan Menggunakan Flag `-J` (Jump Host)
Dari laptop/WSL, Anda tidak perlu login dua kali:
```bash
ssh -i ~/.ssh/jadi_sah.pem -J jds@100.79.211.49 fjr@192.168.1.30
```
*Laptop menghubungi Master lewat Tailscale, lalu Master meneruskan koneksi SSH langsung ke Worker via kabel LAN lokal.*

### B. Konfigurasi Otomatis di Ansible Inventory (`ProxyJump`)
Jika IP Tailscale worker mati permanen atau ingin Ansible selalu lewat Master:
Edit file `k8s-infra/ansible/inventory/hosts.yml`:
```yaml
    k3s_workers:
      hosts:
        k8s-worker-1:
          ansible_host: 192.168.1.30
          ansible_user: fjr
          ansible_ssh_common_args: '-o ProxyJump=jds@100.79.211.49'
          k3s_node_ip: 192.168.1.30
          ansible_become_password: "fajri123"
```
*Dengan parameter `ProxyJump`, Ansible dari laptop Anda otomatis melompat via Master untuk mengelola Worker tanpa perlu IP publik/Tailscale di Worker!*

### C. Konfigurasi Cepat di `~/.ssh/config` Laptop
Tambahkan baris berikut ke `~/.ssh/config` di laptop Anda:
```ssh-config
Host k8s-master
    HostName 100.79.211.49
    User jds
    IdentityFile ~/.ssh/jadi_sah.pem

Host k8s-worker
    HostName 192.168.1.30
    User fjr
    ProxyJump k8s-master
    IdentityFile ~/.ssh/jadi_sah.pem
```
Setelah itu, dari terminal Anda cukup mengetik:
```bash
ssh k8s-worker
```
dan Anda langsung terhubung ke node worker!

