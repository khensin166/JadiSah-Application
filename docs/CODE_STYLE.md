# CODE_STYLE.md

## 1. Tujuan
File ini menentukan konvensi penulisan kode proyek JadiSah agar kode yang dihasilkan, baik oleh tim developer maupun AI, tetap seragam, mudah dibaca, dan konsisten.

## 2. Teknologi (*Stack*)
- **Frontend:** Next.js (App Router), TypeScript, React, Tailwind CSS
- **Backend:** Go (Golang), Gin Web Framework
- **Database:** PostgreSQL
- **Infrastruktur:** Kubernetes (K3s), Docker, GitHub Actions

## 3. Prinsip Umum
- Kode yang mudah dibaca (*readable*) jauh lebih baik daripada kode yang rumit walau sedikit lebih cepat.
- Jangan menduplikasi logika. Jika kode dipakai lebih dari sekali, jadikan sebuah fungsi atau komponen *utility*.
- **Write Comments:** Tulis komentar untuk menjelaskan **MENGAPA** (*Why*) Anda mengambil pendekatan tersebut, bukan menjelaskan **APA** (*What*) yang dilakukan kode (karena kode seharusnya sudah mendeskripsikan dirinya sendiri).

## 4. Konvensi Frontend (Next.js / TypeScript)
- **Komponen React:** Gunakan *Functional Components*.
- **Penamaan File/Komponen:** Gunakan `PascalCase` untuk komponen (contoh: `UserCard.tsx`, `LoginForm.tsx`).
- **Penamaan Variabel/Fungsi:** Gunakan `camelCase` (contoh: `getUserData`, `isLoading`).
- **Tipe Data:** Wajib definisikan `interface` atau `type` TypeScript secara eksplisit (hindari penggunaan `any` sebisa mungkin).
- **Styling:** Gunakan kelas Tailwind CSS standar.

## 5. Konvensi Backend (Go)
- **Struktur Folder:** Ikuti standar layout Golang (misal memisahkan `/cmd`, `/internal`, dan `/pkg` jika skala membesar).
- **Penamaan Variabel/Fungsi:** Gunakan `camelCase` untuk fungsi privat (hanya dipakai di dalam file/package tersebut), dan `PascalCase` untuk fungsi publik/Exported (bisa dipanggil dari package lain).
- **Penamaan Struct:** Gunakan `PascalCase`.
- **Error Handling:** Go tidak menggunakan `try-catch`. Wajib tangkap dan kelola setiap *error* menggunakan pola:
  ```go
  if err != nil {
      // Tangani atau kembalikan error
  }
  ```
- **Linting:** Pastikan kode lolos pengecekan `golangci-lint` (seperti yang dikonfigurasi pada CI/CD).

## 6. Aturan Git Flow & Kolaborasi
- Jangan `push` langsung ke *branch* `main` atau `staging`.
- Gunakan fitur percabangan (*Feature Branch*) dengan format: `feat/nama-fitur` atau `fix/nama-bug`.
- Wajib menggunakan Pull Request (PR) untuk meninjau (Review) kode sebelum di-*merge*.
