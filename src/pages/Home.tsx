import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { fetchPublic } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import { useStore } from '../contexts/StoreContext'
import type { Product, PaginatedResponse } from '../types'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  display_order: number
  is_active: boolean
}

function getLucideIcon(name: string): LucideIcons.LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[name]
  if (typeof icon === 'function') return icon as LucideIcons.LucideIcon
  return LucideIcons.Package
}

function getProductImage(product: Product): string {
  const primary = product.product_images?.find(img => img.is_primary)
  return primary?.url || product.product_images?.[0]?.url || ''
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const store = useStore()

  useEffect(() => {
    fetchPublic<Category[]>('/api/categories')
      .then(data => { if (data?.length) setCategories(data) })
      .catch(() => {})

    fetchPublic<PaginatedResponse<Product>>('/api/products?limit=8')
      .then(data => {
        if (data?.products?.length) {
          setProducts(data.products)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 aspect-[21/9] flex items-center mb-12">
        <div className="absolute inset-0">
          <img src="/pic4.png" alt="Hero" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
        </div>
        <div className="relative z-10 w-full text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {store.slogan || '智慧穿戴新未來'}.
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-8 font-light">立即選購。</p>
          <Link to="/products" className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
            立即選購
          </Link>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mb-16">
          {categories.map((category) => {
            const Icon = getLucideIcon(category.icon)
            return (
              <Link key={category.id} to={`/products?category=${category.slug}`} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <Icon className="h-8 w-8 text-gray-700 mb-3" strokeWidth={1.5} />
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Hot Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">熱銷排行榜</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>目前沒有商品，敬請期待！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                    {product.name}
                  </Link>
                  <div className="mt-auto">
                    <div className="text-lg font-bold text-gray-900 mb-4">NT${Math.round(Number(product.price))}</div>
                    <button
                      onClick={() => addItem(product)}
                      className="w-full bg-[#1a2332] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
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
  )
}
