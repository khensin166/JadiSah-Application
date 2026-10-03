# Panduan Testing Sederhana (Frontend)

Dokumen ini menjelaskan cara menjalankan pengujian (testing) sederhana pada frontend JadiSah.

## 1. Menjalankan Unit Test (Node Test Runner)

Pengujian fungsi kalkulasi dan utilitas dashboard menggunakan built-in Node Test Runner (`node:test` dan `node:assert`).

Jalankan perintah berikut di folder `frontend/`:
```bash
npm test
```

### File Pengujian:
- **`__tests__/dashboard-utils.test.mjs`**:
  - `formatRupiah`: Memastikan format mata uang IDR sesuai dan menangani angka 0 atau input tidak valid.
  - `calculateRSVPPercentage`: Memastikan akurasi persentase RSVP tamu hadir serta menangani kasus total 0.
  - `calculateBudgetPercentage & Remaining`: Memastikan akurasi perhitungan sisa anggaran dan persentase serapan dana.
  - `calculateDaysRemaining`: Memastikan perhitungan mundur hari menuju hari-H akurat.

---

## 2. Pengujian Kode & Linting (ESLint)

Untuk memastikan tidak ada kesalahan sintaks atau type error pada kode React/TypeScript:
```bash
npm run lint
```

---

## 3. Pengujian Visual di Browser (Smoke Test)

1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka browser pada URL:
   - **Halaman Utama**: [http://localhost:3000](http://localhost:3000)
   - **Dashboard Pengguna**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

3. Skenario interaksi yang dapat dicoba:
   - **Ganti Tab Navigasi**: Klik tab *Ringkasan*, *Tamu & RSVP*, *Anggaran*, *Jadwal*, atau *Checklist*.
   - **Salin Link Undangan**: Klik tombol *Salin Link Undangan* pada kartu countdown atas.
   - **Filter & Cari Tamu**: Ketik nama tamu di kotak pencarian atau klik tombol filter status (*Hadir*, *Menunggu*, *Batal*).
   - **Tambah Tamu Baru**: Klik tombol *Tambah Tamu*, masukkan nama, kategori grup, dan pax, lalu klik *Simpan*.
   - **Checklist Persiapan**: Klik kotak tugas untuk menandai selesai/belum selesai.
