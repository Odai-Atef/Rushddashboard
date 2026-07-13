import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, Sparkles, BarChart3, Target, Send, Brain,
  ChevronLeft
} from "lucide-react";

const tabs = [
  { id: 'dashboard', label: 'لوحة التطابق', icon: LayoutDashboard, path: '/dashboard/donor-matching' },
  { id: 'recommended', label: 'المانحون المقترحون', icon: Sparkles, path: '/dashboard/donor-matching/recommended' },
  { id: 'analysis', label: 'تحليل التطابق', icon: Brain, path: '/dashboard/donor-matching/analysis' },
  { id: 'readiness', label: 'جاهزية التمويل', icon: Target, path: '/dashboard/donor-matching/readiness' },
  { id: 'submission', label: 'إعداد الطلب', icon: Send, path: '/dashboard/donor-matching/submission' },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3, path: '/dashboard/donor-matching/analytics' },
];

export function DonorMatchingLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tabs.find(
    (t) => location.pathname === t.path || location.pathname.startsWith(t.path + '/')
  );

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Module Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-end gap-3 mb-4">
          <div className="text-right">
            <h1 className="text-foreground">وحدة التطابق الذكي مع الجهات المانحة</h1>
            <p className="text-xs text-muted-foreground mt-0.5">مدعوم بالذكاء الاصطناعي • تحليل 147 معياراً</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab?.id === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Breadcrumb for deep views */}
      {(location.pathname.includes('/analysis') || location.pathname.includes('/submission')) && (
        <div className="px-6 py-2 bg-muted/30 border-b border-border flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={() => navigate('/dashboard/donor-matching/recommended')} className="hover:text-foreground transition-colors">
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
