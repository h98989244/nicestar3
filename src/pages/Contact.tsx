import { MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

export default function Contact() {
  const store = useStore();
  const displayName = store.site_name || '奈斯達科技';
  const subtitle = store.brand_subtitle || 'TECHNOLOGY';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">聯絡我們</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">聯絡資訊</h2>

          <div className="mb-8 rounded-xl overflow-hidden border border-gray-200 h-64 bg-gray-100">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d121.15779843068962!3d24.898819806008344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4t3!5e0!3m2!1szh-TW!2stw!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="space-y-6">
            {store.address && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">辦公室地址</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{store.address}</p>
                </div>
              </div>
            )}

            {store.phone && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">電話</h3>
                  <p className="text-sm text-gray-600">{store.phone}</p>
                </div>
              </div>
            )}

            {store.email && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">支援電郵</h3>
                  <a href={`mailto:${store.email}`} className="text-sm text-blue-600 hover:underline">
                    {store.email}
                  </a>
                </div>
              </div>
            )}
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
