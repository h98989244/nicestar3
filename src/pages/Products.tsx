import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { fetchPublic } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import type { Product, PaginatedResponse } from '../types'

function getProductImage(product: Product): string {
  const primary = product.product_images?.find(img => img.is_primary)
  return primary?.url || product.product_images?.[0]?.url || ''
}

const sortOptions = [
  { label: '最新上架', sort: 'created_at', order: 'desc' },
  { label: '價格：由低到高', sort: 'price', order: 'asc' },
  { label: '價格：由高到低', sort: 'price', order: 'desc' },
  { label: '名稱排序', sort: 'name', order: 'asc' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [sortIndex, setSortIndex] = useState(0)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''

  // 用 ref 保存最新的篩選值，避免閉包問題
  const filtersRef = useRef({ sortIndex, minPrice, maxPrice })
  filtersRef.current = { sortIndex, minPrice, maxPrice }

  const doFetch = (p = 1, overrides?: { sortIndex?: number }) => {
    setLoading(true)
    const si = overrides?.sortIndex ?? filtersRef.current.sortIndex
    const { sort, order } = sortOptions[si]
    const mp = filtersRef.current.minPrice
    const xp = filtersRef.current.maxPrice

    const params = new URLSearchParams({ limit: '20', page: String(p), sort, order })
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    if (mp) params.set('min_price', mp)
    if (xp) params.set('max_price', xp)

    fetchPublic<PaginatedResponse<Product>>(`/api/products?${params}`)
      .then(data => {
        if (data?.products) {
          setProducts(data.products)
          setTotalPages(data.pagination?.totalPages || 1)
          setPage(p)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  // URL 參數變動時重新載入
  useEffect(() => {
    doFetch()
  }, [category, search])

  const handleSortChange = (e: { target: { value: string } }) => {
    const newIndex = Number(e.target.value)
    setSortIndex(newIndex)
    doFetch(1, { sortIndex: newIndex })
  }

  const handlePriceFilter = () => {
    doFetch()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">3C 精選配件</h1>
          {search && (
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <span>搜尋：<strong className="text-gray-900">{search}</strong></span>
              <button onClick={() => setSearchParams(category ? { category } : {})} className="text-gray-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">商品篩選</h2>

            {/* Price Range */}
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-3">價格區間</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">NT$</span>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePriceFilter()}
                    placeholder="最低"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">NT$</span>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePriceFilter()}
                    placeholder="最高"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handlePriceFilter}
                className="w-full py-1.5 text-sm font-medium text-white bg-[#1a2332] rounded-lg hover:bg-slate-800 transition-colors"
              >
                套用
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">排序方式：</span>
              <select
                value={sortIndex}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {sortOptions.map((opt, i) => (
                  <option key={i} value={i}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>目前沒有符合條件的商品</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                    <Link to={`/product/${product.id}`} className="block aspect-square bg-gray-50 relative p-6">
                      {getProductImage(product) ? (
                        <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">暫無圖片</div>
                      )}
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 mb-1 hover:text-blue-600 line-clamp-2">
                        {product.name}
                      </Link>
                      {product.category && (
                        <span className="text-xs text-gray-500 mb-2">{product.category}</span>
                      )}
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-lg font-bold text-gray-900">NT${Math.round(Number(product.price))}</span>
                          {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                            <span className="text-sm text-gray-400 line-through">NT${Math.round(Number(product.compare_at_price))}</span>
                          )}
                        </div>
                        <button
                          onClick={() => addItem(product)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => doFetch(p)}
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
      </div>
    </div>
  )
}
