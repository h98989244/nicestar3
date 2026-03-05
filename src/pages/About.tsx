import { ShieldCheck, Zap, Lightbulb } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#1a2332] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">關於我們</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            我們致力於將科技融入生活，打造無縫的智慧生活體驗。<br />
            奈斯達科技TECHNOLOGY，您的智慧生活領航人。
          </p>
          <button className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-medium transition-colors backdrop-blur-sm">
            探索更多
          </button>
        </div>

        {/* Brand Philosophy */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">品牌理念</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">嚴選品質</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                只為您提供經過嚴格篩選、設計與功能兼具的頂尖科技產品。
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">科技生活</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                讓科技無縫融入日常，提升便利與生活質感，享受智慧帶來的愉悅。
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">創新體驗</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                不斷發掘前沿科技與獨特產品，帶來超越期待的使用體驗。
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">為什麼選擇我們</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#232d3f] rounded-2xl overflow-hidden border border-white/10">
              <img src="https://picsum.photos/seed/choose1/400/300" alt="3C 專業知識" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">3C 專業知識</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  我們的團隊深諳3C領域，提供專業的產品諮詢與技術支援。
                </p>
              </div>
            </div>
            <div className="bg-[#232d3f] rounded-2xl overflow-hidden border border-white/10">
              <img src="https://picsum.photos/seed/choose2/400/300" alt="卓越服務" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">卓越服務</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  以客戶為中心，提供快速配送、完善售後與貼心的購物體驗。
                </p>
              </div>
            </div>
            <div className="bg-[#232d3f] rounded-2xl overflow-hidden border border-white/10">
              <img src="https://picsum.photos/seed/choose3/400/300" alt="獨家精選" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">獨家精選</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  提供市場上少見的精選品牌與獨家產品，展現您的獨特品味。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
