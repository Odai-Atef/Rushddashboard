import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  Brain,
  Target,
  Zap,
  Eye,
  ChevronRight,
  BarChart3,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

interface Risk {
  id: string;
  title: string;
  category: 'compliance' | 'operational' | 'financial' | 'strategic' | 'reputational';
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  impact: number;
  status: 'active' | 'monitoring' | 'mitigating' | 'resolved';
  description: string;
  owner: string;
  dueDate: string;
}

interface ComplianceItem {
  area: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  requirements: number;
  met: number;
  lastAudit: string;
}

export function ComplianceRiskPage() {
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'compliance' | 'operational' | 'financial' | 'strategic' | 'reputational'>('all');

  // KPI Data
  const kpiData = {
    complianceScore: 87,
    complianceChange: 3,
    activeRisks: 24,
    risksChange: -2,
    criticalAlerts: 5,
    alertsChange: 1,
    operationalRiskLevel: 'متوسط',
    riskScore: 42
  };

  // Compliance Trend Data
  const complianceTrendData = [
    { month: 'يناير', score: 82 },
    { month: 'فبراير', score: 83 },
    { month: 'مارس', score: 85 },
    { month: 'أبريل', score: 84 },
    { month: 'مايو', score: 87 }
  ];

  // Risk Distribution Data
  const riskDistributionData = [
    { name: 'حرج', value: 5, color: '#ef4444' },
    { name: 'عالي', value: 8, color: '#f97316' },
    { name: 'متوسط', value: 7, color: '#eab308' },
    { name: 'منخفض', value: 4, color: '#3b82f6' }
  ];

  // Compliance Areas
  const complianceAreas: ComplianceItem[] = [
    { area: 'الامتثال المالي', status: 'compliant', score: 95, requirements: 45, met: 43, lastAudit: '2026-04-15' },
    { area: 'حماية البيانات (GDPR)', status: 'compliant', score: 92, requirements: 28, met: 26, lastAudit: '2026-05-01' },
    { area: 'الصحة والسلامة', status: 'partial', score: 78, requirements: 32, met: 25, lastAudit: '2026-03-20' },
    { area: 'الامتثال البيئي', status: 'compliant', score: 88, requirements: 18, met: 16, lastAudit: '2026-04-28' },
    { area: 'أمن المعلومات', status: 'partial', score: 72, requirements: 38, met: 27, lastAudit: '2026-05-05' },
    { area: 'قوانين العمل', status: 'non-compliant', score: 65, requirements: 24, met: 16, lastAudit: '2026-04-10' }
  ];

  // Risk Matrix Data
  const riskMatrixData = [
    { id: 1, probability: 85, impact: 90, severity: 'critical', label: 'R1' },
    { id: 2, probability: 75, impact: 80, severity: 'critical', label: 'R2' },
    { id: 3, probability: 60, impact: 70, severity: 'high', label: 'R3' },
    { id: 4, probability: 45, impact: 75, severity: 'high', label: 'R4' },
    { id: 5, probability: 50, impact: 50, severity: 'medium', label: 'R5' },
    { id: 6, probability: 30, impact: 40, severity: 'medium', label: 'R6' },
    { id: 7, probability: 20, impact: 30, severity: 'low', label: 'R7' },
    { id: 8, probability: 15, impact: 25, severity: 'low', label: 'R8' }
  ];

  // Active Risks
  const risks: Risk[] = [
    {
      id: '1',
      title: 'عدم الامتثال لقوانين العمل الجديدة',
      category: 'compliance',
      severity: 'critical',
      probability: 85,
      impact: 90,
      status: 'active',
      description: 'التشريعات الجديدة تتطلب تحديثات فورية في عقود العمل وسياسات الموارد البشرية',
      owner: 'إدارة الموارد البشرية',
      dueDate: '2026-05-20'
    },
    {
      id: '2',
      title: 'ثغرة أمنية في نظام إدارة البيانات',
      category: 'operational',
      severity: 'critical',
      probability: 75,
      impact: 80,
      status: 'mitigating',
      description: 'تم اكتشاف ثغرة أمنية محتملة في نظام إدارة بيانات العملاء',
      owner: 'قسم أمن المعلومات',
      dueDate: '2026-05-15'
    },
    {
      id: '3',
      title: 'تقلبات أسعار الصرف',
      category: 'financial',
      severity: 'high',
      probability: 60,
      impact: 70,
      status: 'monitoring',
      description: 'التقلبات الحادة في أسعار الصرف تؤثر على الأرباح المتوقعة',
      owner: 'الإدارة المالية',
      dueDate: '2026-06-01'
    },
    {
      id: '4',
      title: 'دخول منافس جديد للسوق',
      category: 'strategic',
      severity: 'high',
      probability: 45,
      impact: 75,
      status: 'monitoring',
      description: 'شركة عالمية تخطط للدخول إلى السوق المحلي بأسعار تنافسية',
      owner: 'الإدارة الاستراتيجية',
      dueDate: '2026-07-01'
    },
    {
      id: '5',
      title: 'تأخيرات في سلسلة التوريد',
      category: 'operational',
      severity: 'medium',
      probability: 50,
      impact: 50,
      status: 'active',
      description: 'تأخيرات متكررة من الموردين الرئيسيين تؤثر على الإنتاج',
      owner: 'إدارة العمليات',
      dueDate: '2026-05-25'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'حرج';
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return severity;
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-500';
      case 'partial':
        return 'text-yellow-500';
      case 'non-compliant':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getComplianceStatusLabel = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'ملتزم';
      case 'partial':
        return 'التزام جزئي';
      case 'non-compliant':
        return 'غير ملتزم';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'compliance':
        return 'الامتثال';
      case 'operational':
        return 'تشغيلي';
      case 'financial':
        return 'مالي';
      case 'strategic':
        return 'استراتيجي';
      case 'reputational':
        return 'سمعة';
      default:
        return category;
    }
  };

  const filteredRisks = activeTab === 'all' ? risks : risks.filter(r => r.category === activeTab);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            لوحة الامتثال والمخاطر
          </h1>
          <p className="text-muted-foreground mt-1">مراقبة الامتثال والمخاطر التشغيلية والتهديدات</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          إنشاء تقرير مخاطر
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <ShieldCheck className="w-8 h-8 text-green-500" />
            <div className={`flex items-center gap-1 text-sm ${kpiData.complianceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {kpiData.complianceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(kpiData.complianceChange)}%
            </div>
          </div>
          <p className="text-muted-foreground text-sm">درجة الامتثال</p>
          <p className="text-3xl mt-1">{kpiData.complianceScore}%</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div className={`flex items-center gap-1 text-sm ${kpiData.risksChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {kpiData.risksChange <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {Math.abs(kpiData.risksChange)}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">المخاطر النشطة</p>
          <p className="text-3xl mt-1">{kpiData.activeRisks}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div className={`flex items-center gap-1 text-sm ${kpiData.alertsChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {kpiData.alertsChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(kpiData.alertsChange)}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">التنبيهات الحرجة</p>
          <p className="text-3xl mt-1">{kpiData.criticalAlerts}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-yellow-500" />
            <div className="text-sm text-muted-foreground">{kpiData.riskScore}/100</div>
          </div>
          <p className="text-muted-foreground text-sm">مستوى المخاطر التشغيلية</p>
          <p className="text-3xl mt-1">{kpiData.operationalRiskLevel}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Risk Matrix & Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Matrix */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                مصفوفة المخاطر
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" dataKey="probability" name="الاحتمالية" unit="%" domain={[0, 100]} />
                <YAxis type="number" dataKey="impact" name="التأثير" unit="%" domain={[0, 100]} />
                <ZAxis range={[400, 400]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{data.label}</p>
                          <p className="text-sm text-muted-foreground">الاحتمالية: {data.probability}%</p>
                          <p className="text-sm text-muted-foreground">التأثير: {data.impact}%</p>
                          <p className={`text-sm font-medium ${getSeverityColor(data.severity)}`}>
                            {getSeverityLabel(data.severity)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {riskMatrixData.map((entry, index) => (
                  <Scatter
                    key={index}
                    name={entry.label}
                    data={[entry]}
                    fill={
                      entry.severity === 'critical' ? '#ef4444' :
                      entry.severity === 'high' ? '#f97316' :
                      entry.severity === 'medium' ? '#eab308' : '#3b82f6'
                    }
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>حرج</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>عالي</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>متوسط</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>منخفض</span>
              </div>
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              اتجاه الامتثال
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={complianceTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Areas */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              مجالات الامتثال
            </h2>
            <div className="space-y-4">
              {complianceAreas.map((area, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {area.status === 'compliant' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : area.status === 'partial' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-medium">{area.area}</h3>
                        <p className="text-sm text-muted-foreground">آخر تدقيق: {area.lastAudit}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-medium">{area.score}%</p>
                      <p className={`text-sm ${getComplianceStatusColor(area.status)}`}>
                        {getComplianceStatusLabel(area.status)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>المتطلبات: {area.met}/{area.requirements}</span>
                    <div className="w-48 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          area.status === 'compliant' ? 'bg-green-500' :
                          area.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${area.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - AI Analysis & Actions */}
        <div className="space-y-6">
          {/* Risk Distribution */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              توزيع المخاطر
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Risk Analysis */}
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl">تحليل الذكاء الاصطناعي</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-card/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium mb-1">تحذير: مخاطر امتثال عالية</p>
                    <p className="text-sm text-muted-foreground">
                      تم اكتشاف عدم امتثال محتمل في 3 مجالات تحتاج إلى اتخاذ إجراء فوري
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium mb-1">فرصة للتحسين</p>
                    <p className="text-sm text-muted-foreground">
                      يمكن تحسين درجة الامتثال بنسبة 8% من خلال معالجة 5 نقاط
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium mb-1">اتجاه إيجابي</p>
                    <p className="text-sm text-muted-foreground">
                      انخفاض المخاطر النشطة بنسبة 15% مقارنة بالشهر الماضي
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              الإجراءات الموصى بها
            </h2>
            <div className="space-y-3">
              {[
                { priority: 'urgent', text: 'مراجعة عقود العمل الحالية', time: 'خلال 3 أيام' },
                { priority: 'high', text: 'تحديث سياسات أمن المعلومات', time: 'خلال أسبوع' },
                { priority: 'medium', text: 'إجراء تدريب الامتثال للموظفين', time: 'خلال أسبوعين' },
                { priority: 'low', text: 'مراجعة إجراءات الصحة والسلامة', time: 'خلال شهر' }
              ].map((action, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer hover:border-blue-500 transition-all ${
                    action.priority === 'urgent' ? 'bg-red-500/5 border-red-500/20' :
                    action.priority === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                    action.priority === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                    'bg-blue-500/5 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm flex-1">{action.text}</p>
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{action.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Risks Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            المخاطر النشطة
          </h2>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'compliance', label: 'الامتثال' },
              { id: 'operational', label: 'تشغيلي' },
              { id: 'financial', label: 'مالي' },
              { id: 'strategic', label: 'استراتيجي' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              onClick={() => setSelectedRisk(risk)}
              className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all ${getSeverityBg(risk.severity)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(risk.severity)} ${getSeverityBg(risk.severity)}`}>
                      {getSeverityLabel(risk.severity)}
                    </span>
                    <span className="text-sm text-muted-foreground">{getCategoryLabel(risk.category)}</span>
                  </div>
                  <h3 className="font-medium mb-2">{risk.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>المسؤول: {risk.owner}</span>
                    <span>الموعد النهائي: {risk.dueDate}</span>
                    <span>الاحتمالية: {risk.probability}%</span>
                    <span>التأثير: {risk.impact}%</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Detail Modal */}
      {selectedRisk && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedRisk(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg font-medium ${getSeverityColor(selectedRisk.severity)} ${getSeverityBg(selectedRisk.severity)}`}>
                        {getSeverityLabel(selectedRisk.severity)}
                      </span>
                      <span className="text-muted-foreground">{getCategoryLabel(selectedRisk.category)}</span>
                    </div>
                    <h2 className="text-2xl">{selectedRisk.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedRisk(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">الوصف</h3>
                  <p className="text-muted-foreground">{selectedRisk.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">الاحتمالية</p>
                    <p className="text-2xl font-medium">{selectedRisk.probability}%</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">التأثير</p>
                    <p className="text-2xl font-medium">{selectedRisk.impact}%</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">المسؤول</p>
                    <p className="font-medium">{selectedRisk.owner}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">الموعد النهائي</p>
                    <p className="font-medium">{selectedRisk.dueDate}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">الإجراءات المقترحة</h3>
                  <div className="space-y-2">
                    {[
                      'مراجعة السياسات والإجراءات الحالية',
                      'تعيين فريق متخصص للمعالجة',
                      'وضع خطة زمنية للتنفيذ',
                      'إعداد تقرير دوري للإدارة'
                    ].map((action, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border flex gap-3 justify-end">
                <button
                  onClick={() => setSelectedRisk(null)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  إغلاق
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  تحديث الحالة
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
