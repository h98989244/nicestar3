import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart, Globe, Menu, X } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 切換頁面時自動關閉選單
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow flex items-center justify-center p-4">
          <Outlet />
        </main>
        <footer className="py-6 text-center text-sm text-gray-500">
          © 2024 NICE-DA TECHNOLOGY. 版權所有。
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
                  <span className="font-bold text-lg leading-tight tracking-tight">NICE-DA</span>
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
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                <User className="h-5 w-5" />
              </Link>
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
                  <span className="font-bold text-lg leading-tight tracking-tight text-white">NICE-DA</span>
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
              © 2024 NICE-DA TECHNOLOGY. 版權所有。
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Facebook</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Instagram</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
