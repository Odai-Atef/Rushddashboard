import { ExecutiveDashboard } from './ExecutiveDashboard';
import { AIAnalysisPage } from './AIAnalysisPage';
import { SalesDashboard } from './SalesDashboard';
import { CustomersDashboard } from './CustomersDashboard';
import { ProfitabilityDashboard } from './ProfitabilityDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { HRDashboard } from './HRDashboard';
import { MarketingDashboard } from './MarketingDashboard';
import { RecommendationsDashboard } from './RecommendationsDashboard';
import { OpportunitiesDashboard } from './OpportunitiesDashboard';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardContentProps {
  activeView: string;
}

export function DashboardContent({ activeView }: DashboardContentProps) {
  // Render Executive Dashboard when executive view is active
  if (activeView === 'executive') {
    return (
      <div className="p-4 md:p-6">
        <ExecutiveDashboard />
      </div>
    );
  }

  // Render AI Analysis Page when ai-analysis view is active
  if (activeView === 'ai-analysis') {
    return <AIAnalysisPage />;
  }

  // Render Sales Dashboard when sales view is active
  if (activeView === 'sales') {
    return (
      <div className="p-4 md:p-6">
        <SalesDashboard />
      </div>
    );
  }

  // Render Customers Dashboard when customers view is active
  if (activeView === 'customers') {
    return (
      <div className="p-4 md:p-6">
        <CustomersDashboard />
      </div>
    );
  }

  // Render Profitability Dashboard when profitability view is active
  if (activeView === 'profitability') {
    return (
      <div className="p-4 md:p-6">
        <ProfitabilityDashboard />
      </div>
    );
  }

  // Render Operations Dashboard when operations view is active
  if (activeView === 'operations') {
    return (
      <div className="p-4 md:p-6">
        <OperationsDashboard />
      </div>
    );
  }

  // Render HR Dashboard when hr view is active
  if (activeView === 'hr') {
    return (
      <div className="p-4 md:p-6">
        <HRDashboard />
      </div>
    );
  }

  // Render Marketing Dashboard when marketing view is active
  if (activeView === 'marketing') {
    return (
      <div className="p-4 md:p-6">
        <MarketingDashboard />
      </div>
    );
  }

  // Render Recommendations Dashboard when recommendations view is active
  if (activeView === 'recommendations') {
    return (
      <div className="p-4 md:p-6">
        <RecommendationsDashboard />
      </div>
    );
  }

  // Render Opportunities Dashboard when opportunities view is active
  if (activeView === 'opportunities') {
    return (
      <div className="p-4 md:p-6">
        <OpportunitiesDashboard />
      </div>
    );
  }

  // Generic dashboard for other views
  const salesData = [
    { month: 'يناير', value: 4000 },
    { month: 'فبراير', value: 3000 },
    { month: 'مارس', value: 5000 },
    { month: 'أبريل', value: 4500 },
    { month: 'مايو', value: 6000 },
    { month: 'يونيو', value: 5500 },
  ];

  const getViewTitle = () => {
    const titles: Record<string, string> = {
      executive: 'لوحة القيادة التنفيذية',
      'ai-analysis': 'المحلل التنفيذي الذكي',
      sales: 'لوحة المبيعات',
      customers: 'لوحة العملاء',
      profitability: 'لوحة الربحية',
      operations: 'لوحة التشغيل',
      hr: 'لوحة الموارد البشرية',
      marketing: 'لوحة التسويق',
      recommendations: 'لوحة التوصيات',
      opportunities: 'لوحة الفرص',
    };
    return titles[activeView] || 'لوحة القيادة التنفيذية';
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">{getViewTitle()}</h2>
        <p className="text-muted-foreground">نظرة شاملة على الأداء والمؤشرات الرئيسية</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-green-600">+12.5%</span>
          </div>
          <h3 className="text-muted-foreground text-sm mb-1">إجمالي المبيعات</h3>
          <p className="text-2xl">245,000 ر.س</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-chart-2/10 rounded-lg">
              <Users className="w-5 h-5 text-chart-2" />
            </div>
            <span className="text-sm text-green-600">+8.2%</span>
          </div>
          <h3 className="text-muted-foreground text-sm mb-1">العملاء النشطون</h3>
          <p className="text-2xl">1,234</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-chart-3/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-chart-3" />
            </div>
            <span className="text-sm text-green-600">+15.3%</span>
          </div>
          <h3 className="text-muted-foreground text-sm mb-1">الربح الصافي</h3>
          <p className="text-2xl">89,500 ر.س</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-chart-4/10 rounded-lg">
              <Activity className="w-5 h-5 text-chart-4" />
            </div>
            <span className="text-sm text-red-600">-3.1%</span>
          </div>
          <h3 className="text-muted-foreground text-sm mb-1">معدل التحويل</h3>
          <p className="text-2xl">23.4%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4">اتجاه المبيعات الشهرية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4">مقارنة الأداء</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="value" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-l from-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">توصية AI</h3>
            <p className="text-muted-foreground mb-4">
              بناءً على تحليل البيانات الحالية، نوصي بزيادة الاستثمار في قطاع المنتجات الأكثر مبيعاً بنسبة 15%
              لتحقيق نمو إضافي متوقع بنسبة 24% في الربع القادم.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                عرض التفاصيل
              </button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                تجاهل
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
