# 2026-04-28 - Phase 2 Auth Step 1

## Summary

Started Phase 2 with test/build guardrails, setup explanations, database portability docs, and the first register/login backend slice.

## Changes

- Added backend `prebuild` so tests run before backend builds.
- Added coverage planning to the testing strategy.
- Documented current setup, root `node_modules`, Docker Compose, and plug-and-play PostgreSQL provider flow.
- Added `users` and `refresh_tokens` Prisma schema models.
- Added Phase 2 auth migration SQL.
- Added register and login routes under `/api/v1/auth`.
- Added password hashing, access token creation, opaque refresh token creation, and auth route tests.

## Decisions

- Backend builds are blocked by failing backend tests.
- Use `bcryptjs` for password hashing.
- Use `jose` for JWT access tokens.
- Store refresh tokens as SHA-256 hashes.

## Commands

```powershell
npm install --workspace server bcryptjs jose
npm install --workspace server --save-dev @vitest/coverage-v8@2.1.9
npm run prisma:generate --workspace server
npm run test --workspace server
npm run lint --workspace server
npm run test:coverage --workspace server
npm run build --workspace server
docker compose up -d postgres
Copy-Item server/.env.example server/.env
npm run prisma:migrate:deploy --workspace server
npm exec --workspace server prisma migrate status
```

## Verification

- Server tests passed: 2 files, 6 tests.
- Server coverage command passed.
- Server lint passed.
- Server build passed, with tests running first through `prebuild`.
- Local PostgreSQL container started and became healthy.
- Phase 2 auth migration applied successfully to local PostgreSQL.
- Prisma migration status reports the local database schema is up to date.
- Production dependency audit passed with 0 vulnerabilities via `npm audit --omit=dev`.

## Follow-Ups

- Add refresh/logout/me endpoints.
- Add auth middleware and role guards.
- Add seeded admin user flow.
- Add database-backed auth repository integration tests.
