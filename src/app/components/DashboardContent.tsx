import { ExecutiveDashboard } from './ExecutiveDashboard';
import { AIAnalysisPage } from './AIAnalysisPage';
import { SalesDashboard } from './SalesDashboard';
import { CustomersDashboard } from './CustomersDashboard';
import { ProfitabilityDashboard } from './ProfitabilityDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { HRDashboard } from './HRDashboard';
import { MarketingDashboard } from './MarketingDashboard';
import { RecommendationsDashboard } from './RecommendationsDashboard';
import { OpportunitiesDashboard } from './OpportunitiesDashboard';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardContentProps {
 activeView: string;
}

export function DashboardContent({ activeView }: DashboardContentProps) {
 // Render Executive Dashboard when executive view is active
 if (activeView === 'executive') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <ExecutiveDashboard />
 </div>
 );
 }

 // Render AI Analysis Page when ai-analysis view is active
 if (activeView === 'ai-analysis') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <AIAnalysisPage />
 </div>
 );
 }

 // Render Sales Dashboard when sales view is active
 if (activeView === 'sales') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <SalesDashboard />
 </div>
 );
 }

 // Render Customers Dashboard when customers view is active
 if (activeView === 'customers') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <CustomersDashboard />
 </div>
 );
 }

 // Render Profitability Dashboard when profitability view is active
 if (activeView === 'profitability') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <ProfitabilityDashboard />
 </div>
 );
 }

 // Render Operations Dashboard when operations view is active
 if (activeView === 'operations') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <OperationsDashboard />
 </div>
 );
 }

 // Render HR Dashboard when hr view is active
 if (activeView === 'hr') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <HRDashboard />
 </div>
 );
 }

 // Render Marketing Dashboard when marketing view is active
 if (activeView === 'marketing') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <MarketingDashboard />
 </div>
 );
 }

 // Render Recommendations Dashboard when recommendations view is active
 if (activeView === 'recommendations') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <RecommendationsDashboard />
 </div>
 );
 }

 // Render Opportunities Dashboard when opportunities view is active
 if (activeView === 'opportunities') {
 return (
 <div className="p-4 md:p-6 lg:p-8 bg-background">
 <OpportunitiesDashboard />
 </div>
 );
 }

 // Generic dashboard for other views
 const salesData = [
 { month: 'يناير', value: 4000 },
 { month: 'فبراير', value: 3000 },
 { month: 'مارس', value: 5000 },
 { month: 'أبريل', value: 4500 },
 { month: 'مايو', value: 6000 },
 { month: 'يونيو', value: 5500 },
 ];

 const getViewTitle = () => {
 const titles: Record<string, string> = {
 executive: 'لوحة القيادة التنفيذية',
 'ai-analysis': 'المحلل التنفيذي الذكي',
 sales: 'لوحة المبيعات',
 customers: 'لوحة العملاء',
 profitability: 'لوحة الربحية',
 operations: 'لوحة التشغيل',
 hr: 'لوحة الموارد البشرية',
 marketing: 'لوحة التسويق',
 recommendations: 'لوحة التوصيات',
 opportunities: 'لوحة الفرص',
 };
 return titles[activeView] || 'لوحة القيادة التنفيذية';
 };

 return (
 <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-background">
 {/* Header */}
 <div className="border-b border-border pb-6">
 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{getViewTitle()}</h2>
 <p className="text-muted-foreground text-base">نظرة شاملة على الأداء والمؤشرات الرئيسية</p>
 </div>

 {/* Stats Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
 <div className="flex items-start justify-between mb-5">
 <div className="p-3 rounded-xl bg-[var(--primary)]/[0.08]/[0.08]0/10">
 <TrendingUp className="w-6 h-6 text-[var(--primary)]" />
 </div>
 <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full text-[var(--primary)] bg-[var(--primary)]/[0.1]">
 <ArrowUpRight className="w-3.5 h-3.5" />
 +12.5%
 </div>
 </div>
 <h3 className="text-sm font-medium text-muted-foreground mb-1.5">إجمالي المبيعات</h3>
 <p className="text-3xl font-bold text-foreground tracking-tight">245,000 ر.س</p>
 </div>

 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
 <div className="flex items-start justify-between mb-5">
 <div className="p-3 rounded-xl bg-[var(--secondary)]/[0.08]/10">
 <Users className="w-6 h-6 text-[var(--secondary)]" />
 </div>
 <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full text-[var(--primary)] bg-[var(--primary)]/[0.1]">
 <ArrowUpRight className="w-3.5 h-3.5" />
 +8.2%
 </div>
 </div>
 <h3 className="text-sm font-medium text-muted-foreground mb-1.5">العملاء النشطون</h3>
 <p className="text-3xl font-bold text-foreground tracking-tight">1,234</p>
 </div>

 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
 <div className="flex items-start justify-between mb-5">
 <div className="p-3 rounded-xl bg-[var(--warning)]/[0.08]">
 <DollarSign className="w-6 h-6 text-[var(--warning)]" />
 </div>
 <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full text-[var(--primary)] bg-[var(--primary)]/[0.1]">
 <ArrowUpRight className="w-3.5 h-3.5" />
 +15.3%
 </div>
 </div>
 <h3 className="text-sm font-medium text-muted-foreground mb-1.5">الربح الصافي</h3>
 <p className="text-3xl font-bold text-foreground tracking-tight">89,500 ر.س</p>
 </div>

 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
 <div className="flex items-start justify-between mb-5">
 <div className="p-3 rounded-xl bg-[var(--destructive)]/[0.08]/10">
 <Activity className="w-6 h-6 text-[var(--destructive)]" />
 </div>
 <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full text-[var(--destructive)] bg-[var(--destructive)]/[0.2]">
 <ArrowDownRight className="w-3.5 h-3.5" />
 -3.1%
 </div>
 </div>
 <h3 className="text-sm font-medium text-muted-foreground mb-1.5">معدل التحويل</h3>
 <p className="text-3xl font-bold text-foreground tracking-tight">23.4%</p>
 </div>
 </div>

 {/* Charts */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm">
 <div className="mb-6">
 <h3 className="text-lg font-semibold text-foreground mb-1">اتجاه المبيعات الشهرية</h3>
 <p className="text-sm text-muted-foreground">تطور الإيرادات خلال الأشهر الستة الأخيرة</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={salesData}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
 <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
 <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.75rem',
 boxShadow: 'var(--shadow-md)'
 }}
 labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
 />
 <Line
 type="monotone"
 dataKey="value"
 stroke="var(--primary)"
 strokeWidth={3}
 dot={{ fill: 'var(--primary)', r: 5 }}
 activeDot={{ r: 7 }}
 />
 </LineChart>
 </ResponsiveContainer>
 </div>

 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm">
 <div className="mb-6">
 <h3 className="text-lg font-semibold text-foreground mb-1">مقارنة الأداء</h3>
 <p className="text-sm text-muted-foreground">المبيعات الشهرية مقارنة بالمستهدف</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={salesData}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
 <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
 <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.75rem',
 boxShadow: 'var(--shadow-md)'
 }}
 labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
 />
 <Bar dataKey="value" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* AI Recommendations */}
 <div className="bg-gradient-to-l from-[var(--primary)]/[0.05] to-transparent border border-[var(--primary)]/[0.2] rounded-2xl p-6">
 <div className="flex items-start gap-4">
 <div className="p-3 bg-[var(--primary)] rounded-xl">
 <TrendingUp className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-3">
 <h3 className="text-lg font-semibold text-foreground">توصية الذكاء الاصطناعي</h3>
 <span className="px-2 py-1 bg-[var(--primary)]/[0.08]0/20 text-[var(--primary)] text-xs rounded-full">AI</span>
 </div>
 <p className="text-muted-foreground leading-relaxed mb-4">
 بناءً على تحليل البيانات الحالية، نوصي بزيادة الاستثمار في قطاع المنتجات الأكثر مبيعاً بنسبة 15%
 لتحقيق نمو إضافي متوقع بنسبة 24% في الربع القادم.
 </p>
 <div className="flex flex-wrap gap-3">
 <button className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-lg transition-colors text-sm font-medium">
 عرض التفاصيل
 </button>
 <button className="px-4 py-2 border border-border hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors text-sm text-foreground">
 تجاهل
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
