import {
 Users,
 TrendingUp,
 TrendingDown,
 UserMinus,
 GraduationCap,
 CheckCircle,
 ArrowUpRight,
 ArrowDownRight,
 Sparkles,
 Target,
 Award,
 Calendar
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

export function HRDashboard() {
 // Attendance trend data
 const attendanceData = [
 { month: 'محرم', rate: 92, target: 95 },
 { month: 'صفر', rate: 94, target: 95 },
 { month: 'ربيع الأول', rate: 93, target: 95 },
 { month: 'ربيع الثاني', rate: 95, target: 95 },
 { month: 'جمادى الأولى', rate: 96, target: 95 },
 { month: 'جمادى الآخرة', rate: 97, target: 95 },
 ];

 // Employee performance distribution data
 const performanceDistribution = [
 { rating: 'ممتاز', count: 145, range: '90-100' },
 { rating: 'جيد جداً', count: 210, range: '80-89' },
 { rating: 'جيد', count: 165, range: '70-79' },
 { rating: 'مقبول', count: 85, range: '60-69' },
 { rating: 'ضعيف', count: 25, range: '0-59' },
 ];

 // Resignation reasons data
 const resignationReasonsData = [
 { name: 'فرص أفضل', value: 42, color: 'var(--color-chart-1)' },
 { name: 'الرواتب', value: 28, color: 'var(--color-chart-2)' },
 { name: 'بيئة العمل', value: 18, color: 'var(--color-chart-3)' },
 { name: 'التطوير الوظيفي', value: 8, color: 'var(--color-chart-4)' },
 { name: 'أسباب شخصية', value: 4, color: 'var(--color-chart-5)' },
 ];

 // Training progress data
 const trainingProgress = [
 { id: 1, program: 'برنامج القيادة التنفيذية', enrolled: 45, completed: 38, inProgress: 7, completion: 84 },
 { id: 2, program: 'التحول الرقمي وإدارة التغيير', enrolled: 68, completed: 52, inProgress: 16, completion: 76 },
 { id: 3, program: 'إدارة المشاريع الاحترافية', enrolled: 52, completed: 45, inProgress: 7, completion: 87 },
 { id: 4, program: 'مهارات التواصل والعرض', enrolled: 90, completed: 68, inProgress: 22, completion: 76 },
 { id: 5, program: 'الذكاء الاصطناعي والابتكار', enrolled: 38, completed: 25, inProgress: 13, completion: 66 },
 ];

 // KPI data
 const kpis = [
 {
 title: 'معدل الحضور',
 value: '96.5%',
 change: '+3.8%',
 isPositive: true,
 icon: Calendar,
 color: 'text-[var(--secondary)]',
 bgColor: 'bg-[var(--secondary)]/[0.08]/10'
 },
 {
 title: 'متوسط أداء الموظفين',
 value: '82/100',
 change: '+5.2',
 isPositive: true,
 icon: Award,
 color: 'text-[var(--primary)]',
 bgColor: 'bg-[var(--primary)]/[0.08]/[0.08]0/10'
 },
 {
 title: 'معدل الاستقالات',
 value: '8.2%',
 change: '-2.1%',
 isPositive: true,
 icon: UserMinus,
 color: 'text-[var(--warning)]',
 bgColor: 'bg-[var(--warning)]/[0.08]'
 },
 {
 title: 'إتمام التدريب',
 value: '77.8%',
 change: '+12.5%',
 isPositive: true,
 icon: GraduationCap,
 color: 'text-[var(--secondary)]',
 bgColor: 'bg-[var(--secondary)]/[0.08]'
 },
 ];

 const totalResignations = resignationReasonsData.reduce((sum, item) => sum + item.value, 0);

 return (
 <div className="space-y-6 md:space-y-8">
 {/* Header */}
 <div className="border-b border-[var(--border)] pb-6">
 <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">لوحة الموارد البشرية</h2>
 <p className="text-[var(--text-muted)] text-base">إدارة شاملة لرأس المال البشري والأداء والتطوير</p>
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
 التحليل يُظهر تحسناً في <span className="text-[var(--text-primary)] font-medium">معدل الحضور</span> بنسبة 5% بعد تطبيق نظام الحضور المرن.
 <span className="text-[var(--text-primary)] font-medium"> 23% من الموظفين</span> حصلوا على تقييم ممتاز مما يعكس ثقافة أداء قوية.
 <span className="text-[var(--warning)] font-medium"> الفرص الوظيفية الأفضل</span> تمثل 42% من أسباب الاستقالات وتحتاج استراتيجية احتفاظ.
 </p>
 </div>
 </div>
 </div>

 {/* Charts Section */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--spacing-grid-gap)]">
 {/* Attendance Trend */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg mb-1">اتجاه الحضور</h3>
 <p className="text-sm text-[var(--text-muted)]">معدل الحضور الشهري مقارنة بالمستهدف</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={attendanceData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
 <XAxis
 dataKey="month"
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 />
 <YAxis
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 domain={[85, 100]}
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
 const label = name === 'rate' ? 'معدل الحضور' : 'المستهدف';
 return [`${value}%`, label];
 }}
 />
 <Legend
 wrapperStyle={{ paddingTop: '20px' }}
 formatter={(value) => value === 'rate' ? 'معدل الحضور' : 'المستهدف'}
 />
 <Line
 type="monotone"
 dataKey="rate"
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

 {/* Employee Performance Distribution */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg mb-1">توزيع أداء الموظفين</h3>
 <p className="text-sm text-[var(--text-muted)]">عدد الموظفين حسب التقييم</p>
 </div>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={performanceDistribution}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
 <XAxis
 dataKey="rating"
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 />
 <YAxis
 stroke="#9ca3af"
 style={{ fontSize: '12px' }}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--card)',
 border: '1px solid var(--border)',
 borderRadius: '0.5rem',
 boxShadow: 'var(--shadow-md)'
 }}
 formatter={(value: number) => [`${value} موظف`, 'العدد']}
 />
 <Bar
 dataKey="count"
 fill="#10b981"
 radius={[8, 8, 0, 0]}
 />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Resignation Reasons Chart */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--spacing-card-padding)] shadow-[var(--shadow-card)]">
 <div className="mb-6">
 <h3 className="text-lg mb-1">أسباب الاستقالات</h3>
 <p className="text-sm text-[var(--text-muted)]">تحليل الأسباب الرئيسية لترك الموظفين</p>
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-grid-gap)]">
 <ResponsiveContainer width="100%" height={280}>
 <PieChart>
 <Pie
 data={resignationReasonsData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={100}
 paddingAngle={3}
 dataKey="value"
 label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
 >
 {resignationReasonsData.map((entry, index) => (
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
 formatter={(value: number) => [`${value} حالة`, '']}
 />
 </PieChart>
 </ResponsiveContainer>

 <div className="flex flex-col justify-center space-y-[var(--spacing-small-gap)]">
 {resignationReasonsData.map((item, index) => (
 <div key={index} className="flex items-center justify-between p-[var(--spacing-card-padding)] bg-muted/50 rounded-[var(--radius-button)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
 <span className="font-medium">{item.name}</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className="text-[var(--text-muted)] text-sm">
 {item.value} حالة
 </span>
 <span className="font-medium text-sm">
 {((item.value / totalResignations) * 100).toFixed(0)}%
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Training Progress Table */}
 <div className="bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
 <div className="p-6 border-b border-[var(--border)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-1">
 <GraduationCap className="w-5 h-5 text-[var(--secondary)]" />
 <h3 className="text-lg">البرامج التدريبية</h3>
 </div>
 <p className="text-sm text-[var(--text-muted)]">تقدم الموظفين في البرامج التدريبية</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-muted/50">
 <tr>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">#</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">البرنامج التدريبي</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">المسجلون</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">المكتملون</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">قيد التنفيذ</th>
 <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]">نسبة الإنجاز</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--border)]">
 {trainingProgress.map((program) => (
 <tr key={program.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{program.id}</td>
 <td className="px-6 py-4">
 <p className="font-medium">{program.program}</p>
 </td>
 <td className="px-6 py-4 text-[var(--text-muted)]">
 {program.enrolled} موظف
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <CheckCircle className="w-4 h-4 text-[var(--primary)]" />
 <span className="text-[var(--primary)] font-medium">{program.completed}</span>
 </div>
 </td>
 <td className="px-6 py-4 text-[var(--text-muted)]">
 {program.inProgress} موظف
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden min-w-[100px]">
 <div
 className={`h-full rounded-full ${
 program.completion >= 80
 ? 'bg-[var(--primary)]'
 : program.completion >= 70
 ? 'bg-yellow-500'
 : 'bg-[var(--destructive)]'
 }`}
 style={{ width: `${program.completion}%` }}
 ></div>
 </div>
 <span className="text-sm font-medium w-12 text-left">{program.completion}%</span>
 </div>
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
 <span className="px-2 py-1 bg-[var(--primary)]/[0.2] text-[var(--primary)] text-xs rounded-full">أولوية عالية</span>
 </div>
 <p className="text-[var(--text-muted)] leading-relaxed mb-[var(--spacing-section-gap)]">
 نوصي بتطوير <span className="text-[var(--text-primary)] font-medium">برنامج مسارات وظيفية واضحة</span> لتقليل الاستقالات بسبب الفرص الأفضل بنسبة 35%.
 إطلاق <span className="text-[var(--text-primary)] font-medium">برنامج حوافز أداء</span> للموظفين ذوي التقييم الممتاز سيرفع متوسط الأداء إلى 85/100.
 تكثيف البرامج التدريبية في <span className="text-[var(--primary)] font-medium">الذكاء الاصطناعي</span> سيعزز القدرات التنافسية للجهه.
 </p>
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 <button className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-[var(--radius-button)] transition-colors">
 تطبيق التوصية
 </button>
 <button className="px-4 py-2 border border-[var(--border)] hover:bg-muted dark:hover:bg-muted rounded-[var(--radius-button)] transition-colors">
 عرض خطة الاحتفاظ
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
