# Backend Changelog

## [Unreleased]

### Added
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
- Local `.env` loading via `godotenv`.
- Kubernetes internal service integration support: `http://backend-service.jadisah-staging.svc.cluster.local:8080` for Next.js rewrite proxies.
- DBML schema (`docs/schema.dbml`) for ERD visualization.

### Changed
- Entry point moved from `backend/main.go` to `backend/cmd/server/main.go` (Dockerfile updated).

### Initial
- Initialized Go module and installed Gin & Godotenv.
