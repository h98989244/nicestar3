import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { api } from '../../lib/api'

function getLucideIcon(name: string): LucideIcons.LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[name]
  if (typeof icon === 'function') return icon as LucideIcons.LucideIcon
  return LucideIcons.Box
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  display_order: number
  is_active: boolean
  created_at: string
}

const emptyForm = { name: '', slug: '', icon: '', display_order: 0, is_active: true }

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get<Category[]>('/api/admin/categories/admin-all')
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      display_order: cat.display_order,
      is_active: cat.is_active,
    })
    setShowAdd(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const startAdd = () => {
    setShowAdd(true)
    setEditingId(null)
    setForm({ ...emptyForm, display_order: categories.length + 1 })
  }

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      alert('名稱和代碼為必填')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await api.put(`/api/admin/categories/${editingId}`, form)
      } else {
        await api.post('/api/admin/categories', form)
      }
      setEditingId(null)
      setShowAdd(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`確定要刪除分類「${name}」嗎？`)) return
    try {
      await api.delete(`/api/admin/categories/${id}`)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '刪除失敗')
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">分類管理</h1>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增分類
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">排序</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">名稱</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">代碼 (slug)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">圖示</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {showAdd && (
              <tr className="bg-blue-50">
                <td className="px-4 py-2">
                  <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm" />
                </td>
                <td className="px-4 py-2">
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="分類名稱"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                </td>
                <td className="px-4 py-2">
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-slug"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                </td>
                <td className="px-4 py-2">
                  <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Lucide 圖示名"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                </td>
                <td className="px-4 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm">{form.is_active ? '啟用' : '停用'}</span>
                  </label>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={handleSave} disabled={saving} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setShowAdd(false); setForm(emptyForm) }} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {categories.map(cat => (
              <tr key={cat.id} className={editingId === cat.id ? 'bg-yellow-50' : ''}>
                {editingId === cat.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="px-4 py-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600" />
                        <span className="text-sm">{form.is_active ? '啟用' : '停用'}</span>
                      </label>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={handleSave} disabled={saving} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-sm text-gray-600">{cat.display_order}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{cat.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(() => { const Icon = getLucideIcon(cat.icon); return (
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <span className="text-xs text-gray-400">{cat.icon}</span>
                        </div>
                      ) })()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.is_active ? '啟用' : '停用'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(cat)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
