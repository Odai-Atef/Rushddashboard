import { useState } from 'react';
import {
  LayoutDashboard, Sparkles, BarChart3, Target, Send, Brain,
  ChevronLeft, Bell, Download
} from 'lucide-react';
import { DonorMatchingDashboard } from './DonorMatchingDashboard';
import { AIRecommendedDonors } from './AIRecommendedDonors';
import { MatchAnalysis } from './MatchAnalysis';
import { FundingReadinessAssessment } from './FundingReadinessAssessment';
import { SubmissionPreparation } from './SubmissionPreparation';
import { MatchingAnalytics } from './MatchingAnalytics';

type ViewType = 'dashboard' | 'recommended' | 'analysis' | 'readiness' | 'submission' | 'analytics';

interface Tab {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'لوحة التطابق', icon: LayoutDashboard },
  { id: 'recommended', label: 'المانحون المقترحون', icon: Sparkles },
  { id: 'analysis', label: 'تحليل التطابق', icon: Brain },
  { id: 'readiness', label: 'جاهزية التمويل', icon: Target },
  { id: 'submission', label: 'إعداد الطلب', icon: Send },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
];

export function DonorMatchingModule() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [activeDonorId, setActiveDonorId] = useState<string>('1');

  const handleNavigate = (view: string, donorId?: string) => {
    setActiveView(view as ViewType);
    if (donorId) setActiveDonorId(donorId);
  };

  const activeTab = tabs.find(t => t.id === activeView);

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Module Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <Download className="w-3.5 h-3.5" /> تصدير
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">7</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-foreground text-right">وحدة التطابق الذكي مع الجهات المانحة</h1>
              <p className="text-xs text-muted-foreground text-right mt-0.5">مدعوم بالذكاء الاصطناعي • تحليل 147 معياراً</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
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

      {/* Breadcrumb */}
      {(activeView === 'analysis' || activeView === 'submission') && (
        <div className="px-6 py-2 bg-muted/30 border-b border-border flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={() => setActiveView('recommended')} className="hover:text-foreground transition-colors">
            المانحون المقترحون
          </button>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-foreground">
            {activeView === 'analysis' ? 'تحليل التطابق' : 'إعداد الطلب'}
          </span>
          <ChevronLeft className="w-3 h-3" />
          <span>صندوق الملك عبدالعزيز للأبحاث</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeView === 'dashboard' && (
          <DonorMatchingDashboard onNavigate={handleNavigate} />
        )}
        {activeView === 'recommended' && (
          <AIRecommendedDonors onNavigate={handleNavigate} />
        )}
        {activeView === 'analysis' && (
          <MatchAnalysis donorId={activeDonorId} onNavigate={handleNavigate} />
        )}
        {activeView === 'readiness' && (
          <FundingReadinessAssessment onNavigate={handleNavigate} />
        )}
        {activeView === 'submission' && (
          <SubmissionPreparation donorId={activeDonorId} onNavigate={handleNavigate} />
        )}
        {activeView === 'analytics' && (
          <MatchingAnalytics />
        )}
      </div>
    </div>
  );
}
