import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const faqs = [
    {
      category: '訂單問題',
      items: [
        { q: '如何修改或取消我的訂單？', a: '在訂單尚未發貨前，請前往您的帳戶頁面找到相應訂單並點擊「申請修改」或「取消訂單」。若訂單已發貨，請聯繫我們的客服團隊獲取協助。' },
        { q: '我可以使用哪些付款方式？', a: '我們接受信用卡、PayPal、Apple Pay 等多種付款方式。' },
        { q: '為什麼我的優惠碼無效？', a: '請確認優惠碼是否過期、是否符合使用條件，或是否已在其他訂單中使用過。' },
      ]
    },
    {
      category: '配送資訊',
      items: [
        { q: '訂單需要多長時間送達？', a: '標準配送通常需要 3-5 個工作日，快速配送則為 1-2 個工作日。' },
        { q: '你們提供國際配送嗎？', a: '目前，我們主要在台灣本地進行配送。對於特定地區或大宗訂單的國際運送需求，請透過客服與我們聯繫。' },
      ]
    },
    {
      category: '退換貨政策',
      items: [
        { q: '如何申請退貨？', a: '請在收到商品後 7 天內，透過「我的帳戶」中的訂單記錄申請退貨。' },
        { q: '退款需要多長時間？', a: '退款通常在收到退回商品後的 5-7 個工作日內處理完畢。' },
      ]
    },
    {
      category: '產品保固',
      items: [
        { q: '產品的保固期是多久？', a: '大部分產品享有 1 年保固期，具體請參考商品詳情頁面。' },
        { q: '如何註冊產品保固？', a: '請在購買後 30 天內，前往「保固註冊」頁面填寫相關資訊。' },
        { q: '如何註冊產品保固方案？', a: '請在購買後 30 天內，前往「保固註冊」頁面填寫相關資訊。' },
      ]
    }
  ];

  let itemIndex = 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">常見問題 (FAQ)</h1>
      
      <div className="relative max-w-2xl mx-auto mb-16">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
          placeholder="搜尋常見問題..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {faqs.map((category, catIdx) => (
          <div key={catIdx}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{category.category}</h2>
            <div className="space-y-3">
              {category.items.map((item) => {
                const currentIndex = itemIndex++;
                const isOpen = openIndex === currentIndex;
                
                return (
                  <div key={currentIndex} className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                    >
                      <span className="font-medium text-gray-900 text-sm">{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-blue-500 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-4">還需要協助？</h3>
        <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-4 shadow-sm">
          聯絡我們
        </button>
        <p className="text-sm text-gray-600">
          或透過 <a href="#" className="text-blue-600 hover:underline">線上客服</a> 與我們交談。
        </p>
      </div>
    </div>
  );
}
