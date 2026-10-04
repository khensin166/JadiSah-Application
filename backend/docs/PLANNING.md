# Rencana Pengerjaan (Planning)

## Fase 1: Fondasi Contract-First & Authentication
- [x] Buat struktur folder baru (`api/`, `bruno/`, `generated/`, `tests/`).
- [x] Inisialisasi file spesifikasi dasar `api/openapi.yaml`.
- [x] Setup *tooling*: `oapi-codegen` dan integrasi Swagger UI.
- [x] Setup Limen Auth dan Adapter GORM.
- [ ] Buat pengujian API pertama menggunakan Bruno.
- [ ] Setup struktur CI untuk Automated Integration Tests.

## Fase 2: Database & IAM RBAC
- [x] Siapkan skema database (GORM Models) untuk `users`, `roles`, `permissions`, `couple_links`.
- [x] Buat Middleware Go untuk mengekstrak Session dari Limen dan mencocokkan RBAC *Required Permissions*.
- [x] Implementasi endpoint untuk `Profile` (Membaca & Update) dan `Couples` (Manajemen Undangan Pasangan).
- [ ] **FUTURE IMPLEMENTATION:** Buat *Seeder* untuk Roles default (`SUPER_ADMIN`, `ADMIN`, `USER`) dan menyisipkannya pada startup aplikasi.
- [ ] **FUTURE IMPLEMENTATION:** Implementasi endpoint Admin untuk manajemen User, Role, dan Subscriptions (`AdminListRoles`, `AdminListUsers`, `AdminSetUserRoles`, `AdminSetUserSubscription`).

## Fase 3: Modul Inti Aplikasi (Future Implementation)
- [ ] Modul `wedding` (Manajemen Acara & Konfigurasi Pernikahan).
- [ ] Modul `guest` (Manajemen Tamu, Undangan Digital, dan Kehadiran/RSVP).
- [ ] Modul `event` (Jadwal, Rangkaian Acara, dan Vendor).
- [ ] Selesaikan pembuatan test suite Bruno & Integration Tests untuk seluruh endpoint.

---

### Catatan Kondisi Saat Ini (State Checkpoint)
- **Otentikasi:** Limen sudah terhubung dengan GORM Adapter menggunakan plugin `credential-password`.
- **Database:** AutoMigrate sudah dipanggil di `main.go`. Struktur berada di `internal/models/`.
- **Server:** Menggunakan framework Gin, handler server di-generate menggunakan `oapi-codegen` dan dipisahkan menjadi `internal/api/profile.go` serta `internal/api/couples.go`.
