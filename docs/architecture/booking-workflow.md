# Cleaning App Booking Workflow

## Workflow Principle

Every booking status change must go through a central transition service. This prevents customers, providers, admins, payments, and notifications from putting a booking into invalid states.

Assignment attempts are separate records. A provider can reject an assignment without making the entire booking permanently rejected.

## Recommended Booking Statuses

- `pending_payment`
- `pending_assignment`
- `assigned`
- `accepted`
- `on_the_way`
- `in_progress`
- `completed`
- `closed`
- `cancelled`

## Assignment Statuses

- `assigned`
- `accepted`
- `rejected`
- `cancelled`
- `expired`

## Payment Statuses

- `unpaid`
- `pending`
- `paid`
- `failed`
- `refunded`

For COD, a booking can move through service statuses while payment status remains `unpaid`. It becomes `paid` when cash collection is recorded.

For online payment, a booking starts as `pending_payment` and must not be assigned until payment is confirmed.

## Happy Path: COD MVP

```text
Customer selects service
  -> selects date and time
  -> selects address
  -> chooses COD
  -> booking created as pending_assignment
  -> admin assigns provider
  -> provider accepts assignment
  -> provider goes on the way
  -> provider starts service
  -> provider completes service
  -> COD collection is marked paid
  -> customer reviews
  -> booking closed
```

## Happy Path: Online Payment

```text
Customer selects service
  -> backend creates booking as pending_payment
  -> backend creates Razorpay order
  -> customer pays through gateway
  -> backend verifies payment
  -> webhook/verification marks payment paid
  -> booking moves to pending_assignment
  -> admin assigns provider
  -> provider completes service
  -> customer reviews
  -> booking closed
```

## Allowed Booking Transitions

```text
pending_payment -> pending_assignment
pending_payment -> cancelled

pending_assignment -> assigned
pending_assignment -> cancelled

assigned -> accepted
assigned -> pending_assignment
assigned -> cancelled

accepted -> on_the_way
accepted -> cancelled

on_the_way -> in_progress
on_the_way -> cancelled

in_progress -> completed

completed -> closed
```

`assigned -> pending_assignment` happens when an assignment is rejected, cancelled, or expired and the booking needs reassignment.

## Customer Booking Creation

Input:

- `service_id`.
- `address_id`.
- `booking_date`.
- `booking_start_time`.
- `notes`.
- `payment_method`.

Backend responsibilities:

- Validate authenticated customer.
- Validate service is active.
- Validate address belongs to customer.
- Validate city is serviceable.
- Calculate price server-side.
- Create booking.
- Create payment record if required.
- Create initial booking status history.
- Create notification event.

## Provider Assignment

MVP:

- Admin manually assigns provider.
- Backend verifies provider is active, verified, in the same city, and offers the service.
- Backend creates a `booking_assignments` record.
- Booking `current_provider_id` points to the assigned provider.

Post-MVP:

- Automatic matching by city, service, availability, distance, rating, and workload.

## Provider Accept/Reject

Provider can accept or reject only their own active assignment.

If accepted:

- Assignment becomes `accepted`.
- Booking becomes `accepted`.
- Customer notification is created.

If rejected:

- Assignment becomes `rejected`.
- Booking returns to `pending_assignment`.
- Rejection reason is stored.
- Admin/system can reassign another provider.

## Cancellation Rules

Customer cancellation:

- Allowed while `pending_payment`, `pending_assignment`, `assigned`, or `accepted`.
- Later cancellation requires admin/support handling.

Admin cancellation:

- Allowed for operational exceptions.

Payment handling:

- If payment is already captured, refund flow must be created or manually tracked.

## Notification Events

Create notification events for:

- Booking created.
- Payment successful.
- Provider assigned.
- Provider accepted.
- Provider rejected.
- Provider on the way.
- Service started.
- Service completed.
- COD collected.
- Booking cancelled.

## Audit Requirements

For each status change, store:

- `booking_id`.
- `from_status`.
- `to_status`.
- `changed_by_user_id`.
- `reason`.
- `metadata`.
- `created_at`.
