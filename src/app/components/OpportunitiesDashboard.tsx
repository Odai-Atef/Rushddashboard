import {
  Lightbulb,
  TrendingUp,
  Users,
  Shield,
  AlertTriangle,
  Target,
  Sparkles,
  Handshake,
  Package,
  Globe
} from 'lucide-react';

export function OpportunitiesDashboard() {
  // Opportunity data
  const opportunities = [
    {
      id: 1,
      title: 'التوسع في سوق الخليج',
      category: 'market',
      description: 'فرصة دخول أسواق الإمارات والكويت بناءً على الطلب المتزايد',
      opportunityScore: 92,
      expectedRevenue: '4.5M ر.س',
      timeline: '8-12 شهر',
      investment: '1.2M ر.س',
      riskLevel: 'medium',
      impact: 'high',
      icon: Globe
    },
    {
      id: 2,
      title: 'إطلاق برنامج B2B المتقدم',
      category: 'new-program',
      description: 'برنامج خدمات متكامل للشركات الكبرى مع دعم مخصص',
      opportunityScore: 88,
      expectedRevenue: '2.8M ر.س',
      timeline: '4-6 أشهر',
      investment: '450K ر.س',
      riskLevel: 'low',
      impact: 'high',
      icon: Package
    },
    {
      id: 3,
      title: 'شراكة مع منصات التجارة الإلكترونية',
      category: 'partnership',
      description: 'التعاون مع أمازون السعودية ونون لتوسيع قاعدة العملاء',
      opportunityScore: 85,
      expectedRevenue: '3.2M ر.س',
      timeline: '3-5 أشهر',
      investment: '280K ر.س',
      riskLevel: 'low',
      impact: 'high',
      icon: Handshake
    },
    {
      id: 4,
      title: 'برنامج تدريب الشركات',
      category: 'new-program',
      description: 'برنامج تدريبي مخصص للمؤسسات على الذكاء الاصطناعي',
      opportunityScore: 78,
      expectedRevenue: '1.5M ر.س',
      timeline: '2-4 أشهر',
      investment: '350K ر.س',
      riskLevel: 'low',
      impact: 'medium',
      icon: Target
    },
    {
      id: 5,
      title: 'شراكة مع بنوك محلية',
      category: 'partnership',
      description: 'تقديم خدمات مالية متكاملة للعملاء بالتعاون مع البنوك',
      opportunityScore: 72,
      expectedRevenue: '2.1M ر.س',
      timeline: '6-9 أشهر',
      investment: '520K ر.س',
      riskLevel: 'medium',
      impact: 'medium',
      icon: Handshake
    },
    {
      id: 6,
      title: 'دخول قطاع التعليم',
      category: 'market',
      description: 'تقديم حلول تعليمية رقمية للجامعات والمعاهد',
      opportunityScore: 68,
      expectedRevenue: '1.8M ر.س',
      timeline: '5-8 أشهر',
      investment: '680K ر.س',
      riskLevel: 'high',
      impact: 'medium',
      icon: Globe
    },
  ];

  // New programs section
  const newPrograms = [
    { id: 1, name: 'برنامج B2B المتقدم', status: 'planning', completion: 35 },
    { id: 2, name: 'برنامج تدريب الشركات', status: 'research', completion: 15 },
    { id: 3, name: 'خدمات استشارية متخصصة', status: 'design', completion: 60 },
  ];

  // Partnerships table
  const partnerships = [
    { id: 1, partner: 'أمازون السعودية', type: 'توزيع', status: 'مفاوضات', potential: 'عالي' },
    { id: 2, partner: 'بنك الراجحي', type: 'مالي', status: 'جديد', potential: 'متوسط' },
    { id: 3, partner: 'جامعة الملك سعود', type: 'تعليمي', status: 'بحث', potential: 'متوسط' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      case 'high':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'medium':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'مخاطر منخفضة';
      case 'medium':
        return 'مخاطر متوسطة';
      case 'high':
        return 'مخاطر عالية';
      default:
        return risk;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة الفرص</h2>
        <p className="text-muted-foreground">اكتشاف فرص النمو والاستثمار والشراكات الاستراتيجية</p>
      </div>

      {/* AI Opportunity Recommendation */}
      <div className="bg-gradient-to-l from-purple-500/10 via-blue-500/10 to-transparent border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl">توصية الفرص</h3>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">AI</span>
            </div>
            <p className="text-foreground leading-relaxed mb-4">
              تم تحديد <span className="font-bold text-purple-600 dark:text-purple-400">6 فرص نمو استراتيجية</span> بإجمالي إيرادات متوقعة 15.9M ر.س.
              أعلى الفرص هي <span className="font-bold">التوسع في أسواق الخليج</span> بدرجة فرصة 92/100 وعائد متوقع 4.5M ر.س.
              <span className="font-bold text-green-600"> 3 فرص منخفضة المخاطر</span> يمكن البدء بها فوراً باستثمار إجمالي 1.08M ر.س.
            </p>
          </div>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div>
        <h3 className="text-lg mb-4">بطاقات الفرص</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {opportunities.map((opp) => {
            const Icon = opp.icon;
            return (
              <div
                key={opp.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium mb-2">{opp.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{opp.description}</p>
                  </div>
                </div>

                {/* Opportunity Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">درجة الفرصة</span>
                    <span className="text-lg font-bold text-purple-600">{opp.opportunityScore}/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-purple-500 to-blue-600 rounded-full"
                      style={{ width: `${opp.opportunityScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(opp.riskLevel)}`}>
                    {opp.riskLevel === 'high' ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {getRiskLabel(opp.riskLevel)}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(opp.impact)}`}>
                    <TrendingUp className="w-3 h-3" />
                    تأثير {opp.impact === 'high' ? 'عالي' : 'متوسط'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">العائد المتوقع</p>
                    <p className="font-medium text-green-600">{opp.expectedRevenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">الاستثمار</p>
                    <p className="font-medium">{opp.investment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المدة</p>
                    <p className="font-medium">{opp.timeline}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    دراسة الفرصة
                  </button>
                  <button className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm">
                    التفاصيل
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Programs Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-lg">البرامج الجديدة قيد التطوير</h3>
        </div>
        <div className="space-y-4">
          {newPrograms.map((program) => (
            <div key={program.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{program.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {program.status === 'planning' ? 'تخطيط' : program.status === 'research' ? 'بحث' : 'تصميم'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${program.completion}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-left">{program.completion}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partnerships Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-primary" />
            <h3 className="text-lg">الشراكات المحتملة</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الشريك</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">الإمكانات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {partnerships.map((partner) => (
                <tr key={partner.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{partner.partner}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {partner.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      partner.potential === 'عالي'
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {partner.potential}
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
