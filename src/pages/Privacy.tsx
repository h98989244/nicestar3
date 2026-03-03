export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">隱私權政策</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm space-y-12">
        <p className="text-gray-600 leading-relaxed">
          NICE-DA TECHNOLOGY (以下簡稱「我們」) 承諾保護您的隱私。本政策旨在讓您了解我們如何蒐集、使用、揭露、移轉及儲存您的個人資料。請您詳細閱讀本隱私權政策，以了解我們對您個人資料的處理方式。
        </p>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. 個人資料蒐集</h2>
          <p className="text-gray-600 leading-relaxed">
            當您在我們的網站建立帳戶、購買產品、聯絡客服或參與行銷活動時，我們可能會蒐集您的個人資料，包括但不限於：您的姓名、聯絡電話、電子郵件地址、郵寄地址、付款資訊及訂單記錄。我們也可能自動蒐集您的裝置資訊、瀏覽行為及 IP 地址。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. 資料使用目的</h2>
          <p className="text-gray-600 leading-relaxed">
            我們蒐集的個人資料主要用於以下目的：處理您的訂單及付款、提供客戶服務、發送訂單確認及物流資訊、改善我們的產品與服務、進行市場分析及個人化行銷推薦 (若您已同意)、以及遵守法律法規要求。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. 資料保護與安全</h2>
          <p className="text-gray-600 leading-relaxed">
            我們採取適當的技術和組織措施來保護您的個人資料，防止未經授權的存取、使用、揭露、竄改或破壞。我們僅在業務需要且法律允許的情況下保留您的資料。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookie 使用政策</h2>
          <p className="text-gray-600 leading-relaxed">
            我們的網站使用 Cookie 及類似技術來增強您的瀏覽體驗、分析網站流量及提供個人化內容。您可以透過瀏覽器設定管理或停用 Cookie，但請注意，這可能會影響網站的某些功能。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. 聯絡我們</h2>
          <p className="text-gray-600 leading-relaxed">
            如果您對本隱私權政策有任何疑問或希望行使您的權利 (如存取、更正或刪除您的個人資料)，請透過電子郵件 <a href="mailto:support@niceda.tech" className="text-blue-600 hover:underline">support@niceda.tech</a> 聯繫我們的隱私團隊。
          </p>
        </section>
      </div>
    </div>
  );
}
