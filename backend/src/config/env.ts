import dotenv from 'dotenv';
import { z } from 'zod';

// Loads backend/.env in local development. On a host such as Vercel the
// variables are already in process.env and there is no file to read.
dotenv.config();

// The value shipped in .env.example. Fine on a laptop, never acceptable in production.
const PLACEHOLDER_JWT_SECRET = 'replace_with_a_strong_secret';

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET is required and must be at least 16 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    PORT: z.coerce.number().int().positive().default(4000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  })
  .refine((value) => value.NODE_ENV !== 'production' || value.JWT_SECRET !== PLACEHOLDER_JWT_SECRET, {
    path: ['JWT_SECRET'],
    message: 'JWT_SECRET is still the placeholder from .env.example; generate a real secret',
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`);
  // Fail at startup: a server with a missing or guessable secret must never accept requests.
  throw new Error(`Invalid environment configuration:\n${problems.join('\n')}`);
}

export const env = parsed.data;
