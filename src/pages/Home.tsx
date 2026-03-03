import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Smartphone, Watch, BatteryCharging, Shield, Headphones, Zap, Plus } from 'lucide-react'
import type { Product, PaginatedResponse } from '../types'

const categories = [
  { name: '手機殼', icon: Smartphone, path: '/products?category=cases' },
  { name: '錶帶', icon: Watch, path: '/products?category=bands' },
  { name: '充電器', icon: BatteryCharging, path: '/products?category=chargers' },
  { name: '螢幕保護貼', icon: Shield, path: '/products?category=protectors' },
  { name: '耳機', icon: Headphones, path: '/products?category=audio' },
  { name: '行動電源', icon: Zap, path: '/products?category=powerbanks' },
  { name: '配件', icon: Plus, path: '/products?category=accessories' },
]

const fallbackProducts = [
  { id: '1', name: 'NICE-DA 超薄手機殼', price: 29.99, image: 'https://picsum.photos/seed/case1/400/400' },
  { id: '2', name: 'NICE-DA 不鏽鋼錶帶', price: 29.99, image: 'https://picsum.photos/seed/band1/400/400' },
  { id: '3', name: '便攜式行動電源', price: 39.99, image: 'https://picsum.photos/seed/power1/400/400' },
  { id: '4', name: 'NICE-DA 真無線耳機', price: 18.99, image: 'https://picsum.photos/seed/audio1/400/400' },
  { id: '5', name: 'NICE-DA 超薄手機殼', price: 29.99, image: 'https://picsum.photos/seed/case2/400/400' },
  { id: '6', name: 'NICE-DA 新款智慧充電器', price: 29.99, image: 'https://picsum.photos/seed/charger1/400/400' },
  { id: '7', name: 'NICE-DA 真無線行動電源', price: 29.99, image: 'https://picsum.photos/seed/power2/400/400' },
  { id: '8', name: 'NICE-DA 真無線手機殼', price: 39.99, image: 'https://picsum.photos/seed/case3/400/400' },
]

function getProductImage(product: Product): string {
  const primary = product.product_images?.find(img => img.is_primary)
  return primary?.url || product.product_images?.[0]?.url || 'https://picsum.photos/seed/placeholder/400/400'
}

export default function Home() {
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: number; image: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || ''
    fetch(`${apiBase}/api/products?featured=true&limit=8`)
      .then(res => res.json())
      .then((data: PaginatedResponse<Product>) => {
        if (data.products?.length > 0) {
          setProducts(data.products.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            image: getProductImage(p),
          })))
        } else {
          setProducts(fallbackProducts)
        }
      })
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 aspect-[21/9] flex items-center mb-12">
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/hero/1200/500" alt="Hero" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
        </div>
        <div className="relative z-10 w-full text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            智慧穿戴新未來.
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-8 font-light">立即選購。</p>
          <Link to="/products" className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
            立即選購
          </Link>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-8 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mb-16">
        {categories.map((category) => (
          <Link key={category.name} to={category.path} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <category.icon className="h-8 w-8 text-gray-700 mb-3" strokeWidth={1.5} />
            <span className="text-sm font-medium text-gray-900">{category.name}</span>
          </Link>
        ))}
      </div>

      {/* Hot Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">熱銷排行榜</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                <Link to={`/product/${product.id}`} className="block aspect-square bg-gray-50 relative p-6">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                    {product.name}
                  </Link>
                  <div className="mt-auto">
                    <div className="text-lg font-bold text-gray-900 mb-4">${product.price}</div>
                    <button className="w-full bg-[#1a2332] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
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
