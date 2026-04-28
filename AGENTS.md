# CleaningApp Agent Guide

This file is the first thing every human or AI agent should read before changing the repository.

## Source Of Truth

Use these docs before implementing:

- `docs/PLAN.md`
- `docs/planning/phase-roadmap.md`
- `docs/planning/agentic-guardrails.md`
- `docs/architecture/architecture.md`
- `docs/architecture/data-model.md`
- `docs/architecture/booking-workflow.md`
- `docs/setup/project-structure.md`
- `docs/decisions/`

If implementation and docs disagree, stop and update the docs or ask for a decision. Do not silently invent new architecture.

## Current Direction

- Backend: Express.js + TypeScript.
- Database: PostgreSQL.
- ORM/migrations: Prisma.
- Web client: React + Vite admin/operator app.
- API: REST under `/api/v1`.
- MVP payment path: COD first, Razorpay after booking lifecycle is stable.
- Booking is the central business record.
- Provider rejection is tracked through `booking_assignments`, not as a booking status.

## Development Rules

- Work phase by phase.
- Keep modules small and isolated.
- Add tests with each backend behavior.
- Backend tests must pass before backend builds; `server` uses `prebuild` for this.
- Prefer route -> schema -> controller -> service -> repository.
- Controllers must not query the database directly.
- Only the booking workflow service may change booking status.
- Payment updates must be idempotent.
- Update docs for new commands, schema changes, API behavior, or architecture decisions.
- Seeded admin credentials must come from environment variables, never hard-coded production secrets.

## Documentation Rules

- Add journey notes in `docs/journey/`.
- Add durable decisions in `docs/decisions/`.
- Add database/process details in `docs/database/`.
- Use `scripts/new-journey-entry.ps1` to create dated journey entries.
- Keep docs short, concrete, and implementation-facing.

## Verification Before Handoff

Run the most focused checks available for the files changed. As the project grows, prefer:

- `npm run build --workspace server`
- `npm run test --workspace server`
- `npm run lint --workspace server`
- `npm run build --workspace client-web`

If a command cannot run because dependencies are not installed or services are missing, document that clearly in the final handoff.
