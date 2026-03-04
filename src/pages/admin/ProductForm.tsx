import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '../../lib/api'
import ImageUpload from '../../components/ImageUpload'
import type { Product, ProductImage } from '../../types'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const categories = [
  { value: 'cases', label: '手機殼' },
  { value: 'bands', label: '錶帶' },
  { value: 'chargers', label: '充電器' },
  { value: 'protectors', label: '螢幕保護貼' },
  { value: 'audio', label: '耳機' },
  { value: 'powerbanks', label: '行動電源' },
  { value: 'accessories', label: '配件' },
]

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<ProductImage[]>([])
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    category: '',
    brand: '',
    sku: '',
    stock_quantity: '0',
    is_active: true,
    is_featured: false,
    specs: '{}',
    variants: '[]',
  })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get<Product>(`/api/admin/products/${id}`)
      .then(product => {
        setForm({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: String(product.price),
          compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
          category: product.category,
          brand: product.brand,
          sku: product.sku || '',
          stock_quantity: String(product.stock_quantity),
          is_active: product.is_active,
          is_featured: product.is_featured,
          specs: JSON.stringify(product.specs, null, 2),
          variants: JSON.stringify(product.variants, null, 2),
        })
        setImages(product.product_images || [])
      })
      .catch(err => alert(err instanceof Error ? err.message : '載入失敗'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let parsedSpecs = {}
    let parsedVariants: unknown[] = []
    try {
      parsedSpecs = JSON.parse(form.specs)
      parsedVariants = JSON.parse(form.variants)
    } catch {
      alert('規格或變體 JSON 格式錯誤')
      setSaving(false)
      return
    }

    const body = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      category: form.category,
      brand: form.brand,
      sku: form.sku || null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
      specs: parsedSpecs,
      variants: parsedVariants,
    }

    try {
      if (isEdit) {
        await api.put(`/api/admin/products/${id}`, body)
      } else {
        const created = await api.post<Product>('/api/admin/products', body)
        navigate(`/admin/products/${created.id}/edit`, { replace: true })
        return
      }
      navigate('/admin/products')
    } catch (err) {
      alert(err instanceof Error ? err.message : '儲存失敗')
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
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? '編輯商品' : '新增商品'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* 基本資訊 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">基本資訊</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名稱 *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">選擇分類</option>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
              <input name="brand" value={form.brand} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* 價格與庫存 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">價格與庫存</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">售價 *</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">原價</label>
              <input name="compare_at_price" type="number" step="0.01" min="0" value={form.compare_at_price} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">庫存數量</label>
              <input name="stock_quantity" type="number" min="0" value={form.stock_quantity} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">上架中</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="is_featured" type="checkbox" checked={form.is_featured} onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">精選商品</span>
            </label>
          </div>
        </div>

        {/* 圖片上傳 */}
        {isEdit && id && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ImageUpload productId={id} images={images} onImagesChange={setImages} />
          </div>
        )}

        {/* 送出按鈕 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? '儲存中...' : isEdit ? '更新商品' : '建立商品'}
          </button>
        </div>
      </form>
    </div>
  )
}
