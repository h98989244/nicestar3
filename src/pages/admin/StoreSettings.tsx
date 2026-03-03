import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { api } from '../../lib/api'
import type { StoreInfo } from '../../types'

export default function StoreSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    site_name: '',
    tax_id: '',
    phone: '',
    address: '',
    logo_url: '',
    logo_storage_path: '',
  })

  useEffect(() => {
    api.get<StoreInfo>('/api/store-info')
      .then(data => {
        setForm({
          site_name: data.site_name || '',
          tax_id: data.tax_id || '',
          phone: data.phone || '',
          address: data.address || '',
          logo_url: data.logo_url || '',
          logo_storage_path: data.logo_storage_path || '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/api/admin/store-info', form)
      alert('店家資訊已更新')
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新失敗')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">店家設定</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">基本資訊</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">網站名稱</label>
            <input name="site_name" value={form.site_name} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">統一編號</label>
              <input name="tax_id" value={form.tax_id} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input name="logo_url" value={form.logo_url} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {form.logo_url && (
              <img src={form.logo_url} alt="Logo preview" className="mt-2 h-16 object-contain" />
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? '儲存中...' : '儲存設定'}
          </button>
        </div>
      </form>
    </div>
  )
}
