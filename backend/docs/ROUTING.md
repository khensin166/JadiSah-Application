# Panduan Routing API

Aplikasi ini menggunakan filosofi **Contract-First**. Anda TIDAK meng-inisialisasi routing secara eksplisit menggunakan _framework raw_ seperti mendaftarkan rute satu per satu secara manual.

## Alur Pembuatan Rute

1. **Definisikan di OpenAPI (`api/openapi.yaml`)**
   Contoh:
   ```yaml
   paths:
     /api/weddings:
       get:
         summary: Get all weddings
         operationId: getWeddings
   ```

2. **Generate Kode (oapi-codegen)**
   Jalankan alat *generator* (menggunakan Makefile atau perintah langsung). Ini akan menghasilkan interface Go:
   ```go
   type ServerInterface interface {
       GetWeddings(ctx echo.Context) error
   }
   ```

3. **Implementasi Handler**
   Di `internal/wedding/handler.go`, buat struktur yang memenuhi interface `ServerInterface`:
   ```go
   func (h *WeddingHandler) GetWeddings(ctx echo.Context) error {
       // Logika
       return ctx.JSON(200, data)
   }
   ```

4. **Registrasi Server**
   Di `cmd/server/main.go`, daftarkan implementasi Anda:
   ```go
   generated.RegisterHandlers(e, myHandlers)
   ```

**Pengecualian:**
- Rute untuk infrastruktur atau metric (seperti `/healthz`, `/readyz`, atau rute internal K8s Prometheus) dapat dibuat langsung di *router instance* tanpa harus masuk ke OpenAPI.
- **Limen Auth:** Handler autentikasi dari Limen dapat di-*mount* langsung di router Go menggunakan `http.Handler` standar, meskipun kontrak I/O-nya tetap harus terdokumentasi di OpenAPI untuk tim Frontend.
