import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, Sparkles, TrendingUp, Target, BarChart3, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../layouts/RootLayout';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        login();
        navigate('/dashboard');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
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
            <h2 className="text-2xl font-bold mb-2">مرحباً بعودتك</h2>
            <p className="text-muted-foreground">سجّل الدخول للوصول إلى لوحة التحكم التنفيذية</p>
          </div>

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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm">تذكرني</span>
              </label>
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
              onClick={() => navigate('/auth/register')}
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
