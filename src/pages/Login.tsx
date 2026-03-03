import { Link } from 'react-router-dom';
import { EyeOff } from 'lucide-react';

export default function Login() {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-blue-900">NICE-DA</span>
              <span className="text-[10px] leading-tight font-medium tracking-widest text-blue-800">TECHNOLOGY</span>
            </div>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">會員登入與註冊</h2>

        <div className="flex border-b border-gray-200 mb-8">
          <button className="flex-1 pb-4 text-center font-medium text-blue-600 border-b-2 border-blue-600">
            登入
          </button>
          <button className="flex-1 pb-4 text-center font-medium text-gray-500 hover:text-gray-700">
            註冊
          </button>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
            <input 
              type="email" 
              placeholder="請輸入電子郵件" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="請輸入密碼" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              忘記密碼？
            </a>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            登入
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或使用以下帳號繼續</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              使用 Google 帳號登入
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.56-.06 2.84.61 3.61 1.76-3.15 1.88-2.65 6.1.4 7.34-.74 1.8-1.66 3.04-2.67 3.86zm-4.3-13.8c-.28-2.1 1.58-4.04 3.7-4.18.3 2.2-1.8 4.14-3.7 4.18z"/></svg>
              使用 Apple 帳號登入
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          還沒有帳號？{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            立即註冊
          </a>
        </div>
      </div>
    </div>
  );
}
