import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export function ForgetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('البريد الإلكتروني غير صحيح');
      }
      setIsLoading(false);
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

          {status === 'idle' ? (
            <>
              {/* Page Title */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">نسيت كلمة المرور؟</h2>
                <p className="text-muted-foreground">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
                </p>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
              )}

              {/* Form */}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <span>إرسال رابط إعادة التعيين</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-6 w-full text-center text-sm text-primary hover:underline"
              >
                العودة إلى تسجيل الدخول
              </button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold mb-3">تم إرسال الرابط!</h2>

                <p className="text-muted-foreground mb-2">
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى:
                </p>
                <p className="text-foreground font-medium mb-6">{email}</p>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6 text-right">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    يرجى التحقق من صندوق الوارد الخاص بك. إذا لم تجد الرسالة، تحقق من مجلد البريد المزعج.
                    الرابط صالح لمدة 24 ساعة.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    العودة إلى تسجيل الدخول
                  </button>

                  <button
                    onClick={() => setStatus('idle')}
                    className="w-full py-3 border border-border hover:bg-accent rounded-lg transition-colors"
                  >
                    إعادة إرسال الرابط
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Security Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            أمان حسابك
            <br />
            أولويتنا
          </h2>
          <p className="text-xl mb-8 text-white/90">
            نستخدم أحدث تقنيات الأمان لحماية بياناتك ومعلوماتك الحساسة
          </p>

          {/* Security Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">تشفير متقدم</h3>
                <p className="text-sm text-white/80">جميع البيانات محمية بتشفير من الدرجة العسكرية</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">مصادقة ثنائية</h3>
                <p className="text-sm text-white/80">طبقة حماية إضافية لحسابك</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">مراقبة 24/7</h3>
                <p className="text-sm text-white/80">فريق أمان متخصص يراقب النظام باستمرار</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">امتثال كامل</h3>
                <p className="text-sm text-white/80">متوافق مع معايير GDPR و ISO 27001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
