import React, { useState } from 'react'
import { toDateInputValue } from '../lib/dates'
import { JOB_STATUSES, STATUS_LABELS, type Job, type JobInput } from '../types/job'

const inputClass = 'w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-500'
const labelClass = 'mb-1 block text-sm font-medium text-slate-700'

function initialValues(job?: Job): JobInput {
  return {
    title: job?.title ?? '',
    company: job?.company ?? '',
    location: job?.location ?? '',
    description: job?.description ?? '',
    url: job?.url ?? '',
    notes: job?.notes ?? '',
    status: job?.status ?? 'SAVED',
    appliedAt: toDateInputValue(job?.appliedAt ?? null),
  }
}

interface JobFormProps {
  /** Si se recibe una vacante, el formulario la edita; de lo contrario, crea una. */
  job?: Job
  isSaving: boolean
  error: string | null
  onSubmit: (values: JobInput) => void
  onCancel: () => void
}

export default function JobForm({ job, isSaving, error, onSubmit, onCancel }: JobFormProps) {
  const [form, setForm] = useState<JobInput>(() => initialValues(job))

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="job-title" className={labelClass}>Puesto</label>
          <input id="job-title" name="title" value={form.title} onChange={handleChange} className={inputClass} required maxLength={200} />
        </div>

        <div>
          <label htmlFor="job-company" className={labelClass}>Empresa</label>
          <input id="job-company" name="company" value={form.company} onChange={handleChange} className={inputClass} required maxLength={200} />
        </div>

        <div>
          <label htmlFor="job-location" className={labelClass}>Ubicación</label>
          <input id="job-location" name="location" value={form.location} onChange={handleChange} className={inputClass} maxLength={200} />
        </div>

        <div>
          <label htmlFor="job-url" className={labelClass}>Enlace de la vacante</label>
          <input id="job-url" name="url" type="url" value={form.url} onChange={handleChange} className={inputClass} placeholder="https://example.com" />
        </div>

        <div>
          <label htmlFor="job-status" className={labelClass}>Estado</label>
          <select id="job-status" name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="job-applied" className={labelClass}>Fecha de postulación</label>
          <input id="job-applied" name="appliedAt" type="date" value={form.appliedAt} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="job-description" className={labelClass}>Descripción</label>
        <textarea id="job-description" name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} maxLength={5000} />
      </div>

      <div className="mt-4">
        <label htmlFor="job-notes" className={labelClass}>Notas</label>
        <textarea id="job-notes" name="notes" value={form.notes} onChange={handleChange} rows={3} className={inputClass} maxLength={5000} placeholder="Contactos, seguimiento y próximos pasos" />
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-4 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Guardando...' : job ? 'Guardar cambios' : 'Guardar vacante'}
        </button>
      </div>
    </form>
  )
}
