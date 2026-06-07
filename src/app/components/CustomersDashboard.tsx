import {
  Users,
  UserMinus,
  Star,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Crown
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

export function CustomersDashboard() {
  // Customer segments data
  const segmentsData = [
    { name: 'عملاء مميزون', value: 1250, color: 'var(--color-chart-1)' },
    { name: 'عملاء نشطون', value: 3400, color: 'var(--color-chart-2)' },
    { name: 'عملاء عاديون', value: 2100, color: 'var(--color-chart-3)' },
    { name: 'عملاء غير نشطين', value: 890, color: 'var(--color-muted-foreground)' },
  ];

  // Loyalty trend data
  const loyaltyData = [
    { month: 'محرم', loyaltyScore: 72, customerRetention: 85 },
    { month: 'صفر', loyaltyScore: 75, customerRetention: 87 },
    { month: 'ربيع الأول', loyaltyScore: 78, customerRetention: 88 },
    { month: 'ربيع الثاني', loyaltyScore: 76, customerRetention: 86 },
    { month: 'جمادى الأولى', loyaltyScore: 80, customerRetention: 90 },
    { month: 'جمادى الآخرة', loyaltyScore: 83, customerRetention: 92 },
  ];

  // Complaints breakdown data
  const complaintsData = [
    { category: 'جودة الخدمة', count: 45 },
    { category: 'التأخير', count: 32 },
    { category: 'الأسعار', count: 28 },
    { category: 'الدعم الفني', count: 18 },
    { category: 'أخرى', count: 12 },
  ];

  // High-value customers data
  const highValueCustomers = [
    { id: 1, name: 'شركة النخبة للتجارة', value: 1250000, transactions: 145, satisfaction: 4.8 },
    { id: 2, name: 'مؤسسة الأفق للاستثمار', value: 980000, transactions: 112, satisfaction: 4.9 },
    { id: 3, name: 'شركة الريادة للتقنية', value: 850000, transactions: 98, satisfaction: 4.7 },
    { id: 4, name: 'مجموعة الابتكار القابضة', value: 720000, transactions: 89, satisfaction: 4.6 },
    { id: 5, name: 'شركة المستقبل للحلول', value: 680000, transactions: 76, satisfaction: 4.5 },
  ];

  // KPI data
  const kpis = [
    {
      title: 'العملاء النشطون',
      value: '7,640',
      change: '+12.3%',
      isPositive: true,
      icon: Users,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'معدل التسرب',
      value: '8.2%',
      change: '-2.4%',
      isPositive: true,
      icon: UserMinus,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'درجة الرضا',
      value: '4.7/5',
      change: '+0.3',
      isPositive: true,
      icon: Star,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'الشكاوى',
      value: '135',
      change: '-18.5%',
      isPositive: true,
      icon: AlertCircle,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة العملاء</h2>
        <p className="text-muted-foreground">تحليل شامل لسلوك العملاء والولاء والرضا</p>
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
              تحليل بيانات العملاء يُظهر أن <span className="text-foreground font-medium">معدل الاحتفاظ بالعملاء</span> تحسن بنسبة 7% في الأشهر الستة الماضية.
              العملاء المميزون يمثلون <span className="text-green-600 font-medium">42% من إجمالي الإيرادات</span> رغم كونهم 16% فقط من القاعدة.
              الشكاوى المتعلقة <span className="text-foreground font-medium">بجودة الخدمة</span> انخفضت بنسبة 28% بعد تطبيق البرنامج التدريبي الجديد.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">شرائح العملاء</h3>
            <p className="text-sm text-muted-foreground">توزيع العملاء حسب مستوى النشاط</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {segmentsData.map((entry, index) => (
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
                formatter={(value: number) => [`${value.toLocaleString()} عميل`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {segmentsData.map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                <span className="text-sm text-muted-foreground">{segment.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints Breakdown */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg mb-1">تحليل الشكاوى</h3>
            <p className="text-sm text-muted-foreground">توزيع الشكاوى حسب الفئة</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                type="number"
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                type="category"
                dataKey="category"
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value} شكوى`, '']}
              />
              <Bar
                dataKey="count"
                fill="var(--color-chart-4)"
                radius={[0, 8, 8, 0]}
                maxBarSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loyalty Trend Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg mb-1">اتجاه الولاء والاحتفاظ</h3>
          <p className="text-sm text-muted-foreground">تطور درجة الولاء ومعدل الاحتفاظ بالعملاء</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={loyaltyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => value === 'loyaltyScore' ? 'درجة الولاء' : 'معدل الاحتفاظ %'}
            />
            <Line
              type="monotone"
              dataKey="loyaltyScore"
              stroke="var(--color-chart-1)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-chart-1)', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="customerRetention"
              stroke="var(--color-chart-2)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-chart-2)', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* High-Value Customers Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg">العملاء الأكثر قيمة</h3>
          </div>
          <p className="text-sm text-muted-foreground">أعلى 5 عملاء من حيث القيمة الإجمالية</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">#</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">اسم العميل</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">القيمة الإجمالية</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">عدد المعاملات</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">درجة الرضا</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {highValueCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">{customer.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {customer.id === 1 && <Crown className="w-4 h-4 text-yellow-500" />}
                      <p className="font-medium">{customer.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-green-600">{customer.value.toLocaleString()} ر.س</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {customer.transactions} معاملة
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{customer.satisfaction}</span>
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
              <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">موصى به</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              نوصي بإطلاق <span className="text-foreground font-medium">برنامج ولاء متقدم</span> للعملاء المميزين لزيادة معدل الاحتفاظ إلى 95%.
              كذلك يُنصح بالتركيز على <span className="text-foreground font-medium">تحسين جودة الخدمة</span> لتقليل الشكاوى بنسبة إضافية 35%.
              من المتوقع أن يؤدي ذلك إلى زيادة <span className="text-green-600 font-medium">القيمة الدائمة للعميل</span> بنسبة 42% خلال 12 شهر.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                تطبيق التوصية
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors">
                عرض خطة العمل
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
