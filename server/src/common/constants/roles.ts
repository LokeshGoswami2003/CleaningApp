export const USER_ROLES = ["customer", "provider", "admin", "support"] as const;

export type UserRole = (typeof USER_ROLES)[number];

