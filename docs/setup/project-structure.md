# Recommended Project Structure

## Current Structure To Keep For Phase 1

```text
CleaningApp/
  server/
  client-web/
  docs/
```

The current simple layout is good for the first implementation pass. Do not migrate to a monorepo until the codebase needs shared packages or multiple deployable apps.

## Backend Structure

For Express.js with TypeScript:

```text
server/
  src/
    app.ts
    server.ts
    config/
      env.ts
    common/
      errors/
      http/
      middleware/
      validation/
      constants/
    database/
      prisma.ts
    modules/
      health/
      auth/
        auth.routes.ts
        auth.controller.ts
        auth.service.ts
        auth.repository.ts
        auth.schemas.ts
        auth.test.ts
      users/
      cities/
      addresses/
      service-categories/
      services/
      providers/
      bookings/
      booking-assignments/
      payments/
      reviews/
      notifications/
      complaints/
      admin/
      reports/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  tests/
    setup.ts
    factories/
  package.json
  tsconfig.json
```

## Backend Module Pattern

Each module should follow this shape:

```text
modules/bookings/
  bookings.routes.ts
  bookings.controller.ts
  bookings.service.ts
  bookings.repository.ts
  bookings.schemas.ts
  bookings.types.ts
  bookings.test.ts
```

Rules:

- Routes attach middleware and controllers.
- Schemas validate request params, query, and body.
- Controllers translate HTTP into service calls.
- Services contain business rules.
- Repositories contain database calls.
- Tests live near the behavior they verify.

## React Admin Structure

```text
client-web/
  src/
    app/
    components/
    features/
      auth/
      dashboard/
      cities/
      services/
      providers/
      bookings/
      payments/
      complaints/
    lib/
      api/
      auth/
      formatters/
    main.tsx
```

## Shared Code

Start with shared constants inside `server/src/common` and duplicate only small API types in `client-web` if needed.

Introduce a `packages/shared` folder later only when duplication becomes painful.

Possible future structure:

```text
packages/
  shared/
    src/
      api-types/
      constants/
```

Do not put backend business logic in shared client-visible code.

## Environment Variables

Expected backend variables:

```text
NODE_ENV=
PORT=
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
FCM_PROJECT_ID=
```

Expected web variables:

```text
VITE_API_BASE_URL=
```

## Local Development

Recommended local services:

- PostgreSQL through Docker Compose.
- Backend API as a local Node process.
- React admin web as a local Vite dev server.

Post-MVP additions:

- Redis.
- Queue worker.
- Object storage emulator or cloud bucket.
