# DATABASE.md

## 1. Tujuan
File ini menjelaskan bagaimana data distrukturkan, dikelola, dan diakses dengan aman dalam proyek JadiSah.

## 2. Database Stack
- **Engine Utama:** PostgreSQL
- **Environment:** K3s Kubernetes Namespace `database`
- **Driver/ORM:** (Disepakati kemudian, direkomendasikan GORM atau `pgx` untuk Golang).

## 3. Lingkungan (Environment)
- Database Staging dan Production berada pada Pod/Instances yang terpisah untuk menjaga isolasi data.
- Aplikasi Backend terhubung menggunakan DNS Internal K8s (contoh: `postgres-service.database.svc.cluster.local`).

## 4. Aturan Skema & Model
- Setiap tabel utama wajib memiliki Primary Key berupa ID yang stabil (bisa Auto-Increment Integer atau UUID/CUID).
- Setiap tabel disarankan memiliki kolom penanda waktu:
  - `created_at` (Waktu data dibuat)
  - `updated_at` (Waktu data terakhir diubah)
- Gunakan `Foreign Key` untuk relasi antar tabel (contoh: Relasi antara Tabel `User` dan Tabel `Transaction`).
- Jangan menyimpan data sensitif ganda di banyak tempat tanpa alasan arsitektural yang jelas.

## 5. Migrasi Database
Skema database tidak boleh diubah secara manual langsung di server (misalnya melalui DBeaver atau pgAdmin) di environment Staging/Production.

**Alur Migrasi (SOP):**
1. Buat file migrasi (Migration File) menggunakan *tools* migrasi bawaan Golang (misal `golang-migrate` atau fitur Automigrate GORM).
2. Uji migrasi di lingkungan lokal.
3. Commit file migrasi tersebut ke repository.
4. CI/CD atau proses *startup* backend akan otomatis menjalankan file migrasi tersebut di server.

## 6. Seed Data (Data Awal)
- Buat *seeder* script jika proyek butuh data awalan (seperti daftar Provinsi, Kategori, atau *Role*).
- Dilarang memasukkan data sampel rahasia ke dalam sistem Production.
- Seeder hanya dijalankan manual atau pada environment *Development* dan *Staging*.

## 7. Keamanan Akses
- Ikuti panduan `SECURITY.md`.
- Jangan menggunakan user `postgres` (root) untuk aplikasi Backend. Gunakan *dedicated user* (contoh: user `jadisah` pada database `jadisah_db`). (Ini sudah kita terapkan di Kubernetes!).
