# Cleaning App Logic Review

## Review Summary

The product is feasible, but the first build must stay narrow. The hard part is not the number of screens; it is keeping booking, assignment, payments, cancellations, reviews, and admin actions consistent.

The refined plan should build the backend core first, use React as a small admin/API validation client, and leave full mobile UX to the Flutter team.

## Main Corrections From The Raw Plan

### Express.js Is Locked

The plan no longer leaves the backend choice open between Express and NestJS. Use Express.js with TypeScript and strong module boundaries.

### PostgreSQL Is Locked

MongoDB is removed from the build path. The domain is relational: users, providers, services, bookings, assignments, payments, reviews, and history all benefit from constraints and transactions.

### Provider Rejection Is Not A Booking Status

Provider rejection belongs to a `booking_assignments` record. The booking itself can move back to `pending_assignment` and be reassigned.

### Coupons Are Post-MVP

Coupons are useful, but they create pricing, abuse, and payment edge cases. Keep the first MVP to base price, discount fields reserved for later, and manual admin adjustment only if needed.

### COD Comes Before Razorpay

COD booking is the fastest way to validate the full marketplace lifecycle. Razorpay should be added after booking creation, assignment, provider flow, and completion are stable.

### React Web Is Admin/Operations Only

The React client should not become a customer app. It should help admins manage data and help developers verify APIs.

## Main Risks

### Risk: Booking Workflow Can Become Inconsistent

Correction:

- Route every status change through one booking workflow service.
- Validate actor, current status, target status, payment status, and assignment state.
- Store every transition in `booking_status_history`.

### Risk: Assignment Logic Gets Mixed Into Booking Status

Correction:

- Use `booking_assignments` for assigned/accepted/rejected/cancelled assignment attempts.
- Keep `bookings.current_provider_id` as a convenience pointer only.
- Allow reassignment from `pending_assignment` after rejection.

### Risk: Payment Webhooks Duplicate Updates

Correction:

- Store gateway order/payment IDs uniquely.
- Store processed webhook event IDs when available.
- Make verification and webhook handlers idempotent.
- Never mark a booking paid only from client response.

### Risk: Admin Scope Expands Quickly

Correction:

- MVP admin is operational and minimal.
- Build only the screens needed for catalog, providers, bookings, payments, and dashboard visibility.

## Final Logic Verdict

Build the backend in this order:

1. Foundation.
2. Auth/users.
3. Catalog/providers/addresses.
4. Booking and assignment workflow.
5. Payments and reviews.
6. Notifications and admin operations.
7. Hardening.

Everything else should wait until the booking lifecycle is proven reliable.
