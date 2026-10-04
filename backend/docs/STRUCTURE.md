# Struktur Folder Backend

Kita menggunakan arsitektur **API Contract-First**. `api/openapi.yaml` menjadi *Single Source of Truth* bagi Backend (Go), Frontend (Next.js TypeScript), dan Pengujian (Bruno).

```text
backend/
│
├── api/
│   └── openapi.yaml           <-- Sumber Kebenaran Kontrak API (Swagger)
│
├── cmd/
│   └── server/                <-- Entry point (main.go)
│
├── internal/
│   ├── auth/                  <-- Modul Auth (Limen, Handler, Service)
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   │
│   ├── wedding/               <-- Modul Wedding
│   ├── guest/                 <-- Modul Guest
│   ├── event/                 <-- Modul Event
│   └── middleware/            <-- Middleware (Auth IAM/RBAC guard)
│
├── generated/
│   └── api/                   <-- Kode Go hasil generate dari oapi-codegen
│
├── tests/
│   ├── integration/           <-- Automated Integration Tests
│   └── e2e/                   <-- End-to-End test
│
├── bruno/
│   ├── auth/                  <-- API Tests (Pengganti Postman)
│   ├── wedding/
│   ├── guest/
│   └── event/
│
├── docs/                      <-- Dokumentasi teknis (.md)
│   ├── ARCHITECTURE.md
│   ├── IAM_AUTH_PLAN.md
│   ├── ROUTING.md
│   ├── SETUP.md
│   └── STRUCTURE.md
│
├── go.mod
└── README.md
```

## Prinsip Kerja

1. **JANGAN** tulis routing atau request/response payload secara manual.
2. Edit file `api/openapi.yaml`.
3. Jalankan `oapi-codegen` yang otomatis mengisi folder `generated/api/`.
4. Buat controller/handler di dalam `internal/` yang meng-implementasikan *interface* yang dihasilkan oleh `oapi-codegen`.
5. Uji API menggunakan koleksi test dari `bruno/`.
