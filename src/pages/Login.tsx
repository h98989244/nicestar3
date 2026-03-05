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
              <span className="font-bold text-lg leading-tight tracking-tight text-blue-900">nicestar3</span>
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
