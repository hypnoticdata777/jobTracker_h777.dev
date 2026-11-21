export const JOB_STATUSES = ['SAVED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'ARCHIVED'] as const

export type JobStatus = (typeof JOB_STATUSES)[number]

export const STATUS_LABELS: Record<JobStatus, string> = {
  SAVED: 'Guardada',
  APPLIED: 'Postulada',
  INTERVIEWING: 'En entrevista',
  OFFER: 'Oferta recibida',
  REJECTED: 'Rechazada',
  ARCHIVED: 'Archivada',
}

export interface Job {
  id: number
  title: string
  company: string
  location: string | null
  description: string | null
  url: string | null
  notes: string | null
  status: JobStatus
  /** Fecha ISO a medianoche UTC; solo importa el día de calendario. */
  appliedAt: string | null
  createdBy: number
  createdAt: string
  updatedAt: string
  statusChangedAt: string
}

/** Datos aceptados al crear y editar; las cadenas vacías limpian los campos. */
export interface JobInput {
  title: string
  company: string
  location: string
  description: string
  url: string
  notes: string
  status: JobStatus
  /** Formato AAAA-MM-DD, o '' cuando no hay fecha. */
  appliedAt: string
}
