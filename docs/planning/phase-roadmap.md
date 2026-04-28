# Cleaning App Phase Roadmap

Each phase should be implemented with tests. A phase is complete only when backend tests pass, lint/typecheck pass, migrations run from scratch, and API docs are updated.

## Phase 0: Planning And Architecture

Goal: make the system buildable by humans and agentic AI without scope drift.

Deliverables:

- Product requirements.
- Express backend architecture.
- Data model.
- API design.
- Booking workflow.
- Auth/security plan.
- Testing strategy.
- Agentic guardrails.
- Recommended project structure.

Acceptance criteria:

- MVP and post-MVP scope are separated.
- Express.js is locked as the backend framework.
- Booking, assignment, payment, and notification rules are unambiguous.

## Phase 1: Project Foundation

Goal: create a clean backend foundation and keep the existing React app as the admin shell.

Deliverables:

- `server` Node + Express + TypeScript project.
- Health endpoint: `GET /api/v1/health`.
- Central error format.
- Environment config validation.
- Prisma setup with PostgreSQL connection.
- Docker Compose for local PostgreSQL.
- Test runner, lint, format, and typecheck commands.
- React admin app configured with API base URL.

Acceptance criteria:

- Backend starts locally.
- Health endpoint works.
- Database connection can be verified.
- A first backend integration test passes.

Non-goals:

- Auth.
- Booking.
- Payments.

## Phase 2: Auth, Users, And Sessions

Status: completed on 2026-04-28.

Goal: implement secure identity and role-based access.

Deliverables:

- Register/login for customer users.
- Seeded admin user flow.
- Password hashing.
- Access token and refresh token flow.
- Refresh token rotation and logout/revoke.
- `GET /auth/me`.
- Role guards for admin/provider/customer routes.
- User profile APIs.

Acceptance criteria:

- Customers and admins can authenticate.
- Protected routes reject anonymous requests.
- Role checks protect admin/provider APIs.
- Auth service has unit and integration tests.

Non-goals:

- OTP.
- Google login.
- Two-factor auth.

## Phase 3: Catalog, Cities, Addresses, Providers

Goal: build the marketplace directory.

Deliverables:

- City APIs.
- Service category APIs.
- Service APIs.
- Customer address APIs with ownership checks.
- Provider registration.
- Provider document metadata.
- Provider-service mapping.
- Admin provider verification/status APIs.

Acceptance criteria:

- Admin can create and activate cities/services.
- Customer can browse active services.
- Customer can manage own addresses.
- Provider can register and select services.
- Admin can verify providers.

## Phase 4: Booking And Assignment Lifecycle

Goal: implement the core booking workflow without online payment complexity.

Deliverables:

- COD booking creation.
- Server-side price calculation.
- Booking status transition service.
- Booking status history.
- Booking assignment records.
- Manual admin assignment.
- Provider accept/reject.
- Provider job list.
- Customer booking history.
- Customer/admin cancellation.

Acceptance criteria:

- Customer can create a valid COD booking.
- Admin can assign only eligible providers.
- Provider rejection creates an assignment result without corrupting booking status.
- Invalid status transitions are rejected.
- Every important transition creates history.

## Phase 5: Payments And Reviews

Goal: add payment safety and feedback.

Deliverables:

- COD collection tracking.
- Razorpay order creation.
- Razorpay payment verification.
- Razorpay webhook endpoint.
- Idempotent payment updates.
- Review creation after completed booking.
- Provider rating recalculation.

Acceptance criteria:

- Client-only payment success cannot mark a booking paid.
- Duplicate webhook events do not duplicate state changes.
- Online bookings are not assigned until paid.
- Reviews are allowed only once per completed booking.

## Phase 6: Notifications And Admin Operations

Goal: make the MVP operable from React web.

Deliverables:

- Notification event creation for important booking/payment events.
- Notification read/unread APIs.
- Admin dashboard summary.
- Admin users/providers/services/bookings/payments pages.
- Basic complaint records and admin resolution notes.
- Seed data scripts for demos and QA.

Acceptance criteria:

- Important lifecycle events create notification records.
- Admin can operate core MVP flows from React.
- Demo data can be regenerated reliably.

## Phase 7: Production Hardening

Goal: prepare for beta users.

Deliverables:

- Rate limiting.
- Request logging with correlation IDs.
- Security headers and CORS policy.
- Database indexes.
- Backup and restore notes.
- Error monitoring strategy.
- Deployment notes.
- API contract export for Flutter.

Acceptance criteria:

- Main APIs have predictable errors.
- No secrets are committed.
- Core tests pass from a clean install.
- Known limitations are documented.

## Phase 8: Post-MVP Expansion

Possible additions:

- OTP and Google login.
- Live provider tracking.
- Chat.
- Coupons.
- Wallet.
- Subscriptions.
- Referrals.
- Automated provider matching.
- Provider shifts and availability.
- Withdrawal requests.
- AI price estimation.
