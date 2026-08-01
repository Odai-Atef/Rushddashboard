import {
 DollarSign,
 Users,
 Activity,
 AlertTriangle,
 TrendingUp,
 ArrowUpRight,
 ArrowDownRight,
 Sparkles,
 Target,
 CheckCircle
} from 'lucide-react';
import {
 LineChart,
 Line,
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 Legend
} from 'recharts';

export function ExecutiveDashboard() {
 // Revenue trend data
 const revenueData = [
 { month: 'محرم', revenue: 2100000 },
 { month: 'صفر', revenue: 2350000 },
 { month: 'ربيع الأول', revenue: 2200000 },
 { month: 'ربيع الثاني', revenue: 2650000 },
 { month: 'جمادى الأولى', revenue: 2900000 },
 { month: 'جمادى الآخرة', revenue: 3150000 },
 ];

 // Customer growth data
 const customerGrowthData = [
 { month: 'محرم', customers: 6200 },
 { month: 'صفر', customers: 6450 },
 { month: 'ربيع الأول', customers: 6700 },
 { month: 'ربيع الثاني', customers: 7100 },
 { month: 'جمادى الأولى', revenue: 7400 },
 { month: 'جمادى الآخرة', customers: 7640 },
 ];

 // Alerts data
 const alerts = [
 { id: 1, type: 'urgent', title: 'انخفاض معدل التحويل', description: 'انخفض من 34.5% إلى 28.2%', priority: 'high' },
 { id: 2, type: 'warning', title: 'ارتفاع الشكاوى', description: 'زيادة 15% في شكاوى جودة الخدمة', priority: 'medium' },
 { id: 3, type: 'info', title: 'فرصة نمو', description: 'قناة B2B تحقق أعلى هامش ربح', priority: 'low' },
 ];

 // Top 3 recommendations
 const topRecommendations = [
 {
 id: 1,
 title: 'توسيع قناة المبيعات B2B',
 impact: '+32% إيرادات',
 priority: 'urgent',
 risk: 'low'
 },
 {
 id: 2,
 title: 'تطبيق نظام إدارة الجودة',
 impact: '-40% أخطاء',
 priority: 'high',
 risk: 'medium'
 },
 {
 id: 3,
 title: 'برنامج ولاء للعملاء المميزين',
 impact: '+15% احتفاظ',
 priority: 'high',
 risk: 'low'
 },
 ];

 // KPI data
 const kpis = [
 {
 title: 'إجمالي الإيرادات',
 value: '3.15M ر.س',
 change: '+18.7%',
 isPositive: true,
 icon: DollarSign,
 color: 'text-chart-1',
 bgColor: 'bg-chart-1/10'
 },
 {
 title: 'عدد العملاء',
 value: '7,640',
 change: '+12.3%',
 isPositive: true,
 icon: Users,
 color: 'text-chart-2',
 bgColor: 'bg-chart-2/10'
 },
 {
 title: 'الأداء العام',
 value: '85/100',
 change: '+7.5',
 isPositive: true,
 icon: Activity,
 color: 'text-chart-3',
 bgColor: 'bg-chart-3/10'
 },
 {
 title: 'التنبيهات النشطة',
 value: '12',
 change: '-3',
 isPositive: true,
 icon: AlertTriangle,
 color: 'text-chart-4',
 bgColor: 'bg-chart-4/10'
 },
 ];

 const getAlertColor = (type: string) => {
 switch (type) {
 case 'urgent':
 return 'border-r-4 border-red-500 bg-[var(--destructive)]/10';
 case 'warning':
 return 'border-r-4 border-yellow-500 bg-yellow-500/10';
 case 'info':
 return 'border-r-4 border-ring bg-[var(--primary)]/10';
 default:
 return 'border-r-4 border-muted';
 }
 };

 const getPriorityBadge = (priority: string) => {
 switch (priority) {
 case 'urgent':
 return 'bg-[var(--destructive)]/20 text-[var(--destructive)]';
 case 'high':
 return 'bg-[var(--warning)]/[0.2] text-[var(--warning)]';
 default:
 return 'bg-[var(--primary)]/20 text-[var(--secondary)]';
 }
 };

 return (
 <div className="space-y-6 md:space-y-8">
 {/* Header */}
 <div className="border-b border-border pb-6">
 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">لوحة القيادة التنفيذية</h2>
 <p className="text-muted-foreground text-base">نظرة عامة سريعة عن الوضع العام للمنصة</p>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
 {kpis.map((kpi, index) => {
 const Icon = kpi.icon;
 return (
 <div key={index} className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
 <div className="flex items-start justify-between mb-5">
 <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
 <Icon className={`w-6 h-6 ${kpi.color}`} />
 </div>
 <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${kpi.isPositive ? 'text-[var(--primary)] bg-[var(--primary)]/[0.1]' : 'text-[var(--destructive)] bg-[var(--destructive)]/[0.2]'}`}>
 {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
 {kpi.change}
 </div>
 </div>
 <h3 className="text-sm font-medium text-muted-foreground mb-1.5">{kpi.title}</h3>
 <p className="text-3xl font-bold text-foreground tracking-tight">{kpi.value}</p>
 </div>
 );
 })}
 </div>

 {/* AI Executive Summary */}
 <div className="bg-gradient-to-l from-violet-500/5 via-blue-500/5 to-transparent border border-[var(--secondary)]/[0.2] rounded-2xl p-6">
 <div className="flex items-start gap-4">
 <div className="p-3 bg-violet-600 rounded-xl">
 <Sparkles className="w-7 h-7 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-3">
 <h3 className="text-xl font-semibold text-foreground">الملخص التنفيذي</h3>
 <span className="px-2 py-1 bg-violet-500/20 text-[var(--secondary)] text-xs rounded-full">AI Executive</span>
 </div>
 <p className="text-muted-foreground leading-relaxed mb-4">
 الأداء العام للمنصة <span className="font-bold text-[var(--primary)]">إيجابي ومستقر</span> مع نمو 18.7% في الإيرادات و12.3% في قاعدة العملاء.
 القناة B2B تُظهر <span className="font-bold text-foreground">إمكانات نمو استثنائية</span> بهامش ربح 45%.
 يوجد <span className="font-bold text-[var(--warning)]">12 تنبيه نشط</span> يحتاج اهتماماً فورياً، أبرزها انخفاض معدل التحويل وارتفاع الشكاوى.
 </p>
 </div>
 </div>
 </div>

 {/* Charts */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
 {/* Revenue Trend */}
 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm">
 <div className="mb-6">
 <h3 className="text-lg font-semibold text-foreground mb-1">اتجاه الإيرادات</h3>
 <p className="text-sm text-muted-foreground">الإيرادات الشهرية خلال آخر 6 أشهر</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={revenueData}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
 <XAxis
 dataKey="month"
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '12px' }}
 />
 <YAxis
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '12px' }}
 tickFormatter={(value) => `${value / 1000000}M`}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--color-card)',
 border: '1px solid var(--color-border)',
 borderRadius: '0.5rem',
 boxShadow: 'var(--shadow-md)'
 }}
 labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
 formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'الإيرادات']}
 />
 <Line
 type="monotone"
 dataKey="revenue"
 stroke="var(--color-chart-1)"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-1)', r: 5 }}
 activeDot={{ r: 7 }}
 />
 </LineChart>
 </ResponsiveContainer>
 </div>

 {/* Customer Growth */}
 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 p-5 md:p-6 shadow-sm">
 <div className="mb-6">
 <h3 className="text-lg font-semibold text-foreground mb-1">نمو العملاء</h3>
 <p className="text-sm text-muted-foreground">عدد العملاء النشطين خلال آخر 6 أشهر</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={customerGrowthData}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
 <XAxis
 dataKey="month"
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '12px' }}
 />
 <YAxis
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '12px' }}
 tickFormatter={(value) => `${value / 1000}k`}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--color-card)',
 border: '1px solid var(--color-border)',
 borderRadius: '0.5rem',
 boxShadow: 'var(--shadow-md)'
 }}
 formatter={(value: number) => [`${value.toLocaleString()} عميل`, 'العملاء']}
 />
 <Bar
 dataKey="customers"
 fill="var(--color-chart-2)"
 radius={[8, 8, 0, 0]}
 />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Alerts and Recommendations */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
 {/* Alerts Panel */}
 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 shadow-sm overflow-hidden">
 <div className="p-6 border-b border-border">
 <div className="flex items-center gap-2">
 <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
 <h3 className="text-lg font-semibold text-foreground">التنبيهات</h3>
 </div>
 </div>
 <div className="p-4 space-y-3">
 {alerts.map((alert) => (
 <div key={alert.id} className={`p-4 rounded-lg ${getAlertColor(alert.type)}`}>
 <div className="flex items-start justify-between gap-2 mb-2">
 <h4 className="font-medium">{alert.title}</h4>
 <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(alert.priority)}`}>
 {alert.priority === 'high' ? 'عالية' : alert.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
 </span>
 </div>
 <p className="text-sm text-muted-foreground">{alert.description}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Top 3 Recommendations */}
 <div className="bg-[var(--card)] rounded-2xl border border-border/80/50 shadow-sm overflow-hidden">
 <div className="p-6 border-b border-border">
 <div className="flex items-center gap-2">
 <Target className="w-5 h-5 text-[var(--primary)]" />
 <h3 className="text-lg font-semibold text-foreground">أهم 3 توصيات</h3>
 </div>
 </div>
 <div className="p-4 space-y-3">
 {topRecommendations.map((rec, index) => (
 <div key={rec.id} className="p-4 bg-secondary/50 rounded-xl hover:bg-muted dark:hover:bg-muted/50 transition-colors">
 <div className="flex items-start gap-3">
 <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-sm font-medium flex-shrink-0">
 {index + 1}
 </div>
 <div className="flex-1">
 <h4 className="font-medium text-foreground mb-1">{rec.title}</h4>
 <div className="flex items-center gap-2 text-sm">
 <span className="text-[var(--primary)] font-medium">{rec.impact}</span>
 <span className="text-muted-foreground">•</span>
 <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityBadge(rec.priority)}`}>
 {rec.priority === 'urgent' ? 'عاجل' : 'أولوية عالية'}
 </span>
 </div>
 </div>
 <CheckCircle className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-[var(--primary)] transition-colors" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}
