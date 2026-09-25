# Wedding Planner - Implementation Plan

This document tracks the long-term implementation plan.

## Phase 1 — Foundation (Completed)
- Set up Monorepo (Frontend, Backend, Infrastructure, Docs).
- Initialize Next.js (Frontend).
- Initialize Go + Gin (Backend).
- Initialize PostgreSQL (Docker Compose).
- Create basic AI context files in `doc/` folders.

## Phase 2 — Database
- Database schema and Migrations.
- Setup `sqlc` for type-safe database queries.
- Users, Weddings, and Wedding members entities.

## Phase 3 — Authentication
- Register, Login, Logout.
- Authentication middleware.
- Protected routes.

## Phase 4 — Wedding Management
- Create, Update, Delete wedding.
- Wedding dashboard.

## Phase 5 — Guest & RSVP
- Guest CRUD.
- RSVP functionality.
- Guest statistics, Search/filter.

## Phase 6 — Events
- Wedding events.
- Event schedule and Timeline.

## Phase 7 — Budget
- Budget categories.
- Expenses, Budget summary, Spending statistics.

## Phase 8 — Vendors
- Vendor CRUD.
- Vendor category, contact information, status.

## Phase 9 — Public Invitation
- `/invitation/[slug]` route.
- Public wedding page accessible without login.

## Phase 10 — Testing
- Unit tests, Integration tests, API tests, Frontend tests.

## Phase 11 — Docker & CI/CD (Brought forward - See Infrastructure Plan)
- Production Dockerfiles.
- GitHub Actions for automated deployment.
- Container registry.

## Phase 12 — Kubernetes
- Deploy Frontend, Backend, PostgreSQL.
- Ingress, ConfigMap, Secrets.

## Phase 13 — Monitoring
- Prometheus, Grafana, Application metrics.
- Structured logging (Loki) and Basic alerts.
