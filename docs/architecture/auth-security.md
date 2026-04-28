# Cleaning App Auth And Security Requirements

## MVP Auth Scope

MVP authentication should support:

- Customer signup/login.
- Provider login after registration.
- Admin login through seeded/admin-created accounts.
- Access tokens.
- Refresh tokens.
- Logout/revoke.
- Role-based protected routes.

Phone OTP and Google login are useful, but should be added after core auth and booking flows are stable.

## Roles

Supported roles:

- `customer`
- `provider`
- `admin`
- `support`

Provider-specific operational data lives in the `providers` table, linked to a user account.

## Token Requirements

Access tokens:

- Short-lived.
- Bearer token format.
- Include user ID, role, and expiry.
- Must not include sensitive profile, address, or payment data.

Refresh tokens:

- Longer-lived.
- Stored server-side as hashes or token identifiers.
- Rotated on use.
- Revocable on logout.
- Reuse detection should revoke the token family when possible.
- Phase 2 starts with opaque refresh tokens stored as SHA-256 hashes.
- Phase 2 rotates refresh tokens through `/auth/refresh` and revokes tokens through `/auth/logout`.

## Password Requirements

- Passwords must be hashed with Argon2, bcrypt, or an approved bcrypt-compatible implementation.
- Phase 2 uses `bcryptjs` to avoid native install/build problems on Windows.
- Plaintext passwords must never be logged or stored.
- Login errors should be generic.
- Rate limiting should be added to auth routes before beta release.

## Authorization Requirements

- Customers can access only their own profile, addresses, bookings, payments, reviews, complaints, and notifications.
- Providers can access only their own provider profile and assigned jobs.
- Providers can act only on active assignments addressed to them.
- Admins can manage catalog, users, providers, bookings, assignments, complaints, and payment records.
- Support users should be read-mostly unless explicitly granted operational actions.

## File Security

Provider ID proof and service images should be treated as controlled assets.

Requirements:

- Validate file type and size.
- Store files outside the database.
- Use private object storage for ID proofs.
- Avoid logging document URLs if they expose private access.

## Payment Security

- Never trust payment success from the client alone.
- Verify Razorpay signatures on the backend.
- Use idempotency keys or unique gateway IDs.
- Store processed webhook events.
- Store payment provider payloads carefully, avoiding sensitive card data.
- Refunds should be admin-controlled in MVP unless gateway automation is fully tested.

## Operational Security

- Secrets must come from environment variables or a secret manager.
- No secrets in the repository.
- Production logs must avoid passwords, tokens, full addresses where possible, and payment secrets.
- Admin APIs require strict role checks.
- Phase 2 protects admin user routes with the `admin` role.
- Destructive admin actions should be soft deletes or status changes where practical.
- CORS should allow only known client origins outside local development.
