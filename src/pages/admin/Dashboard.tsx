import { useState, useEffect } from 'react'
import { Package, Eye, EyeOff, Star } from 'lucide-react'
import { api } from '../../lib/api'
import type { Product, PaginatedResponse } from '../../types'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, featured: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // 取得所有商品（管理員路由不受 is_active 限制）
        const res = await api.get<PaginatedResponse<Product>>('/api/admin/products?limit=1000')
        const products = res.products
        setStats({
          total: products.length,
          active: products.filter(p => p.is_active).length,
          inactive: products.filter(p => !p.is_active).length,
          featured: products.filter(p => p.is_featured).length,
        })
      } catch {
        // 靜默處理
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    { label: '全部商品', value: stats.total, icon: Package, color: 'bg-blue-500' },
    { label: '已上架', value: stats.active, icon: Eye, color: 'bg-green-500' },
    { label: '已下架', value: stats.inactive, icon: EyeOff, color: 'bg-gray-500' },
    { label: '精選商品', value: stats.featured, icon: Star, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">儀表板</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className={`${color} rounded-lg p-3 text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
