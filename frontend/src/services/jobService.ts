import api from '../lib/api'
import type { Job, JobInput } from '../types/job'

export async function getJobs(): Promise<Job[]> {
  const response = await api.get('/api/jobs')
  return response.data
}

export async function createJob(input: JobInput): Promise<Job> {
  const response = await api.post('/api/jobs', input)
  return response.data
}

export async function updateJob(id: number, input: Partial<JobInput>): Promise<Job> {
  const response = await api.patch(`/api/jobs/${id}`, input)
  return response.data
}

export async function deleteJob(id: number): Promise<void> {
  await api.delete(`/api/jobs/${id}`)
}
