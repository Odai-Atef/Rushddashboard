import { useState } from 'react';
import {
  Sparkles,
  Plus,
  RefreshCw,
  FileText,
  Building2,
  Users,
  MapPin,
  TrendingUp,
  Target,
  ChevronRight,
  ChevronLeft,
  Save,
  Check,
  X,
  Edit,
  Eye,
  Download,
  Send,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Zap,
  BarChart3,
  GitBranch,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Copy,
  ArrowRight,
  Layers,
  Shield,
  Award,
  Brain,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Maximize2,
  Minimize2,
  BookOpen,
  ListChecks
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

type ViewType = 'studio' | 'wizard' | 'workspace' | 'improvement' | 'feasibility' | 'review' | 'versions' | 'readiness';
type GenerationType = 'new' | 'improve' | 'prepare';

interface Organization {
  name: string;
  sector: string;
  beneficiaries: string;
  geographicArea: string;
  previousProjects: number;
  readinessScore: number;
}

interface WizardData {
  category: string;
  beneficiaries: string;
  geographicScope: string;
  budgetRange: string;
  duration: string;
  specialRequirements: string;
}

interface ProjectSection {
  id: string;
  title: string;
  content: string;
  status: 'generated' | 'edited' | 'approved';
  aiConfidence: number;
}

interface ProjectVersion {
  id: string;
  version: number;
  date: string;
  author: string;
  aiModel: string;
  status: 'draft' | 'under-review' | 'approved' | 'rejected';
}

export function AIProjectInnovationModule() {
  const [currentView, setCurrentView] = useState<ViewType>('studio');
  const [generationType, setGenerationType] = useState<GenerationType | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    category: '',
    beneficiaries: '',
    geographicScope: '',
    budgetRange: '',
    duration: '',
    specialRequirements: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const organization: Organization = {
    name: 'جمعية البر الخيرية',
    sector: 'التنمية الاجتماعية',
    beneficiaries: 'الأسر المحتاجة والأيتام',
    geographicArea: 'مدينة الرياض',
    previousProjects: 12,
    readinessScore: 78
  };

  console.log('✓ AIProjectInnovationModule rendered');

  // PAGE 1: AI Project Studio
  const StudioView = () => {
    const opportunities = [
      { title: 'مشاريع رمضان', description: 'موسم قريب - استعد الآن', priority: 'high', icon: Calendar },
      { title: 'برامج التمكين الاقتصادي', description: 'طلب مرتفع من المانحين', priority: 'medium', icon: TrendingUp },
      { title: 'مشاريع التعليم', description: 'متوافق مع خبرتك', priority: 'low', icon: BookOpen }
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">مدعوم بالذكاء الاصطناعي</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">استوديو المشاريع الذكي</h1>
          <p className="text-xl text-gray-600">حوّل أفكارك إلى مشاريع قابلة للتمويل باستخدام الذكاء الاصطناعي</p>
        </div>

        {/* Organization Context */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">سياق الجهه</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">درجة الجاهزية</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-bold text-green-600">{organization.readinessScore}%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">الجهه</p>
                <p className="font-medium">{organization.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">المستفيدون</p>
                <p className="font-medium">{organization.beneficiaries}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">النطاق الجغرافي</p>
                <p className="font-medium">{organization.geographicArea}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Generate New Project */}
          <button
            onClick={() => {
              setGenerationType('new');
              setCurrentView('wizard');
            }}
            className="group relative bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all text-right"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">إنشاء مشروع جديد</h3>
            <p className="text-gray-600 mb-4">ابدأ من الصفر واستخدم الذكاء الاصطناعي لإنشاء مشروع كامل</p>
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <span>ابدأ الآن</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Improve Existing */}
          <button
            onClick={() => {
              setGenerationType('improve');
              setCurrentView('improvement');
            }}
            className="group relative bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all text-right"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">تحسين مشروع موجود</h3>
            <p className="text-gray-600 mb-4">ارفع جودة مشروعك وزد فرص التمويل بالذكاء الاصطناعي</p>
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <span>حسّن الآن</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Prepare for Donors */}
          <button
            onClick={() => {
              setGenerationType('prepare');
              setCurrentView('feasibility');
            }}
            className="group relative bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all text-right"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">تجهيز للمانحين</h3>
            <p className="text-gray-600 mb-4">حضّر مشروعك للعرض على المانحين بمعايير احترافية</p>
            <div className="flex items-center gap-2 text-purple-600 font-medium">
              <span>جهّز الآن</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">رؤى ذكية</h3>
          </div>
          <div className="space-y-3">
            {opportunities.map((opp, idx) => {
              const Icon = opp.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                    opp.priority === 'high' ? 'bg-red-50 border-red-200' :
                    opp.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <Icon className={`w-6 h-6 flex-shrink-0 ${
                    opp.priority === 'high' ? 'text-red-600' :
                    opp.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{opp.title}</h4>
                    <p className="text-sm text-gray-600">{opp.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    opp.priority === 'high' ? 'bg-red-100 text-red-700' :
                    opp.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {opp.priority === 'high' ? 'عاجل' : opp.priority === 'medium' ? 'مهم' : 'مقترح'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{organization.previousProjects}</p>
            <p className="text-sm text-gray-600 mt-1">مشاريع سابقة</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-600 mt-1">مشاريع مُنشأة بالذكاء الاصطناعي</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">18</p>
            <p className="text-sm text-gray-600 mt-1">مشاريع معتمدة</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600 mt-1">مشاريع ممولة</p>
          </div>
        </div>
      </div>
    );
  };

  // PAGE 2: Project Generation Wizard
  const WizardView = () => {
    const totalSteps = 6;
    const progress = (wizardStep / totalSteps) * 100;

    const categories = [
      { id: 'education', label: 'التعليم والتدريب', icon: BookOpen, color: 'blue' },
      { id: 'health', label: 'الصحة', icon: Activity, color: 'green' },
      { id: 'development', label: 'التنمية المجتمعية', icon: Users, color: 'purple' },
      { id: 'orphans', label: 'رعاية الأيتام', icon: Users, color: 'pink' },
      { id: 'quran', label: 'برامج القرآن', icon: BookOpen, color: 'emerald' },
      { id: 'family', label: 'دعم الأسر', icon: Users, color: 'orange' }
    ];

    const handleGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentView('workspace');
      }, 3000);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('studio')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى الاستوديو
          </button>
          <h1 className="text-3xl font-bold mb-2">معالج إنشاء المشروع</h1>
          <p className="text-gray-600">أجب على بعض الأسئلة ليقوم الذكاء الاصطناعي بإنشاء مشروعك</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">الخطوة {wizardStep} من {totalSteps}</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          {wizardStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">اختر تصنيف المشروع</h2>
                <p className="text-gray-600">ما هو المجال الذي يندرج تحته مشروعك؟</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setWizardData({ ...wizardData, category: cat.id })}
                      className={`p-6 rounded-xl border-2 transition-all text-right ${
                        wizardData.category === cat.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 text-${cat.color}-600`} />
                      <h3 className="font-semibold">{cat.label}</h3>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">الفئة المستهدفة</h2>
                <p className="text-gray-600">من هم المستفيدون من هذا المشروع؟</p>
              </div>
              <textarea
                value={wizardData.beneficiaries}
                onChange={(e) => setWizardData({ ...wizardData, beneficiaries: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="مثال: الأسر المحتاجة، الأيتام، كبار السن..."
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">اقتراح الذكاء الاصطناعي</p>
                    <p className="text-sm text-blue-800">بناءً على تصنيف مشروعك، قد تكون الفئة المستهدفة: "الأسر ذات الدخل المحدود، الأرامل، والأيتام في مدينة الرياض"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">النطاق الجغرافي</h2>
                <p className="text-gray-600">أين سيتم تنفيذ المشروع؟</p>
              </div>
              <select
                value={wizardData.geographicScope}
                onChange={(e) => setWizardData({ ...wizardData, geographicScope: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر النطاق</option>
                <option value="local">محلي (مدينة واحدة)</option>
                <option value="regional">إقليمي (منطقة واحدة)</option>
                <option value="national">وطني (المملكة)</option>
              </select>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">نطاق الميزانية</h2>
                <p className="text-gray-600">ما هي الميزانية التقديرية للمشروع؟</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'small', label: 'أقل من 100,000 ر.س', range: '< 100K' },
                  { value: 'medium', label: '100,000 - 500,000 ر.س', range: '100K - 500K' },
                  { value: 'large', label: '500,000 - 1,000,000 ر.س', range: '500K - 1M' },
                  { value: 'xlarge', label: 'أكثر من 1,000,000 ر.س', range: '> 1M' }
                ].map((budget) => (
                  <button
                    key={budget.value}
                    onClick={() => setWizardData({ ...wizardData, budgetRange: budget.value })}
                    className={`p-6 rounded-xl border-2 transition-all text-right ${
                      wizardData.budgetRange === budget.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <DollarSign className="w-8 h-8 mb-2 text-green-600" />
                    <p className="font-semibold mb-1">{budget.range}</p>
                    <p className="text-sm text-gray-600">{budget.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">المدة المتوقعة</h2>
                <p className="text-gray-600">كم ستستغرق مدة تنفيذ المشروع؟</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'short', label: '3-6 أشهر', icon: Clock },
                  { value: 'medium', label: '6-12 شهر', icon: Clock },
                  { value: 'long', label: 'أكثر من سنة', icon: Clock }
                ].map((dur) => {
                  const Icon = dur.icon;
                  return (
                    <button
                      key={dur.value}
                      onClick={() => setWizardData({ ...wizardData, duration: dur.value })}
                      className={`p-6 rounded-xl border-2 transition-all text-center ${
                        wizardData.duration === dur.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="font-semibold">{dur.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {wizardStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">متطلبات خاصة</h2>
                <p className="text-gray-600">هل هناك أي متطلبات أو ملاحظات خاصة؟</p>
              </div>
              <textarea
                value={wizardData.specialRequirements}
                onChange={(e) => setWizardData({ ...wizardData, specialRequirements: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="مثال: يجب أن يتضمن المشروع برامج تدريبية، يفضل الشراكة مع جهات حكومية..."
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t mt-8">
            <button
              onClick={() => {
                if (wizardStep > 1) {
                  setWizardStep(wizardStep - 1);
                } else {
                  setCurrentView('studio');
                }
              }}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              <ChevronRight className="w-5 h-5" />
              رجوع
            </button>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                <Save className="w-5 h-5" />
                حفظ المسودة
              </button>
              {wizardStep < totalSteps ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  التالي
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      جارٍ الإنشاء...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      إنشاء المشروع
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">الذكاء الاصطناعي يعمل على مشروعك</h3>
              <p className="text-gray-600 mb-6">يتم تحليل المعلومات وإنشاء مشروع احترافي كامل...</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>تحليل المتطلبات</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>إنشاء الأهداف</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>كتابة الأنشطة والتسليمات</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // PAGE 3: AI Project Workspace
  const WorkspaceView = () => {
    const projectSections: ProjectSection[] = [
      { id: '1', title: 'اسم المشروع', content: 'برنامج التمكين الاقتصادي للأسر المنتجة', status: 'generated', aiConfidence: 95 },
      { id: '2', title: 'فكرة المشروع', content: 'برنامج شامل يهدف إلى تمكين الأسر ذات الدخل المحدود اقتصادياً من خلال تدريبهم على مهارات إنتاجية وتوفير التمويل اللازم لبدء مشاريع صغيرة مستدامة.', status: 'generated', aiConfidence: 92 },
      { id: '3', title: 'بيان المشكلة', content: 'تعاني العديد من الأسر في مدينة الرياض من محدودية الدخل وعدم القدرة على تلبية الاحتياجات الأساسية، مما يؤدي إلى اعتمادهم المستمر على المساعدات الخيرية دون تحقيق الاستقلال المالي.', status: 'generated', aiConfidence: 88 },
      { id: '4', title: 'الهدف العام', content: 'تمكين 150 أسرة من تحقيق الاستقلال المالي خلال 12 شهراً من خلال التدريب المهني والدعم المالي.', status: 'generated', aiConfidence: 90 }
    ];

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => setCurrentView('wizard')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
            >
              <ChevronRight className="w-5 h-5" />
              رجوع إلى المعالج
            </button>
            <h1 className="text-3xl font-bold mb-2">مساحة عمل المشروع</h1>
            <p className="text-gray-600">راجع وعدّل المشروع الذي أنشأه الذكاء الاصطناعي</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('readiness')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              تقييم الجاهزية
            </button>
            <button
              onClick={() => setCurrentView('review')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              إرسال للمراجعة
            </button>
          </div>
        </div>

        {/* AI Confidence Badge */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">جودة عالية</p>
              <p className="text-sm text-green-700">الذكاء الاصطناعي واثق بنسبة 92% من جودة هذا المشروع</p>
            </div>
          </div>
        </div>

        {/* Project Sections */}
        <div className="space-y-4">
          {projectSections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        AI: {section.aiConfidence}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSection(section.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="إعادة إنشاء">
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="إضافة تعليق">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                {editingSection === section.id ? (
                  <div className="space-y-3">
                    <textarea
                      defaultValue={section.content}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">إجراءات إضافية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-600" />
              <span>تصدير PDF</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right flex items-center gap-3">
              <Copy className="w-5 h-5 text-gray-600" />
              <span>نسخ المحتوى</span>
            </button>
            <button
              onClick={() => setCurrentView('versions')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right flex items-center gap-3"
            >
              <GitBranch className="w-5 h-5 text-gray-600" />
              <span>عرض الإصدارات</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // PAGE 4: AI Project Improvement Center
  const ImprovementView = () => {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('studio')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى الاستوديو
          </button>
          <h1 className="text-3xl font-bold mb-2">مركز تحسين المشاريع</h1>
          <p className="text-gray-600">قارن بين النسخة الأصلية والنسخة المحسّنة بالذكاء الاصطناعي</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ارفع مشروعك الحالي</h3>
          <p className="text-gray-600 mb-4">PDF, DOCX, أو الصق النص مباشرة</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            اختر ملف
          </button>
        </div>

        {/* Comparison View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold">النسخة الأصلية</h3>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>المحتوى الأصلي للمشروع...</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-500">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">النسخة المحسّنة</h3>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">+45% تحسين</span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>المحتوى المحسّن...</p>
            </div>
          </div>
        </div>

        {/* Improvements Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-4">ملخص التحسينات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-semibold mb-1">أهداف أوضح</p>
              <p className="text-sm text-gray-600">تم تحسين صياغة الأهداف بنسبة 40%</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-semibold mb-1">مؤشرات أداء أفضل</p>
              <p className="text-sm text-gray-600">إضافة 12 مؤشر قابل للقياس</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-semibold mb-1">جاهزية للتمويل</p>
              <p className="text-sm text-gray-600">زيادة الجاهزية من 60% إلى 85%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // PAGE 5: AI Feasibility Study Generator
  const FeasibilityView = () => {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('studio')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى الاستوديو
          </button>
          <h1 className="text-3xl font-bold mb-2">دراسة الجدوى الأولية</h1>
          <p className="text-gray-600">تم إنشاؤها بواسطة الذكاء الاصطناعي</p>
        </div>

        {/* Feasibility Sections */}
        <div className="space-y-6">
          {[
            { title: 'الملخص التنفيذي', icon: FileText, content: 'ملخص شامل للمشروع وأهدافه الرئيسية...' },
            { title: 'تحليل الحاجة', icon: BarChart3, content: 'تحليل مفصل للحاجة إلى المشروع...' },
            { title: 'الجمهور المستهدف', icon: Users, content: 'وصف تفصيلي للمستفيدين...' },
            { title: 'خطة التنفيذ', icon: ListChecks, content: 'المراحل والجداول الزمنية...' },
            { title: 'نظرة عامة على الميزانية', icon: DollarSign, content: 'تفصيل الميزانية المقترحة...' },
            { title: 'تقييم المخاطر', icon: Shield, content: 'تحديد المخاطر وخطط التخفيف...' }
          ].map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <Download className="w-5 h-5" />
              تصدير PDF
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل
            </button>
            <button
              onClick={() => setCurrentView('review')}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              إرسال للاعتماد
            </button>
          </div>
        </div>
      </div>
    );
  };

  // PAGE 6: AI Review & Human Validation
  const ReviewView = () => {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('workspace')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى مساحة العمل
          </button>
          <h1 className="text-3xl font-bold mb-2">المراجعة والاعتماد</h1>
          <p className="text-gray-600">مراجعة بشرية لمخرجات الذكاء الاصطناعي</p>
        </div>

        {/* Review Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900">قيد المراجعة</p>
              <p className="text-sm text-yellow-700">تم إرسال المشروع لمراجعة فريق الحاضنة</p>
            </div>
          </div>
        </div>

        {/* Version Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">نسخة الذكاء الاصطناعي</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">المحتوى الذي أنشأه الذكاء الاصطناعي...</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-500">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">النسخة المعدّلة</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">المحتوى بعد المراجعة البشرية...</p>
            </div>
          </div>
        </div>

        {/* Reviewer Notes */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">ملاحظات المراجع</h3>
          <textarea
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="أضف ملاحظاتك هنا..."
          />
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              اعتماد
            </button>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2">
              <X className="w-5 h-5" />
              رفض
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <Edit className="w-5 h-5" />
              طلب تعديلات
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              إعادة إنشاء
            </button>
          </div>
        </div>
      </div>
    );
  };

  // PAGE 7: AI Project Versions
  const VersionsView = () => {
    const versions: ProjectVersion[] = [
      { id: 'v3', version: 3, date: '2026-06-07 14:30', author: 'AI Model 4.0', aiModel: 'GPT-4', status: 'approved' },
      { id: 'v2', version: 2, date: '2026-06-05 10:15', author: 'AI Model 4.0', aiModel: 'GPT-4', status: 'under-review' },
      { id: 'v1', version: 1, date: '2026-06-01 09:00', author: 'AI Model 3.5', aiModel: 'GPT-3.5', status: 'draft' }
    ];

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('workspace')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى مساحة العمل
          </button>
          <h1 className="text-3xl font-bold mb-2">سجل الإصدارات</h1>
          <p className="text-gray-600">جميع إصدارات المشروع المنشأة بالذكاء الاصطناعي</p>
        </div>

        {/* Current Version Badge */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="w-8 h-8" />
              <div>
                <p className="text-blue-100 text-sm mb-1">الإصدار الحالي</p>
                <p className="text-2xl font-bold">v3.0</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              إنشاء إصدار جديد
            </button>
          </div>
        </div>

        {/* Versions List */}
        <div className="space-y-4">
          {versions.map((version) => (
            <div key={version.id} className={`bg-white rounded-xl border-2 p-6 ${
              version.status === 'approved' ? 'border-green-500' : 'border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">v{version.version}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold">الإصدار {version.version}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        version.status === 'approved' ? 'bg-green-100 text-green-700' :
                        version.status === 'under-review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {version.status === 'approved' ? 'معتمد' : version.status === 'under-review' ? 'قيد المراجعة' : 'مسودة'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        {version.aiModel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {version.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                  {version.status !== 'approved' && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PAGE 8: Project Readiness Dashboard
  const ReadinessView = () => {
    const readinessScores = [
      { category: 'الاكتمال', score: 85, max: 100 },
      { category: 'جاهزية التمويل', score: 78, max: 100 },
      { category: 'الوثائق', score: 92, max: 100 },
      { category: 'جودة المؤشرات', score: 88, max: 100 },
      { category: 'قياس الأثر', score: 75, max: 100 },
      { category: 'المخاطر', score: 95, max: 100 }
    ];

    const radarData = readinessScores.map(s => ({ category: s.category, score: s.score, fullMark: 100 }));

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('workspace')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى مساحة العمل
          </button>
          <h1 className="text-3xl font-bold mb-2">لوحة الجاهزية</h1>
          <p className="text-gray-600">تقييم شامل لجاهزية المشروع</p>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
            <Award className="w-4 h-4" />
            <span className="text-sm">درجة الجاهزية الإجمالية</span>
          </div>
          <div className="text-6xl font-bold mb-2">85%</div>
          <p className="text-green-100">جاهز للموافقة</p>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">التفصيل حسب المحور</h3>
            <div className="space-y-4">
              {readinessScores.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm font-bold text-blue-600">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.score >= 80 ? 'bg-green-500' :
                        item.score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">المخطط الشامل</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                <Radar name="النتيجة" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-900 mb-4">معلومات ناقصة</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span>يُنصح بإضافة مؤشرات أداء إضافية لقياس الأثر</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span>توضيح خطة التخفيف من المخاطر</span>
            </li>
          </ul>
        </div>

        {/* Primary Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('review')}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              إرسال للموافقة
            </button>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <Users className="w-5 h-5" />
              إرسال للجمعية
            </button>
            <button
              onClick={() => setCurrentView('workspace')}
              className="px-8 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              متابعة التعديل
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render views
  return (
    <div className="min-h-full bg-gray-50 p-6">
      {currentView === 'studio' && <StudioView />}
      {currentView === 'wizard' && <WizardView />}
      {currentView === 'workspace' && <WorkspaceView />}
      {currentView === 'improvement' && <ImprovementView />}
      {currentView === 'feasibility' && <FeasibilityView />}
      {currentView === 'review' && <ReviewView />}
      {currentView === 'versions' && <VersionsView />}
      {currentView === 'readiness' && <ReadinessView />}
    </div>
  );
}
