# SECURITY.md

## 1. Tujuan
File ini mendefinisikan aturan keamanan dasar untuk proyek JadiSah.
Seluruh tim developer dan AI coding agents wajib mematuhi aturan ini sebelum dan saat menulis kode.

## 2. Autentikasi & Otorisasi
- Autentikasi menggunakan metode berbasis Token (contoh: JWT - JSON Web Token).
- Frontend (Next.js) harus menyimpan token dengan aman (disarankan di `httpOnly` cookies).
- Backend (Go) wajib memverifikasi validitas token pada setiap endpoint yang diproteksi (menggunakan *Middleware* Gin).
- Jangan pernah percaya data otorisasi (role pengguna) yang hanya dikirim dari *client* (Frontend). Validasi *role* harus dilakukan di sisi Backend.

## 3. Rahasia & Environment Variables
- Kredensial, API Keys, dan koneksi database **WAJIB** disimpan dalam *environment variables* (`.env`).
- **JANGAN PERNAH** menuliskan kredensial rahasia langsung di dalam *source code* (hardcode).
- File `.env` **TIDAK BOLEH** di-*commit* ke GitHub.
- Sediakan file `.env.example` yang hanya berisi nama variabel tanpa nilainya, agar developer lain tahu variabel apa saja yang dibutuhkan.
- Rahasia untuk Production dan Staging dikelola secara terpusat (contoh: GitHub Secrets dan Kubernetes Secrets).

## 4. Validasi Input
- **Validasi Ganda:** Semua input dari pengguna harus divalidasi di Frontend (untuk UX yang baik, gunakan Zod) DAN divalidasi ulang di Backend (untuk keamanan, gunakan *binding* dan validasi *struct* bawaan Gin).
- Tolak tipe data yang tidak sesuai ekspektasi.

## 5. Keamanan API
- Terapkan CORS (Cross-Origin Resource Sharing) di Backend untuk membatasi domain mana yang boleh mengakses API.
- Jangan mengembalikan *Stack Traces* (pesan error mentah dari bahasa pemrograman/database) kepada *user* di environment Production.
- Error harus dibungkus menjadi pesan yang ramah pengguna.

## 6. Perlindungan Data
- Jangan menyimpan password dalam bentuk teks murni. Wajib di-hash menggunakan algoritma yang kuat (contoh: `bcrypt`).
- Gunakan *Parameterized Queries* atau ORM yang aman untuk mencegah SQL Injection.

## 7. Aturan Khusus AI Agent
AI coding agent harus:
- Tidak boleh menciptakan atau menggunakan kredensial asli saat memberikan contoh kode.
- Tidak boleh mematikan sistem autentikasi hanya agar sebuah fitur "bisa jalan sementara".
- Bertanya untuk klarifikasi jika permintaan *user* bertentangan dengan file keamanan ini.
