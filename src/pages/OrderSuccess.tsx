import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package } from 'lucide-react'
import { fetchPublic } from '../lib/api'

interface OrderItem {
  product_name: string
  product_price: number
  quantity: number
  selected_variants: Record<string, string>
}

interface Order {
  order_number: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  shipping_method: string
  shipping_cost: number
  subtotal: number
  total: number
  status: string
  created_at: string
  items: OrderItem[]
}

export default function OrderSuccess() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) return
    fetchPublic<Order>(`/api/orders/${orderNumber}`)
      .then(data => setOrder(data))
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">找不到此訂單</h2>
        <Link to="/" className="text-blue-600 hover:underline">返回首頁</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* 成功圖示 */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">訂單已成立！</h1>
        <p className="text-gray-500">感謝您的購買，我們將儘快為您安排出貨。</p>
      </div>

      {/* 訂單資訊卡片 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
          <Package className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">訂單編號</p>
            <p className="font-bold text-gray-900">{order.order_number}</p>
          </div>
        </div>

        {/* 收件資訊 */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">收件資訊</h3>
          <p className="text-sm text-gray-900">{order.recipient_name}</p>
          <p className="text-sm text-gray-600">{order.recipient_phone}</p>
          <p className="text-sm text-gray-600">{order.recipient_address}</p>
          <p className="text-sm text-gray-600 mt-1">
            {order.shipping_method === 'express' ? '快速配送 (1-2 工作日)' : '標準配送 (3-5 工作日)'}
          </p>
        </div>

        {/* 商品明細 */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">商品明細</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-900">{item.product_name}</span>
                  <span className="text-gray-500 ml-1">x{item.quantity}</span>
                  {Object.keys(item.selected_variants || {}).length > 0 && (
                    <p className="text-xs text-gray-400">
                      {Object.entries(item.selected_variants).map(([k, v]) => `${k}: ${v}`).join('、')}
                    </p>
                  )}
                </div>
                <span className="font-medium text-gray-900 flex-shrink-0">
                  NT${Math.round(Number(item.product_price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 金額摘要 */}
        <div className="px-6 py-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">小計</span>
            <span className="text-gray-900">NT${Math.round(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">運費</span>
            <span className="text-gray-900">NT${Math.round(Number(order.shipping_cost))}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">總計</span>
            <span className="text-xl font-bold text-gray-900">NT${Math.round(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* 按鈕 */}
      <div className="flex gap-4">
        <Link
          to="/products"
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center"
        >
          繼續購物
        </Link>
        <Link
          to="/"
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
        >
          返回首頁
        </Link>
      </div>
    </div>
  )
}
