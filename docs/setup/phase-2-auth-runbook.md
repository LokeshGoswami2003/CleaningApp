# Phase 2 Auth Runbook

## Local Database

Start PostgreSQL:

```powershell
docker compose up -d postgres
```

Apply migrations:

```powershell
npm run prisma:migrate:deploy --workspace server
```

Seed admin:

```powershell
npm run db:seed --workspace server
```

Default local admin values come from `server/.env.example`:

```text
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=AdminPass123
```

Change these in `server/.env` for real environments.

## Backend

Run the API:

```powershell
npm run dev --workspace server
```

The API defaults to:

```text
http://localhost:4000/api/v1
```

## React Flow Checker

Run the React admin/testing client:

```powershell
npm run dev --workspace client-web
```

The client can test:

- Health check.
- Customer register.
- Admin/customer login.
- Access-token `me` checks.
- Refresh token rotation.
- Logout/revoke.
- User profile update.
- Admin user listing.
- Admin user activation/deactivation.

## Build Gate

Backend tests run before backend builds:

```powershell
npm run build --workspace server
```

Coverage:

```powershell
npm run test:coverage --workspace server
```

