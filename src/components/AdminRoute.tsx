import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { api } from '../lib/api'

export default function AdminRoute() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setStatus('unauthenticated')
      return
    }

    api.get('/api/admin/auth/me')
      .then(() => setStatus('authenticated'))
      .catch(() => setStatus('unauthenticated'))
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
