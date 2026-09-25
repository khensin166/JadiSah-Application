# Infrastructure & CI/CD Implementation Plan

This document outlines the professional Infrastructure as Code (IaC) setup for the Staging and Production environments.

## Core Philosophy
- **Zero Manual Server Configuration**: Everything is provisioned and configured via code.
- **Immutable Infrastructure**: Servers are cattle, not pets. If a server dies, we re-run Terraform/Ansible to get a new one.
- **Automated Deployment**: Code merged to specific branches automatically deploys.

## 1. Provisioning (Terraform)
We will use Terraform to create the actual servers (VMs) and networking.
- **Provider**: (e.g., AWS EC2, DigitalOcean, Hetzner - *Needs User Choice*)
- **Resources**:
  - 1 VM for Staging (`staging-server`)
  - 1 VM for Production (`prod-server`)
  - Firewalls / Security Groups (Allowing only Ports 80, 443, and 22).

## 2. Configuration Management (Ansible)
We will use Ansible to configure the newly provisioned VMs.
- **Security**: Create deploy user, add SSH keys, disable root login, setup UFW firewall.
- **Dependencies**: Install Docker, Docker Compose.
- **Reverse Proxy**: Setup Traefik (or Nginx) via Docker for automatic SSL (Let's Encrypt) and subdomain routing.

## 3. Containerization (Docker)
- Create production-ready `Dockerfile` for Backend (multi-stage Go build).
- Create production-ready `Dockerfile` for Frontend (Next.js standalone build).
- Create `docker-compose.prod.yml` to define the stack (Frontend, Backend, Postgres, Traefik).

## 4. CI/CD Pipeline (GitHub Actions)
- **CI Workflow (On PR to `main` / `staging`)**:
  - Run Linters (Go, ESLint).
  - Run Tests.
- **CD Workflow (On Merge to `staging`)**:
  - Build and push Docker images to GitHub Container Registry (GHCR) tagged as `:staging`.
  - SSH into `staging-server` via Action, pull the latest images, and restart containers.
- **CD Workflow (On Tag / Release for Production)**:
  - Build and push Docker images tagged as `:production` or `v1.x.x`.
  - SSH into `prod-server`, pull images, and restart.
