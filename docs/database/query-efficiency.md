# Query Efficiency Rules

The database should be designed so common queries are indexed and predictable.

## General Rules

- Query by indexed foreign keys and statuses.
- Avoid loading large nested relation graphs by default.
- Select only fields needed by the API response.
- Use pagination for list endpoints.
- Use transactions for multi-step booking/payment changes.
- Add indexes before adding high-traffic filters.
- Review query plans for slow admin reports.

## Required Pagination

List endpoints should accept:

- `page` and `page_size`, or
- cursor-based pagination for high-volume timelines.

MVP can use page-based pagination for admin lists.

## Important Indexes

The first schema should include indexes for:

- `bookings.customer_id, created_at`.
- `bookings.current_provider_id, booking_date`.
- `bookings.status`.
- `bookings.city_id, booking_date`.
- `booking_assignments.booking_id`.
- `booking_assignments.provider_id, status`.
- `provider_services(provider_id, service_id)`.
- `payments.gateway_order_id`.
- `payments.gateway_payment_id`.

## Booking Queries

Customer booking history:

```text
WHERE customer_id = ?
ORDER BY created_at DESC
LIMIT ?
```

Provider jobs:

```text
WHERE current_provider_id = ?
AND status IN (...)
ORDER BY booking_date, booking_start_time
```

Admin assignment queue:

```text
WHERE status = 'pending_assignment'
ORDER BY created_at ASC
```

