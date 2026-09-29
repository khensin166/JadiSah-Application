# SETUP.md

## Panduan Menjalankan Backend Go

1. **Install Dependencies**
   Pastikan Go versi 1.22 atau terbaru terinstal.
   ```bash
   go mod tidy
   go mod download
   ```

2. **Environment Variables**
   Salin file `.env.example` ke `.env` dan sesuaikan koneksi database.
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=jadisah
   DB_PASSWORD=rahasia
   DB_NAME=jadisah_db
   GIN_MODE=debug
   ```

3. **Jalankan Server Lokal**
   ```bash
   go run main.go
   ```
   Server akan berjalan di http://localhost:8080.
