import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { authService } from '@/api/services/auth-service';
import { executeRecaptcha } from '@/app/lib/recaptcha';

/**
 * ActivateAccountPage
 *
 * Reads an email activation token from the URL query parameter (?token=...),
 * calls the backend activation endpoint, and redirects the user to the login
 * page with a success or failure message.
 */
const ACTIVATION_SUCCESS_MESSAGE = 'تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول.';
const ACTIVATION_FAILURE_MESSAGE = 'فشل تفعيل الحساب. الرابط قد يكون منتهي الصلاحية أو غير صالح.';
const ACTIVATION_NETWORK_MESSAGE = 'تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت.';
const ACTIVATION_MISSING_MESSAGE = 'رابط التفعيل غير صالح أو مفقود.';

export function ActivateAccountPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(ACTIVATION_MISSING_MESSAGE);
      redirectTimerRef.current = setTimeout(() => {
        navigate(
          `/auth/login?activated=error&message=${encodeURIComponent(ACTIVATION_MISSING_MESSAGE)}`
        );
      }, 2500);
      return;
    }

    let cancelled = false;

    const activate = async () => {
      setStatus('loading');
      try {
        // Execute reCAPTCHA v2 Invisible
        const recaptchaToken = await executeRecaptcha('activate_account');

        const response = await authService.activateAccount(token, recaptchaToken);
        if (cancelled) return;

        if (response.success) {
          setStatus('success');
          setMessage(ACTIVATION_SUCCESS_MESSAGE);

          redirectTimerRef.current = setTimeout(() => {
            navigate(
              `/auth/login?activated=success&message=${encodeURIComponent(ACTIVATION_SUCCESS_MESSAGE)}`
            );
          }, 2500);
          return;
        }

        setStatus('error');
        setMessage(ACTIVATION_FAILURE_MESSAGE);

        redirectTimerRef.current = setTimeout(() => {
          navigate(
            `/auth/login?activated=error&message=${encodeURIComponent(ACTIVATION_FAILURE_MESSAGE)}`
          );
        }, 2500);
      } catch (err: any) {
        if (cancelled) return;

        let errorMessage = ACTIVATION_FAILURE_MESSAGE;
        if (err?.message === 'Failed to fetch') {
          errorMessage = ACTIVATION_NETWORK_MESSAGE;
        } else if (err?.message?.includes('reCAPTCHA')) {
          errorMessage = 'فشل التحقق من reCAPTCHA، يرجى المحاولة مرة أخرى';
        }

        setStatus('error');
        setMessage(errorMessage);

        redirectTimerRef.current = setTimeout(() => {
          navigate(`/auth/login?activated=error&message=${encodeURIComponent(errorMessage)}`);
        }, 2500);
      }
    };

    activate();

    return () => {
      cancelled = true;
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [token, navigate]);

  const iconColor = status === 'success' ? 'text-green-600' : 'text-red-600';
  const bgColor = status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20';

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Status */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">منصة رشد</h1>
            </div>
            <p className="text-muted-foreground">منصة القرارات الذكية</p>
          </div>

          <div className="mb-8">
            {status === 'loading' ? (
              <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            ) : status === 'success' ? (
              <div className={`inline-flex items-center justify-center w-16 h-16 ${bgColor} rounded-full mb-4`}>
                <CheckCircle className={`w-8 h-8 ${iconColor}`} />
              </div>
            ) : (
              <div className={`inline-flex items-center justify-center w-16 h-16 ${bgColor} rounded-full mb-4`}>
                <AlertCircle className={`w-8 h-8 ${iconColor}`} />
              </div>
            )}

            <h2 className="text-2xl font-bold mb-3">
              {status === 'loading' && 'جاري تفعيل حسابك...'}
              {status === 'success' && 'تم تفعيل الحساب'}
              {status === 'error' && 'فشل تفعيل الحساب'}
              {status === 'idle' && 'تفعيل الحساب'}
            </h2>

            <p className="text-muted-foreground mb-6">{message || 'يرجى الانتظار أثناء التحقق من رابط التفعيل.'}</p>

            {(status === 'success' || status === 'error') && (
              <button
                onClick={() =>
                  navigate(
                    `/auth/login?activated=${status}&message=${encodeURIComponent(message)}`
                  )
                }
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <span>الذهاب إلى تسجيل الدخول</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            مرحباً بك في منصة رشد
          </h2>
          <p className="text-xl mb-8 text-white/90">
            خطوة واحدة تفصلك عن بدء رحلة القرارات الذكية
          </p>
        </div>
      </div>
    </div>
  );
}
