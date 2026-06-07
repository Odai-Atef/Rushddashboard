import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
  Clock,
  Target,
  ArrowUpRight,
  CheckCircle,
  FileDown,
  Filter,
  Zap,
  Users,
  Package,
  Award
} from 'lucide-react';
import { useState } from 'react';

interface Recommendation {
  id: number;
  title: string;
  reason: string;
  expectedImpact: string;
  impactValue: string;
  riskLevel: 'low' | 'medium' | 'high';
  priority: 'urgent' | 'high' | 'medium';
  category: 'revenue' | 'cost' | 'efficiency' | 'risk';
  relatedDashboard: string;
  suggestedAction: string;
  timeline: string;
  icon: any;
}

export function RecommendationsDashboard() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const recommendations: Recommendation[] = [
    {
      id: 1,
      title: 'توسيع قناة المبيعات B2B',
      reason: 'قناة B2B تحقق أعلى هامش ربح (45%) وتمثل فرصة نمو غير مستغلة',
      expectedImpact: 'زيادة الإيرادات السنوية',
      impactValue: '+32%',
      riskLevel: 'low',
      priority: 'urgent',
      category: 'revenue',
      relatedDashboard: 'لوحة المبيعات',
      suggestedAction: 'توظيف 3 مدراء مبيعات B2B وزيادة الميزانية التسويقية بـ 500,000 ر.س',
      timeline: '3-6 أشهر',
      icon: TrendingUp
    },
    {
      id: 2,
      title: 'تطبيق نظام إدارة الجودة الشاملة',
      reason: 'تأخير التسليم يمثل 35% من الأخطاء التشغيلية ويؤثر على رضا العملاء',
      expectedImpact: 'تقليل معدل الأخطاء والشكاوى',
      impactValue: '-40%',
      riskLevel: 'medium',
      priority: 'high',
      category: 'efficiency',
      relatedDashboard: 'لوحة العمليات',
      suggestedAction: 'استثمار 280,000 ر.س في نظام إدارة الجودة وتدريب الفرق',
      timeline: '2-4 أشهر',
      icon: Award
    },
    {
      id: 3,
      title: 'إطلاق برنامج ولاء للعملاء المميزين',
      reason: 'العملاء المميزون يمثلون 42% من الإيرادات لكن معرضون لخطر التسرب',
      expectedImpact: 'زيادة معدل الاحتفاظ بالعملاء',
      impactValue: '+15%',
      riskLevel: 'low',
      priority: 'high',
      category: 'revenue',
      relatedDashboard: 'لوحة العملاء',
      suggestedAction: 'تخصيص برنامج مكافآت بميزانية 350,000 ر.س سنوياً',
      timeline: '1-2 شهر',
      icon: Users
    },
    {
      id: 4,
      title: 'تحسين الكفاءة التشغيلية في فرع الدمام',
      reason: 'فرع الدمام يحقق هامش ربح 30% مقابل 40% في الرياض بسبب ضعف الكفاءة',
      expectedImpact: 'زيادة هامش الربح',
      impactValue: '+5%',
      riskLevel: 'low',
      priority: 'medium',
      category: 'cost',
      relatedDashboard: 'لوحة الربحية',
      suggestedAction: 'نقل أفضل الممارسات من فرع الرياض وتدريب الفريق',
      timeline: '3-5 أشهر',
      icon: Target
    },
    {
      id: 5,
      title: 'تطوير برنامج مسارات وظيفية',
      reason: '42% من الاستقالات بسبب فرص أفضل - نحتاج استراتيجية احتفاظ قوية',
      expectedImpact: 'تقليل معدل الاستقالات',
      impactValue: '-35%',
      riskLevel: 'medium',
      priority: 'high',
      category: 'efficiency',
      relatedDashboard: 'لوحة الموارد البشرية',
      suggestedAction: 'إنشاء برنامج تطوير مهني واضح مع خطط ترقية محددة',
      timeline: '4-6 أشهر',
      icon: Sparkles
    },
    {
      id: 6,
      title: 'تقليص تكاليف الرواتب في الأقسام الإدارية',
      reason: 'تكاليف الرواتب زادت 12% في الربع الأخير دون زيادة مقابلة في الإنتاجية',
      expectedImpact: 'توفير سنوي',
      impactValue: '180,000 ر.س',
      riskLevel: 'high',
      priority: 'medium',
      category: 'cost',
      relatedDashboard: 'لوحة الربحية',
      suggestedAction: 'إعادة هيكلة الأقسام الإدارية وتطبيق نظام أتمتة',
      timeline: '2-3 أشهر',
      icon: DollarSign
    },
  ];

  const filters = [
    { id: 'all', label: 'جميع التوصيات', icon: Target },
    { id: 'urgent', label: 'عاجل', icon: Zap },
    { id: 'high-impact', label: 'تأثير عالي', icon: TrendingUp },
    { id: 'low-risk', label: 'مخاطر منخفضة', icon: Shield },
    { id: 'revenue', label: 'نمو الإيرادات', icon: DollarSign },
    { id: 'cost', label: 'تقليل التكاليف', icon: Package },
  ];

  const filteredRecommendations = recommendations.filter((rec) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return rec.priority === 'urgent';
    if (activeFilter === 'high-impact') return ['urgent', 'high'].includes(rec.priority);
    if (activeFilter === 'low-risk') return rec.riskLevel === 'low';
    if (activeFilter === 'revenue') return rec.category === 'revenue';
    if (activeFilter === 'cost') return rec.category === 'cost';
    return true;
  });

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'عاجل';
      case 'high':
        return 'أولوية عالية';
      case 'medium':
        return 'أولوية متوسطة';
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl mb-2">لوحة التوصيات</h2>
          <p className="text-muted-foreground text-lg">ماذا يجب أن يفعل المستثمر الآن؟</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors">
            <FileDown className="w-4 h-4" />
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* AI Executive Summary */}
      <div className="bg-gradient-to-l from-purple-500/10 via-blue-500/10 to-transparent border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl">الملخص التنفيذي من الذكاء الاصطناعي</h3>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">AI Executive</span>
            </div>
            <p className="text-foreground leading-relaxed text-base mb-4">
              بناءً على التحليل الشامل لجميع المؤشرات، تم تحديد <span className="font-bold text-purple-600 dark:text-purple-400">6 فرص استراتيجية</span> لتحسين الأداء.
              الأولوية القصوى هي <span className="font-bold">توسيع قناة B2B</span> التي تعد بزيادة الإيرادات بنسبة 32% مع مخاطر منخفضة.
              التركيز على <span className="font-bold">الاحتفاظ بالعملاء المميزين</span> و<span className="font-bold">تحسين الجودة التشغيلية</span> سيضمن نمواً مستداماً.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">التأثير المتوقع</p>
                <p className="text-2xl font-bold text-green-600">+2.8M ر.س</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-sm text-muted-foreground mb-1">الاستثمار المطلوب</p>
                <p className="text-2xl font-bold text-blue-600">1.13M ر.س</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">العائد المتوقع</p>
                <p className="text-2xl font-bold text-purple-600">+247%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
          <Filter className="w-4 h-4" />
          <span className="text-sm">تصفية:</span>
        </div>
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:bg-accent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm whitespace-nowrap">{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRecommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-2">{rec.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority === 'urgent' && <Zap className="w-3 h-3" />}
                          {getPriorityLabel(rec.priority)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(rec.riskLevel)}`}>
                          {rec.riskLevel === 'high' ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {getRiskLabel(rec.riskLevel)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                          <Clock className="w-3 h-3" />
                          {rec.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">السبب</p>
                        <p className="text-sm leading-relaxed">{rec.reason}</p>
                      </div>

                      <div className="p-4 bg-gradient-to-l from-green-500/10 to-transparent border border-green-500/20 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">التأثير المتوقع</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm">{rec.expectedImpact}</p>
                          <span className="flex items-center gap-1 text-lg font-bold text-green-600">
                            <ArrowUpRight className="w-5 h-5" />
                            {rec.impactValue}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">الإجراء المقترح</p>
                        <p className="text-sm leading-relaxed">{rec.suggestedAction}</p>
                      </div>

                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">اللوحة ذات الصلة</p>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{rec.relatedDashboard}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    <span>اعتماد التوصية</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2.5 border border-border hover:bg-accent rounded-lg transition-colors">
                    <Target className="w-4 h-4" />
                    <span>عرض خطة العمل</span>
                  </button>
                  <button className="px-6 py-2.5 border border-border hover:bg-accent rounded-lg transition-colors">
                    تأجيل
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Plan Timeline */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg">الجدول الزمني للتنفيذ</h3>
        </div>
        <div className="space-y-4">
          {filteredRecommendations.slice(0, 4).map((rec, index) => (
            <div key={rec.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                {index < 3 && <div className="w-0.5 h-12 bg-border mt-2"></div>}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium mb-1">{rec.title}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {rec.timeline}
                  </span>
                  <span>•</span>
                  <span>{rec.expectedImpact}: {rec.impactValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
