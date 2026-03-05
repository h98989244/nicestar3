import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

function getProductImage(product: { product_images?: { url: string; is_primary: boolean }[] }): string {
  const primary = product.product_images?.find(img => img.is_primary)
  return primary?.url || product.product_images?.[0]?.url || ''
}

const SHIPPING_STANDARD = 80
const SHIPPING_EXPRESS = 150

export default function Checkout() {
  const { items, updateQuantity, removeItem, totalPrice, totalCount } = useCart()
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard')

  const shippingCost = totalCount === 0 ? 0 : shipping === 'express' ? SHIPPING_EXPRESS : SHIPPING_STANDARD
  const grandTotal = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">購物車是空的</h2>
        <p className="text-gray-500 mb-8">快去逛逛，把喜歡的商品加入購物車吧！</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          瀏覽商品
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">購物車</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
              {/* Image */}
              <Link to={`/product/${item.product.id}`} className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                {getProductImage(item.product) ? (
                  <img src={getProductImage(item.product)} alt={item.product.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">暫無圖片</div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                  {item.product.name}
                </Link>
                {Object.keys(item.selectedVariants).length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join('、')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-500 hover:text-gray-700"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-500 hover:text-gray-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    NT${Math.round(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeItem(item.product.id)}
                className="self-start p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">運送方式</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${shipping === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shipping === 'standard'}
                  onChange={() => setShipping('standard')}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">標準配送 (3-5 工作日)</span>
                </div>
                <span className="text-sm font-medium text-gray-900">NT${SHIPPING_STANDARD}</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${shipping === 'express' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shipping === 'express'}
                  onChange={() => setShipping('express')}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900">快速配送 (1-2 工作日)</span>
                </div>
                <span className="text-sm font-medium text-gray-900">NT${SHIPPING_EXPRESS}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-blue-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">訂單摘要</h2>

            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.product.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-900 flex-shrink-0">NT${Math.round(Number(item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-blue-200 pt-4 space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">小計</span>
                <span className="font-medium text-gray-900">NT${Math.round(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">運費</span>
                <span className="font-medium text-gray-900">NT${shippingCost}</span>
              </div>
            </div>

            <div className="border-t border-blue-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">總計</span>
                <span className="text-xl font-bold text-gray-900">NT${Math.round(grandTotal)}</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              前往結帳
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
