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
      bgColor: 'bg-orange-500/10',
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
      bgColor: 'bg-red-500/10',
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
      bgColor: 'bg-yellow-500/10',
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
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500'
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
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'تنبيهات المخزون المنخفض',
      value: '15',
      change: '+3',
      isPositive: false,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'المنتجات الراكدة',
      value: '23',
      change: '-5',
      isPositive: true,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'المنتجات التالفة',
      value: '8',
      change: '+2',
      isPositive: false,
      icon: XCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10'
    },
  ];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة المخزون</h2>
        <p className="text-muted-foreground">تحليل المخاطر التشغيلية وأداء إدارة المخزون</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${kpi.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm mb-2">{kpi.title}</h3>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* AI Inventory Insights Panel */}
      <div className="bg-gradient-to-l from-orange-500/10 via-red-500/10 to-transparent border border-orange-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-medium">تحليل المخاطر التشغيلية</h3>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs rounded-full">AI Alert</span>
            </div>
            <p className="text-foreground leading-relaxed mb-4">
              تم رصد <span className="font-bold text-red-600 dark:text-red-400">15 تنبيه مخزون منخفض حرج</span> يحتاج إجراء فوري.
              <span className="font-bold text-orange-600 dark:text-orange-400"> 23 منتج راكد</span> بقيمة 380K ر.س يؤثر على السيولة المالية.
              معدل الدوران تحسن إلى <span className="font-bold text-green-600">6.8</span> مما يدل على تحسن الكفاءة التشغيلية.
              <span className="font-bold text-foreground"> 4 منتجات</span> متوقع نفاذها خلال أقل من 3 أيام.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">القيمة المعرضة للخطر</p>
                <p className="text-2xl font-bold text-red-600">475K ر.س</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-sm text-muted-foreground mb-1">معدل الدوران</p>
                <p className="text-2xl font-bold text-green-600">6.8</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">الكفاءة التشغيلية</p>
                <p className="text-2xl font-bold text-blue-600">85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Risk Cards */}
      <div>
        <h3 className="text-lg font-medium mb-4">تصنيف المخاطر</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {productRisks.map((risk) => {
            const Icon = risk.icon;
            return (
              <div
                key={risk.id}
                className={`relative bg-card border-2 ${risk.borderColor} rounded-xl p-5 hover:shadow-xl transition-all duration-300 overflow-hidden group`}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${risk.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                <div className="relative">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${risk.color} mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h4 className="font-medium text-lg mb-1">{risk.title}</h4>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold">{risk.count}</span>
                    <span className="text-sm text-muted-foreground">منتج</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Inventory Movement Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-1">حركة المخزون</h3>
            <p className="text-sm text-muted-foreground">الوارد والصادر ومعدل الدوران</p>
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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
                stroke="var(--color-chart-1)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-chart-1)', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="outflow"
                stroke="var(--color-chart-2)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-chart-2)', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="turnover"
                stroke="var(--color-chart-3)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-chart-3)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Warehouse Performance */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-1">أداء المستودعات</h3>
            <p className="text-sm text-muted-foreground">معدل الدوران والمنتجات الراكدة</p>
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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
              <Bar dataKey="turnover" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="stagnant" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts Table */}
      <div className="bg-card border-2 border-red-500/30 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-red-500/5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-medium">تنبيهات المخزون المنخفض</h3>
            <span className="px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-full">
              عاجل
            </span>
          </div>
          <p className="text-sm text-muted-foreground">منتجات تحتاج طلب شراء فوري</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">المنتج</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">المخزون الحالي</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الحد الأدنى</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الأيام المتبقية</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lowStockAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{alert.product}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`font-medium ${alert.status === 'critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {alert.currentStock} وحدة
                    </p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {alert.minRequired} وحدة
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${alert.status === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
                      <span className={alert.status === 'critical' ? 'text-red-600 font-medium' : 'text-yellow-600'}>
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
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
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
      <div className="bg-gradient-to-l from-green-500/10 via-emerald-500/10 to-transparent border border-green-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-medium">التوصيات الذكية</h3>
              <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">
                AI Powered
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  <span className="font-medium text-red-600">طلب شراء عاجل</span> لـ 4 منتجات حرجة قبل نفاذها خلال 3 أيام
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  تخفيض أسعار <span className="font-medium text-foreground">23 منتج راكد</span> بقيمة 380K ر.س لتحرير السيولة
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  تطبيق نظام <span className="font-medium text-foreground">Just-In-Time</span> لتقليل المخزون الراكد بنسبة 40%
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  معالجة <span className="font-medium text-foreground">8 منتجات تالفة</span> وتحسين إجراءات الفحص الدوري
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-green-500/20">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                تطبيق جميع التوصيات
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm">
                إنشاء طلبات شراء
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm">
                عرض التفاصيل
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
