/**
 * Payment Callback Page
 *
 * Handles the redirect from Moyasar after payment.
 * Parses query params, polls for status, and redirects accordingly.
 */

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Check, X, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { subscriptionService } from '@/api/services/subscription-service';

type PaymentResult = 'verifying' | 'success' | 'failed' | 'timeout' | 'error';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<PaymentResult>('verifying');
  const [message, setMessage] = useState('جاري التحقق من حالة الدفع...');
  const [pollCount, setPollCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Parse Moyasar callback params
  const moyasarId = searchParams.get('id');       // Moyasar invoice ID
  const moyasarStatus = searchParams.get('status'); // "paid" | "failed" | "canceled"

  // Poll subscription status
  useEffect(() => {
    if (moyasarStatus === 'failed' || moyasarStatus === 'canceled') {
      setResult('failed');
      setMessage('عذراً، لم تتم عملية الدفع. يمكنك المحاولة مرة أخرى.');
      return;
    }

    const poll = async () => {
      try {
        // If we have a moyasar ID, try to get payment status by it first
        // Then check subscription status
        const subRes = await subscriptionService.getMySubscription();

        if (subRes.success && subRes.data.status === 'active') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setResult('success');
          setMessage('تم الدفع بنجاح! جاري التوجيه إلى لوحة التحكم...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          return;
        }

        setPollCount((c) => {
          const next = c + 1;
          if (next >= 12) { // ~60 seconds (5s * 12)
            if (intervalRef.current) clearInterval(intervalRef.current);
            setResult('timeout');
            setMessage('يستغرق التحقق من الدفع وقتاً أطول من المتوقع. يرجى تحديث الصفحة لاحقاً.');
          }
          return next;
        });
      } catch (error: any) {
        // If subscription not found or inactive, keep polling
        if (error?.code === 'SUBSCRIPTION_NOT_FOUND') {
          setPollCount((c) => {
            const next = c + 1;
            if (next >= 12) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setResult('timeout');
              setMessage('يستغرق التحقق من الدفع وقتاً أطول من المتوقع. يرجى تحديث الصفحة لاحقاً.');
            }
            return next;
          });
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setResult('error');
          setMessage('حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.');
        }
      }
    };

    // Initial check immediately
    poll();
    intervalRef.current = setInterval(poll, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [moyasarStatus, navigate]);

  const handleRetry = () => {
    navigate('/dashboard/settings?tab=billing');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const getIcon = () => {
    switch (result) {
      case 'success':
        return (
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
        );
      case 'failed':
        return (
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
        );
      case 'timeout':
        return (
          <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-yellow-600" />
          </div>
        );
      case 'error':
        return (
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        );
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
      style={{ fontFamily: 'Cairo, Tajawal, system-ui, sans-serif' }}
    >
      <div className="text-center px-6 max-w-md">
        <div className="flex justify-center">{getIcon()}</div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          {result === 'success'
            ? 'تم الدفع بنجاح'
            : result === 'failed'
            ? 'فشل الدفع'
            : result === 'timeout'
            ? 'التحقق مستمر'
            : result === 'error'
            ? 'خطأ في التحقق'
            : 'جاري التحقق...'}
        </h1>

        <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>

        {result === 'verifying' && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>المحاولة {pollCount + 1} من 12</span>
          </div>
        )}

        {(result === 'failed' || result === 'error') && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        )}

        {result === 'timeout' && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث الصفحة
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
