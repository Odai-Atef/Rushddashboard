import { useState } from 'react';
import {
 Building2, CheckCircle, XCircle, Sparkles, TrendingUp, ThumbsUp,
 Wallet, Send, Handshake, Users, Target, AlertCircle, DollarSign,
 Percent, ArrowUpRight, ArrowDownRight, Bell, Download, Calendar,
 RefreshCw, Filter, ChevronRight, Clock, Zap
} from 'lucide-react';
import {
 LineChart, Line, AreaChart, Area, BarChart, Bar,
 XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const kpis = [
 { title: 'الجمعيات المسجلة', value: '247', change: '+18', isPositive: true, icon: Building2, color: 'text-[var(--secondary)]', bg: 'bg-muted/[0.08]', border: 'border-[var(--secondary)]/[0.2]' },
 { title: 'الجمعيات المؤهلة', value: '183', change: '+12', isPositive: true, icon: CheckCircle, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/[0.08]', border: 'border-[var(--primary)]/[0.2]' },
 { title: 'غير المؤهلة', value: '64', change: '-4', isPositive: false, icon: XCircle, color: 'text-red-500', bg: 'bg-[var(--destructive)]/[0.08]', border: 'border-[var(--destructive)]/[0.2]' },
 { title: 'مشاريع الذكاء الاصطناعي', value: '1,240', change: '+89', isPositive: true, icon: Sparkles, color: 'text-[var(--secondary)]', bg: 'bg-muted/[0.08]', border: 'border-[var(--secondary)]/[0.2]' },
 { title: 'المشاريع المحسّنة', value: '896', change: '+67', isPositive: true, icon: TrendingUp, color: 'text-[var(--secondary)]', bg: 'bg-muted/[0.1]', border: 'border-[var(--secondary)]/[0.2]' },
 { title: 'المشاريع المعتمدة', value: '412', change: '+34', isPositive: true, icon: ThumbsUp, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/[0.1]', border: 'border-[var(--primary)]/[0.2]' },
 { title: 'جاهزة للتمويل', value: '198', change: '+21', isPositive: true, icon: Wallet, color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/[0.08]', border: 'border-[var(--warning)]/[0.2]' },
 { title: 'مشاريع مُقدَّمة', value: '156', change: '+18', isPositive: true, icon: Send, color: 'text-indigo-600', bg: 'bg-muted/[0.08]', border: 'border-[var(--secondary)]/[0.2]' },
 { title: 'مشاريع ممولة', value: '89', change: '+11', isPositive: true, icon: Handshake, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/[0.08]', border: 'border-green-100' },
 { title: 'إجمالي المانحين', value: '3,847', change: '+234', isPositive: true, icon: Users, color: 'text-[var(--destructive)]', bg: 'bg-[var(--destructive)]/[0.1]', border: 'border-[var(--destructive)]/[0.2]' },
 { title: 'فرص التمويل المفتوحة', value: '67', change: '+8', isPositive: true, icon: Target, color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/[0.1]', border: 'border-[var(--warning)]/[0.2]' },
 { title: 'الفرص الفائتة', value: '23', change: '+3', isPositive: false, icon: AlertCircle, color: 'text-[var(--destructive)]', bg: 'bg-[var(--destructive)]/[0.1]', border: 'border-[var(--destructive)]/[0.2]' },
 { title: 'إجمالي التمويل المُحقَّق', value: '12.4M ر.س', change: '+18.7%', isPositive: true, icon: DollarSign, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/[0.08]', border: 'border-[var(--primary)]/[0.2]' },
 { title: 'نسبة تحقيق الهدف', value: '74.3%', change: '+5.2%', isPositive: true, icon: Percent, color: 'text-[var(--secondary)]', bg: 'bg-muted/[0.1]', border: 'border-[var(--secondary)]/[0.2]' },
];

const trendData = [
 { month: 'يناير', charities: 210, projects: 980, funding: 8200000 },
 { month: 'فبراير', charities: 218, projects: 1020, funding: 9100000 },
 { month: 'مارس', charities: 225, projects: 1080, funding: 9800000 },
 { month: 'أبريل', charities: 231, projects: 1130, funding: 10500000 },
 { month: 'مايو', charities: 239, projects: 1185, funding: 11200000 },
 { month: 'يونيو', charities: 247, projects: 1240, funding: 12400000 },
];

const pipelineData = [
 { name: 'مسجّلة', value: 247, color: '#6366f1' },
 { name: 'مؤهلة', value: 183, color: '#10b981' },
 { name: 'لها مشاريع', value: 142, color: '#3b82f6' },
 { name: 'مقدّمة للتمويل', value: 89, color: '#f59e0b' },
 { name: 'ممولة', value: 89, color: '#22c55e' },
];

const recentActivity = [
 { id: 1, type: 'charity', text: 'انضمت جمعية الأمل للتنمية إلى المنصة', time: 'منذ 14 دقيقة', icon: Building2, color: 'text-[var(--secondary)]' },
 { id: 2, type: 'project', text: 'تمت الموافقة على مشروع التعليم المجتمعي', time: 'منذ 32 دقيقة', icon: ThumbsUp, color: 'text-emerald-500' },
 { id: 3, type: 'funding', text: 'تمويل جديد بقيمة 850,000 ر.س لمشروع الصحة', time: 'منذ ساعة', icon: DollarSign, color: 'text-[var(--primary)]' },
 { id: 4, type: 'ai', text: 'الذكاء الاصطناعي أنشأ 12 مشروعاً مقترحاً', time: 'منذ 2 ساعة', icon: Sparkles, color: 'text-[var(--secondary)]' },
 { id: 5, type: 'donor', text: 'انضم 18 مانحاً جديداً هذا الأسبوع', time: 'منذ 3 ساعات', icon: Users, color: 'text-pink-500' },
];

const alerts = [
 { id: 1, level: 'high', title: 'فرص تمويل تنتهي قريباً', desc: '7 فرص تمويل ستنتهي خلال 48 ساعة', color: 'border-red-300 bg-[var(--destructive)]/[0.08]' },
 { id: 2, level: 'medium', title: 'جمعيات تحتاج متابعة', desc: '23 جمعية لم تستكمل خطة التطوير منذ 30 يومًا', color: 'border-amber-300 bg-[var(--warning)]/[0.08]' },
 { id: 3, level: 'low', title: 'مشاريع معلّقة في الاعتماد', desc: '14 مشروعاً ينتظر الاعتماد أكثر من 7 أيام', color: 'border-[var(--secondary)]/30 bg-muted/[0.08]' },
];

const insights = [
 { text: 'معدل تأهيل الجمعيات ارتفع إلى 74.1% — أعلى مستوى منذ التأسيس', positive: true },
 { text: 'منطقة الرياض تُسهم بـ 38% من إجمالي التمويل المُحقَّق', positive: true },
 { text: 'متوسط دورة اعتماد المشروع انخفض من 18 يوم إلى 11 يوم', positive: true },
 { text: 'قطاع التعليم يستحوذ على 31% من الفرص المفتوحة', positive: null },
];

export function IncubatorOverviewDashboard() {
 const [dateRange, setDateRange] = useState('6months');
 const [isExporting, setIsExporting] = useState(false);

 const handleExport = (type: 'pdf' | 'excel') => {
 setIsExporting(true);
 setTimeout(() => setIsExporting(false), 1500);
 };

 return (
 <div className="p-6 space-y-6 md:space-y-8 text-right" dir="rtl">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">لوحة القيادة التنفيذية الشاملة</h1>
 <p className="text-[var(--text-muted)] mt-1 text-sm">نظرة 360° على أداء الحاضنة • آخر تحديث: الآن</p>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)] flex-wrap">
 <select
 value={dateRange}
 onChange={e => setDateRange(e.target.value)}
 className="text-sm border border-[var(--border)] rounded-[var(--radius-card)] px-3 py-2 bg-[var(--card)] text-[var(--text-primary)]"
 >
 <option value="1month">آخر شهر</option>
 <option value="3months">آخر 3 أشهر</option>
 <option value="6months">آخر 6 أشهر</option>
 <option value="1year">آخر سنة</option>
 </select>
 <button onClick={() => handleExport('excel')} className="flex items-center gap-[var(--spacing-small-gap)] px-3 py-2 text-sm border border-[var(--border)] rounded-[var(--radius-card)] bg-[var(--background)] hover:bg-muted dark:hover:bg-muted text-[var(--text-primary)] transition-colors">
 <Download className="w-4 h-4" />
 Excel
 </button>
 <button onClick={() => handleExport('pdf')} className="flex items-center gap-[var(--spacing-small-gap)] px-3 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-card)] hover:opacity-90 transition-opacity">
 <Download className="w-4 h-4" />
 PDF
 </button>
 </div>
 </div>

 {/* KPI Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[var(--spacing-small-gap)]">
 {kpis.map((kpi, i) => {
 const Icon = kpi.icon;
 return (
 <div key={i} className={`rounded-[var(--radius-card)] border p-4 ${kpi.bg} ${kpi.border} transition-shadow hover:shadow-[var(--shadow-lg)]`}>
 <div className="flex items-start justify-between mb-2">
 <div className={`p-[var(--spacing-small-gap)] rounded-[var(--radius-card)] bg-[var(--background)]/60`}>
 <Icon className={`w-4 h-4 ${kpi.color}`} />
 </div>
 <span className={`flex items-center gap-0.5 text-xs ${kpi.isPositive ? 'text-[var(--primary)]' : 'text-red-500'}`}>
 {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
 {kpi.change}
 </span>
 </div>
 <p className={`text-xl ${kpi.color}`}>{kpi.value}</p>
 <p className="text-xs text-[var(--text-muted)] mt-1 leading-tight">{kpi.title}</p>
 </div>
 );
 })}
 </div>

 {/* Charts Row */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Trend Chart */}
 <div className="lg:col-span-2 u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center justify-between mb-[var(--spacing-section-gap)]">
 <h2 className="text-[var(--text-primary)]">اتجاهات النمو</h2>
 <span className="text-xs text-[var(--text-muted)]">آخر 6 أشهر</span>
 </div>
 <ResponsiveContainer width="100%" height={240}>
 <AreaChart data={trendData}>
 <defs>
 <linearGradient id="charityGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
 <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
 </linearGradient>
 <linearGradient id="projectGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
 <XAxis dataKey="month" tick={{ fontSize: 11 }} />
 <YAxis tick={{ fontSize: 11 }} />
 <Tooltip />
 <Legend />
 <Area type="monotone" dataKey="charities" name="الجمعيات" stroke="#6366f1" fill="url(#charityGrad)" strokeWidth={2} />
 <Area type="monotone" dataKey="projects" name="المشاريع" stroke="#10b981" fill="url(#projectGrad)" strokeWidth={2} />
 </AreaChart>
 </ResponsiveContainer>
 </div>

 {/* Pipeline Funnel */}
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <h2 className="text-[var(--text-primary)] mb-[var(--spacing-section-gap)]">مسار المؤسسات</h2>
 <div className="space-y-[var(--spacing-small-gap)]">
 {pipelineData.map((item, i) => (
 <div key={i}>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-[var(--text-muted)]">{item.name}</span>
 <span className="text-[var(--text-primary)]">{item.value}</span>
 </div>
 <div className="h-2 bg-muted rounded-full overflow-hidden">
 <div
 className="h-full rounded-full transition-all"
 style={{ width: `${(item.value / 247) * 100}%`, backgroundColor: item.color }}
 />
 </div>
 </div>
 ))}
 </div>
 <div className="mt-4 p-[var(--spacing-card-padding)] bg-[var(--primary)]/[0.08] rounded-[var(--radius-card)] border border-[var(--primary)]/[0.2]">
 <p className="text-xs text-[var(--primary)]">معدل التحويل الكلي: <span className="font-semibold">36%</span></p>
 </div>
 </div>
 </div>

 {/* Bottom Row */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Recent Activity */}
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center justify-between mb-[var(--spacing-section-gap)]">
 <h2 className="text-[var(--text-primary)]">النشاط الأخير</h2>
 <button className="text-xs text-[var(--primary)] hover:underline flex items-center gap-[var(--spacing-small-gap)]">
 عرض الكل <ChevronRight className="w-3 h-3" />
 </button>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 {recentActivity.map(item => {
 const Icon = item.icon;
 return (
 <div key={item.id} className="flex items-start gap-[var(--spacing-small-gap)]">
 <div className="p-[var(--spacing-small-gap)].5 rounded-[var(--radius-card)] bg-muted flex-shrink-0">
 <Icon className={`w-3.5 h-3.5 ${item.color}`} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm text-[var(--text-primary)] leading-snug">{item.text}</p>
 <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-[var(--spacing-small-gap)]">
 <Clock className="w-3 h-3" />{item.time}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Alerts */}
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center justify-between mb-[var(--spacing-section-gap)]">
 <h2 className="text-[var(--text-primary)]">التنبيهات</h2>
 <Bell className="w-4 h-4 text-[var(--text-muted)]" />
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 {alerts.map(alert => (
 <div key={alert.id} className={`p-[var(--spacing-card-padding)] rounded-[var(--radius-card)] border ${alert.color}`}>
 <p className="text-sm text-[var(--text-primary)]">{alert.title}</p>
 <p className="text-xs text-[var(--text-muted)] mt-1">{alert.desc}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Quick Insights */}
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center justify-between mb-[var(--spacing-section-gap)]">
 <h2 className="text-[var(--text-primary)]">رؤى سريعة</h2>
 <Zap className="w-4 h-4 text-[var(--warning)]" />
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 {insights.map((insight, i) => (
 <div key={i} className="flex items-start gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] rounded-[var(--radius-card)] bg-muted/50">
 <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${insight.positive === true ? 'bg-[var(--primary)]/[0.08]0' : insight.positive === false ? 'bg-[var(--destructive)]' : 'bg-[var(--primary)]'}`} />
 <p className="text-sm text-[var(--text-primary)] leading-snug">{insight.text}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}
