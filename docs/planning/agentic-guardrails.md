# Agentic AI Implementation Guardrails

These rules are for any human or AI agent working on this codebase. The goal is modularity, test-first implementation, small changes, and predictable progress.

## Working Rules

- Work phase by phase from the roadmap.
- Do not start a later feature until its dependency phase is stable.
- Keep changes scoped to the module being implemented.
- Update docs when API behavior, database schema, or business rules change.
- Prefer small pull-sized tasks over broad rewrites.
- Do not add post-MVP features during MVP phases.

## Module Boundaries

Each backend module owns its routes, validation, service logic, repository access, and tests.

Controllers may:

- Parse request context.
- Call validators.
- Call services.
- Return responses.

Controllers must not:

- Contain business rules.
- Query the database directly.
- Change booking/payment state directly.

Services may:

- Enforce business rules.
- Start transactions.
- Call repositories.
- Emit domain events.

Repositories may:

- Query the database.
- Hide ORM details from services.

## Test-First Rules

For each feature:

1. Write or update the failing test that describes the desired behavior.
2. Implement the smallest code needed.
3. Run the focused test.
4. Run the module test suite.
5. Update docs if the contract changed.

Minimum test expectations:

- Unit tests for pure business rules.
- Integration tests for Express routes.
- Database-backed tests for booking, assignment, payment, and auth behavior.
- Regression tests for every production bug.

## Booking Safety Rules

- Only the booking workflow service may change booking status.
- Every status change must create history.
- Assignment rejection must update `booking_assignments`, not turn the whole booking into `rejected`.
- A provider can act only on an assignment addressed to that provider.
- Online bookings cannot be assigned until payment is confirmed.
- Reviews can be created only once and only after completion.

## Payment Safety Rules

- Client payment success is never trusted by itself.
- Gateway signatures are verified server-side.
- Payment updates are idempotent.
- Gateway IDs are unique where present.
- Refunds are manual/admin-tracked in MVP.

## API Rules

- All APIs use `/api/v1`.
- All success responses use `{ "data": ..., "meta": ... }`.
- All errors use `{ "error": { "code": "...", "message": "...", "details": ... } }`.
- Do not leak stack traces, tokens, password hashes, payment secrets, or private document URLs.
- Prefer adding response fields over renaming/removing fields after Flutter integration starts.

## Definition Of Done

A task is done only when:

- Tests for new behavior exist and pass.
- Typecheck passes.
- Lint passes.
- Database migrations run from scratch.
- API docs are updated.
- Seed data is updated when needed.
- Known limitations are documented.

## Agent Task Template

Every implementation task should include:

- Phase number.
- Module ownership.
- Files expected to change.
- Behavior to implement.
- Tests to add.
- Commands to run.
- Explicit non-goals.
