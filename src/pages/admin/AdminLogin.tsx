import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { api, setToken } from '../../lib/api'
import type { AuthResponse } from '../../types'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.post<AuthResponse>('/api/admin/auth/login', { email, password })
      setToken(data.access_token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a2332] rounded-2xl mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">管理後台登入</h1>
          <p className="text-gray-500 mt-1">NICE-DA Technology</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a2332] text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  )
}
