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
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      title: 'معدل التحويل',
      value: '34.5%',
      change: '+5.3%',
      isPositive: true,
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      title: 'متوسط الفاتورة',
      value: '12,450 ر.س',
      change: '+8.7%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10'
    },
    {
      title: 'نمو المبيعات',
      value: '24.8%',
      change: '-2.1%',
      isPositive: false,
      icon: TrendingUp,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10'
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">لوحة المبيعات</h2>
        <p className="text-gray-500 dark:text-gray-400 text-base">نظرة شاملة على أداء المبيعات والإيرادات</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-5 md:p-6 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${kpi.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">{kpi.title}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-l from-blue-500/5 via-violet-500/5 to-transparent border border-blue-500/20 dark:border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg">رؤية الذكاء الاصطناعي</h3>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 dark:text-blue-400 text-xs rounded-full">AI</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              تحليل البيانات يُظهر أن <span className="text-gray-900 dark:text-white font-medium">منطقة الرياض</span> تحقق أعلى إيرادات بنسبة 38% من الإجمالي.
              المنتجات الاستشارية شهدت نمواً بنسبة <span className="text-emerald-600 dark:text-emerald-400 font-medium">+15.3%</span> خلال الشهر الماضي.
              معدل التحويل تحسن بشكل ملحوظ بفضل <span className="text-gray-900 dark:text-white font-medium">تحسينات تجربة المستخدم</span> التي تم تطبيقها في الربع الأخير.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Trends */}
        <div className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-5 md:p-6 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5">
          <div className="mb-6">
            <h3 className="text-lg mb-1">اتجاهات الإيرادات</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">مقارنة الإيرادات الفعلية بالمستهدفة</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                formatter={(value: number) => [`${value.toLocaleString()} ر.س`, '']}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => value === 'revenue' ? 'الإيرادات الفعلية' : 'المستهدف'}
              />
              <Line
                type="monotone"
                dataKey="revenue"
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
                dot={{ fill: '#9ca3af', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Performance */}
        <div className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-5 md:p-6 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5">
          <div className="mb-6">
            <h3 className="text-lg mb-1">أداء الفروع</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">مبيعات الفروع حسب المنطقة</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis
                type="number"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value / 1000}k`}
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'المبيعات']}
              />
              <Bar
                dataKey="sales"
                fill="#10b981"
                radius={[0, 8, 8, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg mb-1">المنتجات الأكثر مبيعاً</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">أفضل 5 منتجات من حيث الإيرادات</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">#</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">المنتج</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">المبيعات</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">الوحدات المباعة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">النمو</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.sales.toLocaleString()} ر.س</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {product.units} وحدة
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 ${product.growth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
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
      <div className="bg-gradient-to-l from-emerald-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg">التوصية الإستراتيجية</h3>
              <span className="px-2 py-1 bg-green-500/20 text-emerald-600 dark:text-emerald-400 dark:text-green-400 text-xs rounded-full">عاجل</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              نوصي بزيادة الاستثمار في <span className="text-gray-900 dark:text-white font-medium">فرع الرياض</span> بنسبة 20% والتركيز على
              <span className="text-gray-900 dark:text-white font-medium"> المنتجات الاستشارية</span> التي تحقق أعلى معدل نمو.
              من المتوقع أن يؤدي ذلك إلى زيادة الإيرادات بنسبة <span className="text-emerald-600 dark:text-emerald-400 font-medium">+28%</span> في الربع القادم.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                تطبيق التوصية
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                عرض التفاصيل الكاملة
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                تأجيل
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
