import { JobStatus } from '@prisma/client';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  name: z.string().trim().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Only http(s) links are stored: the URL is rendered as a clickable link, and
// a scheme such as javascript: would run code when clicked.
const httpUrl = z
  .string()
  .trim()
  .max(2000)
  .url({ message: 'URL must be valid' })
  .refine((value) => /^https?:\/\//i.test(value), { message: 'URL must start with http:// or https://' });

// The form sends '' for a field the user cleared; store that as "no value".
const emptyToNull = (value: unknown) => (value === '' ? null : value);

const optionalText = (max: number) => z.preprocess(emptyToNull, z.string().trim().max(max).nullish());

const jobFields = {
  title: z.string().trim().min(1, { message: 'Title is required' }).max(200),
  company: z.string().trim().min(1, { message: 'Company is required' }).max(200),
  location: optionalText(200),
  description: optionalText(5000),
  notes: optionalText(5000),
  url: z.preprocess(emptyToNull, httpUrl.nullish()),
  status: z.nativeEnum(JobStatus, { errorMap: () => ({ message: 'Status is not valid' }) }),
  // A calendar date such as 2026-11-17.
  appliedAt: z.preprocess(
    emptyToNull,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Applied date must look like YYYY-MM-DD' })
      .refine((value) => !Number.isNaN(Date.parse(value)), { message: 'Applied date is not a real date' })
      .transform((value) => new Date(`${value}T00:00:00.000Z`))
      .nullish(),
  ),
};

export const createJobSchema = z.object({
  ...jobFields,
  status: jobFields.status.optional(),
});

// Every field is optional on update, but an empty body is a mistake.
export const updateJobSchema = z
  .object(jobFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'Provide at least one field to update' });

// Route ids arrive as strings; anything that is not a positive integer cannot match a row.
export function parseId(raw: string): number | null {
  return /^[1-9]\d{0,8}$/.test(raw) ? Number(raw) : null;
}
