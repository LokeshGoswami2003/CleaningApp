# Development Workflow

## Phase Workflow

1. Read `AGENTS.md`.
2. Read the relevant architecture docs.
3. Check `docs/decisions/` for existing decisions.
4. Create or update a journey entry.
5. Write focused tests for the behavior.
6. Implement the smallest module changes.
7. Run focused checks.
8. Update API, database, or command docs if anything changed.

## Backend Feature Workflow

1. Add or update validation schemas.
2. Add route tests.
3. Add controller/service/repository code.
4. Add database migration if schema changes.
5. Run migration locally.
6. Run focused tests.
7. Update docs.

## Decision Workflow

Create an ADR when a decision affects:

- Data model.
- API contract.
- Auth/security.
- Payment behavior.
- Deployment.
- MVP scope.

