import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { api } from '../../lib/api'
import type { StoreInfo } from '../../types'

export default function StoreSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    site_name: '',
    slogan: '',
    description: '',
    email: '',
    brand_name: '',
    brand_subtitle: '',
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
          slogan: data.slogan || '',
          description: data.description || '',
          email: data.email || '',
          brand_name: data.brand_name || '',
          brand_subtitle: data.brand_subtitle || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        {/* 品牌資訊 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">品牌資訊</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">網站名稱</label>
            <input name="site_name" value={form.site_name} onChange={handleChange}
              placeholder="例如：奈斯達科技有限公司"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">品牌名稱</label>
              <input name="brand_name" value={form.brand_name} onChange={handleChange}
                placeholder="例如：nicestar3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">品牌副標</label>
              <input name="brand_subtitle" value={form.brand_subtitle} onChange={handleChange}
                placeholder="例如：TECHNOLOGY"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">標語 (Slogan)</label>
            <input name="slogan" value={form.slogan} onChange={handleChange}
              placeholder="例如：智慧穿戴新未來"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">網站描述</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="關於公司的簡短描述，會顯示在頁腳及關於我們頁面"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input name="logo_url" value={form.logo_url} onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {form.logo_url && (
              <img src={form.logo_url} alt="Logo preview" className="mt-2 h-16 object-contain" />
            )}
          </div>
        </div>

        {/* 聯絡資訊 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">聯絡資訊</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="例如：+852 2345 6789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="例如：support@nice-da.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input name="address" value={form.address} onChange={handleChange}
              placeholder="公司地址"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">統一編號</label>
            <input name="tax_id" value={form.tax_id} onChange={handleChange}
              placeholder="統一編號"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
