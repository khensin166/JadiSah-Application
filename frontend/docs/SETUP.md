# Panduan Menjalankan Frontend Next.js

1. **Install Dependencies**
   Pastikan Anda sudah menginstal Node.js versi 18 atau 20+.
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Pilihan nilai `NEXT_PUBLIC_API_URL`:
   - **Konek ke Kubernetes Staging Langsung (Tailscale aktif):**
     `NEXT_PUBLIC_API_URL=http://staging.100.79.211.49.nip.io`
   - **Konek ke Backend Lokal / Port-Forward:**
     `NEXT_PUBLIC_API_URL=http://localhost:8080`

3. **Jalankan Server Lokal**
   ```bash
   npm run dev
   ```
   Aplikasi bisa diakses di `http://localhost:3000`.
