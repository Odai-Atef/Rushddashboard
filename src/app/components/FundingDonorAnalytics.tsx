import { useState } from 'react';
import { Download, DollarSign, Users, Target, TrendingUp, MapPin, Tag } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const fundingSecuredData = [
  { month: 'يناير', secured: 1800000, target: 2500000 },
  { month: 'فبراير', secured: 2100000, target: 2500000 },
  { month: 'مارس', secured: 1950000, target: 2500000 },
  { month: 'أبريل', secured: 2300000, target: 2500000 },
  { month: 'مايو', secured: 2450000, target: 2500000 },
  { month: 'يونيو', secured: 2800000, target: 2500000 },
];

const donorGrowthData = [
  { month: 'يناير', donors: 3200, new: 145 },
  { month: 'فبراير', donors: 3345, new: 156 },
  { month: 'مارس', donors: 3490, new: 132 },
  { month: 'أبريل', donors: 3610, new: 167 },
  { month: 'مايو', donors: 3724, new: 178 },
  { month: 'يونيو', donors: 3847, new: 234 },
];

const opportunityConversion = [
  { month: 'يناير', rate: 61 },
  { month: 'فبراير', rate: 64 },
  { month: 'مارس', rate: 59 },
  { month: 'أبريل', rate: 67 },
  { month: 'مايو', rate: 70 },
  { month: 'يونيو', rate: 74 },
];

const fundingByCategory = [
  { name: 'التعليم', value: 3800000, color: '#6366f1' },
  { name: 'الصحة', value: 2900000, color: '#10b981' },
  { name: 'التنمية', value: 2100000, color: '#3b82f6' },
  { name: 'البيئة', value: 1600000, color: '#22c55e' },
  { name: 'الاقتصاد', value: 1200000, color: '#f59e0b' },
  { name: 'أخرى', value: 800000, color: '#94a3b8' },
];

const fundingByRegion = [
  { region: 'الرياض', amount: 4700000, projects: 34 },
  { region: 'جدة', amount: 2800000, projects: 21 },
  { region: 'الدمام', amount: 1900000, projects: 14 },
  { region: 'مكة المكرمة', amount: 1400000, projects: 11 },
  { region: 'المدينة المنورة', amount: 980000, projects: 7 },
  { region: 'مناطق أخرى', amount: 620000, projects: 2 },
];

const topDonors = [
  { name: 'جهه الملك عبدالعزيز', amount: '2.4M ر.س', projects: 12, type: 'مؤسسي' },
  { name: 'صندوق التنمية الاجتماعية', amount: '1.8M ر.س', projects: 9, type: 'حكومي' },
  { name: 'شركة أرامكو السعودية', amount: '1.5M ر.س', projects: 7, type: 'شركات' },
  { name: 'مجموعة MBC', amount: '980K ر.س', projects: 5, type: 'شركات' },
  { name: 'مانح خاص أ', amount: '750K ر.س', projects: 4, type: 'أفراد' },
];

function fmt(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export function FundingDonorAnalytics() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="p-6 space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground">تحليلات التمويل والجهات المانحة</h1>
          <p className="text-muted-foreground text-sm mt-1">التمويل المُحقَّق • نمو المانحين • معدلات التحويل • التوزيع الجغرافي</p>
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
          { label: 'إجمالي التمويل', value: '12.4M ر.س', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'إجمالي المانحين', value: '3,847', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { label: 'تحقيق الهدف', value: '74.3%', icon: Target, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
          { label: 'معدل التحويل', value: '74%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
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

      {/* Funding Secured vs Target */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">التمويل المُحقَّق مقابل الهدف (ر.س)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={fundingSecuredData}>
              <defs>
                <linearGradient id="securedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
              <Tooltip formatter={v => `${fmt(Number(v))} ر.س`} />
              <Legend />
              <Area type="monotone" dataKey="secured" name="التمويل المُحقَّق" stroke="#10b981" fill="url(#securedGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="target" name="الهدف" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">معدل تحويل الفرص</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={opportunityConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={[50, 80]} tick={{ fontSize: 10 }} unit="%" />
              <Tooltip formatter={v => `${v}%`} />
              <Line type="monotone" dataKey="rate" name="معدل التحويل" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900">
            <p className="text-xs text-indigo-700 dark:text-indigo-400">ارتفع المعدل +13% خلال 6 أشهر</p>
          </div>
        </div>
      </div>

      {/* Donor Growth & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">نمو المانحين</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={donorGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="left" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="donors" name="إجمالي المانحين" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="new" name="مانحون جدد" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-foreground">التمويل حسب القطاع</h2>
          </div>
          <div className="flex gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={fundingByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                  {fundingByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `${fmt(Number(v))} ر.س`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2 py-2">
              {fundingByCategory.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{fmt(item.value)}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">{item.name}</span>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional & Top Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-foreground">التمويل حسب المنطقة</h2>
          </div>
          <div className="space-y-3">
            {fundingByRegion.map((region, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="text-muted-foreground">{region.projects} مشروع</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{fmt(region.amount)} ر.س</span>
                    <span className="text-muted-foreground">{region.region}</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-blue-500 to-indigo-600 rounded-full" style={{ width: `${(region.amount / 4700000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">أبرز الجهات المانحة</h2>
          <div className="space-y-3">
            {topDonors.map((donor, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">{donor.amount}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600">{donor.type}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{donor.name}</p>
                  <p className="text-xs text-muted-foreground">{donor.projects} مشاريع</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
