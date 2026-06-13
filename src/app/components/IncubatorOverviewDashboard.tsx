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
  { title: 'الجمعيات المسجلة', value: '247', change: '+18', isPositive: true, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-100 dark:border-blue-900' },
  { title: 'الجمعيات المؤهلة', value: '183', change: '+12', isPositive: true, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-100 dark:border-emerald-900' },
  { title: 'غير المؤهلة', value: '64', change: '-4', isPositive: false, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/40', border: 'border-red-100 dark:border-red-900' },
  { title: 'مشاريع الذكاء الاصطناعي', value: '1,240', change: '+89', isPositive: true, icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-100 dark:border-violet-900' },
  { title: 'المشاريع المحسّنة', value: '896', change: '+67', isPositive: true, icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/40', border: 'border-sky-100 dark:border-sky-900' },
  { title: 'المشاريع المعتمدة', value: '412', change: '+34', isPositive: true, icon: ThumbsUp, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/40', border: 'border-teal-100 dark:border-teal-900' },
  { title: 'جاهزة للتمويل', value: '198', change: '+21', isPositive: true, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-100 dark:border-amber-900' },
  { title: 'مشاريع مُقدَّمة', value: '156', change: '+18', isPositive: true, icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-100 dark:border-indigo-900' },
  { title: 'مشاريع ممولة', value: '89', change: '+11', isPositive: true, icon: Handshake, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/40', border: 'border-green-100 dark:border-green-900' },
  { title: 'إجمالي المانحين', value: '3,847', change: '+234', isPositive: true, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/40', border: 'border-pink-100 dark:border-pink-900' },
  { title: 'فرص التمويل المفتوحة', value: '67', change: '+8', isPositive: true, icon: Target, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-orange-100 dark:border-orange-900' },
  { title: 'الفرص الفائتة', value: '23', change: '+3', isPositive: false, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-100 dark:border-rose-900' },
  { title: 'إجمالي التمويل المُحقَّق', value: '12.4M ر.س', change: '+18.7%', isPositive: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-100 dark:border-emerald-900' },
  { title: 'نسبة تحقيق الهدف', value: '74.3%', change: '+5.2%', isPositive: true, icon: Percent, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/40', border: 'border-cyan-100 dark:border-cyan-900' },
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
  { id: 1, type: 'charity', text: 'انضمت جمعية الأمل للتنمية إلى المنصة', time: 'منذ 14 دقيقة', icon: Building2, color: 'text-blue-500' },
  { id: 2, type: 'project', text: 'تمت الموافقة على مشروع التعليم المجتمعي', time: 'منذ 32 دقيقة', icon: ThumbsUp, color: 'text-emerald-500' },
  { id: 3, type: 'funding', text: 'تمويل جديد بقيمة 850,000 ر.س لمشروع الصحة', time: 'منذ ساعة', icon: DollarSign, color: 'text-green-500' },
  { id: 4, type: 'ai', text: 'الذكاء الاصطناعي أنشأ 12 مشروعاً مقترحاً', time: 'منذ 2 ساعة', icon: Sparkles, color: 'text-violet-500' },
  { id: 5, type: 'donor', text: 'انضم 18 مانحاً جديداً هذا الأسبوع', time: 'منذ 3 ساعات', icon: Users, color: 'text-pink-500' },
];

const alerts = [
  { id: 1, level: 'high', title: 'فرص تمويل تنتهي قريباً', desc: '7 فرص تمويل ستنتهي خلال 48 ساعة', color: 'border-red-300 bg-red-50 dark:bg-red-950/30' },
  { id: 2, level: 'medium', title: 'جمعيات تحتاج متابعة', desc: '23 جمعية لم تستكمل خطة التطوير منذ 30 يومًا', color: 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' },
  { id: 3, level: 'low', title: 'مشاريع معلّقة في الاعتماد', desc: '14 مشروعاً ينتظر الاعتماد أكثر من 7 أيام', color: 'border-blue-300 bg-blue-50 dark:bg-blue-950/30' },
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
    <div className="p-6 space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground">لوحة القيادة التنفيذية الشاملة</h1>
          <p className="text-muted-foreground mt-1 text-sm">نظرة 360° على أداء الحاضنة • آخر تحديث: الآن</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
          >
            <option value="1month">آخر شهر</option>
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="1year">آخر سنة</option>
          </select>
          <button onClick={() => handleExport('excel')} className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-accent text-foreground transition-colors">
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`rounded-xl border p-4 ${kpi.bg} ${kpi.border} transition-shadow hover:shadow-md`}>
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg bg-background/60`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs ${kpi.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className={`text-xl ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">{kpi.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">اتجاهات النمو</h2>
            <span className="text-xs text-muted-foreground">آخر 6 أشهر</span>
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
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">مسار المؤسسات</h2>
          <div className="space-y-3">
            {pipelineData.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="text-foreground">{item.value}</span>
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
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
            <p className="text-xs text-emerald-700 dark:text-emerald-400">معدل التحويل الكلي: <span className="font-semibold">36%</span></p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">النشاط الأخير</h2>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              عرض الكل <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-muted flex-shrink-0">
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">التنبيهات</h2>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border ${alert.color}`}>
                <p className="text-sm text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">رؤى سريعة</h2>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${insight.positive === true ? 'bg-emerald-500' : insight.positive === false ? 'bg-red-500' : 'bg-blue-500'}`} />
                <p className="text-sm text-foreground leading-snug">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
