import React from 'react'
import { formatCalendarDate } from '../lib/dates'
import { JOB_STATUSES, STATUS_LABELS, type Job, type JobStatus } from '../types/job'

const STATUS_STYLES: Record<JobStatus, string> = {
  SAVED: 'border-slate-300 bg-slate-100 text-slate-700',
  APPLIED: 'border-blue-300 bg-blue-50 text-blue-800',
  INTERVIEWING: 'border-amber-300 bg-amber-50 text-amber-800',
  OFFER: 'border-green-300 bg-green-50 text-green-800',
  REJECTED: 'border-red-300 bg-red-50 text-red-800',
  ARCHIVED: 'border-slate-300 bg-white text-slate-500',
}

interface JobCardProps {
  job: Job
  /** True while a change to this job is being saved or it is being deleted. */
  isBusy: boolean
  onStatusChange: (status: JobStatus) => void
  onEdit: () => void
  onDelete: () => void
}

export default function JobCard({ job, isBusy, onStatusChange, onEdit, onDelete }: JobCardProps) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-600">{job.company}</p>
        </div>

        <select
          aria-label={`Status of ${job.title} at ${job.company}`}
          value={job.status}
          disabled={isBusy}
          onChange={(event) => onStatusChange(event.target.value as JobStatus)}
          className={`rounded-full border px-3 py-1 text-sm font-medium disabled:opacity-60 ${STATUS_STYLES[job.status]}`}
        >
          {JOB_STATUSES.map((status) => (
            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        {job.location && <p>Location: {job.location}</p>}
        {job.description && <p className="whitespace-pre-line">{job.description}</p>}
        {job.notes && (
          <p className="whitespace-pre-line rounded bg-slate-50 px-3 py-2">
            <span className="font-medium text-slate-700">Notes: </span>
            {job.notes}
          </p>
        )}
        <p className="text-slate-500">
          {job.appliedAt ? `Applied ${formatCalendarDate(job.appliedAt)}` : 'Not applied yet'}
          {' · '}
          Added {new Date(job.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium">
        {job.url && (
          <a href={job.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700">
            View posting
          </a>
        )}
        <button type="button" onClick={onEdit} disabled={isBusy} className="text-slate-700 hover:text-slate-900 disabled:opacity-60">
          Edit
        </button>
        <button type="button" onClick={onDelete} disabled={isBusy} className="text-red-600 hover:text-red-700 disabled:opacity-60">
          Delete
        </button>
      </div>
    </article>
  )
}
