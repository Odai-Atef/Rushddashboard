import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  ChevronRight,
  ChevronLeft,
  Save,
  Building2,
  Users,
  Target,
  TrendingUp,
  Shield,
  DollarSign,
  Briefcase,
  Heart,
  Zap,
  Brain,
  BarChart3,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  ArrowRight,
  Download,
  X,
  Check,
  Loader2,
  Star,
  AlertCircle,
  Lightbulb,
  PlayCircle,
  BookOpen,
  Link2,
  Activity,
  Circle,
  Building,
  Info
} from 'lucide-react';
import { useOnboardingRegistration } from '@/app/hooks/useOnboardingRegistration';
import { toast } from 'sonner';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { onboardingService, AssessmentCategory, AssessmentQuestion, SaveAnswerPayload, SavedAnswer } from '@/api/services/onboarding-service';

type ViewType = 'landing' | 'registration' | 'profile' | 'assessment' | 'documents' | 'processing' | 'results' | 'analysis' | 'roadmap' | 'decision';

interface RegistrationData {
  orgName: string;
  licenseNumber: string;
  registrationDate: string;
  orgType: string;
  city: string;
  website: string;
  contactPerson: string;
  email: string;
  mobile: string;
}

interface ProfileData {
  overview: string;
  areasOfWork: string[];
  targetBeneficiaries: string;
  geographicCoverage: string;
  employeeCount: string;
  volunteerCount: string;
  activeProjects: string;
}

interface AssessmentAnswer {
  categoryId: string;
  questionId: string;
  answer: number | string | string[] | File | null;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

export function CharityOnboardingFlow() {
  // ── Hook: JWT-based onboarding ──────────────────────────────
  const {
    organization,
    fundingAreas,
    isLoading,
    isSaving,
    error,
    fieldErrors,
    loadOrganization,
    saveOrganization,
    createProfile,
    saveFundingAreas,
    loadFundingAreas,
    clearError,
  } = useOnboardingRegistration();

  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    orgName: '',
    licenseNumber: '',
    registrationDate: '',
    orgType: '',
    city: '',
    website: '',
    contactPerson: '',
    email: '',
    mobile: ''
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    overview: '',
    areasOfWork: [],
    targetBeneficiaries: '',
    geographicCoverage: '',
    employeeCount: '',
    volunteerCount: '',
    activeProjects: ''
  });
  const [currentAssessmentStep, setCurrentAssessmentStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswer[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [overallScore, setOverallScore] = useState(78);
  const [qualificationStatus, setQualificationStatus] = useState<'qualified' | 'conditional' | 'not-qualified'>('conditional');

  // Ref to guard auto-navigation so it only fires once on initial data load
  const hasRestoredStepRef = useRef(false);

  // ── Effect: load existing organization on mount ─────────────
  useEffect(() => {
    loadOrganization();
  }, [loadOrganization]);

  // ── Effect: load existing organization when navigating to registration ────
  useEffect(() => {
    if (currentView === 'registration') {
      loadOrganization();
    }
  }, [currentView, loadOrganization]);

  // ── Effect: load funding areas when profile view mounts ───────
  useEffect(() => {
    if (currentView === 'profile') {
      loadFundingAreas();
    }
  }, [currentView, loadFundingAreas]);

  // ── Effect: pre-fill form when organization data arrives ──────
  useEffect(() => {
    if (organization) {
      setRegistrationData({
        orgName: organization.name || '',
        licenseNumber: organization.licenseNumber || '',
        registrationDate: organization.registrationDate
          ? organization.registrationDate.slice(0, 10)
          : '',
        orgType: organization.type ? organization.type.toLowerCase() : '',
        city: organization.city || '',
        website: organization.website || '',
        contactPerson: organization.contactPerson || '',
        email: organization.email || '',
        mobile: organization.mobile || '',
      });
    }
  }, [organization]);

  // ── Effect: pre-fill profile form when embedded profile arrives ─
  useEffect(() => {
    if (organization?.profile) {
      const p = organization.profile;
      setProfileData({
        overview: p.overview || '',
        targetBeneficiaries: p.targetBeneficiaries || '',
        geographicCoverage: p.geographicCoverage ? p.geographicCoverage.toLowerCase() : '',
        employeeCount: p.employeeCount != null ? String(p.employeeCount) : '',
        volunteerCount: p.volunteerCount != null ? String(p.volunteerCount) : '',
        activeProjects: p.activeProjects != null ? String(p.activeProjects) : '',
        areasOfWork: (p.fundingAreas || []).map((fa) => fa.fundingAreaId).filter(Boolean),
      });
    }
  }, [organization?.profile]);

  // ── Effect: navigate to saved onboarding step on initial load ──
  useEffect(() => {
    if (organization?.currentStep && !hasRestoredStepRef.current) {
      const step = organization.currentStep.toLowerCase();
      const validSteps: ViewType[] = [
        'landing', 'registration', 'profile', 'assessment',
        'documents', 'processing', 'results', 'analysis', 'roadmap', 'decision',
      ];
      if (validSteps.includes(step as ViewType)) {
        setCurrentView(step as ViewType);
        hasRestoredStepRef.current = true;
      }
    }
  }, [organization?.currentStep]);

  // ── Effect: load assessment state (categories + saved answers) when entering assessment view ──────
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (currentView !== 'assessment') {
      setAssessmentCategories([]);
      setAssessmentProgress({});
      setOverallProgress(0);
      setCurrentAssessmentStep(0);
      setIsLoadingAssessment(false);
      setAssessmentError(null);
      setAnswersLoadError(null);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoadingAssessment(true);
    setAssessmentError(null);
    setAnswersLoadError(null);

    const orgId = organization?.id;
    onboardingService.getAssessmentState(orgId)
      .then((res) => {
        if (controller.signal.aborted) return;
        const state = res.data;
        if (!state) return;

        setOverallProgress(state.overallProgress ?? 0);

        if (!state.categories || state.categories.length === 0) {
          setAssessmentCategories([]);
          setAssessmentProgress({});
          return;
        }

        // Build progress map and flatten saved answers from the state response
        const progress: Record<string, { answered: number; total: number; isComplete: boolean }> = {};
        const flattenedAnswers: SavedAnswer[] = [];

        state.categories.forEach((cat) => {
          progress[cat.categoryId] = {
            answered: cat.answeredQuestions ?? 0,
            total: cat.totalQuestions ?? 0,
            isComplete: cat.isComplete ?? false,
          };

          cat.answers?.forEach((ans) => {
            flattenedAnswers.push({
              id: ans.questionId,
              organizationId: state.organizationId,
              questionId: ans.questionId,
              questionType: ans.questionType,
              answerNumeric: ans.answerNumeric ?? null,
              answerValue: ans.answerValue ?? ans.fileUrl ?? null,
              selectedOptions: ans.selectedOptions ?? null,
            });
          });
        });

        setAssessmentProgress(progress);
        mergeSavedAnswers(flattenedAnswers, false);

        // Map state categories to AssessmentCategory shape if they include questions,
        // otherwise keep the existing categories list empty and load categories separately.
        const stateCategories: AssessmentCategory[] | undefined = state.categories
          .filter((cat) => Array.isArray(cat.questions) && cat.questions.length > 0)
          .map((cat) => ({
            id: cat.categoryId,
            name: cat.categoryName,
            nameEn: cat.categoryName,
            icon: '',
            color: '#3B82F6',
            sortOrder: 0,
            questions: cat.questions || [],
          }));

        if (stateCategories && stateCategories.length > 0) {
          setAssessmentCategories(stateCategories);
        } else {
          // Fallback: load categories separately if state does not include questions
          return onboardingService.getAssessmentCategories().then((catRes) => {
            if (controller.signal.aborted) return;
            if (catRes.data) {
              setAssessmentCategories(catRes.data);
            }
          });
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const message = err?.message || 'حدث خطأ أثناء تحميل التقييم';
        if (err?.statusCode === 401) {
          setAssessmentError(message);
        } else if (err?.statusCode === 404) {
          // No organization: show empty assessment without blocking
          setAssessmentCategories([]);
          setAssessmentProgress({});
          setOverallProgress(0);
        } else {
          setAnswersLoadError(message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingAssessment(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [currentView]);

  // ── Effect: display server/network errors via toast ───────────
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // ── Helper: map form state to CreateOrganizationDto ─────────────
  const buildOrganizationDto = (): import('@/api/services/onboarding-service').CreateOrganizationDto => ({
    name: registrationData.orgName.trim(),
    licenseNumber: registrationData.licenseNumber.trim(),
    registrationDate: registrationData.registrationDate,
    type: registrationData.orgType.toUpperCase() as import('@/api/services/onboarding-service').OrganizationType,
    city: registrationData.city.trim(),
    website: registrationData.website.trim() || undefined,
    contactPerson: registrationData.contactPerson.trim(),
    email: registrationData.email.trim(),
    mobile: registrationData.mobile.trim(),
  });

  // ── Helper: handle Next / Save ──────────────────────────────
  const handleSaveAndProceed = async () => {
    clearError();
    const dto = buildOrganizationDto();
    try {
      await saveOrganization(dto);
      setCurrentView('profile');
    } catch (err: any) {
      // Error already handled by hook (fieldErrors + toast via effect)
      // Keep form data intact — no reset here
    }
  };

  // ── Helper: handle profile Next ─────────────────────────────
  const handleProfileNext = async () => {
    clearError();

    // Validation
    if (!profileData.overview.trim()) {
      toast.error('نبذة عن المؤسسة مطلوبة');
      return;
    }
    if (!profileData.targetBeneficiaries.trim()) {
      toast.error('الفئات المستهدفة مطلوبة');
      return;
    }
    if (!profileData.geographicCoverage) {
      toast.error('النطاق الجغرافي مطلوب');
      return;
    }
    if (profileData.areasOfWork.length === 0) {
      toast.error('مجالات العمل مطلوبة');
      return;
    }

    if (!organization?.id) {
      toast.error('لم يتم العثور على معرف المؤسسة. يرجى إكمال التسجيل أولاً.');
      return;
    }

    const payload: import('@/api/services/onboarding-service').OrganizationProfile = {
      overview: profileData.overview.trim(),
      targetBeneficiaries: profileData.targetBeneficiaries.trim(),
      geographicCoverage: profileData.geographicCoverage.toUpperCase() as import('@/api/services/onboarding-service').GeographicCoverage,
      employeeCount: profileData.employeeCount ? parseInt(profileData.employeeCount, 10) : undefined,
      volunteerCount: profileData.volunteerCount ? parseInt(profileData.volunteerCount, 10) : undefined,
      activeProjects: profileData.activeProjects ? parseInt(profileData.activeProjects, 10) : undefined,
      areasOfWork: profileData.areasOfWork,
    };

    try {
      await createProfile(payload);
      await saveFundingAreas(profileData.areasOfWork);
      setCurrentView('assessment');
    } catch {
      // Errors are already handled by hook (toast via effect)
    }
  };

  // ── Helper: clear error on field change ─────────────────────
  const handleFieldChange = (field: keyof RegistrationData, value: string) => {
    if (fieldErrors[field]) {
      clearError();
    }
    setRegistrationData((prev) => ({ ...prev, [field]: value }));
  };

  // Icon name → Lucide component mapping (dynamic categories use string icon names)
  const iconMap: Record<string, React.ElementType> = {
    shield: Shield,
    dollarSign: DollarSign,
    users: Users,
    heart: Heart,
    briefcase: Briefcase,
    zap: Zap,
    target: Target,
    barChart3: BarChart3,
    trendingUp: TrendingUp,
    building: Building,
  };
  const resolveIcon = (name?: string) => (name && iconMap[name]) ? iconMap[name] : Circle;

  // Dynamic assessment categories (fetched from API)
  const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [answersLoadError, setAnswersLoadError] = useState<string | null>(null);
  const [isSavingAnswers, setIsSavingAnswers] = useState(false);
  const [saveAnswersError, setSaveAnswersError] = useState<string | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState<Record<string, { answered: number; total: number; isComplete: boolean }>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const locallyEditedQuestionIds = useRef<Set<string>>(new Set());

  // SCREEN 1: Landing & Assessment Entry
  const LandingView = () => (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">حاضنة رشد الافتراضية</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            انضم إلى حاضنة رشد للمشاريع الخيرية
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            قيّم جاهزية مؤسستك الخيرية للانضمام إلى برنامج الحاضنة واحصل على خطة تطوير شاملة مدعومة بالذكاء الاصطناعي
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">تقييم شامل</h3>
            <p className="text-gray-600 text-sm">تقييم متعمق لـ 9 محاور رئيسية لقياس جاهزية مؤسستك</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">تحليل ذكي</h3>
            <p className="text-gray-600 text-sm">تحليل مدعوم بالذكاء الاصطناعي مع توصيات مخصصة</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">خطة تطوير</h3>
            <p className="text-gray-600 text-sm">خارطة طريق واضحة للتطوير والتحسين المستمر</p>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">ماذا يتضمن التقييم؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">المدة الزمنية</p>
                <p className="text-sm text-gray-600">٣٠ - ٤٥ دقيقة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">عدد الأسئلة</p>
                <p className="text-sm text-gray-600">٤٥ سؤالاً موزعة على ٩ محاور</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">المستندات المطلوبة</p>
                <p className="text-sm text-gray-600">رخصة الجمعية، شهادة الحساب البنكي، العنوان الوطني</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Save className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">حفظ تلقائي</p>
                <p className="text-sm text-gray-600">احفظ تقدمك وعُد متى شئت</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentView('registration')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              ابدأ التقييم
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              اعرف المزيد
            </button>
          </div>
        </div>

        {/* Progress Explanation */}
        <div className="text-center text-sm text-gray-600">
          <p>سيتم إرشادك خلال ٤ خطوات رئيسية: التسجيل → الملف التعريفي → التقييم → النتائج</p>
        </div>
      </div>
    </div>
  );

  // SCREEN 2: Charity Registration
  const RegistrationView = () => (
    <div className="min-h-full bg-gray-50 p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">الخطوة ١ من ٤</span>
            <span className="text-sm font-medium text-blue-600">٢٥٪</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">معلومات المؤسسة الخيرية</h1>
            <p className="text-gray-600">يرجى تعبئة البيانات الأساسية للمؤسسة</p>
          </div>

          <form className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium mb-2">اسم المؤسسة *</label>
              <div className="relative">
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registrationData.orgName}
                  onChange={(e) => handleFieldChange('orgName', e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: جمعية البر الخيرية"
                />
              </div>
              {fieldErrors['name'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['name']}</p>}
            </div>

            {/* License Number & Registration Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">رقم الترخيص *</label>
                <input
                  type="text"
                  value={registrationData.licenseNumber}
                  onChange={(e) => handleFieldChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="١٢٣٤٥٦"
                />
                {fieldErrors['licenseNumber'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['licenseNumber']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ التسجيل *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={registrationData.registrationDate}
                    onChange={(e) => handleFieldChange('registrationDate', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {fieldErrors['registrationDate'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['registrationDate']}</p>}
              </div>
            </div>

            {/* Organization Type & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نوع المؤسسة *</label>
                <select
                  value={registrationData.orgType}
                  onChange={(e) => handleFieldChange('orgType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر نوع المؤسسة</option>
                  <option value="charity">جمعية خيرية</option>
                  <option value="foundation">مؤسسة خيرية</option>
                  <option value="ngo">منظمة غير ربحية</option>
                  <option value="coop">جمعية تعاونية</option>
                </select>
                {fieldErrors['type'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['type']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المدينة / المنطقة *</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registrationData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="الرياض"
                  />
                </div>
                {fieldErrors['city'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['city']}</p>}
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-2">الموقع الإلكتروني</label>
              <div className="relative">
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={registrationData.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.org"
                />
              </div>
              {fieldErrors['website'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['website']}</p>}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium mb-2">اسم الشخص المسؤول *</label>
                <input
                  type="text"
                  value={registrationData.contactPerson}
                  onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أحمد محمد"
                />
                {fieldErrors['contactPerson'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['contactPerson']}</p>}
              </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                {fieldErrors['email'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['email']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الجوال *</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={registrationData.mobile}
                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+966 5X XXX XXXX"
                    dir="ltr"
                  />
                </div>
                {fieldErrors['mobile'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['mobile']}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                رجوع
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveAndProceed}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  حفظ المسودة
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndProceed}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // SCREEN 3: Organization Profile Information
  const ProfileView = () => (
    <div className="min-h-full bg-gray-50 p-6">
      {(isLoading || isSaving) && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">الخطوة ٢ من ٤</span>
            <span className="text-sm font-medium text-blue-600">٥٠٪</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">الملف التعريفي للمؤسسة</h1>
            <p className="text-gray-600">معلومات تفصيلية عن نشاط المؤسسة وبرامجها</p>
          </div>

          <form className="space-y-6">
            {/* Organization Overview */}
            <div>
              <label className="block text-sm font-medium mb-2">نبذة عن المؤسسة *</label>
              <textarea
                value={profileData.overview}
                onChange={(e) => setProfileData({ ...profileData, overview: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="اكتب نبذة مختصرة عن رؤية ورسالة وأهداف المؤسسة..."
              />
              <p className="text-xs text-gray-500 mt-1">٢٠٠ - ٥٠٠ كلمة</p>
            </div>

            {/* Areas of Work */}
            <div>
              <label className="block text-sm font-medium mb-2">مجالات العمل *</label>
              {fundingAreas.length === 0 && !isLoading && (
                <p className="text-sm text-gray-500 mb-2">لا توجد مجالات عمل متاحة حالياً. يرجى المحاولة لاحقاً.</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {fundingAreas.map((area) => (
                  <label key={area.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.areasOfWork.includes(area.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProfileData({ ...profileData, areasOfWork: [...profileData.areasOfWork, area.id] });
                        } else {
                          setProfileData({ ...profileData, areasOfWork: profileData.areasOfWork.filter(a => a !== area.id) });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{area.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Beneficiaries */}
            <div>
              <label className="block text-sm font-medium mb-2">الفئات المستهدفة *</label>
              <input
                type="text"
                value={profileData.targetBeneficiaries}
                onChange={(e) => setProfileData({ ...profileData, targetBeneficiaries: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: الأسر المحتاجة، الأيتام، كبار السن"
              />
            </div>

            {/* Geographic Coverage */}
            <div>
              <label className="block text-sm font-medium mb-2">النطاق الجغرافي *</label>
              <select
                value={profileData.geographicCoverage}
                onChange={(e) => setProfileData({ ...profileData, geographicCoverage: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر النطاق الجغرافي</option>
                <option value="local">محلي (مدينة واحدة)</option>
                <option value="regional">إقليمي (منطقة واحدة)</option>
                <option value="national">وطني (على مستوى المملكة)</option>
                <option value="international">دولي</option>
              </select>
            </div>

            {/* Team Statistics */}
            <div>
              <label className="block text-sm font-medium mb-4">حجم الفريق والمتطوعين</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">عدد الموظفين</label>
                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={profileData.employeeCount}
                      onChange={(e) => setProfileData({ ...profileData, employeeCount: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">عدد المتطوعين</label>
                  <div className="relative">
                    <Heart className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={profileData.volunteerCount}
                      onChange={(e) => setProfileData({ ...profileData, volunteerCount: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">المشاريع النشطة</label>
                  <div className="relative">
                    <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={profileData.activeProjects}
                      onChange={(e) => setProfileData({ ...profileData, activeProjects: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => setCurrentView('registration')}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                رجوع
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  حفظ المسودة
                </button>
                <button
                  type="button"
                  onClick={handleProfileNext}
                  disabled={isLoading || isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Helpers for dynamic assessment rendering
  const getAnswer = (questionId: string) =>
    assessmentAnswers.find((a) => a.questionId === questionId)?.answer;

  const setAnswer = (categoryId: string, questionId: string, answer: AssessmentAnswer['answer']) => {
    locallyEditedQuestionIds.current.add(questionId);
    setSaveAnswersError(null);
    setAssessmentAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { categoryId, questionId, answer }];
    });
  };

  const mergeSavedAnswers = (savedAnswers: SavedAnswer[], overwriteLocal: boolean) => {
    setAssessmentAnswers((prev) => {
      const next = [...prev];
      savedAnswers.forEach((saved) => {
        if (!overwriteLocal && locallyEditedQuestionIds.current.has(saved.questionId)) {
          return;
        }
        let answer: AssessmentAnswer['answer'] = null;
        switch (saved.questionType) {
          case 'SCALE':
            answer = saved.answerNumeric;
            break;
          case 'YES_NO':
          case 'FILE_UPLOAD':
            answer = saved.answerValue;
            break;
          case 'MULTIPLE_CHOICE':
            answer = saved.selectedOptions;
            break;
        }
        const idx = next.findIndex((a) => a.questionId === saved.questionId);
        const categoryId = assessmentCategories.find((cat) =>
          cat.questions.some((q) => q.id === saved.questionId)
        )?.id || '';
        if (idx >= 0) {
          next[idx] = { categoryId, questionId: saved.questionId, answer };
        } else {
          next.push({ categoryId, questionId: saved.questionId, answer });
        }
      });
      return next;
    });
  };

  const buildSaveAnswerPayloads = (questions: AssessmentQuestion[]): SaveAnswerPayload[] => {
    return questions
      .map((q) => {
        const answer = getAnswer(q.id);
        const base: SaveAnswerPayload = {
          questionId: q.id,
          answerNumeric: null,
          answerValue: null,
          selectedOptions: null,
        };
        switch (q.questionType) {
          case 'SCALE':
            return typeof answer === 'number' ? { ...base, answerNumeric: answer } : null;
          case 'YES_NO':
          case 'FILE_UPLOAD':
            return typeof answer === 'string' && answer.trim() !== '' ? { ...base, answerValue: answer } : null;
          case 'MULTIPLE_CHOICE':
            return Array.isArray(answer) && answer.length > 0 ? { ...base, selectedOptions: answer } : null;
          default:
            return null;
        }
      })
      .filter((payload): payload is SaveAnswerPayload => payload !== null);
  };

  const findUnansweredRequiredQuestions = (questions: AssessmentQuestion[]) => {
    return questions.filter((q) => {
      if (!q.isRequired) return false;
      const answer = getAnswer(q.id);
      if (answer == null) return true;
      if (typeof answer === 'string' && answer.trim() === '') return true;
      if (Array.isArray(answer) && answer.length === 0) return true;
      return false;
    });
  };

  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-red-500', 'rounded-lg');
      setTimeout(() => element.classList.remove('ring-2', 'ring-red-500', 'rounded-lg'), 2000);
    }
  };

  const handleAssessmentNext = async () => {
    setSaveAnswersError(null);
    const currentCategory = assessmentCategories[currentAssessmentStep];
    if (!currentCategory) return;

    const scopeQuestions = currentCategory.questions;
    const unansweredRequired = findUnansweredRequiredQuestions(scopeQuestions);
    if (unansweredRequired.length > 0) {
      toast.error(`يرجى الإجابة على ${unansweredRequired.length} سؤال مطلوب`);
      scrollToQuestion(unansweredRequired[0].id);
      return;
    }

    const payload = buildSaveAnswerPayloads(scopeQuestions);
    setIsSavingAnswers(true);
    try {
      const res = await onboardingService.saveAssessmentAnswers(payload, organization?.id);
      if (res.data) {
        mergeSavedAnswers(Array.isArray(res.data) ? res.data : res.data.answers ?? [], true);
        locallyEditedQuestionIds.current.clear();
        if (currentAssessmentStep < assessmentCategories.length - 1) {
          setCurrentAssessmentStep((step) => step + 1);
        } else {
          setCurrentView('documents');
        }
      }
    } catch (err: any) {
      const status = err?.statusCode;
      let message = err?.message || 'حدث خطأ أثناء حفظ الإجابات. يرجى المحاولة مرة أخرى.';
      if (status === 404) {
        message = 'لم يتم العثور على المؤسسة. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
      } else if (status === 400) {
        message = 'بيانات الإجابات غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.';
      }
      setSaveAnswersError(message);
      toast.error(message);
    } finally {
      setIsSavingAnswers(false);
    }
  };

  // SCREEN 4: Readiness Assessment Wizard
  const AssessmentView = () => {
    if (isLoadingAssessment) {
      return (
        <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-600">جارٍ تحميل فئات التقييم...</p>
          </div>
        </div>
      );
    }

    if (assessmentError) {
      return (
        <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">تعذر تحميل التقييم</h2>
            <p className="text-gray-600 mb-6">{assessmentError}</p>
            <button
              onClick={() => setCurrentView('profile')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              العودة إلى الملف التعريفي
            </button>
          </div>
        </div>
      );
    }

    if (assessmentCategories.length === 0) {
      return (
        <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">لا توجد فئات تقييم متاحة</h2>
            <p className="text-gray-600 mb-6">لم يتم العثور على فئات تقييم في الوقت الحالي. يرجى المحاولة لاحقاً.</p>
            <button
              onClick={() => setCurrentView('profile')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              العودة إلى الملف التعريفي
            </button>
          </div>
        </div>
      );
    }

    const currentCategory = assessmentCategories[currentAssessmentStep];
    const CategoryIcon = resolveIcon(currentCategory.icon);
    const currentProgress = assessmentProgress[currentCategory.id] ?? { answered: 0, total: currentCategory.questions.length, isComplete: false };

    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">الخطوة ٣ من ٤ - التقييم</span>
              <span className="text-sm font-medium text-blue-600">{Math.round(overallProgress)}٪</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          {/* Category Steps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {assessmentCategories.map((cat, idx) => {
                const Icon = resolveIcon(cat.icon);
                const catProgress = assessmentProgress[cat.id] ?? { answered: 0, total: cat.questions.length, isComplete: false };
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentAssessmentStep(idx)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      idx === currentAssessmentStep
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : catProgress.isComplete
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${idx === currentAssessmentStep ? 'text-blue-600' : catProgress.isComplete ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${idx === currentAssessmentStep ? 'text-blue-900' : catProgress.isComplete ? 'text-green-900' : 'text-gray-500'}`}>
                        {cat.name}
                      </span>
                      {catProgress.isComplete && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {catProgress.answered} / {catProgress.total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${currentCategory.color}20` }}>
                <CategoryIcon className="w-8 h-8" style={{ color: currentCategory.color }} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{currentCategory.name}</h2>
                <p className="text-gray-600">
                  تم الإجابة على {currentProgress.answered} من {currentProgress.total} أسئلة
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: currentProgress.total > 0 ? `${(currentProgress.answered / currentProgress.total) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>

            {(answersLoadError || saveAnswersError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{saveAnswersError || answersLoadError}</p>
              </div>
            )}

            {/* Dynamic Questions */}
            <div className="space-y-8">
              {currentCategory.questions.length === 0 && (
                <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
                  لا توجد أسئلة في هذا القسم
                </div>
              )}

              {currentCategory.questions.map((q, qIdx) => {
                const answer = getAnswer(q.id);
                const isAnswered = answer != null && !(typeof answer === 'string' && answer.trim() === '') && !(Array.isArray(answer) && answer.length === 0);
                const questionWrapperClass = `p-6 bg-gray-50 rounded-lg transition-all ${q.isRequired && !isAnswered ? 'border-2 border-transparent' : ''}`;

                if (q.questionType === 'YES_NO') {
                  return (
                    <div key={q.id} id={`question-${q.id}`} className={questionWrapperClass}>
                      <label className="block font-medium mb-4">
                        {qIdx + 1}. {q.questionText}
                        {q.isRequired && <span className="text-red-500 mr-1">*</span>}
                        {isAnswered && <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />}
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setAnswer(currentCategory.id, q.id, 'yes')}
                          className={`flex-1 px-6 py-3 border-2 rounded-lg transition-colors font-medium ${
                            answer === 'yes'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          نعم
                        </button>
                        <button
                          onClick={() => setAnswer(currentCategory.id, q.id, 'no')}
                          className={`flex-1 px-6 py-3 border-2 rounded-lg transition-colors font-medium ${
                            answer === 'no'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          لا
                        </button>
                      </div>
                    </div>
                  );
                }

                if (q.questionType === 'SCALE') {
                  return (
                    <div key={q.id} id={`question-${q.id}`} className={questionWrapperClass}>
                      <label className="block font-medium mb-4">
                        {qIdx + 1}. {q.questionText}
                        {q.isRequired && <span className="text-red-500 mr-1">*</span>}
                        {isAnswered && <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />}
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>ضعيف جداً</span>
                          <span>ممتاز</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              onClick={() => setAnswer(currentCategory.id, q.id, num)}
                              className={`flex-1 h-12 border-2 rounded-lg transition-colors font-medium ${
                                answer === num
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (q.questionType === 'MULTIPLE_CHOICE') {
                  const choices = q.options?.choices ?? [];
                  const selected = Array.isArray(answer) ? (answer as string[]) : [];
                  return (
                    <div key={q.id} id={`question-${q.id}`} className={questionWrapperClass}>
                      <label className="block font-medium mb-4">
                        {qIdx + 1}. {q.questionText}
                        {q.isRequired && <span className="text-red-500 mr-1">*</span>}
                        {isAnswered && <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />}
                      </label>
                      {choices.length === 0 ? (
                        <p className="text-sm text-gray-500">لا توجد خيارات متاحة</p>
                      ) : (
                        <div className="space-y-2">
                          {choices.map((option) => (
                            <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAnswer(currentCategory.id, q.id, [...selected, option]);
                                  } else {
                                    setAnswer(currentCategory.id, q.id, selected.filter((s) => s !== option));
                                  }
                                }}
                                className="w-5 h-5 text-blue-600 rounded"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (q.questionType === 'FILE_UPLOAD') {
                  return (
                    <div key={q.id} id={`question-${q.id}`} className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                      <label className="block font-medium mb-2">
                        {qIdx + 1}. {q.questionText}
                        {q.isRequired && <span className="text-red-500 mr-1">*</span>}
                        {isAnswered && <CheckCircle2 className="inline w-4 h-4 text-green-600 mr-2" />}
                      </label>
                      <div className="flex items-start gap-3 mb-3">
                        <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-blue-900 mb-1">وثائق داعمة</p>
                          <p className="text-sm text-blue-700">يمكنك رفع وثائق تثبت إجاباتك لتحسين دقة التقييم</p>
                        </div>
                      </div>
                      <input
                        id={`file-${q.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setAnswer(currentCategory.id, q.id, file);
                        }}
                      />
                      <label
                        htmlFor={`file-${q.id}`}
                        className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-100 transition-colors text-blue-700 font-medium flex items-center justify-center cursor-pointer"
                      >
                        {answer instanceof File ? answer.name : typeof answer === 'string' ? answer : 'اختر ملف أو اسحبه هنا'}
                      </label>
                    </div>
                  );
                }

                // Unrecognized question type fallback
                return (
                  <div key={q.id} id={`question-${q.id}`} className={questionWrapperClass}>
                    <label className="block font-medium mb-2">
                      {qIdx + 1}. {q.questionText}
                      {q.isRequired && <span className="text-red-500 mr-1">*</span>}
                    </label>
                    <p className="text-sm text-gray-500">نوع السؤال غير مدعوم</p>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t">
              <button
                onClick={() => {
                  if (currentAssessmentStep > 0) {
                    setCurrentAssessmentStep(currentAssessmentStep - 1);
                  } else {
                    setCurrentView('profile');
                  }
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </button>
              <div className="text-sm text-gray-500">
                {isSavingAnswers ? 'جارٍ حفظ الإجابات...' : 'تم حفظ الإجابات تلقائياً'}
              </div>
              <button
                onClick={handleAssessmentNext}
                disabled={isSavingAnswers || isLoadingAssessment}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingAnswers ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جارٍ الحفظ...
                  </>
                ) : currentAssessmentStep === assessmentCategories.length - 1 ? (
                  'متابعة للمستندات'
                ) : (
                  'التالي'
                )}
                {!isSavingAnswers && <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // SCREEN 5: Document Upload Center
  const DocumentsView = () => {
    const requiredDocs = [
      { id: 'license', name: 'رخصة الجمعية الخيرية', required: true, uploaded: false },
      { id: 'bank', name: 'شهادة الحساب البنكي', required: true, uploaded: false },
      { id: 'address', name: 'العنوان الوطني', required: true, uploaded: false },
      { id: 'profile', name: 'الملف التعريفي للمؤسسة', required: true, uploaded: false }
    ];

    const optionalDocs = [
      { id: 'projects', name: 'المشاريع السابقة', required: false, uploaded: false },
      { id: 'financial', name: 'التقارير المالية', required: false, uploaded: false },
      { id: 'annual', name: 'التقارير السنوية', required: false, uploaded: false },
      { id: 'brand', name: 'الهوية البصرية', required: false, uploaded: false }
    ];

    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">المستندات المطلوبة</h1>
            <p className="text-gray-600">يرجى رفع المستندات المطلوبة لإكمال التقييم</p>
          </div>

          {/* Upload Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0/4</p>
                  <p className="text-sm text-gray-600">مستندات مطلوبة</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">تم الرفع</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">قيد المراجعة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              المستندات الإلزامية
            </h2>
            <div className="space-y-3">
              {requiredDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-red-600">مطلوب *</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    رفع
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">المستندات الاختيارية</h2>
            <p className="text-sm text-gray-600 mb-4">رفع هذه المستندات يساعد في تحسين دقة التقييم</p>
            <div className="space-y-3">
              {optionalDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">اختياري</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    رفع
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Zone */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-6 border-2 border-dashed border-blue-300">
            <div className="text-center">
              <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">اسحب وأفلت الملفات هنا</h3>
              <p className="text-sm text-gray-600 mb-4">أو انقر لتصفح جهازك</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                اختر الملفات
              </button>
              <p className="text-xs text-gray-500 mt-4">
                الصيغ المدعومة: PDF, JPG, PNG, DOCX (حد أقصى ١٠ ميجابايت)
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('assessment')}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              <ChevronRight className="w-5 h-5" />
              رجوع
            </button>
            <button
              onClick={() => {
                setCurrentView('processing');
                // Simulate processing
                let progress = 0;
                const interval = setInterval(() => {
                  progress += 10;
                  setProcessingProgress(progress);
                  if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setCurrentView('results'), 500);
                  }
                }, 300);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              إرسال التقييم
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // SCREEN 6: Assessment Processing
  const ProcessingView = () => (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
          {/* AI Animation */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-3">جارٍ تحليل البيانات...</h1>
          <p className="text-gray-600 mb-8">
            يقوم الذكاء الاصطناعي بتحليل إجاباتك والمستندات المرفوعة لإعداد تقرير شامل
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">التقدم</span>
              <span className="text-sm font-medium text-blue-600">{processingProgress}٪</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-3 text-right">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${processingProgress > 20 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {processingProgress > 20 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              )}
              <span className={processingProgress > 20 ? 'text-green-900' : 'text-gray-700'}>تحليل الإجابات</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${processingProgress > 50 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {processingProgress > 50 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              )}
              <span className={processingProgress > 50 ? 'text-green-900' : 'text-gray-700'}>مراجعة المستندات</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${processingProgress > 80 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {processingProgress > 80 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              )}
              <span className={processingProgress > 80 ? 'text-green-900' : 'text-gray-700'}>حساب النتيجة النهائية</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            الوقت المتوقع: ٣٠ - ٦٠ ثانية
          </p>
        </div>
      </div>
    </div>
  );

  // SCREEN 7: Readiness Results Dashboard
  const ResultsView = () => {
    const radarData = [
      { category: 'الحوكمة', score: 85, fullMark: 100 },
      { category: 'المالية', score: 72, fullMark: 100 },
      { category: 'الموارد البشرية', score: 68, fullMark: 100 },
      { category: 'المتطوعين', score: 78, fullMark: 100 },
      { category: 'المشاريع', score: 75, fullMark: 100 },
      { category: 'التقنية', score: 65, fullMark: 100 },
      { category: 'الاستراتيجية', score: 80, fullMark: 100 },
      { category: 'الأثر', score: 70, fullMark: 100 },
      { category: 'جمع التبرعات', score: 73, fullMark: 100 }
    ];

    const categoryScores = [
      { name: 'الحوكمة والامتثال', score: 85, color: '#10b981' },
      { name: 'التخطيط الاستراتيجي', score: 80, color: '#3b82f6' },
      { name: 'إدارة المتطوعين', score: 78, color: '#8b5cf6' },
      { name: 'إدارة المشاريع', score: 75, color: '#f59e0b' },
      { name: 'جمع التبرعات', score: 73, color: '#ec4899' },
      { name: 'الإدارة المالية', score: 72, color: '#14b8a6' },
      { name: 'قياس الأثر', score: 70, color: '#f97316' },
      { name: 'الموارد البشرية', score: 68, color: '#06b6d4' },
      { name: 'الجاهزية التقنية', score: 65, color: '#84cc16' }
    ];

    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">نتائج التقييم</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">تهانينا! تم إكمال التقييم</h1>
                <p className="text-blue-100">تم تحليل مؤسستك بنجاح. اطّلع على النتائج التفصيلية أدناه</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <div>
                    <div className="text-5xl font-bold">{overallScore}</div>
                    <div className="text-sm">من ١٠٠</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-medium">
                  <Award className="w-4 h-4" />
                  <span>جيد جداً</span>
                </div>
              </div>
            </div>
          </div>

          {/* Qualification Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">مؤهل مع خطة تحسين</h2>
                  <p className="text-gray-600">تم قبولك في برنامج الحاضنة مع توصيات للتطوير</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('roadmap')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                عرض خطة التطوير
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Radar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">التحليل الشامل</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar name="النتيجة" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">النتائج حسب المحور</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryScores} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {categoryScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">المقارنة المعيارية</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">مؤسستك</span>
                  <span className="text-sm font-bold text-blue-600">{overallScore}٪</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${overallScore}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">متوسط القطاع</span>
                  <span className="text-sm font-bold text-gray-600">٦٥٪</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">المؤسسات الرائدة</span>
                  <span className="text-sm font-bold text-green-600">٩٢٪</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('analysis')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              عرض التحليل التفصيلي
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <Download className="w-5 h-5" />
              تحميل التقرير
            </button>
          </div>
        </div>
      </div>
    );
  };

  // SCREEN 8: Strengths & Weaknesses Analysis
  const AnalysisView = () => {
    const strengths = [
      { area: 'الحوكمة والامتثال', score: 85, insight: 'لديكم هيكل حوكمة قوي مع سياسات واضحة ومجلس إدارة نشط', icon: Shield, color: 'green' },
      { area: 'التخطيط الاستراتيجي', score: 80, insight: 'خطة استراتيجية واضحة مع مؤشرات أداء محددة ومراجعة دورية', icon: Target, color: 'green' },
      { area: 'إدارة المتطوعين', score: 78, insight: 'برامج فعالة لاستقطاب وتدريب المتطوعين مع نظام متابعة جيد', icon: Heart, color: 'green' }
    ];

    const weaknesses = [
      { area: 'الجاهزية التقنية', score: 65, insight: 'هناك حاجة لتحسين البنية التحتية التقنية وأنظمة إدارة البيانات', severity: 'high', icon: Zap, color: 'red' },
      { area: 'الموارد البشرية', score: 68, insight: 'نقص في برامج التطوير المهني وأنظمة تقييم الأداء', severity: 'medium', icon: Users, color: 'yellow' },
      { area: 'قياس الأثر', score: 70, insight: 'أدوات قياس الأثر موجودة لكن تحتاج إلى تطوير وأتمتة', severity: 'medium', icon: BarChart3, color: 'yellow' }
    ];

    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('results')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
            >
              <ChevronRight className="w-5 h-5" />
              رجوع إلى النتائج
            </button>
            <h1 className="text-3xl font-bold mb-2">تحليل نقاط القوة والضعف</h1>
            <p className="text-gray-600">تحليل تفصيلي لأداء مؤسستك عبر جميع المحاور</p>
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
                  <div key={idx} className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{item.area}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">{item.score}</span>
                            <span className="text-gray-500">/100</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{item.insight}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">أداء ممتاز - استمروا في الحفاظ على هذا المستوى</span>
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
                const severityConfig = item.severity === 'high'
                  ? { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'bg-red-100 text-red-700', label: 'أولوية عالية' }
                  : { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700', label: 'أولوية متوسطة' };

                return (
                  <div key={idx} className={`bg-white rounded-xl shadow-sm border-2 ${severityConfig.border} p-6`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${severityConfig.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${severityConfig.text}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{item.area}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityConfig.badge}`}>
                              {severityConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${severityConfig.text}`}>{item.score}</span>
                            <span className="text-gray-500">/100</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{item.insight}</p>
                        <div className={`flex items-center gap-2 p-3 ${severityConfig.bg} rounded-lg`}>
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
                  بناءً على التحليل الشامل، نوصي بالتركيز على تطوير الجاهزية التقنية كأولوية قصوى.
                  الاستثمار في البنية التحتية التقنية سيحسن كفاءة العمليات وجودة البيانات، مما ينعكس إيجاباً على جميع المحاور الأخرى.
                </p>
                <button
                  onClick={() => setCurrentView('roadmap')}
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
  };

  // SCREEN 9: AI Development Plan (continued in next part due to length)
  const RoadmapView = () => {
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
        tasks: ['تقييم الأنظمة الحالية', 'اختيار الحلول التقنية', 'التنفيذ والتدريب', 'الاختبار والتشغيل']
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
        tasks: ['إعداد خطة التدريب', 'تصميم نظام التقييم', 'تنفيذ البرامج', 'القياس والمتابعة']
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
        tasks: ['تحديد مؤشرات الأداء', 'اختيار أدوات القياس', 'جمع البيانات', 'التحليل والتقارير']
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
        tasks: ['مراجعة السياسات المالية', 'أتمتة العمليات', 'تدريب الفريق', 'إعداد التقارير']
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
        tasks: ['تحليل الجهات المانحة', 'تطوير الحملات', 'بناء الشراكات', 'قياس النتائج']
      }
    ];

    const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
      high: { bg: 'bg-red-100', text: 'text-red-700', label: 'أولوية عالية' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'أولوية متوسطة' },
      low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'أولوية منخفضة' }
    };

    const statusConfig: Record<string, { bg: string; text: string; label: string; icon: any }> = {
      'not-started': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'لم تبدأ', icon: Clock },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'قيد التنفيذ', icon: Activity },
      'completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'مكتملة', icon: CheckCircle2 },
      'delayed': { bg: 'bg-red-100', text: 'text-red-700', label: 'متأخرة', icon: AlertCircle }
    };

    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('analysis')}
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
                <div key={initiative.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
                <p className="text-gray-700 mb-4">
                  فريقنا جاهز لدعمك في تنفيذ خطة التطوير. ستحصل على:
                </p>
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
                  onClick={() => setCurrentView('decision')}
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
  };

  // SCREEN 10: Final Decision Screen
  const DecisionView = () => (
    <div className="min-h-full bg-gradient-to-br from-green-50 to-emerald-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          {/* Main Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">مبارك! تم قبولك في حاضنة رشد</h1>
            <p className="text-xl text-gray-600">
              نهنئك على اجتياز التقييم. أنت الآن جزء من مجتمع رشد للمؤسسات الخيرية الرائدة
            </p>
          </div>

          {/* Status Badge */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-green-600" />
              <div className="text-2xl font-bold text-green-900">مؤهل مع خطة تحسين</div>
            </div>
            <p className="text-center text-green-800">
              نتيجتك: <span className="font-bold text-2xl">{overallScore}/100</span> - تصنيف جيد جداً
            </p>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">الخطوات القادمة</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-medium">إنشاء حساب المؤسسة</div>
                  <div className="text-sm text-gray-600">سجّل الدخول إلى منصة الحاضنة وأكمل ملفك التعريفي</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-medium">الاجتماع التعريفي</div>
                  <div className="text-sm text-gray-600">سيتواصل معك فريق الحاضنة لتحديد موعد الاجتماع التعريفي</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-medium">بدء خطة التطوير</div>
                  <div className="text-sm text-gray-600">ابدأ العمل على خطة التحسين مع دعم فريق الخبراء</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              معلومات التواصل
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">البريد الإلكتروني:</span>
                <span className="font-medium">incubator@rushd.sa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">الهاتف:</span>
                <span className="font-medium" dir="ltr">+966 11 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">ساعات العمل:</span>
                <span className="font-medium">الأحد - الخميس، ٩ص - ٥م</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg">
              <PlayCircle className="w-5 h-5" />
              إنشاء حساب المؤسسة
            </button>
            <button className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              تحميل التقرير الكامل
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            سيتم إرسال نسخة من التقرير إلى بريدك الإلكتروني: {registrationData.email || 'email@example.com'}
          </p>
        </div>
      </div>
    </div>
  );

  // Main render
  if (isLoading && !organization) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {currentView === 'landing' && LandingView()}
      {currentView === 'registration' && RegistrationView()}
      {currentView === 'profile' && ProfileView()}
      {currentView === 'assessment' && AssessmentView()}
      {currentView === 'documents' && DocumentsView()}
      {currentView === 'processing' && ProcessingView()}
      {currentView === 'results' && ResultsView()}
      {currentView === 'analysis' && AnalysisView()}
      {currentView === 'roadmap' && RoadmapView()}
      {currentView === 'decision' && DecisionView()}
    </div>
  );
}
