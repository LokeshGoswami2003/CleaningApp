# ADR-0006: Seed Admin User From Environment

Date: 2026-04-28
Status: Accepted

## Context

Phase 2 needs an admin login without building a full admin invitation or user-management workflow first.

## Decision

Use `npm run db:seed --workspace server` to upsert one admin user from environment variables:

- `ADMIN_FULL_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PHONE`
- `ADMIN_PASSWORD`

## Consequences

- Local and hosted environments can bootstrap an admin account consistently.
- Admin credentials are configurable and must be stored as environment secrets outside the repo.
- A richer admin invitation flow can be added later if needed.

## References

- `server/prisma/seed.ts`
- `server/.env.example`
- `docs/setup/phase-2-auth-runbook.md`

