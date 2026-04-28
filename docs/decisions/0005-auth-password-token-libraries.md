# ADR-0005: Use bcryptjs And jose For Phase 2 Auth

Date: 2026-04-28
Status: Accepted

## Context

Phase 2 needs password hashing and access token creation. The implementation should work reliably on Windows and avoid native package build problems during local setup.

## Decision

Use:

- `bcryptjs` for password hashing.
- `jose` for JWT access token signing.
- Opaque random refresh tokens stored as SHA-256 hashes.

## Consequences

- Passwords are never stored in plaintext.
- Access tokens are standard bearer JWTs.
- Refresh tokens are not stored directly; only hashes are stored.
- The implementation avoids native compilation during install.

## References

- `server/src/modules/auth/password.service.ts`
- `server/src/modules/auth/token.service.ts`
- `docs/architecture/auth-security.md`

