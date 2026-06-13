import { useState } from 'react';
import { Download, Clock, Users, Shield, RefreshCw, Activity, Gauge } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const responseTimeData = [
  { month: 'يناير', team: 18.2, charity: 32.5 },
  { month: 'فبراير', team: 16.8, charity: 30.1 },
  { month: 'مارس', team: 15.4, charity: 28.6 },
  { month: 'أبريل', team: 14.1, charity: 26.4 },
  { month: 'مايو', team: 12.7, charity: 24.8 },
  { month: 'يونيو', team: 11.3, charity: 22.7 },
];

const slaData = [
  { month: 'يناير', compliance: 76 },
  { month: 'فبراير', compliance: 79 },
  { month: 'مارس', compliance: 82 },
  { month: 'أبريل', compliance: 85 },
  { month: 'مايو', compliance: 87 },
  { month: 'يونيو', compliance: 91 },
];

const revisionCycles = [
  { month: 'يناير', avg: 3.8, max: 7 },
  { month: 'فبراير', avg: 3.5, max: 6 },
  { month: 'مارس', avg: 3.2, max: 6 },
  { month: 'أبريل', avg: 2.9, max: 5 },
  { month: 'مايو', avg: 2.7, max: 5 },
  { month: 'يونيو', avg: 2.4, max: 4 },
];

const collaborationHealth = [
  { subject: 'التواصل', score: 82 },
  { subject: 'التسليم في الوقت', score: 76 },
  { subject: 'جودة المخرجات', score: 88 },
  { subject: 'رضا الفريق', score: 79 },
  { subject: 'تعاون الجمعيات', score: 71 },
  { subject: 'الكفاءة التشغيلية', score: 84 },
];

const efficiencyMetrics = [
  { metric: 'معالجة الطلبات', current: 89, target: 90, unit: '%' },
  { metric: 'دقة البيانات', current: 96, target: 98, unit: '%' },
  { metric: 'رضا المستخدمين', current: 4.1, target: 4.5, unit: '/5' },
  { metric: 'وقت التشغيل', current: 99.2, target: 99.9, unit: '%' },
  { metric: 'معدل إنجاز المهام', current: 87, target: 95, unit: '%' },
];

const slaByCategory = [
  { name: 'اعتماد المشاريع', sla: 5, actual: 4.2, status: 'ok' },
  { name: 'الرد على الجمعيات', sla: 24, actual: 22.7, status: 'ok' },
  { name: 'مراجعة التقارير', sla: 72, actual: 68, status: 'ok' },
  { name: 'تقييم الجاهزية', sla: 48, actual: 51.3, status: 'breach' },
  { name: 'إصدار التقارير', sla: 7, actual: 8.1, status: 'breach' },
];

const weeklyActivity = [
  { day: 'الأحد', tasks: 42, resolved: 38 },
  { day: 'الاثنين', tasks: 68, resolved: 62 },
  { day: 'الثلاثاء', tasks: 71, resolved: 65 },
  { day: 'الأربعاء', tasks: 59, resolved: 55 },
  { day: 'الخميس', tasks: 63, resolved: 58 },
  { day: 'الجمعة', tasks: 28, resolved: 27 },
  { day: 'السبت', tasks: 18, resolved: 17 },
];

function GaugeCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className={`text-3xl ${color}`}>{value}{unit}</div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export function OperationsPerformanceDashboard() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="p-6 space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground">تحليلات التشغيل والأداء</h1>
          <p className="text-muted-foreground text-sm mt-1">أوقات الاستجابة • امتثال SLA • دورات المراجعة • صحة التعاون</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground">
            <option value="1month">آخر شهر</option>
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            <Download className="w-4 h-4" /> تصدير
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'متوسط استجابة الفريق', value: '11.3', unit: ' ساعة', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { label: 'متوسط استجابة الجمعيات', value: '22.7', unit: ' ساعة', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
          { label: 'امتثال SLA', value: '91', unit: '%', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'متوسط دورات المراجعة', value: '2.4', unit: '', icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { label: 'درجة صحة التعاون', value: '80', unit: '/100', icon: Activity, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-xl border border-border p-4 ${card.bg}`}>
              <div className="p-2 rounded-lg bg-background/60 w-fit mb-2">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-xl ${card.color}`}>{card.value}<span className="text-sm">{card.unit}</span></p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Response Times & SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">أوقات الاستجابة (ساعات)</h2>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="team" name="استجابة الفريق" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="charity" name="استجابة الجمعيات" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">امتثال SLA</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={slaData}>
              <defs>
                <linearGradient id="slaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 10 }} unit="%" />
              <Tooltip formatter={v => `${v}%`} />
              <Area type="monotone" dataKey="compliance" name="الامتثال" stroke="#10b981" fill="url(#slaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
            <p className="text-xs text-emerald-700 dark:text-emerald-400">تحسّن +15% منذ يناير</p>
          </div>
        </div>
      </div>

      {/* SLA by Category */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">امتثال SLA حسب الفئة</h2>
          <span className="text-xs text-muted-foreground">الوقت بالساعات</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-2 text-muted-foreground">الفئة</th>
                <th className="text-center py-2 text-muted-foreground">SLA المتفق</th>
                <th className="text-center py-2 text-muted-foreground">الفعلي</th>
                <th className="text-right py-2 text-muted-foreground">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {slaByCategory.map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 text-foreground">{row.name}</td>
                  <td className="py-3 text-center text-muted-foreground">{row.sla} ساعة</td>
                  <td className={`py-3 text-center ${row.status === 'breach' ? 'text-red-500' : 'text-emerald-600'}`}>{row.actual} ساعة</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'breach' ? 'bg-red-100 text-red-600 dark:bg-red-950/40' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40'}`}>
                      {row.status === 'breach' ? 'خرق' : 'ملتزم'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revision Cycles, Collaboration Health, Weekly */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-foreground">دورات المراجعة</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revisionCycles}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avg" name="المتوسط" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="max" name="الأقصى" stroke="#f87171" strokeWidth={1.5} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-foreground">درجة صحة التعاون</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={collaborationHealth}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <Radar name="الدرجة" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip formatter={v => `${v}/100`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">النشاط الأسبوعي</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="tasks" name="المهام" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="resolved" name="منجزة" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-foreground">مقاييس الكفاءة التشغيلية</h2>
        </div>
        <div className="space-y-4">
          {efficiencyMetrics.map((m, i) => {
            const pct = m.unit === '/5' ? (m.current / 5) * 100 : m.current;
            const targetPct = m.unit === '/5' ? (m.target / 5) * 100 : m.target;
            const isGood = m.current >= m.target * 0.95;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 text-sm text-foreground text-right flex-shrink-0">{m.metric}</div>
                <div className="flex-1 relative">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="absolute top-0 h-3 w-0.5 bg-foreground/30" style={{ left: `${targetPct}%` }} />
                </div>
                <div className="flex items-center gap-1 text-sm flex-shrink-0">
                  <span className={isGood ? 'text-emerald-600' : 'text-amber-600'}>{m.current}{m.unit}</span>
                  <span className="text-muted-foreground text-xs">/ {m.target}{m.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">الخط الرأسي يمثل الهدف المستهدف</p>
      </div>
    </div>
  );
}
