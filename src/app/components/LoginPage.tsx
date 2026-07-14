import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, Mail, Lock, Sparkles, TrendingUp, Target, BarChart3, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../layouts/RootLayout';
import { authService } from '@/api/services/auth-service';
import { executeRecaptcha } from '@/app/lib/recaptcha';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isExpired = searchParams.get('expired') === 'true';
  const redirectParam = searchParams.get('redirect');
  const justRegistered = searchParams.get('registered') === 'true';
  const activationStatus = searchParams.get('activated');
  const activationMessage = searchParams.get('message');
  const decodedActivationMessage = activationMessage
    ? decodeURIComponent(activationMessage)
    : null;

  const getSafeRedirectPath = (): string => {
    if (redirectParam && redirectParam.startsWith('/')) {
      return redirectParam;
    }
    return '/dashboard/charity-assessment';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Execute reCAPTCHA v2 Invisible
      const recaptchaToken = await executeRecaptcha('login');
      
      const response = await authService.login({ email, password, recaptchaToken });
      if (response.success) {
        login();
        navigate(getSafeRedirectPath());
      } else {
        setError(response.message || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (err: any) {
      if (err?.message === 'Failed to fetch') {
        setError('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت');
      } else if (err?.message?.includes('reCAPTCHA')) {
        setError('فشل التحقق من reCAPTCHA، يرجى المحاولة مرة أخرى');
      } else {
        setError(err?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img
              src="/logo.png"
              alt="منصة رشد"
              className="w-[200px] h-[200px] object-contain mx-auto mb-3"
            />
            <p className="text-muted-foreground">منصة القرارات الذكية</p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">مرحباً بعودتك</h2>
            <p className="text-muted-foreground">سجل الدخول للوصول إلى لوحة التحكم التنفيذية</p>
          </div>

          {/* Session Expired Message */}
          {isExpired && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                انتهت صلاحية جلستك، يرجى تسجيل الدخول مرة أخرى
              </p>
            </div>
          )}

          {/* Registration Success Message */}
          {justRegistered && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">
                تم إنشاء حسابك بنجاح. يرجى تفعيل بريدك الإلكتروني من خلال الرابط المرسل إلى بريدك.
              </p>
            </div>
          )}

          {/* Account Activation Message */}
          {activationStatus === 'success' && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-sm text-green-700 dark:text-green-400">
                {decodedActivationMessage || 'تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول.'}
              </p>
            </div>
          )}
          {activationStatus === 'error' && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-sm text-red-600 dark:text-red-400">
                {decodedActivationMessage || 'فشل تفعيل الحساب. الرابط قد يكون منتهي الصلاحية.'}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pr-11 pl-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-11 pl-11 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-sm text-primary hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <button
              onClick={() => navigate('/auth/register/org')}
              className="text-primary hover:underline font-medium"
            >
              إنشاء حساب جديد
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Product Intro */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            منصة الذكاء الاصطناعي
            <br />
            لقرارات الأعمال
          </h2>
          <p className="text-xl mb-8 text-white/90">
            اتخذ قرارات استثمارية وتنفيذية أفضل بدعم من الذكاء الاصطناعي المتقدم
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">تحليل ذكي مدعوم بـ AI</h3>
                <p className="text-sm text-white/80">محلل تنفيذي ذكي يجيب على أسئلتك المعقدة</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">لوحات تحكم شاملة</h3>
                <p className="text-sm text-white/80">تتبع المبيعات والعمليات والأداء في الوقت الفعلي</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">توصيات تنفيذية</h3>
                <p className="text-sm text-white/80">اقتراحات عملية لتحسين الأداء والربحية</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">تقارير متقدمة</h3>
                <p className="text-sm text-white/80">رؤى عميقة ومؤشرات أداء رئيسية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
