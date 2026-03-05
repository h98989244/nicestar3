import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import { fetchPublic } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import type { Product, PaginatedResponse } from '../types'

function getProductImage(product: Product): string {
  const primary = product.product_images?.find(img => img.is_primary)
  return primary?.url || product.product_images?.[0]?.url || ''
}

export default function Products() {
  const [searchParams] = useSearchParams()
  const [priceRange] = useState([100, 15000])
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)

  const loadProducts = (p = 1) => {
    setLoading(true)
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const params = new URLSearchParams({ limit: '20', page: String(p) })
    if (category) params.set('category', category)
    if (search) params.set('search', search)

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

  useEffect(() => { loadProducts() }, [searchParams])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">3C 精選配件</h1>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">商品篩選</h2>

            {/* Price Range */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3 cursor-pointer">
                <h3 className="font-medium text-sm text-gray-900">價格區間</h3>
                <ChevronUp className="h-4 w-4 text-gray-500" />
              </div>
              <div className="px-2 mb-4">
                <div className="h-1 bg-gray-200 rounded-full relative">
                  <div className="absolute h-full bg-blue-500 rounded-full" style={{ left: '10%', right: '20%' }}></div>
                  <div className="absolute h-4 w-4 bg-white border-2 border-blue-500 rounded-full -top-1.5" style={{ left: '10%' }}></div>
                  <div className="absolute h-4 w-4 bg-white border-2 border-blue-500 rounded-full -top-1.5" style={{ right: '20%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">NT$</span>
                  <input type="text" value={priceRange[0]} readOnly className="w-full pl-6 pr-3 py-1.5 border border-gray-300 rounded-md text-sm text-center" />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">NT$</span>
                  <input type="text" value={priceRange[1]} readOnly className="w-full pl-6 pr-3 py-1.5 border border-gray-300 rounded-md text-sm text-center" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">排序方式：</span>
              <select className="border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>最新上架</option>
                <option>價格：由低到高</option>
                <option>價格：由高到低</option>
                <option>熱銷排行</option>
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
      </div>
    </div>
  )
}
