# Wedding Planner - Monorepo

Welcome to the Wedding Planner project.

## Structure
- `frontend/`: Next.js web application.
- `backend/`: Go (Gin) REST API.
- `infrastructure/`: Docker Compose and Ansible playbooks.
- `docs/`: Project documentation and Database ERD.

## Getting Started

### 1. Database
Run PostgreSQL via Docker:
```bash
docker compose up -d
```

### 2. Backend
Run the Go API (runs on port 8080):
```bash
cd backend
go run main.go
```

### 3. Frontend
Run the Next.js development server (runs on port 3000):
```bash
cd frontend
npm run dev
```

## CI/CD Strategy
We will use GitHub actions with path filtering.
For example, pushes to `backend/**` will trigger the backend tests and builds.
Pushes to `frontend/**` will trigger the frontend pipeline.
Playbooks for server setup are in `infrastructure/playbooks`.
