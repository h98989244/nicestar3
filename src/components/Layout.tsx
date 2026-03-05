import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Globe, Menu, X, LogOut } from 'lucide-react';
import { getUserToken, getUserEmail, clearUserData } from '../lib/api';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 切換頁面時自動關閉選單，並更新登入狀態
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setUserEmail(getUserToken() ? getUserEmail() : null);
  }, [location.pathname]);

  // 點擊外部關閉使用者選單
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUserData();
    setUserEmail(null);
    setUserMenuOpen(false);
    navigate('/');
  };

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow flex items-center justify-center p-4">
          <Outlet />
        </main>
        <footer className="py-6 text-center text-sm text-gray-500">
          © 2024 奈斯達科技 版權所有。
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Bar */}
      <div className="bg-[#1a2332] text-white text-xs py-1.5 text-center">
        奈斯達科技 - 智慧穿戴新未來
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  N
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight tracking-tight">nicestar3</span>
                  <span className="text-[10px] leading-tight font-medium tracking-widest text-gray-500">TECHNOLOGY</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-900 hover:text-blue-600 font-medium">首頁</Link>
              <Link to="/products" className="text-gray-500 hover:text-blue-600 font-medium">產品</Link>
              <Link to="/about" className="text-gray-500 hover:text-blue-600 font-medium">關於我們</Link>
              <Link to="/contact" className="text-gray-500 hover:text-blue-600 font-medium">聯絡我們</Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="搜尋商品"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {userEmail ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {userEmail[0].toUpperCase()}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4" />
                        登出
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Link>
              )}
              <Link to="/checkout" className="text-gray-600 hover:text-gray-900 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </Link>
              <div className="hidden sm:flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">TW</span>
              </div>
              <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="flex flex-col px-4 py-3 space-y-1">
              <Link to="/" className="px-3 py-2.5 rounded-lg text-gray-900 hover:bg-gray-100 font-medium">首頁</Link>
              <Link to="/products" className="px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">產品</Link>
              <Link to="/about" className="px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">關於我們</Link>
              <Link to="/contact" className="px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">聯絡我們</Link>
            </nav>
            <div className="px-4 pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="搜尋商品"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2332] text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  N
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight tracking-tight text-white">nicestar3</span>
                  <span className="text-[10px] leading-tight font-medium tracking-widest text-gray-400">TECHNOLOGY</span>
                </div>
              </Link>
              <p className="text-sm text-gray-400 max-w-xs mt-4">
                致力於將科技融入生活，提供高品質的智慧穿戴設備與3C配件，打造無縫的智慧生活體驗。
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">公司</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">關於我們</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">服務條款</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">隱私權政策</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">客戶服務</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white transition-colors">聯絡我們</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">常見問題</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">產品目錄</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 奈斯達科技 版權所有。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
