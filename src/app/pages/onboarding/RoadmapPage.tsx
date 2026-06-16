import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';

export function RoadmapPage() {
  const { goToStep } = useOnboardingNavigate();

  const initiatives = [
    {
      id: 1,
      title: 'تطوير البنية التحتية التقنية',
      area: 'الجاهزية التقنية',
      priority: 'high',
      responsible: 'قسم تقنية المعلومات',
      outcome: 'نظام متكامل لإدارة البيانات والعمليات',
      duration: '٦ أشهر',
      status: 'not-started',
      tasks: ['تقييم الأنظمة الحالية', 'اختيار الحلول التقنية', 'التنفيذ والتدريب', 'الاختبار والتشغيل'],
    },
    {
      id: 2,
      title: 'برنامج تطوير الموارد البشرية',
      area: 'الموارد البشرية',
      priority: 'high',
      responsible: 'إدارة الموارد البشرية',
      outcome: 'فريق عمل مؤهل مع نظام تقييم فعال',
      duration: '٤ أشهر',
      status: 'not-started',
      tasks: ['إعداد خطة التدريب', 'تصميم نظام التقييم', 'تنفيذ البرامج', 'القياس والمتابعة'],
    },
    {
      id: 3,
      title: 'تطوير منهجية قياس الأثر',
      area: 'قياس الأثر',
      priority: 'medium',
      responsible: 'قسم المشاريع والبرامج',
      outcome: 'نظام متقدم لقياس وتقييم الأثر الاجتماعي',
      duration: '٣ أشهر',
      status: 'not-started',
      tasks: ['تحديد مؤشرات الأداء', 'اختيار أدوات القياس', 'جمع البيانات', 'التحليل والتقارير'],
    },
    {
      id: 4,
      title: 'تعزيز الإدارة المالية',
      area: 'الإدارة المالية',
      priority: 'medium',
      responsible: 'القسم المالي',
      outcome: 'شفافية مالية وإدارة محسّنة للموارد',
      duration: '٣ أشهر',
      status: 'not-started',
      tasks: ['مراجعة السياسات المالية', 'أتمتة العمليات', 'تدريب الفريق', 'إعداد التقارير'],
    },
    {
      id: 5,
      title: 'تحسين استراتيجية جمع التبرعات',
      area: 'جمع التبرعات',
      priority: 'low',
      responsible: 'قسم التسويق وجمع التبرعات',
      outcome: 'زيادة الإيرادات وتنويع مصادر التمويل',
      duration: '٦ أشهر',
      status: 'not-started',
      tasks: ['تحليل الجهات المانحة', 'تطوير الحملات', 'بناء الشراكات', 'قياس النتائج'],
    },
  ];

  const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'أولوية عالية' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'أولوية متوسطة' },
    low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'أولوية منخفضة' },
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string; icon: typeof Clock }> = {
    'not-started': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'لم تبدأ', icon: Clock },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'قيد التنفيذ', icon: Activity },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'مكتملة', icon: CheckCircle2 },
    delayed: { bg: 'bg-red-100', text: 'text-red-700', label: 'متأخرة', icon: AlertTriangle },
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goToStep('analysis')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى التحليل
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">خطة التطوير والتحسين</h1>
              <p className="text-gray-600">خارطة طريق مخصصة لتطوير مؤسستك</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                <Download className="w-5 h-5" />
                تحميل الخطة
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                بدء التنفيذ
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">الجدول الزمني للتنفيذ</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm text-gray-600">إجمالي المدة المتوقعة:</div>
            <div className="text-lg font-bold text-blue-600">١٢ شهراً</div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '0%' }}></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>البداية</span>
            <span>٦ أشهر</span>
            <span>الانتهاء</span>
          </div>
        </div>

        {/* Initiatives */}
        <div className="space-y-4">
          {initiatives.map((initiative) => {
            const priorityStyle = priorityConfig[initiative.priority];
            const statusStyle = statusConfig[initiative.status];
            const StatusIcon = statusStyle.icon;

            return (
              <div
                key={initiative.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{initiative.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                        {priorityStyle.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusStyle.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">المحور: {initiative.area}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">المدة</div>
                    <div className="font-semibold">{initiative.duration}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">الجهة المسؤولة</div>
                    <div className="font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {initiative.responsible}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">النتيجة المتوقعة</div>
                    <div className="font-medium flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      {initiative.outcome}
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <div className="text-sm font-medium mb-2">المهام الرئيسية:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {initiative.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">{idx + 1}</span>
                        </div>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">التقدم</span>
                    <span className="text-xs font-medium text-gray-700">٠٪</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 mt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">الدعم من حاضنة رشد</h3>
              <p className="text-gray-700 mb-4">فريقنا جاهز لدعمك في تنفيذ خطة التطوير. ستحصل على:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  استشارات متخصصة في كل محور
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  برامج تدريبية وورش عمل
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  منصة متابعة وتقييم مستمر
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  شبكة من الخبراء والشركاء
                </li>
              </ul>
              <button
                onClick={() => goToStep('decision')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
              >
                الانتقال للخطوة الأخيرة
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
