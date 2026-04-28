# Cleaning App Data Model Requirements

## Core Principle

The booking is the central business record. Payments, provider assignment attempts, status history, notifications, reviews, complaints, and reports attach back to bookings.

## Core Entities

### users

Stores account identity for customers, providers, admins, and support users.

Fields:

- `id`.
- `full_name`.
- `email`.
- `phone`.
- `password_hash`.
- `role`.
- `profile_image_url`.
- `is_phone_verified`.
- `is_email_verified`.
- `is_active`.
- `created_at`.
- `updated_at`.

Roles:

- `customer`.
- `provider`.
- `admin`.
- `support`.

### refresh_tokens

Stores refresh/session state.

Fields:

- `id`.
- `user_id`.
- `token_hash`.
- `token_family_id`.
- `revoked_at`.
- `expires_at`.
- `created_at`.
- `rotated_at`.

### cities

Stores serviceable cities.

Fields:

- `id`.
- `name`.
- `state`.
- `country`.
- `is_active`.
- `created_at`.
- `updated_at`.

### addresses

Stores customer addresses.

Fields:

- `id`.
- `user_id`.
- `city_id`.
- `label`.
- `address_line1`.
- `address_line2`.
- `landmark`.
- `pincode`.
- `latitude`.
- `longitude`.
- `is_default`.
- `created_at`.
- `updated_at`.

### service_categories

Groups services.

Fields:

- `id`.
- `name`.
- `description`.
- `icon_url`.
- `sort_order`.
- `is_active`.
- `created_at`.
- `updated_at`.

### services

Stores bookable services.

Fields:

- `id`.
- `category_id`.
- `name`.
- `description`.
- `base_price`.
- `duration_minutes`.
- `image_url`.
- `included_items`.
- `excluded_items`.
- `is_active`.
- `created_at`.
- `updated_at`.

### providers

Stores provider operational profile.

Fields:

- `id`.
- `user_id`.
- `city_id`.
- `experience_years`.
- `bio`.
- `rating`.
- `total_jobs`.
- `verification_status`.
- `is_available`.
- `created_at`.
- `updated_at`.

### provider_documents

Stores provider KYC metadata. Actual files should live in object storage, not the database.

Fields:

- `id`.
- `provider_id`.
- `document_type`.
- `file_url`.
- `status`.
- `rejection_reason`.
- `uploaded_at`.
- `reviewed_at`.
- `reviewed_by_user_id`.

### provider_services

Maps providers to services.

Fields:

- `id`.
- `provider_id`.
- `service_id`.
- `price_override`.
- `is_active`.
- `created_at`.

### bookings

Stores the service lifecycle.

Fields:

- `id`.
- `customer_id`.
- `current_provider_id`.
- `service_id`.
- `address_id`.
- `city_id`.
- `booking_date`.
- `booking_start_time`.
- `booking_end_time`.
- `status`.
- `base_price`.
- `discount_amount`.
- `total_price`.
- `payment_method`.
- `payment_status`.
- `notes`.
- `cancellation_reason`.
- `cancelled_by_user_id`.
- `created_at`.
- `updated_at`.

Booking statuses:

- `pending_payment`.
- `pending_assignment`.
- `assigned`.
- `accepted`.
- `on_the_way`.
- `in_progress`.
- `completed`.
- `closed`.
- `cancelled`.

Payment methods:

- `cod`.
- `razorpay`.

Payment statuses:

- `unpaid`.
- `pending`.
- `paid`.
- `failed`.
- `refunded`.

### booking_assignments

Tracks assignment attempts between bookings and providers.

Fields:

- `id`.
- `booking_id`.
- `provider_id`.
- `assigned_by_user_id`.
- `status`.
- `rejection_reason`.
- `assigned_at`.
- `responded_at`.
- `cancelled_at`.
- `metadata`.

Assignment statuses:

- `assigned`.
- `accepted`.
- `rejected`.
- `cancelled`.
- `expired`.

### booking_status_history

Tracks booking lifecycle changes.

Fields:

- `id`.
- `booking_id`.
- `from_status`.
- `to_status`.
- `changed_by_user_id`.
- `reason`.
- `metadata`.
- `created_at`.

### payments

Stores payment attempts and gateway state.

Fields:

- `id`.
- `booking_id`.
- `provider`.
- `method`.
- `gateway_order_id`.
- `gateway_payment_id`.
- `gateway_signature`.
- `amount`.
- `currency`.
- `status`.
- `failure_reason`.
- `paid_at`.
- `created_at`.
- `updated_at`.

### payment_events

Stores processed gateway webhook or verification events for idempotency.

Fields:

- `id`.
- `payment_id`.
- `provider`.
- `event_id`.
- `event_type`.
- `payload`.
- `processed_at`.
- `created_at`.

### reviews

Stores customer feedback.

Fields:

- `id`.
- `booking_id`.
- `customer_id`.
- `provider_id`.
- `rating`.
- `comment`.
- `created_at`.

### notifications

Stores notification events before delivery integrations exist.

Fields:

- `id`.
- `user_id`.
- `booking_id`.
- `type`.
- `title`.
- `message`.
- `delivery_channel`.
- `delivery_status`.
- `is_read`.
- `metadata`.
- `created_at`.
- `read_at`.

### complaints

Stores service issues for manual admin handling.

Fields:

- `id`.
- `booking_id`.
- `customer_id`.
- `provider_id`.
- `status`.
- `category`.
- `description`.
- `resolution_notes`.
- `created_at`.
- `updated_at`.

## Post-MVP Entities

Do not implement these during the MVP unless a phase explicitly requires them:

- `coupons`.
- `coupon_redemptions`.
- `wallets`.
- `wallet_transactions`.
- `provider_withdrawals`.
- `subscriptions`.
- `referrals`.
- `chat_threads`.
- `chat_messages`.
- `location_events`.

## Recommended Indexes

- Unique `users.phone`.
- Unique `users.email` where email is not null.
- Unique `providers.user_id`.
- Unique `provider_services(provider_id, service_id)`.
- Unique `reviews.booking_id`.
- Unique `payments.gateway_order_id` where not null.
- Unique `payments.gateway_payment_id` where not null.
- Unique `payment_events(provider, event_id)` where event ID is present.
- Index `addresses.user_id`.
- Index `bookings.customer_id, created_at`.
- Index `bookings.current_provider_id, booking_date`.
- Index `bookings.status`.
- Index `bookings.city_id, booking_date`.
- Index `booking_assignments.booking_id`.
- Index `booking_assignments.provider_id, status`.

## Data Integrity Rules

- A review can be created only once per completed booking.
- A provider must offer a service before being assigned to that service booking.
- A provider must be verified and active before assignment.
- Online payment success must be verified by the backend.
- Online bookings cannot be assigned until paid.
- A booking status can change only through allowed transitions.
- Provider rejection updates assignment state and returns booking to `pending_assignment`.
- Soft-delete or deactivate catalog records instead of deleting records used by historical bookings.
