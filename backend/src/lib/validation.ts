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

export const createJobSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  company: z.string().trim().min(1, { message: 'Company is required' }),
  location: z.string().trim().optional(),
  description: z.string().trim().optional(),
  url: z.string().trim().url({ message: 'URL must be valid' }).optional().or(z.literal('')),
});
