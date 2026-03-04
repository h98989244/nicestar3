import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { api } from '../../lib/api'
import type { Product, PaginatedResponse } from '../../types'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadProducts = async (p = 1) => {
    setLoading(true)
    try {
      const res = await api.get<PaginatedResponse<Product>>(`/api/admin/products?page=${p}&limit=20`)
      setProducts(res.products)
      setTotalPages(res.pagination.totalPages)
      setPage(p)
    } catch (err) {
      alert(err instanceof Error ? err.message : '載入失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  const handleToggleActive = async (product: Product) => {
    try {
      await api.put(`/api/admin/products/${product.id}`, { is_active: !product.is_active })
      loadProducts(page)
    } catch (err) {
      alert(err instanceof Error ? err.message : '操作失敗')
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`確定要刪除「${product.name}」嗎？此操作無法復原。`)) return
    try {
      await api.delete(`/api/admin/products/${product.id}`)
      loadProducts(page)
    } catch (err) {
      alert(err instanceof Error ? err.message : '刪除失敗')
    }
  }

  const getPrimaryImage = (product: Product) => {
    const primary = product.product_images?.find(img => img.is_primary)
    return primary?.url || product.product_images?.[0]?.url || ''
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增商品
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>尚無商品，點擊上方按鈕新增第一個商品</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">商品</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">分類</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">價格</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">庫存</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">狀態</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getPrimaryImage(product) ? (
                          <img src={getPrimaryImage(product)} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            N/A
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sku || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={product.stock_quantity <= 5 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {product.is_active ? '已上架' : '已下架'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => loadProducts(p)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    p === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
