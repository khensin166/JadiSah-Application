# Backend Context

This is the backend service for the Wedding Planner application.
It is built with Go, Gin, and PostgreSQL (via sqlc).

## Purpose
Provides the REST API for managing users, weddings, guests, budgets, etc.

## Guidelines
- Follow standard Go project layout.
- Separate business logic from HTTP handlers.
- Use `sqlc` for type-safe database queries.
