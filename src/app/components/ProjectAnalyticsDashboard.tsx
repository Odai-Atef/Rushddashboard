import { useState } from 'react';
import { Download, Sparkles, GitBranch, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const statusData = [
  { name: 'مُنشَأة بالذكاء الاصطناعي', value: 1240, color: '#8b5cf6' },
  { name: 'قيد التحسين', value: 344, color: '#3b82f6' },
  { name: 'معتمدة', value: 412, color: '#10b981' },
  { name: 'جاهزة للتمويل', value: 198, color: '#f59e0b' },
  { name: 'مُقدَّمة', value: 156, color: '#6366f1' },
  { name: 'ممولة', value: 89, color: '#22c55e' },
  { name: 'معلّقة', value: 41, color: '#f87171' },
];

const pipelineMonthly = [
  { month: 'يناير', created: 180, improved: 140, approved: 65, funded: 12 },
  { month: 'فبراير', created: 195, improved: 152, approved: 70, funded: 14 },
  { month: 'مارس', created: 205, improved: 161, approved: 68, funded: 15 },
  { month: 'أبريل', created: 212, improved: 170, approved: 72, funded: 16 },
  { month: 'مايو', created: 220, improved: 178, approved: 76, funded: 16 },
  { month: 'يونيو', created: 228, improved: 182, approved: 80, funded: 16 },
];

const bottlenecks = [
  { stage: 'المراجعة الأولية', avgDays: 2.1, target: 2, overdue: 8 },
  { stage: 'تقييم الجودة', avgDays: 4.7, target: 3, overdue: 23 },
  { stage: 'اعتماد اللجنة', avgDays: 8.2, target: 5, overdue: 41 },
  { stage: 'مراجعة التمويل', avgDays: 6.1, target: 4, overdue: 19 },
  { stage: 'الاعتماد النهائي', avgDays: 3.4, target: 3, overdue: 6 },
];

const completionTrends = [
  { month: 'يناير', onTime: 48, delayed: 17 },
  { month: 'فبراير', onTime: 52, delayed: 14 },
  { month: 'مارس', onTime: 57, delayed: 11 },
  { month: 'أبريل', onTime: 61, delayed: 11 },
  { month: 'مايو', onTime: 65, delayed: 11 },
  { month: 'يونيو', onTime: 68, delayed: 12 },
];

const aiMetrics = [
  { month: 'يناير', generated: 180, accepted: 142, improved: 98 },
  { month: 'فبراير', generated: 195, accepted: 158, improved: 112 },
  { month: 'مارس', generated: 205, accepted: 169, improved: 124 },
  { month: 'أبريل', generated: 212, accepted: 176, improved: 131 },
  { month: 'مايو', generated: 220, accepted: 184, improved: 139 },
  { month: 'يونيو', generated: 228, accepted: 192, improved: 146 },
];

const sectorBreakdown = [
  { name: 'التعليم', value: 312, color: '#6366f1' },
  { name: 'الصحة', value: 247, color: '#10b981' },
  { name: 'التنمية الاجتماعية', value: 198, color: '#3b82f6' },
  { name: 'البيئة', value: 156, color: '#22c55e' },
  { name: 'الاقتصاد', value: 134, color: '#f59e0b' },
  { name: 'أخرى', value: 193, color: '#94a3b8' },
];

export function ProjectAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="p-6 space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground">تحليلات المشاريع</h1>
          <p className="text-muted-foreground text-sm mt-1">مسار المشاريع • نقاط الاختناق • مقاييس الذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground">
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="1year">آخر سنة</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            <Download className="w-4 h-4" /> تصدير
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المشاريع', value: '2,480', icon: GitBranch, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
          { label: 'معدل الاعتماد', value: '33.2%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'متوسط زمن الاعتماد', value: '11 يوم', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { label: 'مشاريع متأخرة', value: '41', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/40' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-xl border border-border p-4 ${card.bg}`}>
              <div className="p-2 rounded-lg bg-background/60 w-fit mb-2">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-2xl ${card.color}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Status & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects by Status */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">المشاريع حسب الحالة</h2>
          <div className="space-y-3">
            {statusData.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{item.value}</span>
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(item.value / 1240) * 100}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Monthly */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">مسار المشاريع الشهري</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pipelineMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="created" name="منشأة" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="improved" name="محسّنة" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="approved" name="معتمدة" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="funded" name="ممولة" fill="#22c55e" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottlenecks */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">نقاط الاختناق في الاعتماد</h2>
          <span className="text-xs text-muted-foreground">الهدف vs الفعلي (بالأيام)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-2 text-muted-foreground">المرحلة</th>
                <th className="text-center py-2 text-muted-foreground">الهدف</th>
                <th className="text-center py-2 text-muted-foreground">الفعلي</th>
                <th className="text-center py-2 text-muted-foreground">متأخر</th>
                <th className="text-right py-2 text-muted-foreground">الأداء</th>
              </tr>
            </thead>
            <tbody>
              {bottlenecks.map((b, i) => {
                const isOver = b.avgDays > b.target;
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 text-foreground">{b.stage}</td>
                    <td className="py-3 text-center text-muted-foreground">{b.target} أيام</td>
                    <td className={`py-3 text-center ${isOver ? 'text-red-500' : 'text-emerald-600'}`}>{b.avgDays} أيام</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${b.overdue > 20 ? 'bg-red-100 text-red-600 dark:bg-red-950/40' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/40'}`}>{b.overdue}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isOver ? 'bg-red-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min((b.target / b.avgDays) * 100, 100)}%` }} />
                        </div>
                        {isOver ? <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> : <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion Trends & AI Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">اتجاهات اكتمال المشاريع</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={completionTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" name="في الموعد" stackId="a" fill="#10b981" />
              <Bar dataKey="delayed" name="متأخر" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <h2 className="text-foreground">مقاييس مشاريع الذكاء الاصطناعي</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aiMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="generated" name="منشأة" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="accepted" name="مقبولة" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="improved" name="محسّنة" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Breakdown */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-foreground mb-4">المشاريع حسب القطاع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sectorBreakdown.map((sector, i) => (
            <div key={i} className="text-center p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors">
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${sector.color}20` }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
              </div>
              <p className="text-xl text-foreground">{sector.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sector.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
