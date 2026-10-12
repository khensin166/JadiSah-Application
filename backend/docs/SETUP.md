# SETUP.md

## Panduan Menjalankan Backend Go

1. **Install Dependencies**
   Pastikan Go versi 1.22 atau terbaru terinstal.
   ```bash
   go mod tidy
   go mod download
   ```

2. **Code Generation (OpenAPI Contract-First)**
   Setiap kali ada perubahan pada file `api/openapi.yaml`, Anda **wajib** melakukan generasi ulang kode:
   ```bash
   go install github.com/deepmap/oapi-codegen/v2/cmd/oapi-codegen@latest
   oapi-codegen -package api api/openapi.yaml > generated/api/server.gen.go
   ```

3. **Environment Variables**
   Salin file `.env.example` ke `.env` dan sesuaikan koneksi database.
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=jadisah
   DB_PASSWORD=rahasia
   DB_NAME=jadisah_db
   GIN_MODE=debug
   ```

4. **Jalankan Server Lokal**
   ```bash
   go run cmd/server/main.go
   ```
   Server akan berjalan di http://localhost:8080.
   Dokumentasi Swagger UI dapat diakses di http://localhost:8080/swagger.
