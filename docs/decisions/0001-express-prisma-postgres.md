# ADR-0001: Use Express, Prisma, And PostgreSQL

Date: 2026-04-28
Status: Accepted

## Context

The backend needs to support a modular marketplace with users, providers, services, bookings, assignments, payments, reviews, and audit/history records.

The user requested Express.js for the backend.

## Decision

Use:

- Express.js for the HTTP API.
- TypeScript for safety and maintainability.
- PostgreSQL for relational data.
- Prisma for schema management, migrations, and typed database access.

## Consequences

- The backend must keep strong module boundaries because Express does not enforce them by default.
- Database tables are created and updated through Prisma migrations.
- Agents must read `server/AGENTS.md` before changing backend modules.

## References

- `docs/architecture/architecture.md`
- `docs/setup/project-structure.md`
- `docs/database/local-and-aws-flow.md`

