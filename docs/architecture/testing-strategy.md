# Cleaning App Testing Strategy

## Testing Principle

Each implementation phase must end with tests for the behavior introduced in that phase. The most important tests are around auth, authorization, booking transitions, assignment attempts, payment verification, and idempotency.

Backend tests must run before backend builds. The `server` package uses npm's `prebuild` hook so `npm run build --workspace server` runs `npm run test` first.

## Backend Test Types

Unit tests:

- Pure business rules.
- Status transition rules.
- Price calculation.
- Payment signature verification.

Integration tests:

- Express routes using Supertest.
- Auth middleware and role guards.
- Database-backed workflows.

Database tests:

- Migrations run from scratch.
- Unique constraints and ownership checks.
- Transactional booking/payment behavior.

## Required Backend Coverage

- Health endpoint.
- Auth register/login/refresh/logout.
- Password hashing.
- Protected route access.
- Role-based route access.
- City CRUD for admin.
- Service category CRUD for admin.
- Service CRUD for admin.
- Public service listing.
- Address CRUD ownership checks.
- Provider registration.
- Provider document metadata.
- Provider-service mapping.
- Provider verification by admin.
- COD booking creation.
- Online booking `pending_payment` behavior.
- Booking status transitions.
- Invalid booking transition rejection.
- Provider assignment validation.
- Assignment accept/reject.
- Provider cannot act on another provider's assignment.
- Customer cancellation.
- COD collection.
- Razorpay order creation.
- Razorpay payment verification.
- Razorpay webhook idempotency.
- Review creation after completed booking.
- Review rejection before completion.
- Notification record creation.
- Structured error responses.

## Frontend Admin Tests

Required coverage:

- Admin login form.
- Dashboard loads.
- Service management forms.
- Provider verification flow.
- Booking assignment flow.
- Booking status/history display.
- Payment list display.
- Error and loading states.

## Critical End-To-End Flow

1. Admin creates city, category, and service.
2. Customer signs up and creates address.
3. Provider registers and selects service.
4. Admin verifies provider.
5. Customer creates COD booking.
6. Admin assigns provider.
7. Provider accepts.
8. Provider moves booking through service statuses.
9. COD payment is marked collected.
10. Customer submits review.

## Payment Tests

Required coverage:

- Gateway signature verification success.
- Gateway signature verification failure.
- Duplicate webhook does not duplicate state changes.
- Failed payment does not mark booking paid.
- Online booking is not assignable until paid.
- COD booking remains unpaid until collection is recorded.

## Manual Verification

Before beta:

- Verify all admin screens with realistic seed data.
- Verify Flutter-facing API docs with the mobile team.
- Verify booking status flow with real edge cases.
- Verify Razorpay test mode.
- Verify notification tokens and delivery in a test mobile build.

## Phase Definition Of Done

A phase is not complete until:

- New backend behavior has tests.
- Lint/typecheck pass.
- Database migrations run cleanly from scratch.
- API changes are documented.
- Known limitations are recorded.

## Coverage Planning

Coverage should grow by phase. Do not chase a vanity percentage at the cost of useful tests, but do keep the most dangerous logic covered.

Targets:

- Phase 2 auth/user/session services: high coverage for password hashing, token creation, login failures, duplicate users, and role guards.
- Phase 3 catalog/provider/address modules: route and ownership coverage for CRUD behavior.
- Phase 4 booking/assignment modules: highest coverage in the backend, especially status transitions and invalid actor checks.
- Phase 5 payment/review modules: high coverage for idempotency, signature verification, and review eligibility.

Build gate:

- Backend build is blocked by failing backend tests.
- Coverage reports can be generated with `npm run test:coverage --workspace server`.
