export interface Job {
  id: number
  title: string
  company: string
  location: string | null
  description: string | null
  url: string | null
  createdBy: number
  createdAt: string
}

export interface CreateJobRequest {
  title: string
  company: string
  location?: string
  description?: string
  url?: string
}
