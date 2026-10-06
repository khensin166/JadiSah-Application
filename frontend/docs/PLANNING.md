# Frontend Planning

## Phase 1 (Foundation)
- [x] Initialize Next.js app.
- [x] Install Lucide Icons & setup Tailwind CSS v4 design system.
- [x] Install & setup shadcn/ui and Radix UI primitives (`Button`, `Card`, `Badge`, `Input`, `Progress`, `Table`, `Separator`, `Avatar`, `cn` helper).
- [ ] Setup TanStack Query for API fetching.

## Phase 3 (Authentication)
- [x] Create Login & Register UI (with password tooltip helper).
- [x] Support role-based login redirection (`USER`, `ADMIN`, `SUPER_ADMIN`).
- [ ] Setup context for User Session.

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
- [ ] Create Login Page (`/login`) matching Vault's UI aesthetics.
- [ ] Integrate Limen Auth `POST /api/auth/signin/credential` for Login.
- [ ] Connect `GET /api/users/me` to display user profile in Dashboard Header/Sidebar.
- [ ] Connect `GET /api/couples/me` to handle partner status in Dashboard.
