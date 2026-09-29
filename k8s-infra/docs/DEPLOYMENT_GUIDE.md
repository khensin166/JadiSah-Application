# Implementation Plan: Frontend & Backend (Advanced CI/CD)

Rencana ini telah diperbarui untuk mendukung praktik *DevOps* tingkat lanjut: **Build Once, Deploy Anywhere** (Immutable Artifacts) dan pengujian otomatis.

## 1. Pemisahan Lingkungan (Isolation)
- **Namespace `staging`**: Untuk *testing*. Kita akan membuat satu pod PostgreSQL kecil di sini agar data testing tidak merusak data asli.
- **Namespace `production`**: Untuk *user* sungguhan, terhubung ke PostgreSQL utama.

## 2. Tahapan CI/CD (Pipeline Stages)
Selain tahapan *Build*, sebuah *pipeline* yang matang (sekelas *Enterprise*) sebaiknya memiliki tahapan berikut sebelum *Deploy*:
1. **Linting:** Mengecek kerapian penulisan kode (misal: `golangci-lint` atau `ESLint`).
2. **Unit Testing:** Menjalankan test bawaan kode (`go test` atau `jest`) untuk memastikan logika aplikasi tidak rusak.
3. **Security Scanning (Opsional tapi direkomendasikan):** Menggunakan alat seperti *Trivy* atau *SonarQube* untuk mengecek apakah ada celah keamanan di pustaka (dependensi) yang digunakan.
4. **Build & Push:** Membungkus kode jadi Docker Image dan mengirimnya ke GitHub Container Registry (GHCR).
5. **Deploy:** Memperbarui Kubernetes.

## 3. Alur "Build Once, Deploy Anywhere"
Ini adalah strategi yang sangat luar biasa untuk mencegah perbedaan antara *staging* dan *production*.
- **Saat Push ke `staging` (atau `develop`):**
  GitHub Actions akan menjalankan Linting -> Testing -> Build Docker Image (misal diberi nama `myapp:sha-12345`). Lalu, image `sha-12345` ini di-deploy ke namespace `staging`.
- **Saat Push ke `production` (atau merge ke `main`):**
  GitHub Actions **TIDAK AKAN** melakukan *build* ulang. Ia hanya akan "mengambil" image `myapp:sha-12345` yang sudah teruji aman di *staging*, memberinya tag baru (misal `myapp:production`), lalu langsung men-deploy image yang sama persis itu ke namespace `production`. Ini sangat menghemat waktu *build* dan menghilangkan risiko "jalan di staging tapi error di production".

## 4. Tantangan Jaringan (Koneksi GitHub ke VM)
Karena Kubernetes Anda bersembunyi dengan sangat aman di dalam **Tailscale** (`100.79.211.49`), *server* cloud GitHub Actions (yang berada di internet publik) **tidak akan bisa menembak/mengakses** K3s Anda secara langsung untuk melakukan *deploy*.
**Solusinya:** Kita akan menyisipkan perintah `tailscale/github-action` di dalam *pipeline* agar GitHub Runner bisa login sementara ke jaringan Tailscale Anda sebelum menembak perintah `kubectl`.

## 5. Daftar GitHub Secrets yang Harus Disiapkan
Untuk merealisasikan semua ini, Anda harus memasukkan variabel-variabel ini ke menu **Settings > Secrets and variables > Actions** di repository GitHub Anda:
1. `TAILSCALE_CLIENT_ID`: OAuth Client ID agar GitHub Runner bisa masuk ke jaringan Tailscale.
2. `TAILSCALE_CLIENT_SECRET`: OAuth Client Secret pasangan dari Client ID di atas.
3. `KUBECONFIG_DATA`: Isi file `~/.kube/config` dari VM Anda (di-encode Base64) agar GitHub punya hak akses ke K3s.
4. `POSTGRES_PASSWORD_PROD`: Password database production (yang sudah kita buat di `postgres.yml`).
*(Untuk kredensial GHCR, kita bisa menggunakan rahasia `GITHUB_TOKEN` yang sudah disediakan otomatis oleh GitHub).*

### Cara mendapatkan masing-masing secret:

**`TAILSCALE_CLIENT_ID` & `TAILSCALE_CLIENT_SECRET`:**
- Buka: https://login.tailscale.com/admin/settings/oauth
- Klik "Generate OAuth Client" → Centang scope `Devices: Write` dan `Auth Keys: Write`
- Pastikan tag `tag:ci` sudah ada di tagOwners ACL Tailscale Anda

**`KUBECONFIG_DATA`:**
Jalankan perintah ini di server VM (`ssh jds@100.79.211.49`), lalu copy outputnya:
```bash
cat ~/.kube/config | base64 -w 0
```

**`POSTGRES_PASSWORD_PROD`:**
Sama dengan password PostgreSQL production yang sudah diset di `k8s-infra/kubernetes/database/postgres.yml`.

---

## 6. Status Pengerjaan

| Komponen | Status | File |
|---|---|---|
| `Dockerfile` Backend (Go) | ✅ SELESAI | `backend/Dockerfile` |
| `Dockerfile` Frontend (Next.js) | ✅ SELESAI | `frontend/Dockerfile` |
| Next.js `output: standalone` config | ✅ SELESAI | `frontend/next.config.ts` |
| GitHub Actions – Staging Pipeline | ✅ SELESAI | `.github/workflows/deploy-staging.yml` |
| GitHub Actions – Production Pipeline | ✅ SELESAI | `.github/workflows/deploy-production.yml` |
| K8s Manifest – Staging | ✅ SELESAI | `k8s-infra/kubernetes/staging/deployment.yml` |
| K8s Manifest – Production | ✅ SELESAI | `k8s-infra/kubernetes/production/deployment.yml` |
| Setup GitHub Secrets | ⏳ BELUM | Harus diisi manual di GitHub |
| Buat Tailscale OAuth Client | ⏳ BELUM | https://login.tailscale.com/admin/settings/oauth |
| Tambahkan Kubernetes Secret `staging-secret` | ⏳ BELUM | Dijalankan via `kubectl create secret` |
| Tambahkan Kubernetes Secret `production-secret` | ⏳ BELUM | Dijalankan via `kubectl create secret` |

### Langkah Eksekusi Berikutnya (Urutan):
1. Buat **Tailscale OAuth Client** di dashboard Tailscale.
2. Daftarkan semua secret ke **GitHub Repository Secrets**.
3. Buat **Kubernetes Secrets** di server VM:
   ```bash
   # Secret untuk staging
   kubectl create secret generic staging-secret \
     --from-literal=POSTGRES_PASSWORD=<password_staging_anda> \
     -n staging

   # Secret untuk production
   kubectl create secret generic production-secret \
     --from-literal=POSTGRES_PASSWORD=SuperSecretPassword123 \
     -n production
   ```
4. **Push kode** ke branch `staging` untuk memicu pipeline pertama kali.

