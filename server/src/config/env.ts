import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .url()
    .default("postgresql://cleaning_app:cleaning_app_password@localhost:5432/cleaning_app_dev?schema=public"),
  JWT_ACCESS_SECRET: z.string().min(16).default("local-access-secret-change-me"),
  JWT_REFRESH_SECRET: z.string().min(16).default("local-refresh-secret-change-me"),
  RAZORPAY_KEY_ID: z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),
  FCM_PROJECT_ID: z.string().optional().default(""),
  ADMIN_FULL_NAME: z.string().min(2).default("Cleaning App Admin"),
  ADMIN_EMAIL: z.string().email().default("admin@cleaningapp.local"),
  ADMIN_PHONE: z.string().min(7).max(20).default("9999999999"),
  ADMIN_PASSWORD: z.string().min(8).default("AdminPass123")
});

export const env = envSchema.parse(process.env);
