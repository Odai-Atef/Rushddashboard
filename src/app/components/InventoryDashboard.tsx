import {
 Package,
 TrendingUp,
 TrendingDown,
 AlertTriangle,
 AlertCircle,
 XCircle,
 ArrowUpRight,
 ArrowDownRight,
 Sparkles,
 Target,
 CheckCircle,
 BarChart3,
 Clock,
 RefreshCw
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

export function InventoryDashboard() {
 // Inventory movement data
 const movementData = [
 { month: 'محرم', inflow: 450, outflow: 380, turnover: 5.2 },
 { month: 'صفر', inflow: 520, outflow: 490, turnover: 5.8 },
 { month: 'ربيع الأول', inflow: 480, outflow: 450, turnover: 5.5 },
 { month: 'ربيع الثاني', inflow: 580, outflow: 520, turnover: 6.2 },
 { month: 'جمادى الأولى', inflow: 620, outflow: 580, turnover: 6.5 },
 { month: 'جمادى الآخرة', inflow: 680, outflow: 640, turnover: 6.8 },
 ];

 // Low stock alerts
 const lowStockAlerts = [
 { id: 1, product: 'منتج أ - نظام إدارة متكامل', currentStock: 12, minRequired: 50, status: 'critical', daysLeft: 3 },
 { id: 2, product: 'منتج ب - خدمات استشارية', currentStock: 28, minRequired: 40, status: 'warning', daysLeft: 7 },
 { id: 3, product: 'منتج ج - حلول سحابية', currentStock: 35, minRequired: 60, status: 'warning', daysLeft: 10 },
 { id: 4, product: 'منتج د - تطبيقات الجوال', currentStock: 8, minRequired: 30, status: 'critical', daysLeft: 2 },
 { id: 5, product: 'منتج هـ - تدريب وتأهيل', currentStock: 45, minRequired: 70, status: 'warning', daysLeft: 12 },
 ];

 // Warehouse performance
 const warehouseData = [
 { warehouse: 'مستودع الرياض', turnover: 7.2, stagnant: 8, efficiency: 92 },
 { warehouse: 'مستودع جدة', turnover: 6.5, stagnant: 12, efficiency: 88 },
 { warehouse: 'مستودع الدمام', turnover: 5.8, stagnant: 18, efficiency: 82 },
 { warehouse: 'مستودع مكة', turnover: 5.2, stagnant: 15, efficiency: 78 },
 ];

 // Product risk categories
 const productRisks = [
 {
 id: 1,
 type: 'stagnant',
 title: 'منتجات راكدة',
 count: 23,
 value: '380K ر.س',
 description: 'منتجات لم تتحرك منذ أكثر من 90 يوم',
 icon: Clock,
 color: 'from-orange-500 to-red-600',
 bgColor: 'bg-[var(--warning)]/[0.1]',
 borderColor: 'border-orange-500'
 },
 {
 id: 2,
 type: 'low',
 title: 'مخزون منخفض',
 count: 15,
 value: 'طلب عاجل',
 description: 'منتجات تحت الحد الأدنى المطلوب',
 icon: AlertTriangle,
 color: 'from-red-500 to-pink-600',
 bgColor: 'bg-[var(--destructive)]/10',
 borderColor: 'border-red-500'
 },
 {
 id: 3,
 type: 'damaged',
 title: 'منتجات تالفة',
 count: 8,
 value: '95K ر.س',
 description: 'منتجات تحتاج إلى معالجة أو استبدال',
 icon: XCircle,
 color: 'from-yellow-500 to-orange-600',
 bgColor: 'bg-[var(--warning)]/[0.1]',
 borderColor: 'border-yellow-500'
 },
 {
 id: 4,
 type: 'shortage',
 title: 'توقعات النقص',
 count: 12,
 value: '7-14 يوم',
 description: 'منتجات متوقع نفاذها قريباً',
 icon: AlertCircle,
 color: 'from-[var(--secondary)] to-cyan-600',
 bgColor: 'bg-[var(--primary)]/10',
 borderColor: 'border-ring'
 },
 ];

 // KPI data
 const kpis = [
 {
 title: 'معدل دوران المخزون',
 value: '6.8',
 change: '+9.7%',
 isPositive: true,
 icon: RefreshCw,
 color: 'text-[var(--secondary)]',
 bgColor: 'bg-chart-1/10'
 },
 {
 title: 'تنبيهات المخزون المنخفض',
 value: '15',
 change: '+3',
 isPositive: false,
 icon: AlertTriangle,
 color: 'text-[var(--destructive)]',
 bgColor: 'bg-[var(--destructive)]/10'
 },
 {
 title: 'المنتجات الراكدة',
 value: '23',
 change: '-5',
 isPositive: true,
 icon: Clock,
 color: 'text-[var(--warning)]',
 bgColor: 'bg-[var(--warning)]/[0.1]'
 },
 {
 title: 'المنتجات التالفة',
 value: '8',
 change: '+2',
 isPositive: false,
 icon: XCircle,
 color: 'text-[var(--warning)]',
 bgColor: 'bg-[var(--warning)]/[0.1]'
 },
 ];

 const getStockStatusColor = (status: string) => {
 switch (status) {
 case 'critical':
 return 'bg-[var(--destructive)]/20 text-[var(--destructive)]';
 case 'warning':
 return 'bg-[var(--warning)]/[0.2] text-[var(--warning)]';
 default:
 return 'bg-[var(--primary)]/[0.2] text-[var(--primary)]';
 }
 };

 const getStockStatusLabel = (status: string) => {
 switch (status) {
 case 'critical':
 return 'حرج';
 case 'warning':
 return 'تحذير';
 default:
 return 'طبيعي';
 }
 };

 return (
 <div className="space-y-6 md:space-y-8 p-6">
 {/* Header */}
 <div>
 <h2 className="text-[var(--text-section-title)] mb-2">لوحة المخزون</h2>
 <p className="text-[var(--text-muted)]">تحليل المخاطر التشغيلية وأداء إدارة المخزون</p>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
 {kpis.map((kpi, index) => {
 const Icon = kpi.icon;
 return (
 <div key={index} className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all duration-200 flex flex-col justify-between h-full">
 <div className="flex items-start justify-between mb-[var(--spacing-card-padding)]">
 <div className="p-[var(--spacing-small-gap)].5 rounded-[var(--radius-card)] bg-muted/80">
 <Icon className={`w-6 h-6 ${kpi.color}`} />
 </div>
 <div className={`flex items-center gap-[var(--spacing-small-gap)] text-sm font-medium px-2 py-1 rounded-full ${kpi.isPositive ? 'text-[var(--primary)] bg-[var(--primary)]/[0.1]' : 'text-[var(--destructive)] bg-[var(--destructive)]/[0.2]'}`}>
 {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
 {kpi.change}
 </div>
 </div>
 <h3 className="text-sm font-medium text-[var(--text-muted)] mb-1.5">{kpi.title}</h3>
 <p className="text-[var(--text-card-number)] font-bold text-[var(--text-primary)] tracking-tight">{kpi.value}</p>
 </div>
 );
 })}
 </div>

 {/* AI Inventory Insights Panel */}
 <div className="bg-gradient-to-l from-orange-500/10 via-red-500/10 to-transparent border border-orange-500/20 rounded-[var(--radius-card)] p-6">
 <div className="flex items-start gap-4">
 <div className="p-[var(--spacing-card-padding)] bg-gradient-to-br from-orange-500 to-red-600 rounded-[var(--radius-card)]">
 <AlertTriangle className="w-7 h-7 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-3">
 <h3 className="text-xl font-medium">تحليل المخاطر التشغيلية</h3>
 <span className="px-2 py-1 bg-[var(--warning)]/[0.2] text-[var(--warning)] text-xs rounded-full">AI Alert</span>
 </div>
 <p className="text-[var(--text-primary)] leading-relaxed mb-[var(--spacing-section-gap)]">
 تم رصد <span className="font-bold text-[var(--destructive)]">15 تنبيه مخزون منخفض حرج</span> يحتاج إجراء فوري.
 <span className="font-bold text-[var(--warning)]"> 23 منتج راكد</span> بقيمة 380K ر.س يؤثر على السيولة المالية.
 معدل الدوران تحسن إلى <span className="font-bold text-[var(--primary)]">6.8</span> مما يدل على تحسن الكفاءة التشغيلية.
 <span className="font-bold text-[var(--text-primary)]"> 4 منتجات</span> متوقع نفاذها خلال أقل من 3 أيام.
 </p>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[var(--card)]/70/60 rounded-[var(--radius-card)] border border-[var(--border)]/50 items-stretch">
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-lg)] text-center flex flex-col justify-between h-full">
 <p className="text-sm text-[var(--text-muted)] mb-2">القيمة المعرضة للخطر</p>
 <p className="text-[var(--text-card-number)] font-bold text-[var(--destructive)] tracking-tight">475K ر.س</p>
 </div>
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-lg)] text-center flex flex-col justify-between h-full">
 <p className="text-sm text-[var(--text-muted)] mb-2">معدل الدوران</p>
 <p className="text-[var(--text-card-number)] font-bold text-[var(--primary)] tracking-tight">6.8</p>
 </div>
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-lg)] text-center flex flex-col justify-between h-full">
 <p className="text-sm text-[var(--text-muted)] mb-2">الكفاءة التشغيلية</p>
 <p className="text-[var(--text-card-number)] font-bold text-[var(--secondary)] tracking-tight">85%</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Product Risk Cards */}
 <div>
 <h3 className="text-lg font-medium text-[var(--text-primary)] mb-[var(--spacing-section-gap)]">تصنيف المخاطر</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
 {productRisks.map((risk) => {
 const Icon = risk.icon;
 return (
 <div
 key={risk.id}
 className="relative bg-[var(--card)] border-2 rounded-[var(--radius-card)] p-5 hover:shadow-[var(--shadow-lg)] dark:hover:shadow-xl transition-all duration-200 overflow-hidden group flex flex-col justify-between h-full"
 style={{ borderColor: risk.borderColor.replace('border-', '') === 'orange-500' ? 'rgba(249, 115, 22, 0.5)' : risk.borderColor.replace('border-', '') === 'red-500' ? 'rgba(239, 68, 68, 0.5)' : risk.borderColor.replace('border-', '') === 'yellow-500' ? 'rgba(234, 179, 8, 0.5)' : 'rgba(59, 130, 246, 0.5)' }}
 >
 <div className="relative">
 <div className={`inline-flex p-[var(--spacing-card-padding)] rounded-[var(--radius-card)] bg-gradient-to-br ${risk.color} mb-3`}>
 <Icon className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>

 <h4 className="font-medium text-lg text-[var(--text-primary)] mb-1">{risk.title}</h4>
 <div className="flex items-baseline gap-[var(--spacing-small-gap)] mb-3">
 <span className="text-[var(--text-card-number)] font-bold text-[var(--text-primary)] tracking-tight">{risk.count}</span>
 <span className="text-sm text-[var(--text-muted)]">منتج</span>
 </div>

 <p className="text-sm text-[var(--text-muted)] mb-3">{risk.description}</p>

 <div className={`inline-flex px-3 py-1 ${risk.bgColor} rounded-full`}>
 <span className="text-sm font-medium">{risk.value}</span>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Charts Section */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--spacing-grid-gap)]">
 {/* Inventory Movement Chart */}
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-6">
 <div className="mb-6">
 <h3 className="text-lg font-medium mb-1">حركة المخزون</h3>
 <p className="text-sm text-[var(--text-muted)]">الوارد والصادر ومعدل الدوران</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={movementData}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
 <XAxis
 dataKey="month"
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '12px' }}
 />
 <YAxis
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '12px' }}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--color-card)',
 border: '1px solid var(--color-border)',
 borderRadius: '0.75rem',
 boxShadow: 'var(--shadow-md)'
 }}
 labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold', marginBottom: '8px' }}
 />
 <Legend
 wrapperStyle={{ paddingTop: '20px' }}
 formatter={(value) => {
 const labels: Record<string, string> = {
 inflow: 'الوارد',
 outflow: 'الصادر',
 turnover: 'معدل الدوران'
 };
 return labels[value] || value;
 }}
 />
 <Line
 type="monotone"
 dataKey="inflow"
 stroke="#3b82f6"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-1)', r: 4 }}
 />
 <Line
 type="monotone"
 dataKey="outflow"
 stroke="#10b981"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-2)', r: 4 }}
 />
 <Line
 type="monotone"
 dataKey="turnover"
 stroke="#f59e0b"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-3)', r: 4 }}
 />
 </LineChart>
 </ResponsiveContainer>
 </div>

 {/* Warehouse Performance */}
 <div className="u003cREPLACEu003e rounded-[var(--radius-card)] p-6">
 <div className="mb-6">
 <h3 className="text-lg font-medium mb-1">أداء المستودعات</h3>
 <p className="text-sm text-[var(--text-muted)]">معدل الدوران والمنتجات الراكدة</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={warehouseData}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
 <XAxis
 dataKey="warehouse"
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '11px' }}
 angle={-15}
 textAnchor="end"
 height={80}
 />
 <YAxis
 stroke="var(--color-muted-foreground)"
 style={{ fontSize: '12px' }}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--color-card)',
 border: '1px solid var(--color-border)',
 borderRadius: '0.75rem',
 boxShadow: 'var(--shadow-md)'
 }}
 />
 <Legend
 wrapperStyle={{ paddingTop: '10px' }}
 formatter={(value) => {
 const labels: Record<string, string> = {
 turnover: 'معدل الدوران',
 stagnant: 'المنتجات الراكدة',
 efficiency: 'الكفاءة %'
 };
 return labels[value] || value;
 }}
 />
 <Bar dataKey="turnover" fill="#3b82f6" radius={[8, 8, 0, 0]} />
 <Bar dataKey="stagnant" fill="#10b981" radius={[8, 8, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Low Stock Alerts Table */}
 <div className="bg-[var(--card)] border-2 border-red-500/30 rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)]">
 <div className="p-6 border-b border-[var(--border)] bg-[var(--destructive)]/5">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-1">
 <AlertTriangle className="w-5 h-5 text-[var(--destructive)]" />
 <h3 className="text-lg font-medium">تنبيهات المخزون المنخفض</h3>
 <span className="px-2 py-1 bg-[var(--destructive)]/20 text-[var(--destructive)] text-xs rounded-full">
 عاجل
 </span>
 </div>
 <p className="text-sm text-[var(--text-muted)]">منتجات تحتاج طلب شراء فوري</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-muted/50">
 <tr>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">المنتج</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">المخزون الحالي</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الحد الأدنى</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الأيام المتبقية</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الحالة</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الإجراء</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--border)]">
 {lowStockAlerts.map((alert) => (
 <tr key={alert.id} className="hover:bg-[var(--hover)] dark:hover:bg-muted/50 transition-colors">
 <td className="px-6 py-4">
 <p className="font-medium">{alert.product}</p>
 </td>
 <td className="px-6 py-4">
 <p className={`font-medium ${alert.status === 'critical' ? 'text-[var(--destructive)]' : 'text-[var(--warning)]'}`}>
 {alert.currentStock} وحدة
 </p>
 </td>
 <td className="px-6 py-4 text-[var(--text-muted)]">
 {alert.minRequired} وحدة
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Clock className={`w-4 h-4 ${alert.status === 'critical' ? 'text-[var(--destructive)]' : 'text-[var(--warning)]'}`} />
 <span className={alert.status === 'critical' ? 'text-[var(--destructive)] font-medium' : 'text-[var(--warning)]'}>
 {alert.daysLeft} أيام
 </span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(alert.status)}`}>
 {getStockStatusLabel(alert.status)}
 </span>
 </td>
 <td className="px-6 py-4">
 <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-card)] hover:bg-[var(--primary)]/90 transition-colors text-sm">
 طلب شراء
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Recommendations */}
 <div className="bg-gradient-to-l from-green-500/10 via-emerald-500/10 to-transparent border border-[var(--primary)]/[0.2] rounded-[var(--radius-card)] p-6">
 <div className="flex items-start gap-4">
 <div className="p-[var(--spacing-card-padding)] bg-gradient-to-br from-green-500 to-emerald-600 rounded-[var(--radius-card)]">
 <Target className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-3">
 <h3 className="text-lg font-medium">التوصيات الذكية</h3>
 <span className="px-2 py-1 bg-[var(--primary)]/[0.2] text-[var(--primary)] text-xs rounded-full">
 AI Powered
 </span>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-sm leading-relaxed">
 <span className="font-medium text-[var(--destructive)]">طلب شراء عاجل</span> لـ 4 منتجات حرجة قبل نفاذها خلال 3 أيام
 </p>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-sm leading-relaxed">
 تخفيض أسعار <span className="font-medium text-[var(--text-primary)]">23 منتج راكد</span> بقيمة 380K ر.س لتحرير السيولة
 </p>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-sm leading-relaxed">
 تطبيق نظام <span className="font-medium text-[var(--text-primary)]">Just-In-Time</span> لتقليل المخزون الراكد بنسبة 40%
 </p>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-sm leading-relaxed">
 معالجة <span className="font-medium text-[var(--text-primary)]">8 منتجات تالفة</span> وتحسين إجراءات الفحص الدوري
 </p>
 </div>
 </div>
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)] mt-4 pt-4 border-t border-[var(--primary)]/[0.2]">
 <button className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/[0.9] text-[var(--primary-foreground)] rounded-[var(--radius-card)] transition-colors text-sm">
 تطبيق جميع التوصيات
 </button>
 <button className="px-4 py-2 border border-[var(--border)] hover:bg-muted dark:hover:bg-muted rounded-[var(--radius-card)] transition-colors text-sm">
 إنشاء طلبات شراء
 </button>
 <button className="px-4 py-2 border border-[var(--border)] hover:bg-muted dark:hover:bg-muted rounded-[var(--radius-card)] transition-colors text-sm">
 عرض التفاصيل
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
