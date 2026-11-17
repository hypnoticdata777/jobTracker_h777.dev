import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import JobCard from '../components/JobCard'
import JobForm from '../components/JobForm'
import { getErrorMessage } from '../lib/errors'
import useAuth from '../lib/useAuth'
import { logoutUser } from '../services/authService'
import { createJob, deleteJob, getJobs, updateJob } from '../services/jobService'
import type { Job, JobInput } from '../types/job'

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  // Errors from quick actions on a card (status change, delete), which have no form to show them in.
  const [actionError, setActionError] = useState<string | null>(null)

  const jobsQuery = useQuery({ queryKey: ['jobs'], queryFn: getJobs })
  const jobs = jobsQuery.data ?? []

  const refreshJobs = () => queryClient.invalidateQueries({ queryKey: ['jobs'] })

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      refreshJobs()
      setIsCreating(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<JobInput> }) => updateJob(id, input),
    onSuccess: () => {
      refreshJobs()
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: refreshJobs,
    onError: (error) => setActionError(getErrorMessage(error, 'Could not delete the job.')),
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()
      navigate('/login')
    },
  })

  const openCreateForm = () => {
    createMutation.reset()
    setEditingId(null)
    setIsCreating((current) => !current)
  }

  const openEditForm = (job: Job) => {
    updateMutation.reset()
    setIsCreating(false)
    setEditingId(job.id)
  }

  const changeStatus = (job: Job, status: Job['status']) => {
    setActionError(null)
    updateMutation.mutate(
      { id: job.id, input: { status } },
      { onError: (error) => setActionError(getErrorMessage(error, 'Could not change the status.')) },
    )
  }

  const removeJob = (job: Job) => {
    if (!window.confirm(`Delete "${job.title}" at ${job.company}? This cannot be undone.`)) return

    setActionError(null)
    deleteMutation.mutate(job.id)
  }

  const isBusy = (job: Job) =>
    (updateMutation.isLoading && updateMutation.variables?.id === job.id) ||
    (deleteMutation.isLoading && deleteMutation.variables === job.id)

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Job Tracker</h1>
            <p className="text-sm text-slate-500">Welcome, {user?.name || user?.email || 'friend'}</p>
          </div>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {logoutMutation.isLoading ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
            <p className="text-sm text-slate-500">Your current job opportunities</p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {isCreating ? 'Close form' : 'Add job'}
          </button>
        </div>

        {isCreating && (
          <div className="mb-8">
            <JobForm
              isSaving={createMutation.isLoading}
              error={createMutation.isError ? getErrorMessage(createMutation.error, 'Could not save the job.') : null}
              onSubmit={(values) => createMutation.mutate(values)}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}

        {actionError && (
          <div role="alert" className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</div>
        )}

        {jobsQuery.isLoading ? (
          <p className="text-slate-600">Loading jobs...</p>
        ) : jobsQuery.isError ? (
          <div role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {getErrorMessage(jobsQuery.error, 'Could not load your jobs.')}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No jobs yet. Add your first opportunity to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) =>
              editingId === job.id ? (
                <JobForm
                  key={job.id}
                  job={job}
                  isSaving={updateMutation.isLoading}
                  error={updateMutation.isError ? getErrorMessage(updateMutation.error, 'Could not save the changes.') : null}
                  onSubmit={(values) => updateMutation.mutate({ id: job.id, input: values })}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <JobCard
                  key={job.id}
                  job={job}
                  isBusy={isBusy(job)}
                  onStatusChange={(status) => changeStatus(job, status)}
                  onEdit={() => openEditForm(job)}
                  onDelete={() => removeJob(job)}
                />
              ),
            )}
          </div>
        )}
      </main>
    </div>
  )
}
