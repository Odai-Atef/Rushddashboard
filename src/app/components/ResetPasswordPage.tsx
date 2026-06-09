import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Shield,
  XCircle,
} from 'lucide-react';
import { authService } from '@/api/services/auth-service';
import { evaluatePasswordStrength, isPasswordStrong } from '@/lib/password-rules';

/**
 * ResetPasswordPage
 *
 * Allows users to set a new password using a reset token delivered via email.
 * Reads the token from the URL query parameter (?token=...), validates the
 * new password client-side, submits to the backend, and handles success and
 * error states.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const ruleChecks = evaluatePasswordStrength(newPassword);
  const allRulesPassed = isPasswordStrong(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';
  const canSubmit = allRulesPassed && passwordsMatch && !isLoading;

  // Token presence check on mount
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('الرابط غير صالح. الرجاء طلب رابط جديد.');
    } else {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canSubmit) return;

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await authService.resetPassword(token, newPassword);
      if (response.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(response.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
      }
    } catch (err: any) {
      if (err?.message === 'Failed to fetch') {
        setStatus('error');
        setErrorMessage('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت');
      } else {
        // Backend returns 400 for invalid/expired tokens with a generic message
        setStatus('error');
        setErrorMessage(err?.message || 'الرمز غير صالح أو منتهي الصلاحية');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to login after a short delay on success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

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

          {/* Missing/Invalid Token Error State */}
          {status === 'error' && !isLoading && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                  {errorMessage}
                </p>
                <button
                  onClick={() => navigate('/auth/forgot-password')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  طلب رابط جديد
                </button>
              </div>
            </div>
          )}

          {status === 'success' ? (
            /* Success State */
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mb-3">تم إعادة تعيين كلمة المرور</h2>

              <p className="text-muted-foreground mb-6">
                تم تغيير كلمة المرور بنجاح. ستتم إعادة توجيهك إلى صفحة تسجيل الدخول خلال ثوانٍ...
              </p>

              <button
                onClick={() => navigate('/auth/login')}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                الذهاب إلى تسجيل الدخول
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Page Title */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">إعادة تعيين كلمة المرور</h2>
                <p className="text-muted-foreground">
                  أدخل كلمة مرور جديدة لاستعادة حسابك
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pr-11 pl-11 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Strength Rules */}
                <div className="space-y-2">
                  {ruleChecks.map((check, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        check.satisfied
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {check.satisfied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>{check.rule.label}</span>
                    </div>
                  ))}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value && e.target.value !== newPassword) {
                          setConfirmError('كلمتا المرور غير متطابقتين');
                        } else {
                          setConfirmError('');
                        }
                      }}
                      onBlur={() => {
                        if (confirmPassword && confirmPassword !== newPassword) {
                          setConfirmError('كلمتا المرور غير متطابقتين');
                        } else {
                          setConfirmError('');
                        }
                      }}
                      placeholder="••••••••"
                      className="w-full pr-11 pl-11 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmError && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {confirmError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري إعادة التعيين...</span>
                    </>
                  ) : (
                    <>
                      <span>إعادة تعيين كلمة المرور</span>
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
                <Shield className="w-5 h-5" />
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
