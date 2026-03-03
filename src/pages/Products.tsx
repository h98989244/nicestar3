import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronUp, Star } from 'lucide-react'
import type { Product, PaginatedResponse } from '../types'

const fallbackProducts = [
  { id: '101', name: '羅技 MX Master 3S 無線滑鼠', price: 99.99, rating: 5, reviews: 245, image: 'https://picsum.photos/seed/mouse1/400/400' },
  { id: '102', name: 'Apple iPhone 15 Pro Max 矽膠保護殼 - MagSafe', price: 49.00, rating: 4, reviews: 1023, image: 'https://picsum.photos/seed/case4/400/400' },
  { id: '103', name: 'Belkin BoostCharge Pro 3 合 1 無線充電器', price: 149.99, rating: 5, reviews: 350, image: 'https://picsum.photos/seed/charger2/400/400' },
  { id: '104', name: 'Sony WH-1000XM5 Noise Cancelling Headphones', price: 348.00, rating: 5, reviews: 676, image: 'https://picsum.photos/seed/audio2/400/400' },
  { id: '105', name: 'Razer BlackWidow V4 Pro Mechanical Gaming Keyboard', price: 229.99, rating: 4, reviews: 150, image: 'https://picsum.photos/seed/kb1/400/400' },
  { id: '106', name: 'Belkin BoostCharge Pro 3 合 1 無線充電器', price: 149.99, rating: 5, reviews: 350, image: 'https://picsum.photos/seed/charger3/400/400' },
  { id: '107', name: 'Logitech MX Master 3S Wireless Mouse', price: 99.99, rating: 5, reviews: 245, image: 'https://picsum.photos/seed/mouse2/400/400' },
  { id: '108', name: 'Apple iPhone 15 Pro Max 矽膠保護殼 - with MagSafe', price: 49.00, rating: 4, reviews: 1023, image: 'https://picsum.photos/seed/case5/400/400' },
  { id: '109', name: 'Sony WH-1000XM5 Noise Cancelling Headphones', price: 348.00, rating: 5, reviews: 676, image: 'https://picsum.photos/seed/audio3/400/400' },
  { id: '110', name: 'Logitech MX Master 3S Wireless Mouse', price: 99.99, rating: 5, reviews: 245, image: 'https://picsum.photos/seed/mouse3/400/400' },
  { id: '111', name: 'Sony WH-1000XM5 Noise Cancelling Headphones', price: 348.00, rating: 5, reviews: 876, image: 'https://picsum.photos/seed/audio4/400/400' },
  { id: '112', name: 'Razer BlackWidow V4 Pro Mechanical Gaming Keyboard', price: 229.99, rating: 4, reviews: 150, image: 'https://picsum.photos/seed/kb2/400/400' },
]

function getProductImage(product: Product): string {
  const primary = product.product_images?.find(img => img.is_primary)
  return primary?.url || product.product_images?.[0]?.url || 'https://picsum.photos/seed/placeholder/400/400'
}

export default function Products() {
  const [searchParams] = useSearchParams()
  const [priceRange] = useState([20, 500])
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: number; rating: number; reviews: number; image: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const apiBase = import.meta.env.VITE_API_URL || ''
    const params = new URLSearchParams({ limit: '20' })
    if (category) params.set('category', category)
    if (search) params.set('search', search)

    fetch(`${apiBase}/api/products?${params}`)
      .then(res => res.json())
      .then((data: PaginatedResponse<Product>) => {
        if (data.products?.length > 0) {
          setProducts(data.products.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            rating: 5,
            reviews: 0,
            image: getProductImage(p),
          })))
        } else {
          setProducts(fallbackProducts)
        }
      })
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false))
  }, [searchParams])

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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="text" value={priceRange[0]} readOnly className="w-full pl-6 pr-3 py-1.5 border border-gray-300 rounded-md text-sm text-center" />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="text" value={priceRange[1]} readOnly className="w-full pl-6 pr-3 py-1.5 border border-gray-300 rounded-md text-sm text-center" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 mb-4" />

            {/* Brands */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3 cursor-pointer">
                <h3 className="font-medium text-sm text-gray-900">品牌</h3>
                <ChevronUp className="h-4 w-4 text-gray-500" />
              </div>
              <div className="space-y-2.5">
                {['Apple', 'Logitech', 'Razer', 'Samsung', 'Sony', 'Belkin'].map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 mb-4" />

            {/* Models */}
            <div>
              <div className="flex justify-between items-center mb-3 cursor-pointer">
                <h3 className="font-medium text-sm text-gray-900">適用機型</h3>
                <ChevronUp className="h-4 w-4 text-gray-500" />
              </div>
              <div className="space-y-2.5">
                {['iPhone 15 Pro Max', 'iPhone 15', 'Apple Watch Series 9', 'iPad Pro', 'MacBook Air', 'AirPods Pro 2'].map(model => (
                  <label key={model} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">{model}</span>
                  </label>
                ))}
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                  <Link to={`/product/${product.id}`} className="block aspect-square bg-gray-50 relative p-6">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 mb-1 hover:text-blue-600 line-clamp-2">
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < product.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="mt-auto">
                      <div className="text-lg font-bold text-gray-900 mb-4">${product.price}</div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
