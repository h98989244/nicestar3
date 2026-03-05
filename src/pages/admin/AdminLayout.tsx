import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tags, Settings, LogOut } from 'lucide-react'
import { clearToken } from '../../lib/api'
import { useStore } from '../../contexts/StoreContext'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: '儀表板', end: true },
  { to: '/admin/products', icon: Package, label: '商品管理', end: false },
  { to: '/admin/categories', icon: Tags, label: '分類管理', end: false },
  { to: '/admin/settings', icon: Settings, label: '店家設定', end: false },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const store = useStore()

  const handleLogout = () => {
    clearToken()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 側邊欄 */}
      <aside className="w-64 bg-[#1a2332] text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-lg font-bold">{store.site_name || '奈斯達科技'}管理後台</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            登出
          </button>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
