# UI Components Documentation

Panduan dan arsitektur UI Component pada Frontend JadiSah (Wedding Planner).

## Konvensi Desain & Styling
- **Framework**: React 19, Next.js (App Router), Tailwind CSS v4.
- **UI Primitives**: Komponen dasar berbasis shadcn/ui (`cva`, `clsx`, `tailwind-merge`, Radix primitives).
- **Icon Library**: `lucide-react`.
- **Aksen Warna & Estetika (Éternel Atelier Luxury)**:
  - **Warm Alabaster / Ivory Canvas** (`ivory-50: #FDFBF7`, `ivory-100: #FAF6EE`, `ivory-200: #F3EBDD`, border `champagne-light: #E5D6C3`): Kanvas bertekstur kertas undangan pernikahan sutra, hangat dan menenangkan tanpa silau atau latar belakang gelap ekstrem.
  - **Champagne Gold Accents** (`champagne: #C5A880`, `champagne-dark: #9E7E55`, `champagne-gold: #D4AF37`, `champagne-soft: #F5EFE6`): Aksen foil mewah pada tombol primer, monogram atelier, dan indikator progres.
  - **Olive Sage Botanicals** (`sage: #7A8A76`, `sage-dark: #4E5F4A`, `sage-soft: #F0F4EF`): Indikator status sukses/hadir yang terinspirasi dari dedaunan zaitun Mediterania.
  - **Charcoal Espresso Typography** (`charcoal-900: #1C1C1A`, `charcoal-800: #242321`, `charcoal-500: #6E6D68`): Tipografi mewah dengan kontras tinggi yang nyaman di mata.
  - **Blush Chiffon** (`blush: #D6B5A8`, `blush-soft: #FAF1EE`): Aksen lembut untuk nuansa romantis.
  - **Luxury Typography**: Serif *Cormorant Garamond* untuk judul dan nama pasangan, dipadukan dengan sans-serif modern *Plus Jakarta Sans* untuk keterbacaan data.

---

## Shadcn UI Primitives (`components/ui/`)

Komponen dasar yang digunakan di seluruh aplikasi:
1. **`Button`** (`components/ui/button.tsx`): Komponen tombol dengan varian `default` (Champagne Gold), `charcoal`, `outline`, `secondary`, `ghost`, `link`, `champagne`, `rose`, serta ukuran `default`, `sm`, `lg`, `icon`. Mendukung `asChild` via Radix Slot.
2. **`Card`** (`components/ui/card.tsx`): Wadah konten terstruktur (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) dengan tipografi kontras tinggi `text-charcoal-900` yang konsisten tanpa glitch dark mode.
3. **`Badge`** (`components/ui/badge.tsx`): Label status dengan varian `default` (Champagne Soft), `charcoal`, `secondary`, `outline`, `success`, `warning`, `rose`, `destructive`.
4. **`Input`** (`components/ui/input.tsx`): Komponen formulir input teks berlatar belakang hangat `bg-ivory-50`, border `border-champagne-light`, dan teks `text-charcoal-900` (bebas dari balok hitam dark mode).
5. **`Progress`** (`components/ui/progress.tsx`): Bar indikator kemajuan dengan transisi halus beraksen Champagne Gold.
6. **`Table`** (`components/ui/table.tsx`): Tabel data semantik (`Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`) dengan divider dan hover beraksen ivory/champagne.
7. **`Separator`** (`components/ui/separator.tsx`): Garis pemisah horizontal atau vertikal berwarna `champagne-light/60`.
8. **`Avatar`** (`components/ui/avatar.tsx`): Komponen avatar dan inisial pengguna (`AvatarFallback`) beraksen champagne soft.
9. **`Calendar`** (`components/ui/calendar.tsx`): Komponen kalender bulanan interaktif dengan navigasi bulan/tahun, palet champagne/ivory, dan locale Indonesia.
10. **`DatePicker`** (`components/ui/date-picker.tsx`): Input pemilih tanggal berbasis popover kalender interaktif.
11. **`TimePicker`** (`components/ui/time-picker.tsx`): Input pemilih waktu jam & menit (interval 15 menit dengan zona waktu WIB) berbasis popover dropdown.

---

## Modul Dashboard Berbasis Sidebar (`components/dashboard/`)

Struktur tata letak dashboard `/dashboard` menggunakan pola Sidebar modern:

1. **`DashboardSidebar`** (`components/dashboard/DashboardSidebar.tsx`)
   - Navigasi samping berbasis shadcn/ui primitives (`SidebarProvider`, `Sidebar`, `SidebarContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`).
   - Lebar 72 / 288px pada desktop, sliding drawer overlay pada mobile.
   - Menampilkan logo brand JadiSah, info pasangan aktif & sisa hari akad (*Atelier Pernikahan*), navigasi tab dengan badge counter (*Ringkasan*, *Tamu & RSVP*, *Anggaran*, *Jadwal*, *Checklist*), pintasan link undangan publik (*Tautan Cepat*), dan profil singkat user di bagian footer sidebar.
   - Dilengkapi `suppressHydrationWarning` untuk mencegah bentrok atribut otomatis dari browser extension.

2. **`DashboardHeader`** (`components/dashboard/DashboardHeader.tsx`)
   - App bar atas dengan tombol toggle hamburger untuk mobile, judul & deskripsi tab aktif, kolom pencarian global (Input), tombol pratinjau undangan publik, dan notifikasi bell.

3. **`CountdownBanner`** (`components/dashboard/CountdownBanner.tsx`)
   - Banner hero pasangan (*Sarah Amanda & Dimas Prasetyo*) dibangun dengan `Button` dan efek glassmorphism. Dilengkapi hitung mundur hari otomatis, tombol salin link, dan tombol share WhatsApp.

4. **`StatsCards`** (`components/dashboard/StatsCards.tsx`)
   - Dibangun ulang dengan shadcn `Card` dan `Progress`:
     - **Tamu & RSVP**: Total undangan, hadir, menunggu, batal, beserta bar persentase RSVP.
     - **Anggaran Terpakai**: Realisasi vs total pagu dan sisa anggaran.
     - **Kategori Vendor**: Kategori vendor aktif dan status kontrak.
     - **Rangkaian Acara**: Sesi acara terencana.

5. **`RecentGuestsTable`** (`components/dashboard/RecentGuestsTable.tsx`)
   - Dibangun ulang menggunakan shadcn `Card`, `Table`, `Input`, `Button`, dan `Badge`.
   - Filter tab (*Semua*, *Hadir*, *Menunggu*, *Batal*), pencarian teks instan, dan form inline tambah tamu baru.

6. **`BudgetOverviewCard`** (`components/dashboard/BudgetOverviewCard.tsx`)
   - Dibangun dengan shadcn `Card` dan `Progress` bar untuk rincian alokasi per pos vendor (Venue, Catering, MUA, Dokumentasi, Busana).

7. **`TimelineChecklist`** (`components/dashboard/TimelineChecklist.tsx`)
   - Dibangun dengan shadcn `Card`, `Badge`, `Button`, dan `Input`:
     - **Rundown Acara**: Waktu, nama sesi, lokasi.
       - *Fitur Tambah Sesi Acara*: Formulir inline untuk menginput judul sesi, jam mulai/selesai, dan lokasi, serta aksi hapus sesi. Sinkron otomatis dengan counter di `StatsCards` dan badge di `DashboardSidebar`.
     - **Checklist Persiapan**: To-do list dengan toggle klik selesai, dual filter (filter tenggat waktu: *All*, *Bulan Ini*, *2 Bulan*, *3 Bulan*, dan filter status: *Semua*, *Belum Selesai*, *Selesai*), serta tombol hapus tugas.
       - *Fitur Tambah Tugas*: Formulir inline untuk menambah tugas baru dengan pilihan kategori vendor (Tamu, Anggaran, Catering, Busana, Dekorasi, Dokumentasi, Acara) dan tenggat waktu via popover `<DatePicker />`. Progres terhitung otomatis dan sinkron ke badge di `DashboardSidebar`.

---

## Utility Functions (`lib/dashboard-utils.ts`)
- `formatRupiah(amount: number)`: Format angka mata uang Rupiah Indonesia (`Rp 150.000.000`).
- `calculateRSVPPercentage(attending, total)`: Menghitung persentase konfirmasi kehadiran.
- `calculateBudgetPercentage(spent, total)`: Menghitung persentase realisasi anggaran.
- `calculateRemainingBudget(total, spent)`: Menghitung sisa anggaran yang tersedia.
- `calculateDaysRemaining(targetDate)`: Menghitung selisih hari menuju hari-H.
- `formatEventTimeRange(start, end)`: Memformat tampilan rentang jam sesi acara (`08:00 - 10:30 WIB`).
- `parseTaskDueDate(dueDateStr)`: Mengurai teks tanggal format lokal Indonesia (*5 Okt 2026*) menjadi objek `Date`.
- `isTaskInTimeWindow(dueDateStr, filter, referenceDate)`: Menentukan apakah tenggat waktu tugas masuk dalam rentang waktu tertentu (*this-month*, *2-months*, *3-months*, *all*).
