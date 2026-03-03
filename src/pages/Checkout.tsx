import { useState } from 'react';
import { Check } from 'lucide-react';

export default function Checkout() {
  const [step, setStep] = useState(2); // 1: Confirm, 2: Shipping, 3: Payment

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">結帳</h1>

      {/* Progress Steps */}
      <div className="relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        
        <div className="relative flex justify-between">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <Check className="w-5 h-5" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-900">1. 確認商品</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-900">2. 收件資訊</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
            <span className="mt-2 text-sm font-medium text-gray-500">3. 確認付款</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Form Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">收件資訊</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">收件人姓名</label>
                <input type="text" placeholder="收件人姓名" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">聯絡電話</label>
                <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">收件地址</label>
              <input type="text" placeholder="收件地址" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-3" />
              <input type="text" placeholder="收件地址 2 (選填)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">郵遞區號</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">運送方式</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-blue-500 rounded-xl bg-blue-50 cursor-pointer">
                  <input type="radio" name="shipping" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <div className="flex-1">
                    <span className="block text-sm font-medium text-gray-900">標準配送 (3-5 工作日)</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">NT$80</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="shipping" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <div className="flex-1">
                    <span className="block text-sm font-medium text-gray-900">快速配送 (1-2 工作日)</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">NT$150</span>
                </label>
              </div>
            </div>

            <button type="button" onClick={() => setStep(3)} className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              前往付款
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-blue-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">訂單摘要</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">小計：</span>
                <span className="font-medium text-gray-900">NT$2,490</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">運費：</span>
                <span className="font-medium text-gray-900">NT$80</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">稅額：</span>
                <span className="font-medium text-gray-900">NT$120</span>
              </div>
            </div>
            
            <div className="border-t border-blue-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">總計：</span>
                <span className="text-xl font-bold text-gray-900">NT$2,690</span>
              </div>
            </div>

            <button onClick={() => setStep(3)} className="w-full bg-blue-400 text-white py-3 rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-sm">
              前往付款
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
