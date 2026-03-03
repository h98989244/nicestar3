import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">聯絡我們</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">聯絡資訊</h2>
          
          <div className="mb-8 rounded-xl overflow-hidden border border-gray-200 h-64 bg-gray-100 relative">
            {/* Placeholder for Map */}
            <img src="https://picsum.photos/seed/map/800/400" alt="Map" className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
              <div className="font-bold text-gray-900 text-sm">NICE-DA TECHNOLOGY</div>
              <div className="text-xs text-gray-500">香港辦公室</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">辦公室地址</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  香港九龍觀塘鴻圖道57號南洋廣場15樓1503室
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">電話</h3>
                <p className="text-sm text-gray-600">
                  +852 2345 6789
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">支援電郵</h3>
                <a href="mailto:support@nice-da.com" className="text-sm text-blue-600 hover:underline">
                  support@nice-da.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">發送訊息給我們</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
              <input 
                type="text" 
                placeholder="請輸入您的姓名" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
              <input 
                type="email" 
                placeholder="請輸入您的電子郵件" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">主旨</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                <option>產品諮詢</option>
                <option>訂單查詢</option>
                <option>售後服務</option>
                <option>其他</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">訊息內容</label>
              <textarea 
                rows={5}
                placeholder="請詳細描述您的問題或需求..." 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              ></textarea>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              發送訊息
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
