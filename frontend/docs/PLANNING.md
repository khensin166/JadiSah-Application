# Frontend Planning

## Phase 1 (Foundation)
- [x] Initialize Next.js app.
- [x] Install Lucide Icons & setup Tailwind CSS v4 design system.
- [x] Install & setup shadcn/ui and Radix UI primitives (`Button`, `Card`, `Badge`, `Input`, `Progress`, `Table`, `Separator`, `Avatar`, `cn` helper).
- [ ] Setup TanStack Query for API fetching.

## Phase 3 (Authentication)
- [x] Create Login & Register UI (with password tooltip helper).
- [x] Support role-based login redirection (`USER`, `ADMIN`, `SUPER_ADMIN`).
- [x] Setup global context for User Session (`AuthProvider` & `useSession`) backed by `GET /api/users/me`.
- [x] Implement Route Protection via Next.js 16 `proxy.ts` (protect `/dashboard`, `/admin`) and client-side `<RoleGuard>`.

## Phase 4 (User Dashboard)
- [x] Create User Dashboard (`/dashboard`) with modern Sidebar layout (Desktop & Mobile Drawer).
- [x] Rebuild all dashboard components using shadcn/ui primitives (`Card`, `Button`, `Table`, `Input`, `Progress`, `Badge`).
- [x] Countdown hero card with live real-time countdown grid (*Hari : Jam : Menit : Detik*) and copyable public invitation link.
- [x] Key metrics summary cards (RSVP progress, Budget realization, Vendors, Events).
- [x] Interactive guest list with search, status filters, and quick-add form.
- [x] Budget category breakdown with visual progress tracking.
- [x] Event schedule rundown and interactive preparation checklist.
- [x] Interactive Tambah Rundown and Tambah Checklist with category selector, filters, and dynamic badge synchronization.
- [x] Integrated Calendar/DatePicker popover for task due dates and TimePicker dropdown for rundown start/end times.
- [x] Time window filter for preparation checklist (Bulan Ini, 2 Bulan, 3 Bulan, All) with comprehensive unit tests.
- [x] Refined visual theme to Éternel Atelier Luxury (Warm Ivory/Alabaster canvas `#FAF6EE`, Champagne Gold accents `#C5A880`, Olive Sage `#7A8A76`, Charcoal Espresso typography `#1C1C1A`, and Cormorant Garamond / Plus Jakarta Sans fonts).
- [x] Unit testing for utility calculations with Node native test runner (`npm test`).

## Phase 5 (Template Migration: Vault - Square UI)
- [ ] Clone and extract Vault (dashboard-4) from `zerostaticthemes/square-ui`.
- [ ] Adapt Vault's sidebar and layout to match the current color palette (Éternel Atelier Luxury).
- [ ] Apply Vault's structural layout to `/dashboard`.

## Phase 6 (API Integration - IAM Auth & Users)
- [x] Create Login Page (`/login`) matching Vault's UI aesthetics.
- [x] Integrate Limen Auth `POST /api/auth/signin/credential` for Login.
- [x] Connect `GET /api/users/me` & `PATCH /api/users/me` to display and edit user profile in Dashboard Header/Sidebar/Modal.
- [x] Connect `GET /api/couples/me`, `DELETE /api/couples/me`, and `/api/couples/invitations` to handle partner linking and invitations in Dashboard.

## Phase 7 (Theme Variable System & Landing Page Refactoring) - [IN PROGRESS / APPROVED PLAN]
- [ ] **Structured Theming Architecture (Colors & Assets as Variables)**:
  - [ ] Define theme contracts in `types/theme.ts` (`ThemeConfig`, `ThemeColors`, `ThemeAssets`, `ThemeBranding`).
  - [ ] Centralize semantic color tokens (canvas/background, primary, secondary, accent, text, border).
  - [ ] Centralize image & asset slots (logo SVG/path, hero illustration/showcase, feature icons/badges, textures) so themes can be switched or customized easily.
  - [ ] Implement default theme preset in `lib/theme/themes/eternel-atelier.ts` with helper getters in `lib/theme/index.ts`.
  - [ ] Align CSS semantic custom properties in `app/globals.css` with the theme variable configuration.
- [ ] **Reusable Component Decomposition for Landing Page (`components/landing/`)**:
  - [ ] Create `LandingNavbar.tsx`: Responsive navigation with session awareness (displays "Masuk" / "Daftar" if unauthenticated, or "Buka Dashboard" if logged in) and dynamic logo from theme assets.
  - [ ] Create `LandingHero.tsx`: Elegant Cormorant Garamond typography, value proposition, action buttons, and responsive theme showcase graphic.
  - [ ] Create `LandingFeatures.tsx`: Modular feature grid reading feature items and badges dynamically from the theme config (no hardcoded rose/emerald colors).
  - [ ] Create `LandingCTA.tsx`: Warm champagne luxury call-to-action banner for new couple signups.
  - [ ] Create `LandingFooter.tsx`: Clean, standardized branding footer matching atelier aesthetics.
- [ ] **Refactor Landing Page (`app/page.tsx`)**:
  - [ ] Rewrite `app/page.tsx` into a concise, declarative orchestrator (<35 lines) composing the landing components.
  - [ ] Eliminate all legacy hardcoded Tailwind classes (`rose-500`, `pink-500`, `zinc-900`) in favor of theme tokens.
- [ ] **Verification & Testing**:
  - [ ] Run `npm.cmd run lint` (ESLint clean).
  - [ ] Run `npx.cmd tsc --noEmit` (TypeScript strict check).
  - [ ] Run `npm.cmd test` (Unit tests passing).

## Phase 8 (Admin Console UI - Backlog Pengembangan Selanjutnya)
- [ ] **Admin Layout & Navigation (`/admin`)**:
  - [ ] Dedicated Admin Sidebar with navigation: Overview, Users & Roles, Subscriptions, Audit Logs.
  - [ ] Role indicator banner and Super Admin quick switch badge.
- [ ] **Admin User Management**:
  - [ ] User directory table connected to backend `GET /api/admin/users`.
  - [ ] Search, filter by role (`USER`, `ADMIN`, `SUPER_ADMIN`), and status.
  - [ ] Role Assignment modal via `POST /api/admin/roles/assign`.
  - [ ] Subscription Tier modal (`FREE`, `PRO`, `ENTERPRISE`) via `PATCH /api/admin/subscriptions`.
- [ ] **Audit Logs & Security Monitoring**:
  - [ ] System activity and security log viewer connected to `GET /api/admin/audit-logs`.
  - [ ] Filter by action, user ID, and timestamp.
