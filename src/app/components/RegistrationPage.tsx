import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, Sparkles, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../layouts/RootLayout';
import { authService } from '@/api/services/auth-service';

export function RegistrationPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    roleSlug: 'executive',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName) newErrors.lastName = 'اسم العائلة مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.phone) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.companyName) newErrors.companyName = 'اسم الشركة مطلوب';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        roleSlug: formData.roleSlug,
        phone: formData.phone,
      });
      if (response.success) {
        login();
        navigate('/dashboard');
      } else {
        setApiError(response.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch (err: any) {
      if (err?.message === 'Failed to fetch') {
        setApiError('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت');
      } else {
        setApiError(err?.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Rushd Platform</h1>
            </div>
            <p className="text-muted-foreground">منصة القرارات الذكية</p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h2>
            <p className="text-muted-foreground">انضم إلى منصة التحليل التنفيذي الذكي</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                الاسم الأول
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="أحمد"
                  className={`w-full pr-11 pl-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.firstName ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                اسم العائلة
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="محمد"
                  className={`w-full pr-11 pl-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.lastName ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pr-11 pl-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+966 50 123 4567"
                  className={`w-full pr-11 pl-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                اسم الشركة
              </label>
              <div className="relative">
                <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="شركة الرشد للاستثمار"
                  className={`w-full pr-11 pl-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.companyName ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">الدور</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'investor', label: 'مستثمر' },
                  { value: 'executive', label: 'تنفيذي' },
                  { value: 'analyst', label: 'محلل' }
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => updateField('roleSlug', role.value)}
                    className={`px-4 py-2.5 rounded-lg border-2 transition-all text-sm ${
                      formData.roleSlug === role.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pr-11 pl-11 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.password ? 'border-red-500' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pr-11 pl-11 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                  className={`mt-0.5 w-4 h-4 rounded border text-primary focus:ring-2 focus:ring-primary ${
                    errors.agreeToTerms ? 'border-red-500' : 'border-border'
                  }`}
                />
                <span className="text-sm">
                  أوافق على{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    الشروط والأحكام
                  </a>{' '}
                  و{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    سياسة الخصوصية
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-xs text-red-600 mt-1">{errors.agreeToTerms}</p>}
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
                  <span>إنشاء حساب</span>
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
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            انضم إلى أفضل المستثمرين
            <br />
            والتنفيذيين
          </h2>
          <p className="text-xl mb-8 text-white/90">
            استفد من قوة الذكاء الاصطناعي لاتخاذ قرارات أعمال أفضل وأسرع
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>تحليل فوري للبيانات بدعم الذكاء الاصطناعي</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>لوحات تحكم تفاعلية وتقارير متقدمة</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>توصيات تنفيذية قابلة للتطبيق مباشرة</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>دعم فني متخصص 24/7</span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>أمان وحماية بيانات على مستوى المؤسسات</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
