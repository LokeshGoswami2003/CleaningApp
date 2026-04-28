# Client Web Agent Guide

The React app is a minimal admin/operator client for API progress checks. It is not the production customer mobile app.

## Scope

Build screens that help operate and verify the backend:

- Admin login.
- Dashboard summary.
- Cities and services.
- Providers and verification.
- Bookings and assignment.
- Payments.
- Complaints.

## Rules

- Keep UI operational and clear.
- Do not add customer marketing pages unless requested.
- Keep API calls in `src/lib/api`.
- Keep domain screens under `src/features`.
- Use backend response shapes from `docs/architecture/api-design.md`.

