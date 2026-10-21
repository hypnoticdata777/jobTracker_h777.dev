import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/authService'
import { createJob, getJobs } from '../services/jobService'
import useAuth from '../lib/useAuth'

const emptyForm = {
  title: '',
  company: '',
  location: '',
  description: '',
  url: '',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  })

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setForm(emptyForm)
      setIsFormOpen(false)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()
      navigate('/login')
    },
  })

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    await createMutation.mutateAsync({
      title: form.title,
      company: form.company,
      location: form.location || undefined,
      description: form.description || undefined,
      url: form.url || undefined,
    })
  }

  if (isLoading) {
    return <div className="p-6 text-slate-700">Loading jobs...</div>
  }

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
            {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
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
            onClick={() => setIsFormOpen((current) => !current)}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {isFormOpen ? 'Close form' : 'Add job'}
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mb-8 rounded border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">URL</label>
                <input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded border border-slate-300 px-4 py-2 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createMutation.isPending ? 'Saving...' : 'Save job'}
              </button>
            </div>
          </form>
        )}

        {jobs.length === 0 ? (
          <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No jobs yet. Add your first opportunity to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <article key={job.id} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-600">{job.company}</p>
                  </div>

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View posting
                    </a>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {job.location && <p>Location: {job.location}</p>}
                  {job.description && <p>{job.description}</p>}
                  <p>Added {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
