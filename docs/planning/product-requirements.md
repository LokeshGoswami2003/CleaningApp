# Cleaning App Product Requirements

## Product Vision

The Cleaning App helps customers book trusted cleaning services and helps providers manage assigned cleaning jobs. Admin users operate the marketplace by managing cities, catalog, providers, bookings, payments, complaints, and basic reports.

The MVP should feel reliable before it feels feature-rich. Customers need confidence that a service will happen. Providers need clear jobs and status actions. Admins need enough control to fix real operational issues.

## Product Roles

### Customer

MVP capabilities:

- Register and sign in.
- Manage profile.
- Add and manage addresses.
- Select city.
- Browse active categories and services.
- View service price, duration, and included/excluded items.
- Create a booking with date, time, address, notes, and payment method.
- View booking status and history.
- Cancel eligible bookings.
- Submit a rating and review after completion.

Post-MVP:

- OTP login.
- Google login.
- Chat.
- Live provider tracking.
- Coupons, referrals, subscriptions, and wallet.

### Provider

MVP capabilities:

- Register a provider profile linked to a user account.
- Upload KYC metadata.
- Select offered services.
- View assigned jobs.
- Accept or reject assigned bookings.
- Move accepted jobs through allowed statuses.
- View completed jobs and rating summary.

Post-MVP:

- Availability calendar.
- Withdrawal requests.
- Live location sharing.
- Advanced earnings dashboard.

### Admin

MVP capabilities:

- Sign in.
- Manage cities.
- Manage service categories and services.
- Manage users.
- Verify and activate providers.
- Assign providers to bookings.
- View booking status history.
- View payment records.
- Handle cancellations and complaints manually.
- View basic operational dashboard metrics.

Post-MVP:

- Automated assignment.
- Refund automation.
- Deep analytics.
- Dedicated support ticketing.

## MVP Requirements

- Express.js backend APIs for customers, providers, and admins.
- PostgreSQL data model with migrations.
- Authentication and role-based authorization.
- City and service catalog.
- Address management.
- Provider registration, KYC metadata, service mapping, and admin verification.
- Booking lifecycle with centralized transition service.
- Assignment attempt records for provider assignment, accept, and reject.
- COD payment tracking.
- Razorpay-ready integration boundaries.
- Review system.
- Notification event records.
- Basic React admin web app for operating and testing APIs.
- API documentation suitable for Flutter integration.
- Tests for new behavior in every phase.

## Non-Goals For MVP

- Building the full Flutter customer/provider apps in this repo.
- Customer marketing website.
- Live tracking.
- Chat.
- Coupons/referrals/subscriptions.
- Wallet/ledger.
- Automated provider matching.
- Advanced provider payouts.
- AI price estimation.
- Multi-country support.

## Product Principles

- Booking consistency matters more than feature count.
- Admins must be able to recover from edge cases manually.
- Payment updates must be idempotent and auditable.
- Provider assignment should be manual first, automated later.
- Mobile clients must not own business rules.
- Every important lifecycle change should leave a history record.
