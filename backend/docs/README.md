# Backend Context

This is the backend service for the Wedding Planner application.
Built with Go, Gin framework, and PostgreSQL.

## Purpose
Provides the REST API for managing users, weddings, guests, budgets, etc.

## Forward connection
```bash
kubectl port-forward svc/postgres-staging-service 5432:5432 -n staging
```
