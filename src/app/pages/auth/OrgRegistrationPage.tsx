import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  Building,
  Building2,
  CheckCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { authService, OrgRegistrationData } from '@/api/services/auth-service';
import { onboardingService, FundingArea } from '@/api/services/onboarding-service';
import { TermsModal } from '@/app/components/TermsModal';
import { useAuth } from '@/app/layouts/RootLayout';

type OrgTypeOption = 'charity' | 'private_company';

interface FormData {
  orgName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  licenseNumber: string;
  orgType: OrgTypeOption | '';
  activity: string;
  fundingAreas: string[];
}

const initialFormData: FormData = {
  orgName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  licenseNumber: '',
  orgType: '',
  activity: '',
  fundingAreas: [],
};

export function OrgRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [apiError, setApiError] = useState('');
  const [fundingAreas, setFundingAreas] = useState<FundingArea[]>([]);

  useEffect(() => {
    onboardingService
      .getFundingAreas()
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          setFundingAreas(response.data);
        }
      })
      .catch(() => {
        // Silently ignore; validation will handle empty list
      });
  }, []);

  const setField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleFundingArea = (areaId: string) => {
    setFormData((prev) => {
      const nextAreas = prev.fundingAreas.includes(areaId)
        ? prev.fundingAreas.filter((id) => id !== areaId)
        : [...prev.fundingAreas, areaId];
      return { ...prev, fundingAreas: nextAreas };
    });
    setErrors((prev) => {
      if (!prev.fundingAreas) return prev;
      const next = { ...prev };
      delete next.fundingAreas;
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    const orgName = formData.orgName.trim();
    if (!orgName) {
      nextErrors.orgName = 'اسم الجهه مطلوب';
    }

    const email = formData.email.trim();
    if (!email) {
      nextErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    const phone = formData.phone.trim();
    if (!phone) {
      nextErrors.phone = 'رقم الجوال مطلوب';
    }

    if (!formData.password) {
      nextErrors.password = 'كلمة المرور مطلوبة';
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    if (!formData.agreeToTerms) {
      nextErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';
    }

    const licenseNumber = formData.licenseNumber.trim();
    if (!licenseNumber) {
      nextErrors.licenseNumber = 'رقم الترخيص مطلوب';
    }

    if (!formData.orgType) {
      nextErrors.orgType = 'نوع الجهه مطلوب';
    }

    if (formData.orgType === 'private_company') {
      if (!formData.activity.trim()) {
        nextErrors.activity = 'النشاط مطلوب';
      }
    } else if (formData.orgType === 'charity') {
      if (formData.fundingAreas.length === 0) {
        nextErrors.fundingAreas = 'مجالات العمل مطلوبة';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const backendFieldToFormKey = (
    backendField: string
  ): keyof FormData | undefined => {
    const mapping: Record<string, keyof FormData | undefined> = {
      name: 'orgName',
      companyName: 'orgName',
      email: 'email',
      phone: 'phone',
      password: 'password',
      confirmPassword: 'confirmPassword',
      licenseNumber: 'licenseNumber',
      type: 'orgType',
      overview: 'activity',
      areasOfWork: 'fundingAreas',
    };
    return mapping[backendField] ?? (backendField as keyof FormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج قبل المتابعة');
      return;
    }

    setIsLoading(true);

    const payload: OrgRegistrationData = {
      name: formData.orgName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      licenseNumber: formData.licenseNumber.trim(),
      type: formData.orgType === 'private_company' ? 'COOP' : 'CHARITY',
      overview: formData.orgType === 'private_company' ? formData.activity.trim() : '',
      areasOfWork: formData.orgType === 'charity' ? formData.fundingAreas : [],
    };

    try {
      const response = await authService.registerOrganization(payload);
      if (response.success) {
        toast.success(response.message || 'تم إنشاء الحساب وتسجيل الجهه بنجاح');
        navigate('/auth/login?registered=true');
      } else {
        setApiError(response.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch (err: any) {
      if (err?.message === 'Failed to fetch') {
        setApiError('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت');
      } else if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        const backendErrors: Array<{ field?: string; message?: string }> = err.errors;
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        const generalMessages: string[] = [];

        backendErrors.forEach((item) => {
          const mappedField = backendFieldToFormKey(item.field || '');
          const field = mappedField;
          const message = item.message || '';

          if (field && field in formData) {
            fieldErrors[field] = fieldErrors[field]
              ? `${fieldErrors[field]}<br/>${message}`
              : message;
          } else {
            generalMessages.push(message);
          }
        });

        if (Object.keys(fieldErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }

        const topLevelMessage = err?.message || '';
        const detailMessages = generalMessages.filter(
          (m) => m !== topLevelMessage
        );
        const uniqueDetailMessages = Array.from(new Set(detailMessages));
        const details = uniqueDetailMessages.join('<br/>');

        setApiError(
          topLevelMessage && details
            ? `${topLevelMessage}<br/>${details}`
            : topLevelMessage || details || 'فشل التحقق من صحة البيانات'
        );
      } else {
        setApiError(err?.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isCharitySelected = formData.orgType === 'charity';
  const isPrivateCompanySelected = formData.orgType === 'private_company';

  const getInputClassName = (field: keyof FormData, hasIcon: boolean) =>
    `w-full ${hasIcon ? 'pr-11 pl-4' : 'px-4'} py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
      errors[field] ? 'border-red-500' : 'border-border'
    }`;

  const getIconInputClassName = (field: keyof FormData) =>
    `w-full pr-11 pl-11 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
      errors[field] ? 'border-red-500' : 'border-border'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-[1.2] flex items-center justify-center p-4 lg:p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-3xl py-4 lg:py-8">
          {/* Logo */}
          <div className="mb-6 text-center">
            <img
              src="/logo.png"
              alt="Rushd Platform"
              className="w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] object-contain mx-auto mb-3"
            />
            <p className="text-muted-foreground">منصة القرارات الذكية</p>
          </div>

          {/* Welcome Text */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">إنشاء حساب جديد وتسجيل جهه</h2>
            <p className="text-muted-foreground">أكمل بيانات جهتك في خطوة واحدة</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p
                className="text-sm text-red-600 dark:text-red-400"
                dangerouslySetInnerHTML={{ __html: apiError }}
              />
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-card   rounded-lg space-y-5">

              {/* Organization Name */}
              <div>
                <label htmlFor="orgName" className="block text-sm font-medium mb-2">
                  اسم الجهه *
                </label>
                <div className="relative">
                  <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="orgName"
                    type="text"
                    value={formData.orgName}
                    onChange={(e) => setField('orgName', e.target.value)}
                    placeholder="مثال: جمعية البر الخيرية"
                    className={getInputClassName('orgName', true)}
                  />
                </div>
                {errors.orgName && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.orgName }} />}
              </div>

              {/* Organization Type */}
              <div>
                <label htmlFor="orgType" className="block text-sm font-medium mb-2">
                  نوع الجهه *
                </label>
                <select
                  id="orgType"
                  value={formData.orgType}
                  onChange={(e) => setField('orgType', e.target.value as OrgTypeOption | '')}
                  className={getInputClassName('orgType', false)}
                >
                  <option value="">اختر نوع الجهه</option>
                  <option value="charity">جمعية خيرية</option>
                  <option value="private_company">شركة أهلية</option>
                </select>
                {errors.orgType && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.orgType }} />}
              </div>

              {/* License Number */}
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium mb-2">
                  رقم الترخيص *
                </label>
                <input
                  id="licenseNumber"
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setField('licenseNumber', e.target.value)}
                  placeholder="١٢٣٤٥٦"
                  className={getInputClassName('licenseNumber', false)}
                />
                {errors.licenseNumber && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.licenseNumber }} />}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="name@company.com"
                    className={getInputClassName('email', true)}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.email }} />}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="+966 50 123 4567"
                    className={getInputClassName('phone', true)}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.phone }} />}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    كلمة المرور *
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setField('password', e.target.value)}
                      placeholder="••••••••"
                      className={getIconInputClassName('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.password }} />}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    تأكيد كلمة المرور *
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setField('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      className={getIconInputClassName('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.confirmPassword }} />}
                </div>
              </div>

              {/* Funding Areas */}
              {isCharitySelected && (
                <div>
                  <label className="block text-sm font-medium mb-2">مجالات العمل *</label>
                  {fundingAreas.length === 0 && (
                    <p className="text-sm text-muted-foreground mb-2">
                      لا توجد مجالات عمل متاحة حالياً. يرجى المحاولة لاحقاً.
                    </p>
                  )}
                  <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-2 rounded-lg border ${errors.fundingAreas ? 'border-red-500 bg-red-500/5' : 'border-transparent'}`}>
                    {fundingAreas.map((area) => (
                      <label
                        key={area.id}
                        className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-accent cursor-pointer bg-card"
                      >
                        <input
                          type="checkbox"
                          checked={formData.fundingAreas.includes(area.id)}
                          onChange={() => toggleFundingArea(area.id)}
                          className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm">{area.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.fundingAreas && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.fundingAreas }} />}
                </div>
              )}

              {/* Private company activity */}
              {isPrivateCompanySelected && (
                <div>
                  <label htmlFor="activity" className="block text-sm font-medium mb-2">
                    النشاط *
                  </label>
                  <div className="relative">
                    <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="activity"
                      type="text"
                      value={formData.activity}
                      onChange={(e) => setField('activity', e.target.value)}
                      placeholder="مثال: تجارة عامة، مقاولات، خدمات استشارية"
                      className={getInputClassName('activity', true)}
                    />
                  </div>
                  {errors.activity && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.activity }} />}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setField('agreeToTerms', e.target.checked)}
                  className={`mt-0.5 w-4 h-4 rounded border text-primary focus:ring-2 focus:ring-primary ${
                    errors.agreeToTerms ? 'border-red-500' : 'border-border'
                  }`}
                />
                <span className="text-sm">
                  أوافق على{' '}
                  <TermsModal>الشروط والأحكام و سياسة الخصوصية</TermsModal>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-xs text-red-600 mt-1" dangerouslySetInnerHTML={{ __html: errors.agreeToTerms }} />}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إنشاء الحساب...</span>
                </>
              ) : (
                <>
                  <span>إنشاء حساب وتسجيل الجهه</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-primary hover:underline font-medium"
            >
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-[0.9] bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-600 p-10 items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">
            انضم إلى أفضل المستثمرين
            <br />
            والتنفيذيين
          </h2>
          <p className="text-lg mb-6 text-white/90">
            استفد من قوة الذكاء الاصطناعي لاتخاذ قرارات أعمال أفضل وأسرع
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>تحليل فوري للبيانات بدعم الذكاء الاصطناعي</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>لوحات تحكم تفاعلية وتقارير متقدمة</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>توصيات تنفيذية قابلة للتطبيق مباشرة</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>دعم فني متخصص 24/7</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>أمان وحماية بيانات على مستوى المؤسسات</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
