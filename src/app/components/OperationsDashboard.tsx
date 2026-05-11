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
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'معدل الأخطاء',
      value: '2.8%',
      change: '-1.2%',
      isPositive: true,
      icon: AlertCircle,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'متوسط زمن التسليم',
      value: '2.4 يوم',
      change: '-0.8 يوم',
      isPositive: true,
      icon: Truck,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'درجة الإنتاجية',
      value: '88/100',
      change: '+4.2',
      isPositive: true,
      icon: Activity,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    },
  ];

  const totalErrors = errorCategoriesData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة العمليات</h2>
        <p className="text-muted-foreground">مراقبة الأداء التشغيلي والكفاءة والإنتاجية</p>
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
              التحليل يُظهر تحسناً ملحوظاً في <span className="text-foreground font-medium">زمن التسليم</span> بنسبة 25% خلال الأشهر الستة الماضية.
              <span className="text-foreground font-medium"> فريق الرياض</span> يحقق أعلى إنتاجية بمعدل 95/100 مع أقل معدل أخطاء.
              <span className="text-orange-600 dark:text-orange-400 font-medium"> تأخير التسليم</span> يمثل 35% من الأخطاء ويحتاج تحسين عاجل.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Process Performance Radar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">أداء العمليات</h3>
            <p className="text-sm text-muted-foreground">تقييم السرعة والدقة والكفاءة لكل عملية</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={processData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="process"
                tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
              />
              <Radar
                name="السرعة"
                dataKey="speed"
                stroke="var(--color-chart-1)"
                fill="var(--color-chart-1)"
                fillOpacity={0.3}
              />
              <Radar
                name="الدقة"
                dataKey="accuracy"
                stroke="var(--color-chart-2)"
                fill="var(--color-chart-2)"
                fillOpacity={0.3}
              />
              <Radar
                name="الكفاءة"
                dataKey="efficiency"
                stroke="var(--color-chart-3)"
                fill="var(--color-chart-3)"
                fillOpacity={0.3}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Error Categories */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">تصنيف الأخطاء</h3>
            <p className="text-sm text-muted-foreground">توزيع الأخطاء التشغيلية حسب النوع</p>
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
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value} خطأ`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {errorCategoriesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {item.value} ({((item.value / totalErrors) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Time Trend */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg mb-1">اتجاه زمن التسليم</h3>
          <p className="text-sm text-muted-foreground">متوسط زمن التسليم مقارنة بالمستهدف (بالأيام)</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={deliveryTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              domain={[0, 4]}
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

      {/* Team Productivity Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg mb-1">إنتاجية الفرق</h3>
          <p className="text-sm text-muted-foreground">مقارنة أداء الفرق التشغيلية</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">#</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الفريق</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">عدد الطلبات</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">متوسط الزمن</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">معدل الأخطاء</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الإنتاجية</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الاتجاه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teamProductivity.map((team) => (
                <tr key={team.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">{team.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{team.team}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {team.orders.toLocaleString()} طلب
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {team.avgTime} يوم
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      team.errorRate <= 2.5
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : team.errorRate <= 3.5
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                      {team.errorRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            team.productivity >= 90
                              ? 'bg-green-500'
                              : team.productivity >= 85
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${team.productivity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-left">{team.productivity}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {team.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
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
              <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">موصى به</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              نوصي بتطبيق <span className="text-foreground font-medium">نظام إدارة الجودة الشاملة</span> لتقليل أخطاء التسليم بنسبة 40%.
              نقل أفضل الممارسات من <span className="text-foreground font-medium">فريق الرياض</span> إلى الفرق الأخرى سيرفع الإنتاجية العامة بنسبة 12%.
              تحسين <span className="text-green-600 font-medium">عمليات الشحن واللوجستيات</span> سيخفض زمن التسليم إلى 2.0 يوم.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                تطبيق التوصية
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors">
                عرض خطة التحسين
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
