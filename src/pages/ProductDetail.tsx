import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { fetchPublic } from '../lib/api'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description')
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchPublic<Product>(`/api/products/${id}`)
      .then(data => {
        if (data) {
          setProduct(data)
          const defaults: Record<string, string> = {}
          if (data.variants && Array.isArray(data.variants)) {
            for (const v of data.variants) {
              if (v.options?.length > 0) defaults[v.name] = v.options[0]
            }
          }
          setSelectedVariants(defaults)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">找不到此商品</h2>
        <p className="text-gray-500 mb-8">商品可能已下架或不存在</p>
        <Link to="/products" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          瀏覽所有商品
        </Link>
      </div>
    )
  }

  const name = product.name
  const description = product.description || ''
  const price = Number(product.price)
  const comparePrice = product.compare_at_price ? Number(product.compare_at_price) : null
  const stock = product.stock_quantity ?? 0
  const specs = product.specs || {}
  const variants = Array.isArray(product.variants) ? product.variants : []

  const images = product.product_images?.length
    ? product.product_images.sort((a, b) => a.display_order - b.display_order).map(img => img.url)
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900">首頁</Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link to="/products" className="hover:text-gray-900">產品</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-gray-900 font-medium">{name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center">
            {images.length > 0 ? (
              <img src={images[activeImage] || images[0]} alt={name} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <div className="text-gray-300 text-lg">暫無圖片</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-white rounded-xl border p-2 flex items-center justify-center ${i === activeImage ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">{name}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-lg text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
            )}
          </div>
          {stock <= 10 && (
            <div className="text-sm text-red-500 font-medium mb-8">
              即時庫存：僅剩 {stock} 件！
            </div>
          )}

          {variants.length > 0 && <div className="space-y-6 mb-8">
            {variants.map(variant => (
              <div key={variant.name}>
                <h3 className="text-sm font-medium text-gray-900 mb-3">{variant.name}</h3>
                <div className="flex gap-3">
                  {variant.options.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                      className={`px-6 py-2 rounded-lg border text-sm font-medium ${
                        selectedVariants[variant.name] === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>}

          <div className="flex gap-4 mt-auto">
            <button className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              加入購物車
            </button>
            <button className="flex-1 bg-orange-500 text-white py-3.5 rounded-xl font-medium hover:bg-orange-600 transition-colors">
              立即購買
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'description' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            商品描述
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'specs' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            規格參數
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 text-sm font-medium text-center ${activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            用戶評論
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">詳細介紹</h3>
              <p className="text-gray-600 leading-relaxed mb-8">{description}</p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div>
              {Object.keys(specs).length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {Object.entries(specs).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-3 pr-4 text-sm font-medium text-gray-700 w-1/3">{key}</td>
                        <td className="py-3 text-sm text-gray-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">規格參數內容...</p>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-gray-600">用戶評論內容...</div>
          )}
        </div>
      </div>
    </div>
  )
}
