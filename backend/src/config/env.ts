import dotenv from 'dotenv';
import { z } from 'zod';

// Carga backend/.env en desarrollo; en Vercel las variables ya están en process.env.
dotenv.config();

// Valor de ejemplo permitido en desarrollo, pero nunca en producción.
const PLACEHOLDER_JWT_SECRET = 'replace_with_a_strong_secret';

const envSchema = z
  .object({
    DATABASE_URL: z.string({ required_error: 'DATABASE_URL es obligatoria', invalid_type_error: 'DATABASE_URL debe ser texto' }).min(1, 'DATABASE_URL es obligatoria'),
    JWT_SECRET: z.string({ required_error: 'JWT_SECRET es obligatoria', invalid_type_error: 'JWT_SECRET debe ser texto' }).min(16, 'JWT_SECRET es obligatoria y debe tener al menos 16 caracteres'),
    JWT_EXPIRES_IN: z.string({ invalid_type_error: 'JWT_EXPIRES_IN debe ser texto' }).default('7d'),
    PORT: z.coerce.number({ invalid_type_error: 'PORT debe ser un número' }).int('PORT debe ser un entero').positive('PORT debe ser positivo').default(4000),
    NODE_ENV: z.enum(['development', 'test', 'production'], { errorMap: () => ({ message: 'NODE_ENV debe ser development, test o production' }) }).default('development'),
  })
  .refine((value) => value.NODE_ENV !== 'production' || value.JWT_SECRET !== PLACEHOLDER_JWT_SECRET, {
    path: ['JWT_SECRET'],
    message: 'JWT_SECRET conserva el valor de ejemplo de .env.example; genera una clave segura',
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`);
  // Impedir el arranque cuando la clave falta o es predecible.
  throw new Error(`Configuración de entorno inválida:\n${problems.join('\n')}`);
}

export const env = parsed.data;
