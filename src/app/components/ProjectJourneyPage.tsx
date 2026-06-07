export function ProjectJourneyPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة رحلة المشروع</h1>
        <p className="text-muted-foreground">منصة تعاون لإدارة دورة حياة المشاريع الخيرية</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-3">صفحة إدارة المشاريع</h2>
          <p className="text-muted-foreground mb-6">
            هذه الصفحة قيد التطوير. سيتم إضافة ميزات إدارة المشاريع الكاملة قريباً.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              إنشاء مشروع جديد
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              عرض المشاريع
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">المشاريع النشطة</h3>
          <p className="text-3xl font-bold text-blue-500">12</p>
          <p className="text-sm text-muted-foreground mt-1">مشروع قيد التنفيذ</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">المشاريع المكتملة</h3>
          <p className="text-3xl font-bold text-green-500">48</p>
          <p className="text-sm text-muted-foreground mt-1">مشروع تم إنجازه</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">قيد المراجعة</h3>
          <p className="text-3xl font-bold text-yellow-500">5</p>
          <p className="text-sm text-muted-foreground mt-1">مشروع ينتظر الموافقة</p>
        </div>
      </div>
    </div>
  );
}
