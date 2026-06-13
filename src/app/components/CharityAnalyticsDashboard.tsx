import { useState } from 'react';
import { Download, TrendingUp, Award, Users, BarChart3, Star, HeartHandshake } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const charityGrowthData = [
  { month: 'يناير', registered: 210, qualified: 152, nonQualified: 58 },
  { month: 'فبراير', registered: 218, qualified: 159, nonQualified: 59 },
  { month: 'مارس', registered: 225, qualified: 165, nonQualified: 60 },
  { month: 'أبريل', registered: 231, qualified: 170, nonQualified: 61 },
  { month: 'مايو', registered: 239, qualified: 176, nonQualified: 63 },
  { month: 'يونيو', registered: 247, qualified: 183, nonQualified: 64 },
];

const qualifiedData = [
  { name: 'مؤهلة', value: 183, color: '#10b981' },
  { name: 'غير مؤهلة', value: 64, color: '#f87171' },
];

const assessmentResults = [
  { criterion: 'الحوكمة', score: 78 },
  { criterion: 'الكفاءة المالية', score: 65 },
  { criterion: 'الكفاءة التشغيلية', score: 71 },
  { criterion: 'التأثير المجتمعي', score: 82 },
  { criterion: 'الشفافية', score: 69 },
  { criterion: 'الاستدامة', score: 74 },
];

const developmentPlans = [
  { name: 'جمعية الأمل', progress: 92, status: 'ممتاز' },
  { name: 'مؤسسة التنمية', progress: 78, status: 'جيد' },
  { name: 'جمعية الرواد', progress: 61, status: 'متوسط' },
  { name: 'مؤسسة البناء', progress: 45, status: 'يحتاج دعم' },
  { name: 'جمعية المستقبل', progress: 88, status: 'ممتاز' },
  { name: 'مؤسسة الريادة', progress: 55, status: 'متوسط' },
];

const engagementData = [
  { month: 'يناير', high: 45, medium: 98, low: 67 },
  { month: 'فبراير', high: 52, medium: 102, low: 64 },
  { month: 'مارس', high: 58, medium: 108, low: 59 },
  { month: 'أبريل', high: 64, medium: 110, low: 57 },
  { month: 'مايو', high: 71, medium: 113, low: 55 },
  { month: 'يونيو', high: 79, medium: 116, low: 52 },
];

const satisfactionData = [
  { category: 'دعم المنصة', score: 4.3 },
  { category: 'جودة البرامج', score: 4.1 },
  { category: 'استجابة الفريق', score: 3.8 },
  { category: 'نتائج المشاريع', score: 4.0 },
  { category: 'التمويل المتاح', score: 3.6 },
];

const COLORS = ['#10b981', '#f87171'];

function ProgressBar({ value, color = 'bg-primary' }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function statusColor(status: string) {
  if (status === 'ممتاز') return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40';
  if (status === 'جيد') return 'text-blue-600 bg-blue-50 dark:bg-blue-950/40';
  if (status === 'متوسط') return 'text-amber-600 bg-amber-50 dark:bg-amber-950/40';
  return 'text-red-500 bg-red-50 dark:bg-red-950/40';
}

function progressColor(v: number) {
  if (v >= 80) return 'bg-emerald-500';
  if (v >= 60) return 'bg-blue-500';
  if (v >= 40) return 'bg-amber-500';
  return 'bg-red-400';
}

export function CharityAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="p-6 space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground">تحليلات الجمعيات</h1>
          <p className="text-muted-foreground text-sm mt-1">نمو الجمعيات • التأهيل • التفاعل • الرضا</p>
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
          { label: 'إجمالي الجمعيات', value: '247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { label: 'معدل التأهيل', value: '74.1%', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'متوسط التفاعل', value: '68%', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
          { label: 'متوسط الرضا', value: '4.0/5', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-xl border border-border p-4 ${card.bg}`}>
              <div className={`p-2 rounded-lg bg-background/60 w-fit mb-2`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-2xl ${card.color}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Growth & Qualified vs Non-Qualified */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">نمو الجمعيات</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={charityGrowthData}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="registered" name="المسجلة" stroke="#6366f1" fill="url(#regGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="qualified" name="المؤهلة" stroke="#10b981" fill="url(#qualGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center">
          <h2 className="text-foreground mb-4 w-full">مؤهلة مقابل غير مؤهلة</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={qualifiedData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {qualifiedData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {qualifiedData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment & Development Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">نتائج تقييم الجاهزية</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assessmentResults} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="criterion" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="score" name="النتيجة" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">تقدم خطط التطوير</h2>
          <div className="space-y-4">
            {developmentPlans.map((plan, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(plan.status)}`}>{plan.status}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{plan.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{plan.progress}%</span>
                  <div className="flex-1">
                    <ProgressBar value={plan.progress} color={progressColor(plan.progress)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement & Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">مستويات تفاعل الجمعيات</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="high" name="تفاعل عالي" stackId="a" fill="#10b981" />
              <Bar dataKey="medium" name="تفاعل متوسط" stackId="a" fill="#6366f1" />
              <Bar dataKey="low" name="تفاعل منخفض" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-foreground mb-4">رضا الجمعيات</h2>
          <div className="space-y-4 mt-2">
            {satisfactionData.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= Math.round(item.score) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                    ))}
                    <span className="text-sm text-muted-foreground mr-1">{item.score}</span>
                  </div>
                  <span className="text-sm text-foreground">{item.category}</span>
                </div>
                <ProgressBar value={(item.score / 5) * 100} color="bg-amber-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
