# Backend Changelog

## [Unreleased]

### Added
- **Admin Concierge Mode & Couple Auth Exception**:
  - `GET /api/couples/me`: Returns `204 No Content` when accessed by `ADMIN` or `SUPER_ADMIN` accounts without active couple links, eliminating 404 error noise in the frontend and admin concierge view.
  - `DELETE /api/couples/me`: Transitions couple link to `models.Unlinked` (`UNLINKED`) status upon disconnection.
- **Contract-First & Documentation Synchronization**:
  - Updated OpenAPI 3.0 specification (`backend/api/openapi.yaml`) with `204 No Content` for `getMyCouple`, `200`/`204` for `unlinkMyCouple`, and `UNLINKED` in `CoupleLinkStatus`.
  - Regenerated Go Gin server interfaces and models via `go generate ./...` (`backend/generated/api/server.gen.go`).
  - Updated Bruno collections in `backend/bruno/Couples/` and `backend/bruno/Admin/` with embedded `docs {}` blocks covering parameters, RBAC permissions, and expected response codes.
  - Rewrote and expanded project API documentation in `docs/API.md` with complete routing tables, HTTP status codes, and environment guides.
- **GORM Query Optimization & Clean Logging**:
  - Configured GORM logger in `internal/db/db.go` with `logger.Config{ IgnoreRecordNotFoundError: true }` to silence noisy `record not found` console errors on normal lookup queries.
  - Refactored partner queries in `internal/api/profile.go` and `internal/api/couples.go` from `.First(&link)` to `.Limit(1).Find(&coupleLinks)`.
- **Structured JSON Logging & Observability (`internal/logger/`)**:
  - Centralized JSON logger built on Go standard library `log/slog` (RFC3339Nano UTC timestamp, service name, environment, log level, and error object).
  - Gin HTTP logging middleware (`logger.Middleware()`):
    - Injects and propagates `X-Request-ID` as `trace_id`.
    - Tracks per-request latency in milliseconds (`latency_ms`).
    - Records authenticated `user_id` automatically from Limen session context.
    - Captures HTTP status, client IP, method, and path.
  - Gin panic recovery middleware (`logger.Recovery()`):
    - Catches unhandled panics, formats stack traces into structured JSON error objects (`PanicError`), and returns clean `500 Internal Server Error` responses containing the `trace_id`.
  - Comprehensive unit test suite in `internal/logger/logger_test.go` covering logger formatting, middleware headers, and panic recovery.
- Multi-path `.env` loading in `cmd/server/main.go` (`.env`, `../.env`, `../../.env`) ensuring seamless execution regardless of the working directory.
- Admin IAM endpoints (`internal/api/admin.go`):
  - `GET /api/admin/roles` (permission `roles:read`)
  - `GET /api/admin/users` with `q`, `page`, `per_page` (permission `users:read`)
  - `PUT /api/admin/users/{userId}/roles` (permission `roles:assign`; 409 if a SUPER_ADMIN removes their own SUPER_ADMIN role)
  - `PUT /api/admin/users/{userId}/subscription` (permission `subscriptions:update`; FREE clears `expires_at`)
- `Server.authorize` helper: Limen session validation + RBAC permission check per handler.
- RBAC seeder (`internal/db/seeder.go`) — idempotent seeding of roles & permissions on startup.
- Limen auth integration (credential-password, GORM adapter, UUID ID generator, Bearer token support).
- GORM models: `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `couple_links`, Limen tables.
- Profile & couple-link handlers.
- Kubernetes internal service integration support: `http://backend-service.jadisah-staging.svc.cluster.local:8080` for Next.js rewrite proxies.
- DBML schema (`docs/schema.dbml`) for ERD visualization.

### Changed
- Migrated all `log.Println` and `log.Fatalf` in `cmd/server/main.go` and `internal/db/seeder.go` to structured `logger.Info` / `logger.Error` / `logger.Warn`.
- Entry point moved from `backend/main.go` to `backend/cmd/server/main.go` (Dockerfile updated).

### Initial
- Initialized Go module and installed Gin & Godotenv.
