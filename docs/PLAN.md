# Cleaning App Documentation Index

This documentation is the implementation guide for a cleaning-service marketplace similar to Urban Company. The raw notes are kept as source material, but the refined plan below is the version to build from.

Source reference:

- [Raw Cleaning App Requirements](./%F0%9F%A7%B9Cleaning%20App.md)

## Product Direction

This repository will focus on the backend architecture, APIs, database, tests, and a minimal React web client for admin operations and API verification.

The production customer and provider mobile clients are expected to be Flutter apps owned outside this repo. The React app in this repo is not the final customer app; it is an operational web client for progress checks, admin workflows, and backend validation.

## Locked Technical Decisions

- Backend: Express.js with TypeScript.
- API style: REST under `/api/v1`.
- Database: PostgreSQL.
- ORM/migrations: Prisma is recommended for fast, typed Express development.
- Validation: Zod or a similar schema validator at the route boundary.
- Auth: email/phone plus password first; OTP and Google login are post-MVP.
- Payments: COD first, Razorpay sandbox after booking flow is stable.
- Notifications: persist notification events first; FCM/SMS/email delivery adapters later.
- Web client: React + Vite admin/operator client.
- Mobile: Flutter clients consume the same backend APIs.
- Multi-city: supported from the first schema.

## Core Architecture Rule

Booking is the source of truth for the service lifecycle. Payments, assignment attempts, notification events, reviews, complaints, and reports must attach back to a booking.

One refinement matters a lot: provider rejection is not a booking status. It is an assignment attempt result. A booking can be reassigned after a provider rejects it.

## MVP Scope

Build the smallest reliable marketplace core:

- Auth and role-based authorization.
- Users, providers, cities, addresses.
- Service categories and services.
- Manual admin provider verification.
- Manual admin booking assignment.
- Provider accept/reject through assignment records.
- Booking lifecycle and status history.
- COD payment records.
- Razorpay-ready payment abstraction and webhook design.
- Reviews after completed bookings.
- Notification event records.
- Minimal React admin web client.
- Tests for every phase.

## Explicitly Post-MVP

- Full Flutter implementation in this repo.
- Live GPS tracking.
- Chat.
- Coupons and referrals.
- Wallet and subscriptions.
- Automated dispatch optimization.
- Provider withdrawal workflow.
- Complex analytics.
- AI price estimation.
- Multi-country payments.

## Planning Docs

- [Product Requirements](./planning/product-requirements.md)
- [Phase Roadmap](./planning/phase-roadmap.md)
- [Logic Review](./planning/logic-review.md)
- [Agentic Guardrails](./planning/agentic-guardrails.md)

## Architecture Docs

- [Architecture](./architecture/architecture.md)
- [Auth & Security](./architecture/auth-security.md)
- [Data Model](./architecture/data-model.md)
- [API Design](./architecture/api-design.md)
- [Booking Workflow](./architecture/booking-workflow.md)
- [Testing Strategy](./architecture/testing-strategy.md)

## Setup Docs

- [Recommended Project Structure](./setup/project-structure.md)
- [Phase 1 Setup Runbook](./setup/phase-1-setup.md)
- [Phase 2 Auth Runbook](./setup/phase-2-auth-runbook.md)

## Operating Docs

- [Development Commands](./development/commands.md)
- [Development Workflow](./development/workflow.md)
- [Database Flow](./database/local-and-aws-flow.md)
- [Database Provider Portability](./database/provider-portability.md)
- [Architecture Decisions](./decisions/README.md)
- [Journey Log](./journey/README.md)

## Phase 0 Definition Of Done

- MVP and post-MVP scope are separated.
- Express.js is the chosen backend framework.
- Backend modules and ownership boundaries are documented.
- Booking, assignment, payment, and notification rules are clear.
- The phase roadmap can be executed with test-first implementation.
