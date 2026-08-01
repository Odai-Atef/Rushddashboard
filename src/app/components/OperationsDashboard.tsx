import {
 Clock,
 AlertCircle,
 Truck,
 Activity,
 TrendingUp,
 TrendingDown,
 ArrowUpRight,
 ArrowDownRight,
 Sparkles,
 Target,
 Zap
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
 Legend,
 RadarChart,
 PolarGrid,
 PolarAngleAxis,
 PolarRadiusAxis,
 Radar
} from 'recharts';

export function OperationsDashboard() {
 // Process performance data
 const processData = [
 { process: 'استلام الطلب', speed: 95, accuracy: 98, efficiency: 92 },
 { process: 'المعالجة', speed: 85, accuracy: 88, efficiency: 87 },
 { process: 'التعبئة', speed: 90, accuracy: 95, efficiency: 93 },
 { process: 'الشحن', speed: 78, accuracy: 85, efficiency: 80 },
 { process: 'التسليم', speed: 82, accuracy: 90, efficiency: 85 },
 ];

 // Delivery time trend data
 const deliveryTrendData = [
 { month: 'محرم', avgTime: 3.2, target: 3.0 },
 { month: 'صفر', avgTime: 3.5, target: 3.0 },
 { month: 'ربيع الأول', avgTime: 2.8, target: 3.0 },
 { month: 'ربيع الثاني', avgTime: 2.9, target: 3.0 },
 { month: 'جمادى الأولى', avgTime: 2.6, target: 3.0 },
 { month: 'جمادى الآخرة', avgTime: 2.4, target: 3.0 },
 ];

 // Error categories data
 const errorCategoriesData = [
 { name: 'أخطاء الإدخال', value: 28, color: 'var(--color-chart-1)' },
 { name: 'تأخير التسليم', value: 35, color: 'var(--color-chart-2)' },
 { name: 'أخطاء التعبئة', value: 18, color: 'var(--color-chart-3)' },
 { name: 'مشاكل الشحن', value: 12, color: 'var(--color-chart-4)' },
 { name: 'أخرى', value: 7, color: 'var(--color-chart-5)' },
 ];

 // Team productivity data
 const teamProductivity = [
 { id: 1, team: 'فريق الرياض', orders: 1850, avgTime: 2.3, errorRate: 2.1, productivity: 95, trend: 'up' },
 { id: 2, team: 'فريق جدة', orders: 1620, avgTime: 2.5, errorRate: 2.8, productivity: 92, trend: 'up' },
 { id: 3, team: 'فريق الدمام', orders: 1380, avgTime: 2.8, errorRate: 3.5, productivity: 88, trend: 'down' },
 { id: 4, team: 'فريق مكة', orders: 1150, avgTime: 3.0, errorRate: 3.2, productivity: 85, trend: 'up' },
 { id: 5, team: 'فريق المدينة', orders: 980, avgTime: 3.2, errorRate: 4.1, productivity: 82, trend: 'down' },
 ];

 // KPI data
 const kpis = [
 {
 title: 'سرعة الإنجاز',
 value: '87%',
 change: '+5.8%',
 isPositive: true,
 icon: Zap,
 color: 'text-[var(--secondary)]',
 bgColor: 'bg-[var(--secondary)]/[0.08]/10'
 },
 {
 title: 'معدل الأخطاء',
 value: '2.8%',
 change: '-1.2%',
 isPositive: true,
 icon: AlertCircle,
 color: 'text-[var(--primary)]',
 bgColor: 'bg-[var(--primary)]/[0.08]/[0.08]0/10'
 },
 {
 title: 'متوسط زمن التسليم',
 value: '2.4 يوم',
 change: '-0.8 يوم',
 isPositive: true,
 icon: Truck,
 color: 'text-[var(--warning)]',
 bgColor: 'bg-[var(--warning)]/[0.08]'
 },
 {
 title: 'درجة الإنتاجية',
 value: '88/100',
 change: '+4.2',
 isPositive: true,
 icon: Activity,
 color: 'text-[var(--secondary)]',
 bgColor: 'bg-[var(--secondary)]/[0.08]'
 },
 ];

 const totalErrors = errorCategoriesData.reduce((sum, item) => sum + item.value, 0);

 return (
 <div className="space-y-6 md:space-y-8">
 {/* Header */}
 <div className="border-b border-[var(--border)] pb-6">
 <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">لوحة العمليات</h2>
 <p className="text-[var(--text-muted)] text-base">مراقبة الأداء التشغيلي والكفاءة والإنتاجية</p>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-grid-gap)] items-stretch">
 {kpis.map((kpi, index) => {
 const Icon = kpi.icon;
 return (
 <div key={index} className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] dark:hover:shadow-[var(--shadow-lg)] transition-all duration-200">
 <div className="flex items-center justify-between mb-[var(--spacing-section-gap)]">
 <div className={`p-[var(--spacing-card-padding)] ${kpi.bgColor} rounded-[var(--radius-button)]`}>
 <Icon className={`w-5 h-5 ${kpi.color}`} />
 </div>
 <div className={`flex items-center gap-[var(--spacing-small-gap)] text-sm ${kpi.isPositive ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
 {kpi.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
 {kpi.change}
 </div>
 </div>
 <h3 className="text-[var(--text-muted)] text-sm mb-2">{kpi.title}</h3>
 <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{kpi.value}</p>
 </div>
 );
 })}
 </div>

 {/* AI Insight Card */}
 <div className="bg-gradient-to-l from-[var(--secondary)]/[0.05] via-[var(--secondary)]/[0.05] to-transparent border border-[var(--secondary)]/[0.2] rounded-[var(--radius-card)] p-6">
 <div className="flex items-start gap-4">
 <div className="p-[var(--spacing-card-padding)] bg-gradient-to-br from-[var(--secondary)] to-purple-600 rounded-[var(--radius-card)]">
 <Sparkles className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
 <h3 className="text-lg">رؤية الذكاء الاصطناعي</h3>
 <span className="px-2 py-1 bg-[var(--primary)]/20 text-[var(--secondary)] text-xs rounded-full">AI</span>
 </div>
 <p className="text-[var(--text-muted)] leading-relaxed">
 التحليل يُظهر تحسناً ملحوظاً في <span className="text-[var(--text-primary)] font-medium">زمن التسليم</span> بنسبة 25% خلال الأشهر الستة الماضية.
 <span className="text-[var(--text-primary)] font-medium"> فريق الرياض</span> يحقق أعلى إنتاجية بمعدل 95/100 مع أقل معدل أخطاء.
 <span className="text-[var(--warning)] font-medium"> تأخير التسليم</span> يمثل 35% من الأخطاء ويحتاج تحسين عاجل.
 </p>
 </div>
 </div>
 </div>

 {/* Charts Section */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--spacing-grid-gap)]">
 {/* Process Performance Radar */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg mb-1">أداء العمليات</h3>
 <p className="text-sm text-[var(--text-muted)]">تقييم السرعة والدقة والكفاءة لكل عملية</p>
 </div>
 <ResponsiveContainer width="100%" height={320}>
 <RadarChart data={processData}>
 <PolarGrid stroke="#e5e7eb" />
 <PolarAngleAxis
 dataKey="process"
 tick={{ fill: 'var(--foreground)', fontSize: 12 }}
 />
 <PolarRadiusAxis
 angle={90}
 domain={[0, 100]}
 tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
 />
 <Radar
 name="السرعة"
 dataKey="speed"
 stroke="#3b82f6"
 fill="#3b82f6"
 fillOpacity={0.3}
 />
 <Radar
 name="الدقة"
 dataKey="accuracy"
 stroke="#10b981"
 fill="#10b981"
 fillOpacity={0.3}
 />
 <Radar
 name="الكفاءة"
 dataKey="efficiency"
 stroke="#f59e0b"
 fill="#f59e0b"
 fillOpacity={0.3}
 />
 <Legend wrapperStyle={{ paddingTop: '10px' }} />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.5rem',
 boxShadow: 'var(--shadow-md)'
 }}
 formatter={(value: number) => [`${value}%`, '']}
 />
 </RadarChart>
 </ResponsiveContainer>
 </div>

 {/* Error Categories */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg mb-1">تصنيف الأخطاء</h3>
 <p className="text-sm text-[var(--text-muted)]">توزيع الأخطاء التشغيلية حسب النوع</p>
 </div>
 <ResponsiveContainer width="100%" height={280}>
 <PieChart>
 <Pie
 data={errorCategoriesData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={100}
 paddingAngle={3}
 dataKey="value"
 label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
 >
 {errorCategoriesData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.5rem',
 boxShadow: 'var(--shadow-md)'
 }}
 formatter={(value: number) => [`${value} خطأ`, '']}
 />
 </PieChart>
 </ResponsiveContainer>
 <div className="grid grid-cols-1 gap-[var(--spacing-small-gap)] mt-4">
 {errorCategoriesData.map((item, index) => (
 <div key={index} className="flex items-center justify-between">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
 <span className="text-sm">{item.name}</span>
 </div>
 <span className="text-sm font-medium text-[var(--text-muted)]">
 {item.value} ({((item.value / totalErrors) * 100).toFixed(0)}%)
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Delivery Time Trend */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg mb-1">اتجاه زمن التسليم</h3>
 <p className="text-sm text-[var(--text-muted)]">متوسط زمن التسليم مقارنة بالمستهدف (بالأيام)</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={deliveryTrendData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
 <XAxis
 dataKey="month"
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 />
 <YAxis
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 domain={[0, 4]}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.5rem',
 boxShadow: 'var(--shadow-md)'
 }}
 labelStyle={{ color: '#111827', fontWeight: 'bold' }}
 formatter={(value: number, name: string) => {
 const label = name === 'avgTime' ? 'الزمن الفعلي' : 'المستهدف';
 return [`${value} يوم`, label];
 }}
 />
 <Legend
 wrapperStyle={{ paddingTop: '20px' }}
 formatter={(value) => value === 'avgTime' ? 'الزمن الفعلي' : 'المستهدف'}
 />
 <Line
 type="monotone"
 dataKey="avgTime"
 stroke="#3b82f6"
 strokeWidth={3}
 dot={{ fill: 'var(--color-chart-1)', r: 5 }}
 activeDot={{ r: 7 }}
 />
 <Line
 type="monotone"
 dataKey="target"
 stroke="#9ca3af"
 strokeWidth={2}
 strokeDasharray="5 5"
 dot={{ fill: 'var(--muted-foreground)', r: 4 }}
 />
 </LineChart>
 </ResponsiveContainer>
 </div>

 {/* Team Productivity Table */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
 <div className="p-6 border-b border-[var(--border)]">
 <h3 className="text-lg mb-1">إنتاجية الفرق</h3>
 <p className="text-sm text-[var(--text-muted)]">مقارنة أداء الفرق التشغيلية</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-secondary/50">
 <tr>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">#</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الفريق</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">عدد الطلبات</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">متوسط الزمن</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">معدل الأخطاء</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الإنتاجية</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">الاتجاه</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
 {teamProductivity.map((team) => (
 <tr key={team.id} className="hover:bg-secondary/50 transition-colors">
 <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{team.id}</td>
 <td className="px-6 py-4">
 <p className="font-medium">{team.team}</p>
 </td>
 <td className="px-6 py-4 text-[var(--text-muted)]">
 {team.orders.toLocaleString()} طلب
 </td>
 <td className="px-6 py-4 text-[var(--text-muted)]">
 {team.avgTime} يوم
 </td>
 <td className="px-6 py-4">
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
 team.errorRate <= 2.5
 ? 'bg-[var(--primary)]/[0.2] text-[var(--primary)]'
 : team.errorRate <= 3.5
 ? 'bg-[var(--warning)]/[0.2] text-[var(--warning)]'
 : 'bg-[var(--destructive)]/20 text-[var(--destructive)]'
 }`}>
 {team.errorRate}%
 </span>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
 <div
 className={`h-full rounded-full ${
 team.productivity >= 90
 ? 'bg-[var(--primary)]'
 : team.productivity >= 85
 ? 'bg-yellow-500'
 : 'bg-[var(--destructive)]'
 }`}
 style={{ width: `${team.productivity}%` }}
 ></div>
 </div>
 <span className="text-sm font-medium w-12 text-left">{team.productivity}%</span>
 </div>
 </td>
 <td className="px-6 py-4">
 {team.trend === 'up' ? (
 <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
 ) : (
 <TrendingDown className="w-5 h-5 text-[var(--destructive)]" />
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Recommendation Card */}
 <div className="bg-gradient-to-l from-[var(--primary)]/[0.05] to-transparent border border-[var(--primary)]/[0.2] rounded-[var(--radius-card)] p-6">
 <div className="flex items-start gap-4">
 <div className="p-[var(--spacing-card-padding)] bg-gradient-to-br from-green-500 to-emerald-600 rounded-[var(--radius-card)]">
 <Target className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
 <h3 className="text-lg">التوصية الإستراتيجية</h3>
 <span className="px-2 py-1 bg-[var(--primary)]/[0.2] text-[var(--primary)] text-xs rounded-full">موصى به</span>
 </div>
 <p className="text-[var(--text-muted)] leading-relaxed mb-[var(--spacing-section-gap)]">
 نوصي بتطبيق <span className="text-[var(--text-primary)] font-medium">نظام إدارة الجودة الشاملة</span> لتقليل أخطاء التسليم بنسبة 40%.
 نقل أفضل الممارسات من <span className="text-[var(--text-primary)] font-medium">فريق الرياض</span> إلى الفرق الأخرى سيرفع الإنتاجية العامة بنسبة 12%.
 تحسين <span className="text-[var(--primary)] font-medium">عمليات الشحن واللوجستيات</span> سيخفض زمن التسليم إلى 2.0 يوم.
 </p>
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 <button className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-[var(--radius-button)] transition-colors">
 تطبيق التوصية
 </button>
 <button className="px-4 py-2 border border-[var(--border)] hover:bg-muted dark:hover:bg-muted rounded-[var(--radius-button)] transition-colors">
 عرض خطة التحسين
 </button>
 <button className="px-4 py-2 border border-[var(--border)] hover:bg-muted dark:hover:bg-muted rounded-[var(--radius-button)] transition-colors">
 تأجيل
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
