import {
 TrendingUp,
 TrendingDown,
 DollarSign,
 PiggyBank,
 MapPin,
 Target,
 AlertTriangle,
 ArrowUpRight,
 ArrowDownRight,
 Sparkles,
 Shield,
 CheckCircle,
 Package,
 Layers
} from 'lucide-react';
import {
 LineChart,
 Line,
 BarChart,
 Bar,
 PieChart,
 Pie,
 Cell,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 Legend
} from 'recharts';

export function ProfitabilityDashboard() {
 // Profit trend data
 const profitTrendData = [
 { month: 'محرم', profit: 580000, revenue: 2100000, cost: 1520000 },
 { month: 'صفر', profit: 720000, revenue: 2350000, cost: 1630000 },
 { month: 'ربيع الأول', profit: 650000, revenue: 2200000, cost: 1550000 },
 { month: 'ربيع الثاني', profit: 890000, revenue: 2650000, cost: 1760000 },
 { month: 'جمادى الأولى', profit: 980000, revenue: 2900000, cost: 1920000 },
 { month: 'جمادى الآخرة', profit: 1150000, revenue: 3150000, cost: 2000000 },
 ];

 // Cost breakdown data
 const costBreakdownData = [
 { name: 'الرواتب والأجور', value: 850000, color: 'var(--color-chart-1)' },
 { name: 'العمليات والتشغيل', value: 520000, color: 'var(--color-chart-2)' },
 { name: 'التسويق', value: 280000, color: 'var(--color-chart-3)' },
 { name: 'الإيجارات', value: 180000, color: 'var(--color-chart-4)' },
 { name: 'أخرى', value: 170000, color: 'var(--color-chart-5)' },
 ];

 // Branch profitability data
 const branchProfitability = [
 { branch: 'الرياض', profit: 450000, margin: 42 },
 { branch: 'جدة', profit: 380000, margin: 36 },
 { branch: 'الدمام', profit: 220000, margin: 28 },
 { branch: 'مكة', profit: 180000, margin: 31 },
 { branch: 'المدينة', profit: 145000, margin: 26 },
 ];

 // Top profitable services
 const topServices = [
 { id: 1, service: 'خدمات استشارية متقدمة', revenue: 850000, cost: 420000, profit: 430000, margin: 50.6 },
 { id: 2, service: 'حلول التحول الرقمي', revenue: 720000, cost: 400000, profit: 320000, margin: 44.4 },
 { id: 3, service: 'إدارة المشاريع', revenue: 580000, cost: 348000, profit: 232000, margin: 40.0 },
 { id: 4, service: 'التدريب التنفيذي', revenue: 450000, cost: 285000, profit: 165000, margin: 36.7 },
 { id: 5, service: 'تحليل البيانات', revenue: 380000, cost: 247000, profit: 133000, margin: 35.0 },
 ];

 // Channel profitability
 const channelData = [
 { channel: 'B2B المباشر', profit: 680000, margin: 45 },
 { channel: 'التجارة الإلكترونية', profit: 520000, margin: 38 },
 { channel: 'الشركاء والموزعون', profit: 320000, margin: 28 },
 { channel: 'المتاجر الفعلية', profit: 250000, margin: 24 },
 ];

 // Risk alerts
 const riskAlerts = [
 {
 id: 1,
 type: 'high',
 title: 'ارتفاع التكاليف التشغيلية',
 description: 'زيادة 15% في تكاليف العمليات خلال الشهرين الماضيين',
 impact: 'تأثير متوسط على الهامش الربحي'
 },
 {
 id: 2,
 type: 'medium',
 title: 'انخفاض ربحية فرع الدمام',
 description: 'هامش الربح انخفض من 32% إلى 28%',
 impact: 'يحتاج مراجعة استراتيجية'
 },
 ];

 // KPI data
 const kpis = [
 {
 title: 'هامش الربح الإجمالي',
 value: '36.5%',
 change: '+3.8%',
 isPositive: true,
 icon: Target,
 color: 'text-[var(--secondary)]',
 bgColor: 'bg-[var(--secondary)]/[0.08]/10'
 },
 {
 title: 'صافي الربح',
 value: '1.15M ر.س',
 change: '+22.4%',
 isPositive: true,
 icon: PiggyBank,
 color: 'text-[var(--primary)]',
 bgColor: 'bg-[var(--primary)]/[0.08]/[0.08]0/10'
 },
 {
 title: 'التكاليف التشغيلية',
 value: '2.00M ر.س',
 change: '+8.5%',
 isPositive: false,
 icon: DollarSign,
 color: 'text-[var(--warning)]',
 bgColor: 'bg-[var(--warning)]/[0.08]'
 },
 {
 title: 'أعلى فرع ربحية',
 value: 'الرياض',
 change: '42% هامش',
 isPositive: true,
 icon: MapPin,
 color: 'text-[var(--secondary)]',
 bgColor: 'bg-[var(--secondary)]/[0.08]'
 },
 ];

 const totalCosts = costBreakdownData.reduce((sum, item) => sum + item.value, 0);

 const getRiskColor = (type: string) => {
 switch (type) {
 case 'high':
 return 'border-r-4 border-red-500 bg-[var(--destructive)]/10';
 case 'medium':
 return 'border-r-4 border-yellow-500 bg-yellow-500/10';
 default:
 return 'border-r-4 border-ring bg-[var(--primary)]/10';
 }
 };

 return (
 <div className="space-y-6 md:space-y-8">
 {/* Header */}
 <div className="border-b border-[var(--border)] pb-6">
 <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">لوحة الربحية</h2>
 <p className="text-[var(--text-muted)] text-base">تحليل تنفيذي شامل للأداء المالي والربحية</p>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-grid-gap)] items-stretch">
 {kpis.map((kpi, index) => {
 const Icon = kpi.icon;
 return (
 <div key={index} className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)] hover:shadow-xl transition-all duration-300">
 <div className="flex items-center justify-between mb-[var(--spacing-section-gap)]">
 <div className={`p-[var(--spacing-card-padding)] ${kpi.bgColor} rounded-[var(--radius-button)]`}>
 <Icon className={`w-5 h-5 ${kpi.color}`} />
 </div>
 <div className={`flex items-center gap-[var(--spacing-small-gap)] text-sm font-medium ${kpi.isPositive ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
 {kpi.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
 {kpi.change}
 </div>
 </div>
 <h3 className="text-[var(--text-muted)] text-sm mb-2">{kpi.title}</h3>
 <p className="text-2xl font-bold">{kpi.value}</p>
 </div>
 );
 })}
 </div>

 {/* AI Financial Insights Panel */}
 <div className="bg-gradient-to-l from-[var(--secondary)]/[0.05] via-[var(--secondary)]/[0.05] to-transparent border border-[var(--secondary)]/[0.2] rounded-[var(--radius-card)] p-6">
 <div className="flex items-start gap-4">
 <div className="p-[var(--spacing-card-padding)] bg-gradient-to-br from-[var(--secondary)] to-purple-600 rounded-[var(--radius-card)]">
 <Sparkles className="w-7 h-7 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-3">
 <h3 className="text-xl font-medium">التحليل المالي الذكي</h3>
 <span className="px-2 py-1 bg-[var(--primary)]/20 text-[var(--secondary)] text-xs rounded-full">AI Executive</span>
 </div>
 <p className="text-[var(--text-primary)] leading-relaxed mb-[var(--spacing-section-gap)]">
 الأداء المالي <span className="font-bold text-[var(--primary)]">إيجابي بقوة</span> مع نمو 22.4% في صافي الربح وتحسن هامش الربح إلى 36.5%.
 <span className="font-bold text-[var(--primary)]"> فرع الرياض</span> يحقق أعلى ربحية بهامش 42% ويجب التركيز على نقل أفضل الممارسات للفروع الأخرى.
 <span className="font-bold text-[var(--text-primary)]"> الخدمات الاستشارية</span> تحقق هامش ربح استثنائي 50.6% وتمثل فرصة نمو كبيرة.
 </p>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[var(--card)]/50/50 rounded-[var(--radius-card)] border border-[var(--border)]">
 <div className="text-center">
 <p className="text-sm text-[var(--text-muted)] mb-1">العائد على الاستثمار</p>
 <p className="text-2xl font-bold text-[var(--primary)]">57.5%</p>
 </div>
 <div className="text-center border-x border-[var(--border)]">
 <p className="text-sm text-[var(--text-muted)] mb-1">نمو الربح الشهري</p>
 <p className="text-2xl font-bold text-[var(--secondary)]">+17.3%</p>
 </div>
 <div className="text-center">
 <p className="text-sm text-[var(--text-muted)] mb-1">الكفاءة التشغيلية</p>
 <p className="text-2xl font-bold text-[var(--secondary)]">92/100</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Charts Section */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--spacing-grid-gap)]">
 {/* Profit Trend Chart */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg font-medium mb-1">الاتجاه المالي</h3>
 <p className="text-sm text-[var(--text-muted)]">تطور الأرباح والإيرادات والتكاليف</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={profitTrendData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
 <XAxis
 dataKey="month"
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 />
 <YAxis
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 tickFormatter={(value) => `${value / 1000000}M`}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.75rem',
 boxShadow: 'var(--shadow-md)'
 }}
 labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}
 formatter={(value: number, name: string) => {
 const labels: Record<string, string> = {
 profit: 'الربح',
 revenue: 'الإيرادات',
 cost: 'التكاليف'
 };
 return [`${value.toLocaleString()} ر.س`, labels[name]];
 }}
 />
 <Legend
 wrapperStyle={{ paddingTop: '20px' }}
 formatter={(value) => {
 const labels: Record<string, string> = {
 profit: 'الربح',
 revenue: 'الإيرادات',
 cost: 'التكاليف'
 };
 return labels[value] || value;
 }}
 />
 <Line
 type="monotone"
 dataKey="revenue"
 stroke="#3b82f6"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-1)', r: 4 }}
 activeDot={{ r: 6 }}
 />
 <Line
 type="monotone"
 dataKey="cost"
 stroke="#10b981"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-2)', r: 4 }}
 activeDot={{ r: 6 }}
 />
 <Line
 type="monotone"
 dataKey="profit"
 stroke="#f59e0b"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-3)', r: 4 }}
 activeDot={{ r: 6 }}
 />
 </LineChart>
 </ResponsiveContainer>
 </div>

 {/* Cost Breakdown */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg font-medium mb-1">هيكل التكاليف</h3>
 <p className="text-sm text-[var(--text-muted)]">توزيع التكاليف التشغيلية</p>
 </div>
 <ResponsiveContainer width="100%" height={240}>
 <PieChart>
 <Pie
 data={costBreakdownData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={100}
 paddingAngle={3}
 dataKey="value"
 label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
 >
 {costBreakdownData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.75rem',
 boxShadow: 'var(--shadow-md)'
 }}
 formatter={(value: number) => [`${value.toLocaleString()} ر.س`, '']}
 />
 </PieChart>
 </ResponsiveContainer>
 <div className="grid grid-cols-1 gap-[var(--spacing-small-gap)] mt-4">
 {costBreakdownData.map((item, index) => (
 <div key={index} className="flex items-center justify-between p-[var(--spacing-small-gap)] rounded-[var(--radius-button)] hover:bg-muted/50 transition-colors">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
 <span className="text-sm">{item.name}</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className="text-sm font-medium">{item.value.toLocaleString()} ر.س</span>
 <span className="text-sm text-[var(--text-muted)]">
 {((item.value / totalCosts) * 100).toFixed(1)}%
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Branch & Channel Profitability */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--spacing-grid-gap)]">
 {/* Branch Profitability */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg font-medium mb-1">ربحية الفروع</h3>
 <p className="text-sm text-[var(--text-muted)]">مقارنة الأرباح والهوامش حسب الفرع</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={branchProfitability} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
 <XAxis
 type="number"
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 tickFormatter={(value) => `${value / 1000}K`}
 />
 <YAxis
 type="category"
 dataKey="branch"
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 width={80}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.75rem',
 boxShadow: 'var(--shadow-md)'
 }}
 formatter={(value: number, name: string) => {
 if (name === 'profit') {
 return [`${value.toLocaleString()} ر.س`, 'الربح'];
 }
 return [`${value}%`, 'الهامش'];
 }}
 />
 <Bar dataKey="profit" fill="#3b82f6" radius={[0, 8, 8, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Channel Profitability */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg font-medium mb-1">القنوات الأعلى ربحية</h3>
 <p className="text-sm text-[var(--text-muted)]">الأرباح والهوامش حسب قناة البيع</p>
 </div>
 <div className="space-y-4">
 {channelData.map((channel, index) => (
 <div key={index} className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium">{channel.channel}</span>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className="text-sm text-[var(--text-muted)]">{channel.profit.toLocaleString()} ر.س</span>
 <span className="text-sm font-bold text-[var(--primary)]">{channel.margin}%</span>
 </div>
 </div>
 <div className="relative h-3 bg-muted rounded-full overflow-hidden">
 <div
 className="absolute inset-y-0 right-0 bg-gradient-to-l from-green-500 to-emerald-600 rounded-full"
 style={{ width: `${(channel.margin / 50) * 100}%` }}
 ></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Top Profitable Services Table */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
 <div className="p-6 border-b border-[var(--border)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-1">
 <Layers className="w-5 h-5 text-[var(--primary)]" />
 <h3 className="text-lg font-medium">الخدمات الأعلى ربحية</h3>
 </div>
 <p className="text-sm text-[var(--text-muted)]">تحليل الربحية حسب الخدمة أو المنتج</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-muted/50">
 <tr>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">#</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الخدمة</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الإيرادات</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">التكاليف</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الربح</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الهامش</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--border)]">
 {topServices.map((service) => (
 <tr key={service.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{service.id}</td>
 <td className="px-6 py-4">
 <p className="font-medium">{service.service}</p>
 </td>
 <td className="px-6 py-4 text-[var(--text-muted)]">
 {service.revenue.toLocaleString()} ر.س
 </td>
 <td className="px-6 py-4 text-[var(--text-muted)]">
 {service.cost.toLocaleString()} ر.س
 </td>
 <td className="px-6 py-4">
 <p className="font-medium text-[var(--primary)]">{service.profit.toLocaleString()} ر.س</p>
 </td>
 <td className="px-6 py-4">
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
 service.margin >= 45
 ? 'bg-[var(--primary)]/[0.2] text-[var(--primary)]'
 : service.margin >= 38
 ? 'bg-[var(--primary)]/20 text-[var(--secondary)]'
 : 'bg-[var(--warning)]/[0.2] text-[var(--warning)]'
 }`}>
 {service.margin}%
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Risk Alerts & Recommendations */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--spacing-grid-gap)]">
 {/* Risk Alerts */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-6">
 <Shield className="w-5 h-5 text-[var(--warning)]" />
 <h3 className="text-lg font-medium">تنبيهات المخاطر المالية</h3>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 {riskAlerts.map((alert) => (
 <div key={alert.id} className={`p-4 rounded-[var(--radius-button)] ${getRiskColor(alert.type)}`}>
 <h4 className="text-sm font-medium mb-2">{alert.title}</h4>
 <p className="text-sm text-[var(--text-muted)] mb-2">{alert.description}</p>
 <p className="text-xs text-[var(--text-muted)]">{alert.impact}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Recommendations */}
 <div className="bg-gradient-to-l from-[var(--primary)]/[0.05] to-transparent border border-[var(--primary)]/[0.2] rounded-[var(--radius-card)] p-6">
 <div className="flex items-start gap-4">
 <div className="p-[var(--spacing-card-padding)] bg-gradient-to-br from-green-500 to-emerald-600 rounded-[var(--radius-card)]">
 <Target className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-3">
 <h3 className="text-lg font-medium">التوصيات الإستراتيجية</h3>
 <span className="px-2 py-1 bg-[var(--primary)]/[0.2] text-[var(--primary)] text-xs rounded-full">
 أولوية عالية
 </span>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-sm leading-relaxed">
 التركيز على <span className="font-medium text-[var(--text-primary)]">الخدمات الاستشارية</span> ذات هامش الـ 50.6% لزيادة الربحية بنسبة 28%
 </p>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-sm leading-relaxed">
 نقل أفضل الممارسات من <span className="font-medium text-[var(--text-primary)]">فرع الرياض</span> للفروع الأخرى لرفع الهوامش بمعدل 8%
 </p>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-sm leading-relaxed">
 مراجعة <span className="font-medium text-[var(--text-primary)]">التكاليف التشغيلية</span> وتطبيق الأتمتة لتوفير 180K ر.س سنوياً
 </p>
 </div>
 </div>
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)] mt-4 pt-4 border-t border-[var(--primary)]/[0.2]">
 <button className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-[var(--radius-button)] transition-colors text-sm">
 تطبيق التوصيات
 </button>
 <button className="px-4 py-2 border border-[var(--border)] hover:bg-muted dark:hover:bg-muted rounded-[var(--radius-button)] transition-colors text-sm">
 عرض التفاصيل
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
