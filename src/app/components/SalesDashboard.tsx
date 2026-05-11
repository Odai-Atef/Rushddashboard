import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
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

export function SalesDashboard() {
  // Revenue trends data
  const revenueData = [
    { month: 'محرم', revenue: 450000, target: 400000 },
    { month: 'صفر', revenue: 520000, target: 450000 },
    { month: 'ربيع الأول', revenue: 480000, target: 500000 },
    { month: 'ربيع الثاني', revenue: 620000, target: 550000 },
    { month: 'جمادى الأولى', revenue: 680000, target: 600000 },
    { month: 'جمادى الآخرة', revenue: 750000, target: 650000 },
  ];

  // Branch performance data
  const branchData = [
    { branch: 'الرياض', sales: 320000 },
    { branch: 'جدة', sales: 280000 },
    { branch: 'الدمام', sales: 180000 },
    { branch: 'مكة', sales: 150000 },
    { branch: 'المدينة', sales: 120000 },
  ];

  // Top products data
  const topProducts = [
    { id: 1, name: 'منتج أ - نظام إدارة متكامل', sales: 450000, units: 125, growth: 15.3 },
    { id: 2, name: 'منتج ب - خدمات استشارية', sales: 380000, units: 89, growth: 12.8 },
    { id: 3, name: 'منتج ج - حلول سحابية', sales: 290000, units: 156, growth: -3.2 },
    { id: 4, name: 'منتج د - تطبيقات الجوال', sales: 210000, units: 67, growth: 8.5 },
    { id: 5, name: 'منتج هـ - تدريب وتأهيل', sales: 180000, units: 94, growth: 22.1 },
  ];

  // KPI data
  const kpis = [
    {
      title: 'إجمالي الإيرادات',
      value: '2.85M ر.س',
      change: '+18.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'معدل التحويل',
      value: '34.5%',
      change: '+5.3%',
      isPositive: true,
      icon: Target,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'متوسط الفاتورة',
      value: '12,450 ر.س',
      change: '+8.7%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'نمو المبيعات',
      value: '24.8%',
      change: '-2.1%',
      isPositive: false,
      icon: TrendingUp,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة المبيعات</h2>
        <p className="text-muted-foreground">نظرة شاملة على أداء المبيعات والإيرادات</p>
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
              تحليل البيانات يُظهر أن <span className="text-foreground font-medium">منطقة الرياض</span> تحقق أعلى إيرادات بنسبة 38% من الإجمالي.
              المنتجات الاستشارية شهدت نمواً بنسبة <span className="text-green-600 font-medium">+15.3%</span> خلال الشهر الماضي.
              معدل التحويل تحسن بشكل ملحوظ بفضل <span className="text-foreground font-medium">تحسينات تجربة المستخدم</span> التي تم تطبيقها في الربع الأخير.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">اتجاهات الإيرادات</h3>
            <p className="text-sm text-muted-foreground">مقارنة الإيرادات الفعلية بالمستهدفة</p>
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
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
                formatter={(value: number) => [`${value.toLocaleString()} ر.س`, '']}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => value === 'revenue' ? 'الإيرادات الفعلية' : 'المستهدف'}
              />
              <Line
                type="monotone"
                dataKey="revenue"
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

        {/* Branch Performance */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">أداء الفروع</h3>
            <p className="text-sm text-muted-foreground">مبيعات الفروع حسب المنطقة</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                type="number"
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <YAxis
                type="category"
                dataKey="branch"
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'المبيعات']}
              />
              <Bar
                dataKey="sales"
                fill="var(--color-chart-2)"
                radius={[0, 8, 8, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg mb-1">المنتجات الأكثر مبيعاً</h3>
          <p className="text-sm text-muted-foreground">أفضل 5 منتجات من حيث الإيرادات</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">#</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">المنتج</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">المبيعات</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الوحدات المباعة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">النمو</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">{product.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.sales.toLocaleString()} ر.س</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {product.units} وحدة
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-medium">{Math.abs(product.growth)}%</span>
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
              <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">عاجل</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              نوصي بزيادة الاستثمار في <span className="text-foreground font-medium">فرع الرياض</span> بنسبة 20% والتركيز على
              <span className="text-foreground font-medium"> المنتجات الاستشارية</span> التي تحقق أعلى معدل نمو.
              من المتوقع أن يؤدي ذلك إلى زيادة الإيرادات بنسبة <span className="text-green-600 font-medium">+28%</span> في الربع القادم.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                تطبيق التوصية
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors">
                عرض التفاصيل الكاملة
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
