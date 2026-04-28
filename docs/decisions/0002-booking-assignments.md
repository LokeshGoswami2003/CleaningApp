# ADR-0002: Track Provider Assignment Separately From Booking Status

Date: 2026-04-28
Status: Accepted

## Context

The raw plan treated provider rejection like a booking status. That makes reassignment awkward because a rejected provider does not mean the booking is rejected by the marketplace.

## Decision

Use a `booking_assignments` table for provider assignment attempts.

Booking status tracks the service lifecycle. Assignment status tracks the provider response.

## Consequences

- A provider rejection updates the assignment to `rejected`.
- The booking can return to `pending_assignment`.
- Admin/system can assign another provider cleanly.
- Provider actions must be authorized against the active assignment.

## References

- `docs/architecture/booking-workflow.md`
- `docs/architecture/data-model.md`

