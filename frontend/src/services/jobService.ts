import api from '../lib/api'
import type { CreateJobRequest, Job } from '../types/job'

export async function getJobs(): Promise<Job[]> {
  const response = await api.get('/api/jobs')
  return response.data
}

export async function createJob(input: CreateJobRequest): Promise<Job> {
  const response = await api.post('/api/jobs', input)
  return response.data
}

// TODO: enable when backend adds update/delete routes.
// export async function updateJob(id: number, input: Partial<CreateJobRequest>): Promise<Job> {
//   const response = await api.put(`/api/jobs/${id}`, input)
//   return response.data
// }
//
// export async function deleteJob(id: number): Promise<void> {
//   await api.delete(`/api/jobs/${id}`)
// }
