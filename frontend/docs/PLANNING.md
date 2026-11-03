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
- [x] Interactive Tambah Rundown and Tambah Checklist with category selector, filters, dan dynamic badge synchronization.
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

## Phase 7 (Theme Variable System & Landing Page Refactoring)
- [x] **Structured Theming Architecture (Colors & Assets as Variables)**:
  - [x] Define theme contracts in `types/theme.ts` (`ThemeConfig`, `ThemeColors`, `ThemeAssets`, `ThemeFeatureItem`).
  - [x] Centralize semantic color tokens (canvas, surface, primary, secondary, accent, text, border).
  - [x] Centralize image & asset slots (logo letter, hero mockup badge/title/subtitle, feature badges & icons) so themes can be switched easily.
  - [x] Implement default theme preset in `lib/theme/themes/eternel-atelier.ts` with helper getters in `lib/theme/index.ts`.
- [x] **Reusable Component Decomposition for Landing Page (`components/landing/`)**:
  - [x] Create `LandingNavbar.tsx`: Responsive navigation with session awareness (displays "Masuk" / "Daftar" if unauthenticated, or "Buka Dashboard" if logged in) and dynamic logo from theme assets.
  - [x] Create `LandingHero.tsx`: Elegant Cormorant Garamond typography, value proposition, action buttons, and responsive theme showcase graphic.
  - [x] Create `LandingFeatures.tsx`: Modular feature grid reading feature items and badges dynamically from the theme config (no hardcoded rose/emerald colors).
  - [x] Create `LandingCTA.tsx`: Warm champagne luxury call-to-action banner for new couple signups.
  - [x] Create `LandingFooter.tsx`: Clean, standardized branding footer matching atelier aesthetics.
- [x] **Refactor Landing Page (`app/page.tsx`)**:
  - [x] Rewrite `app/page.tsx` into a concise, declarative orchestrator (<25 lines) composing the landing components.
  - [x] Eliminate all legacy hardcoded Tailwind classes (`rose-500`, `pink-500`, `zinc-900`) in favor of theme tokens.
- [x] **Verification & Testing**:
  - [x] Run `npm.cmd run lint` (ESLint clean, 0 errors, 0 warnings).
  - [x] Run `npx.cmd tsc --noEmit` (TypeScript strict check clean).
  - [x] Run `npm.cmd test` (25/25 unit tests passing).

## Phase 8 (Admin Console UI - Selesai)
- [x] **Service Layer & Types**:
  - [x] Definisi tipe data admin di `types/admin.ts` (`AdminUser`, `AdminUserPage`, `AdminRole`, `SubscriptionTier`: `FREE`, `PREMIUM`, `VIP`).
  - [x] Service API di `lib/services/admin.service.ts` (`listUsers`, `listRoles`, `setUserRoles`, `setUserSubscription`).
- [x] **Admin Layout & Modular Components (`components/admin/`)**:
  - [x] Dedicated Admin Sidebar (`AdminSidebar.tsx`) dengan lencana otoritas Admin/Super Admin, navigasi ke Dashboard User, dan styling atelier.
  - [x] Admin Header (`AdminHeader.tsx`) menampilkan status live connection, refresh trigger, dan mobile drawer toggle.
  - [x] Admin Quick Metrics Cards (`AdminMetricsCards.tsx`) menampilkan total akun, total subscribed (Premium/VIP), dan jumlah administrator.
  - [x] User Management Table (`UserManagementTable.tsx`) terhubung ke `GET /api/admin/users` dengan pencarian live (`q`), filter role (`ALL`, `USER`, `ADMIN`, `SUPER_ADMIN`), filter paket tier, dan paginasi.
  - [x] Edit Role Modal (`EditRoleModal.tsx`) terhubung ke `PUT /api/admin/users/{userId}/roles` (khusus `SUPER_ADMIN`, dengan proteksi self-demotion).
  - [x] Edit Subscription Modal (`EditSubscriptionModal.tsx`) terhubung ke `PUT /api/admin/users/{userId}/subscription` (tier: `FREE`, `PREMIUM`, `VIP`, dengan pemilih tanggal expired untuk Premium/VIP).
- [x] **Halaman Admin Console (`app/admin/page.tsx`)**:
  - [x] Integrasi penuh komponen admin modular di `app/admin/page.tsx`.
  - [x] Proteksi hak akses role & permission check (aksi edit hanya untuk `SUPER_ADMIN`, route guard untuk `ADMIN` & `SUPER_ADMIN`).
  - [x] Admin Concierge Mode di `/dashboard`: Exception pemeriksaan `/api/couples/me` untuk `ADMIN` & `SUPER_ADMIN` (tanpa error `no active couple link`), tetap terotentikasi sebagai admin penuh, dan dapat meninjau konfigurasi pasangan.
  - [x] Verifikasi strict: 0 lint errors/warnings, 0 type errors, 25/25 unit tests lulus.

## Phase 9 (Account Security & Password Flow - Selesai)
- [x] **Contract & Service Integration**:
  - [x] Kontrak tipe data di `types/auth.ts` (`ChangePasswordPayload`, `ResetPasswordPayload`, `AuthSession`).
  - [x] Penambahan metode di `authService` (`requestPasswordReset`, `resetPassword`, `changePassword`, `listSessions`, `revokeOtherSessions`).
- [x] **Unauthenticated Flow**:
  - [x] Halaman Lupa Password (`app/forgot-password/page.tsx`) dengan validasi email dan status instruksi terkirim.
  - [x] Halaman Reset Password (`app/reset-password/page.tsx`) dengan ekstraksi token URL, validasi kriteria keamanan kata sandi live, dan konfirmasi.
  - [x] Penautan link "Lupa password?" di `app/login/page.tsx` ke `/forgot-password`.
  - [x] Proteksi rute tamu di `proxy.ts` untuk `/forgot-password` dan `/reset-password`.
- [x] **Authenticated Security Settings**:
  - [x] Modal Pengaturan Keamanan & Sesi (`components/dashboard/AccountSecurityModal.tsx`) di `/dashboard`.
  - [x] Fitur Ganti Kata Sandi dengan opsi otomatis cabut sesi di perangkat lain (`revoke_other_sessions: true`).
  - [x] Fitur Pantau Sesi Masuk Aktif (`/api/auth/sessions`) dan Cabut Semua Sesi Perangkat Lain (`/api/auth/revoke-sessions`).
  - [x] Integrasi ke `DashboardSidebar` (menu dropdown user & menu Tautan Cepat) dan `DashboardPage`.

## Phase 10 (Social Login / OAuth - Backlog)
- [ ] Google OAuth 2.0 Integration (Client ID & Secret, backend callback `/api/auth/oauth/google/callback`).
- [ ] Facebook Login Integration (Meta App ID & Secret, backend callback `/api/auth/oauth/facebook/callback`).
- [ ] Tombol Social Login di halaman `/login` dan `/register`.
