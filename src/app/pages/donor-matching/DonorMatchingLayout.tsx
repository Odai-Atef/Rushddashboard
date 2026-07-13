import { Outlet, useLocation } from "react-router";
import { Sparkles, ChevronLeft } from "lucide-react";

export function DonorMatchingLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Module Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-start gap-3">
          <div className="text-right">
            <h1 className="text-foreground">وحدة التطابق الذكي مع الجهات المانحة</h1>
            <p className="text-xs text-muted-foreground mt-0.5">مدعوم بالذكاء الاصطناعي • تحليل 147 معياراً</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Breadcrumb for deep views */}
      {(location.pathname.includes('/analysis') || location.pathname.includes('/submission')) && (
        <div className="px-6 py-2 bg-muted/30 border-b border-border flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={() => window.history.back()} className="hover:text-foreground transition-colors">
            المانحون المقترحون
          </button>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-foreground">
            {location.pathname.includes('/analysis') ? 'تحليل التطابق' : 'إعداد الطلب'}
          </span>
          <ChevronLeft className="w-3 h-3" />
          <span>صندوق الملك عبدالعزيز للأبحاث</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
