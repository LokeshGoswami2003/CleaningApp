# Cleaning App Architecture

## Architecture Principle

Build a modular Express.js backend around the booking lifecycle. Keep the first system simple enough for a fast MVP, but strict enough that payments, notifications, Flutter clients, admin workflows, and future assignment automation can grow without rewriting the core.

## Stack

Backend:

- Node.js.
- Express.js.
- TypeScript.
- Prisma for PostgreSQL migrations and typed database access.
- Zod or equivalent for request validation.
- Vitest or Jest with Supertest for route tests.

Database:

- PostgreSQL.

Admin web:

- React.
- TypeScript.
- Vite.
- Minimal UI focused on operations and API verification.

Mobile:

- Flutter customer app.
- Flutter provider app or provider mode.

Integrations:

- Razorpay for online payments after COD flow is stable.
- Firebase Cloud Messaging for push delivery after notification events exist.
- SMS/email providers behind adapters.
- Object storage for provider documents and service images.

## Current Workspace Mapping

```text
CleaningApp/
  server/      # Express API, currently empty
  client-web/  # React admin/operator web app
  docs/        # planning and architecture docs
```

Keep this layout for the first implementation pass. A later migration to `apps/api` and `apps/admin-web` can happen only if the repo grows enough to justify it.

## Backend Modules

- `auth`
- `users`
- `cities`
- `addresses`
- `service-categories`
- `services`
- `providers`
- `bookings`
- `booking-assignments`
- `payments`
- `reviews`
- `notifications`
- `complaints`
- `admin`
- `reports`

Each module owns:

- Routes.
- Controllers.
- Validation schemas.
- Services/business logic.
- Repository/database access.
- Tests.

## Backend Layers

```text
routes -> validators -> controllers -> services -> repositories -> database
```

Rules:

- Controllers do not contain business rules.
- Controllers do not query the database directly.
- Services enforce business rules and transactions.
- Repositories hide Prisma/database details.
- Shared constants/enums live in a shared internal package or `server/src/common`.

## High-Level Flow

```text
Flutter Customer App -> Backend API -> PostgreSQL
Flutter Provider App -> Backend API -> PostgreSQL
React Admin Web      -> Backend API -> PostgreSQL

Backend API -> Razorpay
Backend API -> Notification Adapters
Backend API -> Object Storage
```

## Service Responsibilities

### Backend API

- Authentication and session handling.
- Role-based authorization.
- User/profile management.
- Service catalog.
- Provider registration and verification.
- Address management.
- Booking creation and status transitions.
- Booking assignment attempts.
- Payment records and gateway verification.
- Reviews and provider rating updates.
- Notification event creation.
- Admin/report APIs.

### React Admin Web

- Admin login.
- Dashboard overview.
- Manage cities.
- Manage services.
- Verify providers.
- Assign bookings.
- View booking lifecycle/history.
- View payment records.
- Resolve simple complaints.

### Flutter Apps

- Customer booking experience.
- Provider job experience.
- Push notification handling.
- Location permissions and mobile UX.

## Architecture Decisions

- PostgreSQL is the source of truth.
- Booking state changes go through one workflow service.
- Provider assignment attempts are tracked separately from booking status.
- Every booking status change is recorded.
- Payment gateway callbacks are verified server-side.
- Notification events are stored before delivery integrations are added.
- Admin manual assignment comes before automated dispatch.
- Mobile and React clients must not own business rules.

## Scalability Direction

MVP can run as a single API service with PostgreSQL. Later scaling can add:

- Background worker for notifications and reports.
- Redis for rate limiting and short-lived locks.
- Queue for payment/notification/retry jobs.
- Object storage for provider documents and service images.
- Read-optimized reporting views.
