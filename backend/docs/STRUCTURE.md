# Backend Structure

- `cmd/`: Entry points for the application (e.g., `main.go`).
- `internal/`: Private application code.
  - `config/`: Configuration loading (env vars).
  - `handler/`: HTTP handlers (Gin controllers).
  - `middleware/`: Gin middlewares (Auth, Logger, CORS).
  - `service/`: Core business logic.
  - `repository/`: Database interactions (sqlc generated code).
  - `model/`: Data models and DTOs.
  - `router/`: Route registration.
- `migrations/`: SQL migration files (e.g., golang-migrate).
