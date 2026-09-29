# SETUP.md

## Panduan Menjalankan Frontend Next.js

1. **Install Dependencies**
   Pastikan Anda sudah menginstal Node.js versi 18 atau 20+.
   ```bash
   npm install
   ```

2. **Environment Variables**
   Salin file `.env.example` menjadi `.env.local`.
   ```bash
   cp .env.example .env.local
   ```
   Pastikan variabel `NEXT_PUBLIC_API_URL` terisi (untuk lokal biasanya `http://localhost:8080/api`).

3. **Jalankan Server Lokal**
   ```bash
   npm run dev
   ```
   Aplikasi bisa diakses di http://localhost:3000.
