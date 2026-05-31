import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_API_KEY: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1).default("signalist"),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().min(1).default("gemini-1.5-flash"),
  SMTP_HOST: z.string().min(1).default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().email(),
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),
  INNGEST_DEV: z.string().optional(),
});

const parsedEnv = envSchema.parse(process.env);
const resolvedBetterAuthSecret =
  parsedEnv.BETTER_AUTH_SECRET ?? parsedEnv.BETTER_AUTH_API_KEY;

if (!resolvedBetterAuthSecret) {
  throw new Error("Missing BETTER_AUTH_SECRET (or BETTER_AUTH_API_KEY fallback)");
}

export const env = {
  ...parsedEnv,
  BETTER_AUTH_SECRET: resolvedBetterAuthSecret,
};
