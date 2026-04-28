import { z } from "zod";

const phoneSchema = z.string().trim().min(7).max(20);
const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(100).optional(),
  phone: phoneSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(20)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
