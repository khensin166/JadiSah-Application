# Implementation Plan: PostgreSQL Kubernetes Setup

## Apakah Perlu Menggunakan GitHub Actions (CI/CD) untuk Database?
**Jawaban: TIDAK DISARANKAN.**
Database adalah komponen *Stateful* (menyimpan data permanen). Sangat jarang kita melakukan pembaruan versi (update/deploy) pada database setiap hari. GitHub Actions jauh lebih cocok dan akan kita gunakan secara maksimal nanti untuk **Aplikasi (Frontend & Backend)** Anda, karena kode aplikasi akan sering berubah dan butuh *build* otomatis.

Untuk PostgreSQL, kita akan setup secara "statis" (manual dengan *manifest* Kubernetes) karena ini adalah pondasi infrastruktur.

---

## Langkah-langkah Setup PostgreSQL (Tahap 1)

### 1. Pembuatan Namespace
Kita tidak akan menggunakan namespace `default`. Kita akan membuat ruangan khusus bernama `database` agar rapi dan terisolasi.

### 2. Konfigurasi Rahasia (Secret)
Kita akan membuat `Secret` di Kubernetes untuk menyimpan username dan password database dengan aman (tidak ditulis langsung di teks biasa).

### 3. Konfigurasi Penyimpanan Permanen (Persistent Volume Claim / PVC)
Secara bawaan, kalau Pod (container) mati, semua isinya terhapus. Agar data tabel dan *user* PostgreSQL tidak hilang kalau VM *restart*, kita akan meminta K3s untuk membuatkan folder penyimpanan permanen menggunakan fitur `local-path-provisioner` (yang tadi sudah aktif).

### 4. Deploy PostgreSQL (StatefulSet)
Kita akan menggunakan `StatefulSet` (bukan Deployment biasa seperti Nginx tadi) untuk mengeksekusi container image `postgres:16-alpine`. StatefulSet memastikan urutan dan pengikatan penyimpanan (*storage binding*) lebih terjamin untuk database.

### 5. Konfigurasi Jaringan Internal (Service)
Kita akan membuat *Service* (tanpa *Ingress*). Kenapa tanpa *Ingress*? Karena database **sangat berbahaya** jika terekspos langsung ke internet atau jaringan luar. 
Nantinya, API Go Anda yang berada di dalam cluster cukup memanggil database ini menggunakan alamat internal Kubernetes:
`postgres-service.database.svc.cluster.local`

---

## FAQ Keamanan Data PostgreSQL

### 1. Kalau Pod Mati atau Server Restart, Apakah Data Hilang?
**TIDAK HILANG.** Data Anda 100% aman.
K3s mengaitkan `PersistentVolumeClaim` (PVC) ke folder fisik sungguhan di dalam hard disk VM Anda. Kalau Pod (`postgres-0`) mati, error, atau server VM di-restart, Kubernetes akan menghancurkan pod tersebut dan membuat pod yang baru. Sebelum pod baru menyala, Kubernetes otomatis me-mount kembali folder fisik tersebut. Data **HANYA HILANG** jika Anda dengan sengaja menghapus PVC-nya (misal via `kubectl delete pvc postgres-pvc -n database`).

### 2. Kalau YAML Diubah (Tambah Storage Jadi 20GB), Apakah Data Hilang?
**TETAP AMAN.**
Kubernetes memiliki fitur *Volume Expansion*. Jika kapasitas disk mau habis, Anda tinggal mengubah `storage: 10Gi` menjadi `storage: 20Gi` di file YAML, lalu eksekusi ulang `kubectl apply -f postgres.yml`. Kubernetes akan otomatis memperluas kapasitas disk tanpa mematikan database apalagi menghapus data.
*(Perhatian: Kubernetes mengizinkan menaikkan kapasitas storage, tapi menolak jika Anda menurunkannya. Data tidak akan hilang, tapi akan memunculkan error).*
