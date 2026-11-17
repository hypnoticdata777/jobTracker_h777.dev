export const JOB_STATUSES = ['SAVED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'ARCHIVED'] as const

export type JobStatus = (typeof JOB_STATUSES)[number]

export const STATUS_LABELS: Record<JobStatus, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
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
  /** ISO timestamp at UTC midnight; only the date part is meaningful. */
  appliedAt: string | null
  createdBy: number
  createdAt: string
  updatedAt: string
  statusChangedAt: string
}

/** What the API accepts on create and update. Empty strings clear a field. */
export interface JobInput {
  title: string
  company: string
  location: string
  description: string
  url: string
  notes: string
  status: JobStatus
  /** YYYY-MM-DD, or '' for no date. */
  appliedAt: string
}
