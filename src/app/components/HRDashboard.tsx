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
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'متوسط أداء الموظفين',
      value: '82/100',
      change: '+5.2',
      isPositive: true,
      icon: Award,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'معدل الاستقالات',
      value: '8.2%',
      change: '-2.1%',
      isPositive: true,
      icon: UserMinus,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'إتمام التدريب',
      value: '77.8%',
      change: '+12.5%',
      isPositive: true,
      icon: GraduationCap,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    },
  ];

  const totalResignations = resignationReasonsData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة الموارد البشرية</h2>
        <p className="text-muted-foreground">إدارة شاملة لرأس المال البشري والأداء والتطوير</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${kpi.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm mb-2">{kpi.title}</h3>
              <p className="text-2xl">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-l from-blue-500/10 via-purple-500/10 to-transparent border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg">رؤية الذكاء الاصطناعي</h3>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">AI</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              التحليل يُظهر تحسناً في <span className="text-foreground font-medium">معدل الحضور</span> بنسبة 5% بعد تطبيق نظام الحضور المرن.
              <span className="text-foreground font-medium"> 23% من الموظفين</span> حصلوا على تقييم ممتاز مما يعكس ثقافة أداء قوية.
              <span className="text-orange-600 dark:text-orange-400 font-medium"> الفرص الوظيفية الأفضل</span> تمثل 42% من أسباب الاستقالات وتحتاج استراتيجية احتفاظ.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">اتجاه الحضور</h3>
            <p className="text-sm text-muted-foreground">معدل الحضور الشهري مقارنة بالمستهدف</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
                domain={[85, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
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
                stroke="var(--color-chart-1)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-chart-1)', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-muted-foreground)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Performance Distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">توزيع أداء الموظفين</h3>
            <p className="text-sm text-muted-foreground">عدد الموظفين حسب التقييم</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="rating"
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
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value} موظف`, 'العدد']}
              />
              <Bar
                dataKey="count"
                fill="var(--color-chart-2)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resignation Reasons Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg mb-1">أسباب الاستقالات</h3>
          <p className="text-sm text-muted-foreground">تحليل الأسباب الرئيسية لترك الموظفين</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value} حالة`, '']}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col justify-center space-y-3">
            {resignationReasonsData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm">
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
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-chart-4" />
            <h3 className="text-lg">البرامج التدريبية</h3>
          </div>
          <p className="text-sm text-muted-foreground">تقدم الموظفين في البرامج التدريبية</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">#</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">البرنامج التدريبي</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">المسجلون</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">المكتملون</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">قيد التنفيذ</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">نسبة الإنجاز</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trainingProgress.map((program) => (
                <tr key={program.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">{program.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{program.program}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {program.enrolled} موظف
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">{program.completed}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {program.inProgress} موظف
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden min-w-[100px]">
                        <div
                          className={`h-full rounded-full ${
                            program.completion >= 80
                              ? 'bg-green-500'
                              : program.completion >= 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
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
      <div className="bg-gradient-to-l from-green-500/10 via-emerald-500/10 to-transparent border border-green-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg">التوصية الإستراتيجية</h3>
              <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">أولوية عالية</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              نوصي بتطوير <span className="text-foreground font-medium">برنامج مسارات وظيفية واضحة</span> لتقليل الاستقالات بسبب الفرص الأفضل بنسبة 35%.
              إطلاق <span className="text-foreground font-medium">برنامج حوافز أداء</span> للموظفين ذوي التقييم الممتاز سيرفع متوسط الأداء إلى 85/100.
              تكثيف البرامج التدريبية في <span className="text-green-600 font-medium">الذكاء الاصطناعي</span> سيعزز القدرات التنافسية للجهه.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                تطبيق التوصية
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors">
                عرض خطة الاحتفاظ
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors">
                تأجيل
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
