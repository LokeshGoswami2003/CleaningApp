# Phase 1 Setup Runbook

This runbook explains how the project foundation is intended to run.

## One-Time Install

From the repo root:

```powershell
npm install
```

This installs dependencies for the root workspace, `server`, and `client-web`.

If workspace install causes issues, install separately:

```powershell
cd server
npm install

cd ../client-web
npm install
```

## Environment Setup

Create a local server env file:

```powershell
Copy-Item server/.env.example server/.env
```

The default local database URL is:

```text
postgresql://cleaning_app:cleaning_app_password@localhost:5432/cleaning_app_dev?schema=public
```

## Start Local PostgreSQL

From the repo root:

```powershell
docker compose up -d postgres
```

This starts a PostgreSQL 16 container and creates:

- user: `cleaning_app`
- password: `cleaning_app_password`
- database: `cleaning_app_dev`

## Generate Prisma Client

From `server/`:

```powershell
npm run prisma:generate
```

## Create Tables Locally

Tables are created by migrations.

When models are added to `server/prisma/schema.prisma`, create a migration:

```powershell
cd server
npm run prisma:migrate:dev -- --name initial_schema
```

For the current Phase 1 skeleton, there are no domain tables yet.

## Run Backend

```powershell
cd server
npm run dev
```

Health check:

```text
GET http://localhost:4000/api/v1/health
```

Expected response:

```json
{
  "data": {
    "status": "ok",
    "service": "cleaning-app-api"
  },
  "meta": {}
}
```

## Run React Admin Client

```powershell
cd client-web
npm run dev
```

## Run Checks

```powershell
cd server
npm run build
npm run test
npm run lint
```

```powershell
cd client-web
npm run build
npm run lint
```

## AWS Database Flow

Local development creates and changes schema with:

```powershell
npm run prisma:migrate:dev
```

AWS/staging/production applies committed migrations with:

```powershell
npm run prisma:migrate:deploy
```

In AWS, the database itself is created by infrastructure setup, usually RDS PostgreSQL. The application tables are created by Prisma migrations during deployment.

See:

- `docs/database/local-and-aws-flow.md`
- `docs/database/schema-lifecycle.md`
- `docs/database/query-efficiency.md`

