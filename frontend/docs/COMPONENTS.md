# UI Components Documentation

Panduan dan arsitektur UI Component pada Frontend JadiSah (Wedding Planner).

## Konvensi Desain & Styling
- **Framework**: React 19, Next.js (App Router), Tailwind CSS v4.
- **Icon Library**: `lucide-react`.
- **Aksen Warna Utama**:
  - Rose / Pink (`rose-500`, `rose-600`): Aksen tema pernikahan dan cinta.
  - Emerald (`emerald-500`): Status sukses, konfirmasi kehadiran (Hadir).
  - Amber (`amber-500`): Status pending/menunggu, indikator anggaran.
  - Zinc: Netral teks dan surface card background.

---

## Modul Dashboard Pengguna (`components/dashboard/`)

Komponen utama dashboard pengguna pada rute `/dashboard`:

1. **`DashboardNavbar`** (`components/dashboard/DashboardNavbar.tsx`)
   - Header aplikasi dengan logo JadiSah, navigasi tab interaktif (*Ringkasan*, *Tamu*, *Anggaran*, *Jadwal*, *Checklist*), tombol shortcut undangan publik, dan avatar profil pengguna.

2. **`CountdownBanner`** (`components/dashboard/CountdownBanner.tsx`)
   - Banner sambutan utama pernikahan pasangan (*Sarah Amanda & Dimas Prasetyo*).
   - Menghitung mundur sisa hari menuju hari-H menggunakan utility `calculateDaysRemaining`.
   - Fitur cepat: Salin URL undangan publik (`jadisah.id/invitation/sarah-dimas`) dan tombol bagikan via WhatsApp.

3. **`StatsCards`** (`components/dashboard/StatsCards.tsx`)
   - 4 kartu metrik utama:
     - **Tamu & RSVP**: Total undangan, jumlah konfirmasi hadir, menunggu, dan batal disertai progress bar persentase.
     - **Anggaran Terpakai**: Realisasi pengeluaran vs total pagu anggaran pernikahan dan sisa dana.
     - **Kategori Vendor**: Kategori vendor aktif (Gedung, Catering, MUA, Foto, Dekor).
     - **Rangkaian Acara**: Jumlah sesi acara terencana (Akad, Resepsi 1, Resepsi 2).

4. **`RecentGuestsTable`** (`components/dashboard/RecentGuestsTable.tsx`)
   - Manajemen data tamu undangan dengan fitur filter tab (*Semua*, *Hadir*, *Menunggu*, *Batal*), pencarian teks instan nama/grup, dan form inline untuk menambah tamu baru beserta jumlah pax.

5. **`BudgetOverviewCard`** (`components/dashboard/BudgetOverviewCard.tsx`)
   - Rincian alokasi dan realisasi pengeluaran per pos vendor pernikahan (Venue, Catering, Dekorasi, Dokumentasi, Busana) dengan visual progress bar.

6. **`TimelineChecklist`** (`components/dashboard/TimelineChecklist.tsx`)
   - **Rundown Acara**: Waktu, nama sesi, dan lokasi acara.
   - **Checklist Persiapan**: To-do list interaktif dengan status centang selesai dan penghitung tugas.

---

## Utility Functions (`lib/dashboard-utils.ts`)
- `formatRupiah(amount: number)`: Format angka mata uang Rupiah Indonesia (`Rp 150.000.000`).
- `calculateRSVPPercentage(attending, total)`: Menghitung persentase konfirmasi kehadiran.
- `calculateBudgetPercentage(spent, total)`: Menghitung persentase realisasi anggaran.
- `calculateRemainingBudget(total, spent)`: Menghitung sisa anggaran yang tersedia.
- `calculateDaysRemaining(targetDate)`: Menghitung selisih hari menuju hari-H.
