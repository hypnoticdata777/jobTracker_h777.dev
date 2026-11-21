import { JobStatus } from '@prisma/client';
import { z } from 'zod';

// También traducir errores automáticos de Zod (campos ausentes, tipos y límites).
z.setErrorMap((issue) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return { message: issue.received === 'undefined' ? 'Este campo es obligatorio' : 'El tipo de dato no es válido' };
    case z.ZodIssueCode.too_small:
      return { message: `El valor debe tener al menos ${issue.minimum} caracteres` };
    case z.ZodIssueCode.too_big:
      return { message: `El valor no debe superar ${issue.maximum} caracteres` };
    case z.ZodIssueCode.invalid_string:
      return { message: 'El formato del campo no es válido' };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: 'Selecciona una opción válida' };
    default:
      return { message: 'El valor del campo no es válido' };
  }
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  name: z.string().trim().min(1, { message: 'El nombre no puede estar vacío' }).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria' }),
});

// Solo se guardan enlaces HTTP(S); otros protocolos podrían ejecutar código al abrirlos.
const httpUrl = z
  .string()
  .trim()
  .max(2000)
  .url({ message: 'Ingresa un enlace válido' })
  .refine((value) => /^https?:\/\//i.test(value), { message: 'El enlace debe comenzar con http:// o https://' });

// Un campo que el usuario vació llega como ''; se guarda como ausencia de valor.
const emptyToNull = (value: unknown) => (value === '' ? null : value);
const optionalText = (max: number) => z.preprocess(emptyToNull, z.string().trim().max(max).nullish());

const jobFields = {
  title: z.string().trim().min(1, { message: 'El puesto es obligatorio' }).max(200),
  company: z.string().trim().min(1, { message: 'La empresa es obligatoria' }).max(200),
  location: optionalText(200),
  description: optionalText(5000),
  notes: optionalText(5000),
  url: z.preprocess(emptyToNull, httpUrl.nullish()),
  status: z.nativeEnum(JobStatus, { errorMap: () => ({ message: 'El estado no es válido' }) }),
  // Fecha de calendario, por ejemplo 2026-11-17; no incluye hora.
  appliedAt: z.preprocess(
    emptyToNull,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha de postulación debe usar el formato AAAA-MM-DD' })
      .refine((value) => !Number.isNaN(Date.parse(value)), { message: 'La fecha de postulación no es válida' })
      .transform((value) => new Date(`${value}T00:00:00.000Z`))
      .nullish(),
  ),
};

export const createJobSchema = z.object({ ...jobFields, status: jobFields.status.optional() });

// Los campos son opcionales al editar, pero debe enviarse al menos uno.
export const updateJobSchema = z
  .object(jobFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'Proporciona al menos un campo para actualizar' });

// Los identificadores llegan como texto y deben ser enteros positivos.
export function parseId(raw: string): number | null {
  return /^[1-9]\d{0,8}$/.test(raw) ? Number(raw) : null;
}
