import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MousePointerClick
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
  Cell
} from 'recharts';

export function MarketingDashboard() {
  // Campaign performance data
  const campaigns = [
    { id: 1, name: 'حملة التواصل الاجتماعي Q2', spend: 120000, conversions: 450, roi: 285, status: 'active' },
    { id: 2, name: 'إعلانات جوجل - خدمات الأعمال', spend: 95000, conversions: 380, roi: 315, status: 'active' },
    { id: 3, name: 'التسويق بالمحتوى', spend: 65000, conversions: 290, roi: 245, status: 'completed' },
    { id: 4, name: 'حملة البريد الإلكتروني', spend: 45000, conversions: 220, roi: 198, status: 'active' },
  ];

  // Conversion funnel data
  const funnelData = [
    { stage: 'الزوار', value: 15000, fill: 'var(--color-chart-1)' },
    { stage: 'العملاء المحتملين', value: 8500, fill: 'var(--color-chart-2)' },
    { stage: 'المؤهلون', value: 4200, fill: 'var(--color-chart-3)' },
    { stage: 'المتفاوضون', value: 1800, fill: 'var(--color-chart-4)' },
    { stage: 'العملاء', value: 850, fill: 'var(--color-chart-5)' },
  ];

  // ROI trend data
  const roiTrendData = [
    { month: 'محرم', roi: 185, spend: 280000 },
    { month: 'صفر', roi: 210, spend: 295000 },
    { month: 'ربيع الأول', roi: 195, spend: 310000 },
    { month: 'ربيع الثاني', roi: 245, spend: 285000 },
    { month: 'جمادى الأولى', roi: 265, spend: 300000 },
    { month: 'جمادى الآخرة', roi: 280, spend: 325000 },
  ];

  // KPI data
  const kpis = [
    {
      title: 'معدل التحويل',
      value: '5.7%',
      change: '+1.2%',
      isPositive: true,
      icon: MousePointerClick,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      title: 'تكلفة التسويق',
      value: '325K ر.س',
      change: '+8.3%',
      isPositive: false,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      title: 'تكلفة التحويل',
      value: '382 ر.س',
      change: '-15.2%',
      isPositive: true,
      icon: Target,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10'
    },
    {
      title: 'العائد على الاستثمار',
      value: '280%',
      change: '+32%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10'
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">لوحة التسويق</h2>
        <p className="text-gray-500 dark:text-gray-400 text-base">تحليل أداء الحملات التسويقية والعائد على الاستثمار</p>
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

      {/* AI Marketing Insight */}
      <div className="bg-gradient-to-l from-blue-500/5 via-violet-500/5 to-transparent border border-blue-500/20 dark:border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg">رؤية تسويقية</h3>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 dark:text-blue-400 text-xs rounded-full">AI</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              <span className="text-gray-900 dark:text-white font-medium">إعلانات جوجل</span> تحقق أعلى عائد استثمار (315%) مع تكلفة تحويل أقل.
              معدل التحويل تحسن بنسبة <span className="text-emerald-600 dark:text-emerald-400 font-medium">21%</span> بعد تحسين الصفحات المقصودة.
              <span className="text-amber-600 dark:text-amber-400 dark:text-orange-400 font-medium"> 43% من الزوار</span> يغادرون في مرحلة العملاء المحتملين - نحتاج تحسين استراتيجية التأهيل.
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Performance Cards */}
      <div>
        <h3 className="text-lg mb-4">أداء الحملات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md border border-gray-200/80 dark:border-gray-700/50 rounded-xl p-5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">{campaign.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    campaign.status === 'active'
                      ? 'bg-green-500/20 text-emerald-600 dark:text-emerald-400 dark:text-green-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {campaign.status === 'active' ? 'نشطة' : 'مكتملة'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">الإنفاق</p>
                  <p className="font-medium">{campaign.spend.toLocaleString()} ر.س</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">التحويلات</p>
                  <p className="font-medium">{campaign.conversions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ROI</p>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">{campaign.roi}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* ROI Trend */}
        <div className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-5 md:p-6 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5">
          <div className="mb-6">
            <h3 className="text-lg mb-1">اتجاه العائد على الاستثمار</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">ROI والإنفاق التسويقي الشهري</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roiTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                yAxisId="right"
                orientation="left"
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
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="roi"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: 'var(--color-chart-1)', r: 5 }}
                name="العائد %"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="spend"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: 'var(--color-chart-2)', r: 5 }}
                name="الإنفاق ر.س"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-5 md:p-6 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5">
          <div className="mb-6">
            <h3 className="text-lg mb-1">قمع التحويل</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">رحلة العميل من الزائر إلى العميل</p>
          </div>
          <div className="space-y-3">
            {funnelData.map((stage, index) => {
              const percentage = index === 0 ? 100 : ((stage.value / funnelData[0].value) * 100);
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 right-0 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: stage.fill
                      }}
                    >
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Campaign ROI Table */}
      <div className="bg-white dark:bg-gray-900/60 dark:backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg">عائد الاستثمار حسب الحملة</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">الحملة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">الإنفاق</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">التحويلات</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">تكلفة التحويل</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 dark:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{campaign.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {campaign.spend.toLocaleString()} ر.س
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {campaign.conversions} تحويل
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {(campaign.spend / campaign.conversions).toFixed(0)} ر.س
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-emerald-600 dark:text-emerald-400 dark:text-green-400">
                      {campaign.roi}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
