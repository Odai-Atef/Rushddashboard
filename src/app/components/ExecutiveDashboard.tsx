import {
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
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
        return 'border-r-4 border-red-500 bg-red-500/10';
      case 'warning':
        return 'border-r-4 border-yellow-500 bg-yellow-500/10';
      case 'info':
        return 'border-r-4 border-blue-500 bg-blue-500/10';
      default:
        return 'border-r-4 border-muted';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة القيادة التنفيذية</h2>
        <p className="text-muted-foreground">نظرة عامة سريعة عن الوضع العام للمنصة</p>
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

      {/* AI Executive Summary */}
      <div className="bg-gradient-to-l from-purple-500/10 via-blue-500/10 to-transparent border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl">الملخص التنفيذي</h3>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">AI Executive</span>
            </div>
            <p className="text-foreground leading-relaxed mb-4">
              الأداء العام للمنصة <span className="font-bold text-green-600">إيجابي ومستقر</span> مع نمو 18.7% في الإيرادات و12.3% في قاعدة العملاء.
              القناة B2B تُظهر <span className="font-bold">إمكانات نمو استثنائية</span> بهامش ربح 45%.
              يوجد <span className="font-bold text-orange-600 dark:text-orange-400">12 تنبيه نشط</span> يحتاج اهتماماً فورياً، أبرزها انخفاض معدل التحويل وارتفاع الشكاوى.
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">اتجاه الإيرادات</h3>
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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">نمو العملاء</h3>
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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Alerts Panel */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg">التنبيهات</h3>
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
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="text-lg">أهم 3 توصيات</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {topRecommendations.map((rec, index) => (
              <div key={rec.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{rec.title}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600 font-medium">{rec.impact}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority === 'urgent' ? 'عاجل' : 'أولوية عالية'}
                      </span>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-green-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
