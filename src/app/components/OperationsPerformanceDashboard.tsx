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
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-4 md:p-5 shadow-[var(--shadow-card)] text-center">
 <div className={`text-3xl ${color}`}>{value}{unit}</div>
 <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
 <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
 <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${Math.min(value, 100)}%` }} />
 </div>
 </div>
 );
}

export function OperationsPerformanceDashboard() {
 const [dateRange, setDateRange] = useState('6months');

 return (
 <div className="p-6 space-y-6 md:space-y-8 text-right" dir="rtl">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">تحليلات التشغيل والأداء</h1>
 <p className="text-[var(--text-muted)] text-sm mt-1">أوقات الاستجابة • امتثال SLA • دورات المراجعة • صحة التعاون</p>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="text-sm border border-[var(--border)] rounded-[var(--radius-card)] px-3 py-2 bg-[var(--card)] text-[var(--text-primary)]">
 <option value="1month">آخر شهر</option>
 <option value="3months">آخر 3 أشهر</option>
 <option value="6months">آخر 6 أشهر</option>
 </select>
 <button className="flex items-center gap-[var(--spacing-small-gap)] px-3 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-card)] hover:opacity-90">
 <Download className="w-4 h-4" /> تصدير
 </button>
 </div>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
 {[
 { label: 'متوسط استجابة الفريق', value: '11.3', unit: ' ساعة', icon: Clock, color: 'text-[var(--secondary)]', bg: 'bg-[var(--secondary)]/[0.08]' },
 { label: 'متوسط استجابة الجمعيات', value: '22.7', unit: ' ساعة', icon: Users, color: 'text-indigo-600', bg: 'bg-[var(--secondary)]/[0.08]' },
 { label: 'امتثال SLA', value: '91', unit: '%', icon: Shield, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/[0.08]' },
 { label: 'متوسط دورات المراجعة', value: '2.4', unit: '', icon: RefreshCw, color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/[0.08]' },
 { label: 'درجة صحة التعاون', value: '80', unit: '/100', icon: Activity, color: 'text-[var(--secondary)]', bg: 'bg-[var(--secondary)]/[0.08]' },
 ].map((card, i) => {
 const Icon = card.icon;
 return (
 <div key={i} className={`rounded-[var(--radius-card)] border border-[var(--border)] p-4 ${card.bg}`}>
 <div className="p-[var(--spacing-small-gap)] rounded-[var(--radius-card)] bg-[var(--background)]/60 w-fit mb-2">
 <Icon className={`w-5 h-5 ${card.color}`} />
 </div>
 <p className={`text-xl ${card.color}`}>{card.value}<span className="text-sm">{card.unit}</span></p>
 <p className="text-xs text-[var(--text-muted)] mt-1">{card.label}</p>
 </div>
 );
 })}
 </div>

 {/* Response Times & SLA */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <h2 className="text-[var(--text-primary)] mb-[var(--spacing-section-gap)]">أوقات الاستجابة (ساعات)</h2>
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

 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <h2 className="text-[var(--text-primary)] mb-[var(--spacing-section-gap)]">امتثال SLA</h2>
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
 <div className="mt-2 p-[var(--spacing-small-gap)] bg-[var(--primary)]/[0.08] rounded-[var(--radius-card)] border border-[var(--primary)]/[0.2]">
 <p className="text-xs text-[var(--primary)]">تحسّن +15% منذ يناير</p>
 </div>
 </div>
 </div>

 {/* SLA by Category */}
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center justify-between mb-[var(--spacing-section-gap)]">
 <h2 className="text-[var(--text-primary)]">امتثال SLA حسب الفئة</h2>
 <span className="text-xs text-[var(--text-muted)]">الوقت بالساعات</span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-[var(--border)]">
 <th className="text-right py-2 text-[var(--text-muted)]">الفئة</th>
 <th className="text-center py-2 text-[var(--text-muted)]">SLA المتفق</th>
 <th className="text-center py-2 text-[var(--text-muted)]">الفعلي</th>
 <th className="text-right py-2 text-[var(--text-muted)]">الحالة</th>
 </tr>
 </thead>
 <tbody>
 {slaByCategory.map((row, i) => (
 <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--hover)] dark:hover:bg-muted/50">
 <td className="py-3 text-[var(--text-primary)]">{row.name}</td>
 <td className="py-3 text-center text-[var(--text-muted)]">{row.sla} ساعة</td>
 <td className={`py-3 text-center ${row.status === 'breach' ? 'text-[var(--destructive)]' : 'text-[var(--primary)]'}`}>{row.actual} ساعة</td>
 <td className="py-3">
 <span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'breach' ? 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)]' : 'bg-[var(--primary)]/[0.1] text-[var(--primary)]'}`}>
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
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-[var(--spacing-section-gap)]">
 <RefreshCw className="w-4 h-4 text-[var(--text-muted)]" />
 <h2 className="text-[var(--text-primary)]">دورات المراجعة</h2>
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

 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-[var(--spacing-section-gap)]">
 <Activity className="w-4 h-4 text-[var(--text-muted)]" />
 <h2 className="text-[var(--text-primary)]">درجة صحة التعاون</h2>
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

 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <h2 className="text-[var(--text-primary)] mb-[var(--spacing-section-gap)]">النشاط الأسبوعي</h2>
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
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-[var(--spacing-card-padding)]">
 <Gauge className="w-4 h-4 text-[var(--text-muted)]" />
 <h2 className="text-[var(--text-primary)]">مقاييس الكفاءة التشغيلية</h2>
 </div>
 <div className="space-y-4">
 {efficiencyMetrics.map((m, i) => {
 const pct = m.unit === '/5' ? (m.current / 5) * 100 : m.current;
 const targetPct = m.unit === '/5' ? (m.target / 5) * 100 : m.target;
 const isGood = m.current >= m.target * 0.95;
 return (
 <div key={i} className="flex items-center gap-4">
 <div className="w-32 text-sm text-[var(--text-primary)] text-right flex-shrink-0">{m.metric}</div>
 <div className="flex-1 relative">
 <div className="h-3 bg-muted rounded-full overflow-hidden">
 <div className={`h-full rounded-full ${isGood ? 'bg-[var(--primary)]/[0.08]0' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
 </div>
 <div className="absolute top-0 h-3 w-0.5 bg-foreground/30" style={{ left: `${targetPct}%` }} />
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)] text-sm flex-shrink-0">
 <span className={isGood ? 'text-[var(--primary)]' : 'text-[var(--warning)]'}>{m.current}{m.unit}</span>
 <span className="text-[var(--text-muted)] text-xs">/ {m.target}{m.unit}</span>
 </div>
 </div>
 );
 })}
 </div>
 <p className="text-xs text-[var(--text-muted)] mt-3">الخط الرأسي يمثل الهدف المستهدف</p>
 </div>
 </div>
 );
}
