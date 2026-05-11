import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
  Target
} from 'lucide-react';
import {
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
  LineChart,
  Line
} from 'recharts';

export function ProfitabilityDashboard() {
  // Profit margin by product data
  const productProfitData = [
    { product: 'منتج أ', revenue: 450000, cost: 270000, margin: 40 },
    { product: 'منتج ب', revenue: 380000, cost: 247000, margin: 35 },
    { product: 'منتج ج', revenue: 290000, cost: 203000, margin: 30 },
    { product: 'منتج د', revenue: 210000, cost: 157500, margin: 25 },
    { product: 'منتج هـ', revenue: 180000, cost: 144000, margin: 20 },
  ];

  // Cost breakdown data
  const costBreakdownData = [
    { name: 'الرواتب والأجور', value: 850000, color: 'var(--color-chart-1)' },
    { name: 'التشغيل والصيانة', value: 420000, color: 'var(--color-chart-2)' },
    { name: 'التسويق والإعلان', value: 280000, color: 'var(--color-chart-3)' },
    { name: 'الإيجارات', value: 180000, color: 'var(--color-chart-4)' },
    { name: 'تكاليف أخرى', value: 120000, color: 'var(--color-chart-5)' },
  ];

  // Channel profitability data
  const channelData = [
    { channel: 'التجارة الإلكترونية', profit: 520000, margin: 42 },
    { channel: 'المتاجر الفعلية', profit: 380000, margin: 28 },
    { channel: 'الشركات B2B', profit: 680000, margin: 45 },
    { channel: 'الموزعون', profit: 220000, margin: 22 },
  ];

  // Branch profitability data
  const branchProfitability = [
    { id: 1, branch: 'الرياض', revenue: 1250000, cost: 750000, profit: 500000, margin: 40.0, trend: 'up' },
    { id: 2, branch: 'جدة', revenue: 980000, cost: 637000, profit: 343000, margin: 35.0, trend: 'up' },
    { id: 3, branch: 'الدمام', revenue: 720000, cost: 504000, profit: 216000, margin: 30.0, trend: 'down' },
    { id: 4, branch: 'مكة', revenue: 580000, cost: 418400, profit: 161600, margin: 27.9, trend: 'up' },
    { id: 5, branch: 'المدينة', revenue: 450000, cost: 337500, profit: 112500, margin: 25.0, trend: 'down' },
  ];

  // KPI data
  const kpis = [
    {
      title: 'هامش الربح الإجمالي',
      value: '35.8%',
      change: '+3.2%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'إجمالي التكاليف',
      value: '1.85M ر.س',
      change: '-5.4%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'صافي الربح',
      value: '1.33M ر.س',
      change: '+18.7%',
      isPositive: true,
      icon: PiggyBank,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'أعلى فرع ربحية',
      value: 'الرياض',
      change: '40%',
      isPositive: true,
      icon: MapPin,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    },
  ];

  const totalCosts = costBreakdownData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة الربحية</h2>
        <p className="text-muted-foreground">تحليل تفصيلي للأرباح والتكاليف والهوامش المالية</p>
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

      {/* AI Insight Card - Risk Highlighting */}
      <div className="bg-gradient-to-l from-orange-500/10 via-yellow-500/10 to-transparent border border-orange-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg">تحذير المخاطر المالية</h3>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs rounded-full">تنبيه</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              التحليل يُظهر أن <span className="text-foreground font-medium">تكاليف الرواتب</span> زادت بنسبة 12% مقارنة بالربع السابق.
              فرعا <span className="text-orange-600 dark:text-orange-400 font-medium">الدمام والمدينة</span> يشهدان انخفاضاً في الهوامش الربحية بنسبة -8%.
              قناة <span className="text-foreground font-medium">الموزعون</span> تحقق أقل هامش ربح (22%) ويجب إعادة تقييم استراتيجيتها.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profit Margin by Product */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">هامش الربح حسب المنتج</h3>
            <p className="text-sm text-muted-foreground">مقارنة الإيرادات والتكاليف والهوامش</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productProfitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="product"
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
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    revenue: 'الإيرادات',
                    cost: 'التكاليف',
                    margin: 'هامش الربح'
                  };
                  if (name === 'margin') {
                    return [`${value}%`, labels[name]];
                  }
                  return [`${value.toLocaleString()} ر.س`, labels[name]];
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    revenue: 'الإيرادات',
                    cost: 'التكاليف'
                  };
                  return labels[value] || value;
                }}
              />
              <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="cost" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">تحليل التكاليف</h3>
            <p className="text-sm text-muted-foreground">توزيع التكاليف حسب الفئة</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} ر.س`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {costBreakdownData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {((item.value / totalCosts) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Profitability Comparison */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg mb-1">مقارنة ربحية القنوات</h3>
          <p className="text-sm text-muted-foreground">الأرباح والهوامش حسب قناة البيع</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={channelData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              type="number"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="channel"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'profit') {
                  return [`${value.toLocaleString()} ر.س`, 'الربح'];
                }
                return [`${value}%`, 'الهامش'];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => value === 'profit' ? 'الربح' : 'هامش الربح %'}
            />
            <Bar dataKey="profit" fill="var(--color-chart-1)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Branch Profitability Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg mb-1">ربحية الفروع</h3>
          <p className="text-sm text-muted-foreground">تحليل الأداء المالي لكل فرع</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">#</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الفرع</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الإيرادات</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">التكاليف</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">صافي الربح</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">هامش الربح</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الاتجاه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {branchProfitability.map((branch) => (
                <tr key={branch.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">{branch.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{branch.branch}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {branch.revenue.toLocaleString()} ر.س
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {branch.cost.toLocaleString()} ر.س
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-green-600">{branch.profit.toLocaleString()} ر.س</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      branch.margin >= 35
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : branch.margin >= 28
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                      {branch.margin}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {branch.trend === 'up' ? (
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
              <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">أولوية عالية</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              نوصي بـ<span className="text-foreground font-medium">تحسين الكفاءة التشغيلية</span> في فرعي الدمام والمدينة لرفع الهوامش بنسبة 5%.
              إعادة التفاوض على <span className="text-foreground font-medium">تكاليف الرواتب</span> وتحسين الإنتاجية يمكن أن يوفر 180,000 ر.س سنوياً.
              التركيز على قناة <span className="text-green-600 font-medium">B2B ذات هامش الـ 45%</span> سيزيد الأرباح بنسبة 32% خلال 6 أشهر.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                تطبيق التوصية
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors">
                تحليل مالي تفصيلي
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
