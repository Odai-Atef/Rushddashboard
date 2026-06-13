import { useState } from 'react';
import { Download, TrendingUp, Target, Users, ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, FunnelChart, Funnel, LabelList,
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const successRateData = [
  { month: 'يناير', rate: 38, applications: 8 },
  { month: 'فبراير', rate: 42, applications: 12 },
  { month: 'مارس', rate: 45, applications: 15 },
  { month: 'أبريل', rate: 51, applications: 19 },
  { month: 'مايو', rate: 55, applications: 23 },
  { month: 'يونيو', rate: 62, applications: 28 },
];

const topCategories = [
  { name: 'التعليم', value: 34, color: '#6366f1' },
  { name: 'الصحة', value: 22, color: '#10b981' },
  { name: 'التنمية الاجتماعية', value: 18, color: '#3b82f6' },
  { name: 'البيئة', value: 14, color: '#22c55e' },
  { name: 'الاقتصاد', value: 12, color: '#f59e0b' },
];

const mostMatchedDonors = [
  { name: 'صندوق الملك عبدالعزيز', matches: 47, success: 89 },
  { name: 'مؤسسة أرامكو', matches: 38, success: 76 },
  { name: 'صندوق تنمية المجتمع', matches: 31, success: 68 },
  { name: 'مؤسسة الوليد', matches: 24, success: 71 },
  { name: 'هيئة الهلال الأحمر', matches: 18, success: 55 },
];

const opportunityTrends = [
  { month: 'يناير', open: 48, closing: 12, closed: 22 },
  { month: 'فبراير', open: 52, closing: 14, closed: 19 },
  { month: 'مارس', open: 58, closing: 11, closed: 25 },
  { month: 'أبريل', open: 61, closing: 15, closed: 21 },
  { month: 'مايو', open: 64, closing: 13, closed: 27 },
  { month: 'يونيو', open: 67, closing: 17, closed: 24 },
];

const funnelData = [
  { name: 'جهات مانحة محللة', value: 247, fill: '#6366f1' },
  { name: 'تطابق أولي (≥50%)', value: 89, fill: '#3b82f6' },
  { name: 'تطابق عالي (≥80%)', value: 28, fill: '#10b981' },
  { name: 'طلبات مُقدَّمة', value: 13, fill: '#f59e0b' },
  { name: 'تمويل مُعتمد', value: 5, fill: '#22c55e' },
];

const scoreDistribution = [
  { range: '90-100%', count: 9 },
  { range: '80-89%', count: 19 },
  { range: '70-79%', count: 31 },
  { range: '60-69%', count: 44 },
  { range: '50-59%', count: 58 },
  { range: '<50%', count: 86 },
];

export function MatchingAnalytics() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90">
          <Download className="w-4 h-4" /> تصدير التقرير
        </button>
        <div className="flex items-center gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground">
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="1year">آخر سنة</option>
          </select>
          <h2 className="text-foreground">تحليلات التطابق</h2>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'معدل نجاح التطابق', value: '62%', change: '+24%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'إجمالي التطابقات', value: '247', change: '+89', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
          { label: 'فرص مفتوحة الآن', value: '67', change: '+8', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { label: 'معدل التحويل', value: '38.4%', change: '+12%', icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-xl border border-border p-4 ${card.bg}`}>
              <div className="p-2 rounded-lg bg-background/60 w-fit mb-2">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-2xl ${card.color}`}>{card.value}</p>
              <p className="text-xs text-foreground mt-0.5">{card.label}</p>
              <p className="text-xs text-emerald-600 mt-1">{card.change} vs الفترة السابقة</p>
            </div>
          );
        })}
      </div>

      {/* Success Rate Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4 text-right">اتجاه معدل النجاح</h3>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={successRateData}>
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} unit="%" domain={[30, 70]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="rate" name="معدل النجاح %" stroke="#10b981" fill="url(#rateGrad)" strokeWidth={2.5} />
              <Bar yAxisId="right" dataKey="applications" name="عدد التطابقات" fill="#6366f115" stroke="#6366f1" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories Pie */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-3 text-right">أعلى فئات التمويل</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={topCategories} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                {topCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {topCategories.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-foreground">{cat.value}%</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">{cat.name}</span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Matched Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4 text-right">أكثر الجهات المانحة تطابقاً</h3>
          <div className="space-y-3">
            {mostMatchedDonors.map((donor, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-left w-16 flex-shrink-0">
                  <span className="text-xs text-emerald-600">{donor.success}%</span>
                  <p className="text-xs text-muted-foreground">نجاح</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{donor.matches} تطابق</span>
                    <span className="text-sm text-foreground">{donor.name}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-indigo-500 to-violet-600 rounded-full" style={{ width: `${(donor.matches / 47) * 100}%` }} />
                  </div>
                </div>
                <span className="text-lg text-muted-foreground/50 w-6 text-center">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4 text-right">توزيع درجات التطابق</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="range" type="category" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={v => `${v} جهة`} />
              <Bar dataKey="count" name="عدد الجهات" radius={[0, 4, 4, 0]}>
                {scoreDistribution.map((entry, i) => (
                  <Cell key={i} fill={i === 0 ? '#10b981' : i === 1 ? '#6366f1' : i === 2 ? '#3b82f6' : i === 3 ? '#f59e0b' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Opportunity Trends */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-foreground mb-4 text-right">اتجاهات فرص التمويل</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={opportunityTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="open" name="مفتوحة" stackId="a" fill="#10b981" />
            <Bar dataKey="closing" name="تنتهي قريباً" stackId="a" fill="#f59e0b" />
            <Bar dataKey="closed" name="منتهية" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-foreground mb-5 text-right">قمع التحويل من التحليل إلى التمويل</h3>
        <div className="space-y-3">
          {funnelData.map((step, i) => {
            const pct = Math.round((step.value / funnelData[0].value) * 100);
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="text-left w-16 flex-shrink-0">
                  <span className="text-sm text-foreground">{step.value}</span>
                  <p className="text-xs text-muted-foreground">{pct}%</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-8 rounded-lg transition-all" style={{ width: `${pct}%`, backgroundColor: step.fill, minWidth: '60px' }} />
                  </div>
                </div>
                <span className="text-sm text-foreground text-right w-36 flex-shrink-0">{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
