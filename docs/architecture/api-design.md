# Cleaning App API Design

## API Principle

The API must be explicit and predictable for Flutter and React clients. Clients should not duplicate business rules such as booking status transitions, payment verification, provider assignment, or provider eligibility.

Base path:

```text
/api/v1
```

## Response Shape

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "BOOKING_INVALID_STATUS",
    "message": "Booking cannot move from completed to in_progress.",
    "details": {}
  }
}
```

## Health

- `GET /health`

## Auth APIs

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Post-MVP:

- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `POST /auth/google`

## User APIs

Customer/provider/admin self-service:

- `GET /users/me`
- `PATCH /users/me`

Admin:

- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id/status`

## City APIs

Public:

- `GET /cities`

Admin:

- `POST /admin/cities`
- `PATCH /admin/cities/:id`
- `PATCH /admin/cities/:id/status`

## Address APIs

Customer:

- `POST /addresses`
- `GET /addresses`
- `GET /addresses/:id`
- `PATCH /addresses/:id`
- `DELETE /addresses/:id`
- `PATCH /addresses/:id/default`

## Catalog APIs

Public:

- `GET /service-categories`
- `GET /services`
- `GET /services/:id`

Admin:

- `POST /admin/service-categories`
- `PATCH /admin/service-categories/:id`
- `PATCH /admin/service-categories/:id/status`
- `POST /admin/services`
- `PATCH /admin/services/:id`
- `PATCH /admin/services/:id/status`

## Provider APIs

Provider:

- `POST /providers/register`
- `GET /providers/me`
- `PATCH /providers/me`
- `POST /providers/me/documents`
- `POST /providers/me/services`
- `DELETE /providers/me/services/:service_id`
- `GET /providers/jobs`
- `POST /providers/assignments/:assignment_id/accept`
- `POST /providers/assignments/:assignment_id/reject`
- `POST /providers/bookings/:id/on-the-way`
- `POST /providers/bookings/:id/start`
- `POST /providers/bookings/:id/complete`

Admin:

- `GET /admin/providers`
- `GET /admin/providers/:id`
- `PATCH /admin/providers/:id/verify`
- `PATCH /admin/providers/:id/status`

## Booking APIs

Customer:

- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:id`
- `POST /bookings/:id/cancel`

Admin:

- `GET /admin/bookings`
- `GET /admin/bookings/:id`
- `POST /admin/bookings/:id/assign`
- `POST /admin/bookings/:id/cancel`
- `GET /admin/bookings/:id/history`
- `GET /admin/bookings/:id/assignments`

Booking creation input:

```json
{
  "service_id": "uuid",
  "address_id": "uuid",
  "booking_date": "2026-05-01",
  "booking_start_time": "10:00",
  "notes": "Bring cleaning supplies",
  "payment_method": "cod"
}
```

## Payment APIs

Customer:

- `POST /payments/orders`
- `POST /payments/verify`
- `GET /payments/:id`

Provider/admin for COD collection:

- `POST /payments/:id/mark-collected`

Gateway:

- `POST /webhooks/razorpay`

Admin:

- `GET /admin/payments`
- `GET /admin/payments/:id`

## Review APIs

Customer:

- `POST /reviews`
- `GET /bookings/:id/review`

Public/provider:

- `GET /providers/:id/reviews`

## Notification APIs

- `GET /notifications`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

## Complaint APIs

Customer:

- `POST /complaints`
- `GET /complaints`

Admin:

- `GET /admin/complaints`
- `GET /admin/complaints/:id`
- `PATCH /admin/complaints/:id`

## Post-MVP APIs

Do not implement these in MVP phases:

- Coupon APIs.
- Referral APIs.
- Wallet APIs.
- Subscription APIs.
- Chat APIs.
- Live tracking APIs.

## API Versioning

Start with `/api/v1`. After Flutter integration begins, avoid breaking changes. Prefer adding fields over removing or renaming fields.
