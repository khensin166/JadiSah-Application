# Database Schema (PostgreSQL)

This document contains the initial database design for the Wedding Planner application.

## Entity Relationship

### `users`
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `full_name` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `weddings`
- `id` (UUID, PK)
- `name` (VARCHAR) - e.g., "John & Jane Wedding"
- `date` (DATE)
- `venue_name` (VARCHAR, NULL)
- `slug` (VARCHAR, UNIQUE) - For public invitation link
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `wedding_members`
- `id` (UUID, PK)
- `wedding_id` (UUID, FK -> weddings.id)
- `user_id` (UUID, FK -> users.id)
- `role` (VARCHAR) - e.g., "owner", "editor"
- `created_at` (TIMESTAMP)

### `events`
- `id` (UUID, PK)
- `wedding_id` (UUID, FK -> weddings.id)
- `title` (VARCHAR) - e.g., "Ceremony", "Reception"
- `start_time` (TIMESTAMP)
- `end_time` (TIMESTAMP)
- `location` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `guests`
- `id` (UUID, PK)
- `wedding_id` (UUID, FK -> weddings.id)
- `name` (VARCHAR)
- `email` (VARCHAR, NULL)
- `phone` (VARCHAR, NULL)
- `status` (VARCHAR) - e.g., "invited", "attending", "declined"
- `group_name` (VARCHAR, NULL) - e.g., "Bride's Family"
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `guest_rsvps`
- `id` (UUID, PK)
- `guest_id` (UUID, FK -> guests.id)
- `event_id` (UUID, FK -> events.id)
- `is_attending` (BOOLEAN)
- `dietary_requirements` (VARCHAR, NULL)
- `created_at` (TIMESTAMP)

### `budgets`
- `id` (UUID, PK)
- `wedding_id` (UUID, FK -> weddings.id)
- `total_budget` (DECIMAL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `budget_categories`
- `id` (UUID, PK)
- `budget_id` (UUID, FK -> budgets.id)
- `name` (VARCHAR) - e.g., "Catering", "Photography"
- `allocated_amount` (DECIMAL)
- `spent_amount` (DECIMAL)
- `created_at` (TIMESTAMP)

### `vendors`
- `id` (UUID, PK)
- `wedding_id` (UUID, FK -> weddings.id)
- `category` (VARCHAR) - e.g., "Photographer"
- `name` (VARCHAR)
- `contact_person` (VARCHAR)
- `email` (VARCHAR, NULL)
- `phone` (VARCHAR, NULL)
- `status` (VARCHAR) - e.g., "shortlisted", "hired"
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
