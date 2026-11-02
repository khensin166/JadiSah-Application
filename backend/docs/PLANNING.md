# Rencana Pengerjaan Backend (Planning)

## Fase 1: Fondasi Contract-First & Authentication
- [x] Buat struktur folder baru (`api/`, `bruno/`, `generated/`, `tests/`).
- [x] Inisialisasi file spesifikasi dasar `api/openapi.yaml`.
- [x] Setup *tooling*: `oapi-codegen` dan integrasi Swagger UI.
- [x] Setup Limen Auth dan Adapter GORM.
- [x] Buat pengujian API pertama menggunakan Bruno.
- [ ] Setup struktur CI untuk Automated Integration Tests.

## Fase 2: Database & IAM RBAC
- [x] Siapkan skema database (GORM Models) untuk `users`, `roles`, `permissions`, `couple_links`.
- [x] Buat Middleware Go untuk mengekstrak Session dari Limen dan mencocokkan RBAC *Required Permissions*.
- [x] Implementasi endpoint untuk `Profile` (Membaca & Update) dan `Couples` (Manajemen Undangan Pasangan).
- [x] Buat *Seeder* untuk Roles default (`SUPER_ADMIN`, `ADMIN`, `USER`) dan menyisipkannya pada startup aplikasi (`internal/db/seeder.go`).
- [x] Implementasi endpoint Admin untuk manajemen User, Role, dan Subscriptions (`AdminListRoles`, `AdminListUsers`, `AdminSetUserRoles`, `AdminSetUserSubscription`) di `internal/api/admin.go`.

## Fase 3: Observability & Structured JSON Logging
- [x] **Perbaikan Environment Loader Multi-Path**:
  - [x] Update `cmd/server/main.go` agar memanggil `godotenv.Load(".env", "../.env", "../../.env")` sehingga file konfigurasi `.env` dapat dibaca baik saat dijalankan dari root repository, direktori `backend/`, maupun `backend/cmd/server/`.
- [x] **Package Structured Logger (`internal/logger`)**:
  - [x] Implementasi logger terstruktur menggunakan Go standard library `log/slog` (format JSON, zero-dependency, high performance).
  - [x] Konfigurasi field standar JSON:
    - `timestamp`: Format ISO8601 UTC RFC3339Nano.
    - `level`: `INFO`, `WARN`, `ERROR`, `DEBUG`.
    - `service`: Nama service (`jadisah-backend`).
    - `environment`: `development`, `staging`, atau `production`.
    - `trace_id`: UUID request unik (diambil dari header `X-Request-ID` atau digenerate otomatis).
    - `user_id`: ID user terotentikasi dari session Limen context (atau `null` jika guest).
    - `latency_ms`: Durasi pemrosesan dalam milidetik (`float64`).
    - `method`, `path`, `status_code`, `client_ip`: Metadata HTTP request.
    - `message`: Deskripsi peristiwa.
    - `error`: Detail `{ "type": "...", "stack": "..." }` jika terjadi kegagalan atau unhandled panic.
- [x] **Gin Middleware & Panic Recovery**:
  - [x] `logger.Middleware()`: Menggantikan `gin.Logger()` bawaan untuk mencetak log HTTP request dalam satu baris JSON terstruktur.
  - [x] `logger.Recovery()`: Menggantikan `gin.Recovery()` bawaan untuk menangkap panic, mencatat stack trace ke dalam field JSON `error`, serta mengembalikan respon `500 Internal Server Error` terstandarisasi.
- [x] **Integrasi Startup & Application Logging**:
  - [x] Migrasikan `log.Printf` dan `log.Fatalf` pada inisialisasi database, migrasi, seeding, dan startup server ke structured logger.
- [x] **Pengujian & Verifikasi**:
  - [x] Unit testing logger & middleware di `internal/logger/logger_test.go` (100% pass).
  - [x] Verifikasi build backend (`go build ./...` clean).

## Fase 4: Modul Inti Aplikasi (Future Implementation)
- [ ] Modul `wedding` (Manajemen Acara & Konfigurasi Pernikahan).
- [ ] Modul `guest` (Manajemen Tamu, Undangan Digital, dan Kehadiran/RSVP).
- [ ] Modul `event` (Jadwal, Rangkaian Acara, dan Vendor).
- [ ] Selesaikan pembuatan test suite Bruno & Integration Tests untuk seluruh endpoint.

---

### Catatan Kondisi Saat Ini (State Checkpoint)
- **Otentikasi:** Limen sudah terhubung dengan GORM Adapter menggunakan plugin `credential-password`.
- **Database:** AutoMigrate dan Seeder Role/Permission telah terpasang. Konfigurasi staging menggunakan user `jadisah` dan database `jadisah_staging`.
- **Observability:** Structured JSON logging terpusat via `internal/logger` terpasang di seluruh router Gin dan startup lifecycle.
- **Server:** Menggunakan framework Gin, handler server di-generate menggunakan `oapi-codegen` dan dipisahkan menjadi `internal/api/profile.go` serta `internal/api/couples.go`.
