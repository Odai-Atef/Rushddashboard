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
 { id: 1, priority: 'عاجل', action: 'أكمل وثيقة خطة الاستدامة المطلوبة من صندوق الملك عبدالعزيز', deadline: 'خلال 3 أيام', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-[var(--destructive)]/[0.08] border-[var(--destructive)]/[0.3]' },
 { id: 2, priority: 'مهم', action: 'راجع معايير أهلية جهه أرامكو وقدّم ملف التسجيل', deadline: 'خلال أسبوع', icon: CheckCircle2, color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/[0.08] border-[var(--warning)]/[0.3]' },
 { id: 3, priority: 'مقترح', action: 'حسّن درجة تأثير المشروع لرفع نسبة التطابق بنسبة 12%', deadline: 'قبل التقديم', icon: TrendingUp, color: 'text-[var(--secondary)]', bg: 'bg-[var(--secondary)]/[0.08] border-[var(--secondary)]/[0.3]' },
 { id: 4, priority: 'مقترح', action: 'أضف بيانات المستفيدين التفصيلية لتحسين التطابق الجغرافي', deadline: 'هذا الأسبوع', icon: Users, color: 'text-[var(--secondary)]', bg: 'bg-[var(--secondary)]/[0.08] border-[var(--secondary)]/[0.3]' },
];

const topMatches = [
 { id: '1', name: 'صندوق الملك عبدالعزيز للأبحاث', score: 94, area: 'التعليم والبحث', status: 'open', deadline: '15 يوليو 2026' },
 { id: '2', name: 'جهه أرامكو للاستدامة', score: 89, area: 'البيئة والمجتمع', status: 'open', deadline: '30 يوليو 2026' },
 { id: '3', name: 'صندوق تنمية المجتمع', score: 83, area: 'التنمية الاجتماعية', status: 'closing', deadline: '20 يوليو 2026' },
];

export function DonorMatchingDashboard({ onNavigate }: DonorMatchingDashboardProps) {
 return (
 <div className="space-y-6 md:space-y-8">
 {/* AI Insight Banner */}
 <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-700 p-6 text-[var(--primary-foreground)]">
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
 <button onClick={() => onNavigate('recommended')} className="flex items-center gap-2 px-4 py-2 bg-card text-primary rounded-lg text-sm hover:bg-primary/5 transition-colors">
 <Sparkles className="w-4 h-4" />
 عرض التوصيات
 </button>
 <button onClick={() => onNavigate('analytics')} className="flex items-center gap-2 px-4 py-2 bg-[var(--card)]/10 border border-[var(--primary-foreground)]/[0.2] rounded-lg text-sm hover:bg-[var(--card)]/20 transition-colors">
 <BarChart3 className="w-4 h-4" />
 التحليلات
 </button>
 </div>
 </div>
 <div className="hidden lg:flex items-center justify-center w-24 h-24 rounded-full bg-[var(--card)]/10 border border-[var(--primary-foreground)]/[0.2]">
 <div className="text-center">
 <p className="text-3xl">94</p>
 <p className="text-xs text-violet-200">أعلى تطابق</p>
 </div>
 </div>
 </div>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
 {[
 { label: 'جهات مانحة موصى بها', value: '28', sub: '+5 هذا الأسبوع', icon: Users, color: 'text-[var(--secondary)]', bg: 'bg-[var(--secondary)]/[0.08]', border: 'border-[var(--secondary)]/[0.2]' },
 { label: 'فرص تطابق عالي', value: '9', sub: 'نسبة تطابق ≥80%', icon: Star, color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/[0.08]', border: 'border-[var(--warning)]/[0.2]' },
 { label: 'فرص تمويل مفتوحة', value: '67', sub: '7 تنتهي قريباً', icon: Wallet, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/[0.08]', border: 'border-[var(--primary)]/[0.2]' },
 { label: 'درجة الجاهزية للتمويل', value: '79%', sub: '+4% من الشهر الماضي', icon: Target, color: 'text-[var(--secondary)]', bg: 'bg-[var(--secondary)]/[0.08]', border: 'border-[var(--secondary)]/[0.2]' },
 ].map((card, i) => {
 const Icon = card.icon;
 return (
 <div key={i} className={`bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between h-full`}>
 <div className="flex items-start justify-between mb-4">
 <div className="p-2.5 rounded-xl bg-muted/80">
 <Icon className={`w-6 h-6 ${card.color}`} />
 </div>
 <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
 </div>
 <p className="text-3xl font-bold text-foreground tracking-tight">{card.value}</p>
 <p className="text-sm text-foreground mt-1">{card.label}</p>
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
 <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--destructive)]/[0.08] text-[var(--destructive)] flex items-center gap-1">
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
 <div className="mt-2 flex items-center justify-between p-3 bg-[var(--secondary)]/[0.08] rounded-lg border border-[var(--secondary)]/[0.2]">
 <button onClick={() => onNavigate('readiness')} className="text-xs text-indigo-600 flex items-center gap-1">
 تحسين <ChevronRight className="w-3 h-3" />
 </button>
 <p className="text-sm text-[var(--secondary)]">المتوسط: <span>79.7%</span></p>
 </div>
 </div>
 </div>

 {/* Recommended Actions */}
 <div className="bg-card border border-border rounded-xl p-5">
 <div className="flex items-center gap-2 mb-4">
 <Zap className="w-4 h-4 text-[var(--warning)]" />
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
 <span className={`text-xs px-2 py-0.5 rounded-full ${action.priority === 'عاجل' ? 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)]' : action.priority === 'مهم' ? 'bg-amber-100 text-[var(--warning)]' : 'bg-[var(--secondary)]/[0.1] text-[var(--secondary)]'}`}>
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
