import {
  Sparkles, Target, Wallet, TrendingUp, ChevronRight, Bell,
  Zap, ArrowUpRight, Clock, CheckCircle2, AlertTriangle, Users,
  BarChart3, Star, Brain
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DonorMatchingDashboardProps {
  onNavigate: (view: string, donorId?: string) => void;
}

const readinessData = [
  { subject: 'وثائق المشروع', score: 85 },
  { subject: 'الميزانية', score: 72 },
  { subject: 'الأهلية', score: 90 },
  { subject: 'الجغرافيا', score: 78 },
  { subject: 'المستفيدون', score: 88 },
  { subject: 'الأثر', score: 65 },
];

const trendData = [
  { month: 'يناير', matches: 8, applications: 3, funded: 1 },
  { month: 'فبراير', matches: 12, applications: 5, funded: 2 },
  { month: 'مارس', matches: 15, applications: 6, funded: 2 },
  { month: 'أبريل', matches: 19, applications: 8, funded: 3 },
  { month: 'مايو', matches: 23, applications: 10, funded: 4 },
  { month: 'يونيو', matches: 28, applications: 13, funded: 5 },
];

const recommendedActions = [
  { id: 1, priority: 'عاجل', action: 'أكمل وثيقة خطة الاستدامة المطلوبة من صندوق الملك عبدالعزيز', deadline: 'خلال 3 أيام', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' },
  { id: 2, priority: 'مهم', action: 'راجع معايير أهلية مؤسسة أرامكو وقدّم ملف التسجيل', deadline: 'خلال أسبوع', icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' },
  { id: 3, priority: 'مقترح', action: 'حسّن درجة تأثير المشروع لرفع نسبة التطابق بنسبة 12%', deadline: 'قبل التقديم', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
  { id: 4, priority: 'مقترح', action: 'أضف بيانات المستفيدين التفصيلية لتحسين التطابق الجغرافي', deadline: 'هذا الأسبوع', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800' },
];

const topMatches = [
  { id: '1', name: 'صندوق الملك عبدالعزيز للأبحاث', score: 94, area: 'التعليم والبحث', status: 'open', deadline: '15 يوليو 2026' },
  { id: '2', name: 'مؤسسة أرامكو للاستدامة', score: 89, area: 'البيئة والمجتمع', status: 'open', deadline: '30 يوليو 2026' },
  { id: '3', name: 'صندوق تنمية المجتمع', score: 83, area: 'التنمية الاجتماعية', status: 'closing', deadline: '20 يوليو 2026' },
];

export function DonorMatchingDashboard({ onNavigate }: DonorMatchingDashboardProps) {
  return (
    <div className="space-y-6">
      {/* AI Insight Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-700 p-6 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-violet-200" />
              <span className="text-violet-200 text-sm">تحليل الذكاء الاصطناعي</span>
            </div>
            <h2 className="text-xl mb-1">وجدنا 28 جهة مانحة مناسبة لمشروعك</h2>
            <p className="text-violet-200 text-sm">بناءً على تحليل 147 معياراً — أعلى نسبة تطابق: 94% مع صندوق الملك عبدالعزيز للأبحاث</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => onNavigate('recommended')} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm hover:bg-violet-50 transition-colors">
                <Sparkles className="w-4 h-4" />
                عرض التوصيات
              </button>
              <button onClick={() => onNavigate('analytics')} className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors">
                <BarChart3 className="w-4 h-4" />
                التحليلات
              </button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center w-24 h-24 rounded-full bg-white/10 border border-white/20">
            <div className="text-center">
              <p className="text-3xl">94</p>
              <p className="text-xs text-violet-200">أعلى تطابق</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'جهات مانحة موصى بها', value: '28', sub: '+5 هذا الأسبوع', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-100 dark:border-violet-900' },
          { label: 'فرص تطابق عالي', value: '9', sub: 'نسبة تطابق ≥80%', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-100 dark:border-amber-900' },
          { label: 'فرص تمويل مفتوحة', value: '67', sub: '7 تنتهي قريباً', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-100 dark:border-emerald-900' },
          { label: 'درجة الجاهزية للتمويل', value: '79%', sub: '+4% من الشهر الماضي', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-100 dark:border-blue-900' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-xl border p-4 ${card.bg} ${card.border}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-background/60`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className={`text-2xl ${card.color}`}>{card.value}</p>
              <p className="text-xs text-foreground mt-0.5">{card.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => onNavigate('recommended')} className="text-sm text-primary flex items-center gap-1 hover:underline">
              عرض الكل <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <h2 className="text-foreground">أعلى تطابقات الذكاء الاصطناعي</h2>
          </div>
          <div className="space-y-3">
            {topMatches.map(match => (
              <div key={match.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer group" onClick={() => onNavigate('analysis', match.id)}>
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    {match.status === 'closing' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ينتهي قريباً
                      </span>
                    )}
                    <span className="text-sm text-foreground">{match.name}</span>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {match.deadline}
                    </span>
                    <span className="text-xs text-muted-foreground">{match.area}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="var(--muted)" strokeWidth="4" />
                      <circle cx="28" cy="28" r="24" fill="none"
                        stroke={match.score >= 90 ? '#10b981' : match.score >= 80 ? '#6366f1' : '#f59e0b'}
                        strokeWidth="4"
                        strokeDasharray={`${(match.score / 100) * 150.8} 150.8`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm text-foreground">{match.score}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">تطابق</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Radar */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => onNavigate('readiness')} className="text-sm text-primary flex items-center gap-1 hover:underline">
              تفاصيل <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <h2 className="text-foreground">جاهزية التمويل</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={readinessData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
              <Radar name="الجاهزية" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip formatter={v => `${v}%`} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900">
            <button onClick={() => onNavigate('readiness')} className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              تحسين <ChevronRight className="w-3 h-3" />
            </button>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">المتوسط: <span>79.7%</span></p>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-500" />
          <h2 className="text-foreground">الإجراءات الموصى بها من الذكاء الاصطناعي</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendedActions.map(action => {
            const Icon = action.icon;
            return (
              <div key={action.id} className={`flex items-start gap-3 p-4 rounded-xl border ${action.bg}`}>
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${action.color}`} />
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{action.deadline}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${action.priority === 'عاجل' ? 'bg-red-100 text-red-600 dark:bg-red-900/50' : action.priority === 'مهم' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50'}`}>
                      {action.priority}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{action.action}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-foreground mb-4">اتجاه التطابق والتقديم</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="matches" name="تطابقات" stroke="#6366f1" fill="url(#matchGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="applications" name="تقديمات" stroke="#10b981" fill="none" strokeWidth={2} />
            <Area type="monotone" dataKey="funded" name="ممولة" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
