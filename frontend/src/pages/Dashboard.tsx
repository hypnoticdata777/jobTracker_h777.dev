import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function Dashboard() {
  const { data, isLoading } = useQuery(['jobs'], async () => {
    const res = await api.get('/api/jobs')
    return res.data
  })

  if (isLoading) return <div>Loading jobs...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        {(data || []).map((job: any) => (
          <div key={job.id} className="border p-4 rounded">
            <h2 className="font-semibold">{job.title}</h2>
            <div className="text-sm text-gray-600">{job.company}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
