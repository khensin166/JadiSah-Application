# Frontend Changelog

## [Unreleased]
- Added complete User Dashboard (`/dashboard`) for wedding couples.
- Created reusable components:
  - `DashboardNavbar`: Header navigation with tab switcher and profile summary.
  - `CountdownBanner`: Countdown hero banner with invitation link copying and WhatsApp sharing.
  - `StatsCards`: 4 high-impact metric cards (RSVP, Budget, Vendors, Events).
  - `RecentGuestsTable`: Interactive guest list with search, status filtering, and quick-add form.
  - `BudgetOverviewCard`: Category-by-category expense tracking with progress indicators.
  - `TimelineChecklist`: Event rundown and interactive to-do checklist.
- Added calculation utilities (`lib/dashboard-utils.ts`) with unit tests in `__tests__/dashboard-utils.test.mjs`.
- Configured `npm test` script in `package.json`.
- Added documentation in `COMPONENTS.md`, `TESTING.md`, and updated `PLANNING.md`.
- Initialized Next.js project.
