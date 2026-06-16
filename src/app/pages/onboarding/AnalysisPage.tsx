import { BarChart3, Brain, CheckCircle2, ChevronRight, Heart, Lightbulb, Star, Target, Users, Zap, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { resolveIcon as resolveApiIcon } from '@/app/utils/icon-map';
import {
  Strength as StrengthItem,
  Weakness as WeaknessItem,
} from '@/api/services/onboarding-service';

export function AnalysisPage() {
  const { goToStep } = useOnboardingNavigate();
  const { assessmentResult } = useOnboardingContext();

  const apiStrengths = (assessmentResult?.strengths || []).filter(
    (s): s is StrengthItem => typeof s === 'object' && s !== null
  );
  const apiWeaknesses = (assessmentResult?.weaknesses || []).filter(
    (w): w is WeaknessItem => typeof w === 'object' && w !== null
  );

  const strengths =
    apiStrengths.length > 0
      ? apiStrengths.map((s) => ({
          area: s.area,
          score: s.score,
          insight: s.insight,
          icon: resolveApiIcon(s.icon),
          color: s.score >= 80 ? 'green' : s.score >= 50 ? 'blue' : 'yellow',
        }))
      : [
          {
            area: 'الحوكمة والامتثال',
            score: 85,
            insight:
              'لديكم هيكل حوكمة قوي مع سياسات واضحة ومجلس إدارة نشط',
            icon: Shield,
            color: 'green',
          },
          {
            area: 'التخطيط الاستراتيجي',
            score: 80,
            insight:
              'خطة استراتيجية واضحة مع مؤشرات أداء محددة ومراجعة دورية',
            icon: Target,
            color: 'green',
          },
          {
            area: 'إدارة المتطوعين',
            score: 78,
            insight:
              'برامج فعالة لاستقطاب وتدريب المتطوعين مع نظام متابعة جيد',
            icon: Heart,
            color: 'green',
          },
        ];

  const weaknesses =
    apiWeaknesses.length > 0
      ? apiWeaknesses.map((w) => ({
          area: w.area,
          score: w.score,
          insight: w.insight,
          severity: w.severity || 'medium',
          icon: resolveApiIcon(w.severity === 'high' ? 'AlertTriangle' : 'Zap'),
          color: w.severity === 'high' ? 'red' : 'yellow',
        }))
      : [
          {
            area: 'الجاهزية التقنية',
            score: 65,
            insight:
              'هناك حاجة لتحسين البنية التحتية التقنية وأنظمة إدارة البيانات',
            severity: 'high',
            icon: Zap,
            color: 'red',
          },
          {
            area: 'الموارد البشرية',
            score: 68,
            insight:
              'نقص في برامج التطوير المهني وأنظمة تقييم الأداء',
            severity: 'medium',
            icon: Users,
            color: 'yellow',
          },
          {
            area: 'قياس الأثر',
            score: 70,
            insight:
              'أدوات قياس الأثر موجودة لكن تحتاج إلى تطوير وأتمتة',
            severity: 'medium',
            icon: BarChart3,
            color: 'yellow',
          },
        ];

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goToStep('results')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى النتائج
          </button>
          <h1 className="text-3xl font-bold mb-2">تحليل نقاط القوة والضعف</h1>
          <p className="text-gray-600">
            تحليل تفصيلي لأداء مؤسستك عبر جميع المحاور
          </p>
        </div>

        {/* Strengths */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">نقاط القوة</h2>
          </div>
          <div className="space-y-4">
            {strengths.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{item.area}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">
                            {item.score}
                          </span>
                          <span className="text-gray-500">/100</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{item.insight}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          أداء ممتاز - استمروا في الحفاظ على هذا المستوى
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold">مجالات التحسين</h2>
          </div>
          <div className="space-y-4">
            {weaknesses.map((item, idx) => {
              const Icon = item.icon;
              const severityConfig =
                item.severity === 'high'
                  ? {
                      bg: 'bg-red-50',
                      border: 'border-red-200',
                      text: 'text-red-600',
                      badge: 'bg-red-100 text-red-700',
                      label: 'أولوية عالية',
                    }
                  : {
                      bg: 'bg-yellow-50',
                      border: 'border-yellow-200',
                      text: 'text-yellow-600',
                      badge: 'bg-yellow-100 text-yellow-700',
                      label: 'أولوية متوسطة',
                    };

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl shadow-sm border-2 ${severityConfig.border} p-6`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 ${severityConfig.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${severityConfig.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{item.area}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${severityConfig.badge}`}
                          >
                            {severityConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${severityConfig.text}`}>
                            {item.score}
                          </span>
                          <span className="text-gray-500">/100</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{item.insight}</p>
                      <div
                        className={`flex items-center gap-2 p-3 ${severityConfig.bg} rounded-lg`}
                      >
                        <Lightbulb className={`w-4 h-4 ${severityConfig.text}`} />
                        <span className={`text-sm font-medium ${severityConfig.text.replace('600', '900')}`}>
                          توصية: راجع خطة التطوير للحصول على خطوات محددة للتحسين
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">توصيات الذكاء الاصطناعي</h3>
              <p className="text-gray-700 mb-4">
                بناءً على التحليل الشامل، نوصي بالتركيز على تطوير الجاهزية التقنية
                كأولوية قصوى. الاستثمار في البنية التحتية التقنية سيحسن كفاءة
                العمليات وجودة البيانات، مما ينعكس إيجاباً على جميع المحاور الأخرى.
              </p>
              <button
                onClick={() => goToStep('roadmap')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                عرض خطة التطوير الكاملة
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
