import { z } from "zod";

export const updateMyProfileSchema = z
  .object({
    full_name: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email().max(100).nullable().optional()
  })
  .refine((value) => value.full_name !== undefined || value.email !== undefined, {
    message: "At least one field must be provided."
  });

export const userIdParamsSchema = z.object({
  id: z.string().uuid()
});

export const updateUserStatusSchema = z.object({
  is_active: z.boolean()
});

export type UpdateMyProfileInput = z.infer<typeof updateMyProfileSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

