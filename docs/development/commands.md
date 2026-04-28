# Development Commands

Commands are documented here as they become part of the normal workflow.

## Root

```powershell
npm run docs:journey -- "Phase title"
npm run build
npm run test
```

## Server

Run from `server/` unless using workspace commands from root.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
npm run build
npm run test
npm run lint
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run db:seed
```

## Client Web

Run from `client-web/`.

```powershell
npm install
npm run dev
npm run build
npm run lint
```

## Docker PostgreSQL

Run from the repo root after Docker is available.

```powershell
docker compose up -d postgres
docker compose down
docker compose logs postgres
```

## Journey Entry

Run from the repo root:

```powershell
./scripts/new-journey-entry.ps1 -Title "Short milestone title"
```
