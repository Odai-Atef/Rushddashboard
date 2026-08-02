/**
 * Payment Callback Page
 *
 * Handles the redirect from Moyasar after payment.
 * Parses query params, calls backend callback, and redirects accordingly.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Check, X, Loader2, AlertTriangle, RefreshCw, Phone, MessageCircle } from 'lucide-react';
import { subscriptionService } from '@/api/services/subscription-service';
import apiClient from '@/api/client';

const DASHBOARD_URL = '/dashboard';
const LOGIN_URL = '/auth/login';

function isAuthenticated(): boolean {
 return !!localStorage.getItem('auth_token');
}

type PaymentResult = 'verifying' | 'success' | 'failed' | 'timeout' | 'error';

export function PaymentCallbackPage() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const [result, setResult] = useState<PaymentResult>('verifying');
 const [message, setMessage] = useState('جاري التحقق من حالة الدفع...');
 const [pollCount, setPollCount] = useState(0);
 const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

 // Parse Moyasar callback params
 const moyasarId = searchParams.get('id'); // Moyasar payment ID
 const invoiceId = searchParams.get('invoice_id'); // Moyasar invoice ID
 const moyasarStatus = searchParams.get('status'); // "paid" | "failed" | "canceled"

 const effectiveId = invoiceId || moyasarId;

 // Call backend callback endpoint to verify payment and activate subscription
 const verifyPayment = useCallback(async () => {
 if (!effectiveId) {
 console.log('[PaymentCallback] No effectiveId found in URL');
 return false;
 }

 try {
 console.log('[PaymentCallback] Calling backend callback with id:', effectiveId);

 // Call backend callback endpoint to verify with Moyasar
 const callbackUrl = `/api/v1/subscriptions/payments/callback?id=${effectiveId}&status=${moyasarStatus || 'unknown'}`;
 const res = await apiClient.get(callbackUrl, { skipAuthRedirect: true } as any);
 
 console.log('[PaymentCallback] Backend callback response:', res);

 if (res.data?.success) {
 setResult('success');
 setMessage('تم الدفع بنجاح! جاري التوجيه...');
 setTimeout(() => {
 navigate(isAuthenticated() ? DASHBOARD_URL : LOGIN_URL);
 }, 2000);
 return true;
 } else {
 console.log('[PaymentCallback] Backend returned not-success:', res.data);
 }
 } catch (err: any) {
 console.log('[PaymentCallback] Callback endpoint failed, will poll:', err?.message, err?.statusCode);
 }
 return false;
 }, [effectiveId, moyasarStatus, navigate]);

 // Poll subscription status as fallback
 useEffect(() => {
 if (moyasarStatus === 'failed' || moyasarStatus === 'canceled') {
 setResult('failed');
 setMessage('عذراً، لم تتم عملية الدفع. يمكنك المحاولة مرة أخرى.');
 return;
 }

 let attempts = 0;
 const maxAttempts = 12;
 let callbackAttempted = false;

 const poll = async () => {
 attempts += 1;
 console.log(`[PaymentCallback] Poll attempt ${attempts}/${maxAttempts}`);

 try {
 // Try backend callback first (only on first attempt)
 if (!callbackAttempted) {
 callbackAttempted = true;
 console.log('[PaymentCallback] Attempting backend callback...');
 const verified = await verifyPayment();
 if (verified) {
 console.log('[PaymentCallback] Callback verified successfully');
 return;
 }
 }

 // Fallback: poll subscription status
 console.log('[PaymentCallback] Polling subscription status...');
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

 setPollCount(attempts);
 if (attempts >= maxAttempts) {
 if (intervalRef.current) clearInterval(intervalRef.current);
 setResult('timeout');
 setMessage('يستغرق التحقق من الدفع وقتاً أطول من المتوقع. يرجى تحديث الصفحة لاحقاً.');
 }
 } catch (error: any) {
 console.log('[PaymentCallback] Poll error:', error?.code, error?.message);
 if (error?.code === 'SUBSCRIPTION_NOT_FOUND') {
 setPollCount(attempts);
 if (attempts >= maxAttempts) {
 if (intervalRef.current) clearInterval(intervalRef.current);
 setResult('timeout');
 setMessage('يستغرق التحقق من الدفع وقتاً أطول من المتوقع. يرجى تحديث الصفحة لاحقاً.');
 }
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
 }, [moyasarStatus, navigate, verifyPayment]);

 const handleManualSync = async () => {
 setResult('verifying');
 setMessage('جاري محاولة التفعيل اليدوي...');
 try {
 const res = await apiClient.post('/api/v1/subscriptions/payments/sync');
 if ((res.data as any)?.success) {
 setResult('success');
 setMessage('تم تفعيل الاشتراك بنجاح! جاري التوجيه إلى لوحة التحكم...');
 setTimeout(() => {
 navigate('/dashboard');
 }, 2000);
 } else {
 setResult('error');
 setMessage((res.data as any)?.message || 'لم يتم العثور على اشتراك معلق');
 }
 } catch (err: any) {
 setResult('error');
 setMessage(err?.message || 'فشل التفعيل اليدوي');
 }
 };

 const handleGoHome = () => {
 navigate('/');
 };

 const getIcon = () => {
 switch (result) {
 case 'success':
 return (
 <div className="w-20 h-20 rounded-full bg-[var(--primary)]/[0.08] flex items-center justify-center mb-6">
 <Check className="w-10 h-10 text-[var(--primary)]" />
 </div>
 );
 case 'failed':
 return (
 <div className="w-20 h-20 rounded-full bg-[var(--destructive)]/[0.08] flex items-center justify-center mb-6">
 <X className="w-10 h-10 text-[var(--destructive)]" />
 </div>
 );
 case 'timeout':
 return (
 <div className="w-20 h-20 rounded-full bg-[var(--warning)]/[0.1] flex items-center justify-center mb-6">
 <AlertTriangle className="w-10 h-10 text-[var(--warning)]" />
 </div>
 );
 case 'error':
 return (
 <div className="w-20 h-20 rounded-full bg-[var(--destructive)]/[0.08] flex items-center justify-center mb-6">
 <X className="w-10 h-10 text-[var(--destructive)]" />
 </div>
 );
 default:
 return (
 <div className="w-20 h-20 rounded-full bg-muted/[0.08] flex items-center justify-center mb-6">
 <Loader2 className="w-10 h-10 text-[var(--secondary)] animate-spin" />
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

 <h1 className="text-2xl font-bold text-foreground mb-3">
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

 <p className="text-secondary mb-8 leading-relaxed">{message}</p>

 {result === 'verifying' && (
 <div className="flex items-center justify-center gap-[var(--spacing-small-gap)] text-sm text-[var(--text-muted)]">
 <Loader2 className="w-4 h-4 animate-spin" />
 <span>المحاولة {pollCount + 1} من 12</span>
 </div>
 )}

 {(result === 'failed' || result === 'error') && (
 <div className="flex flex-col sm:flex-row gap-[var(--spacing-small-gap)] justify-center">
 <button
 onClick={() => window.location.reload()}
 className="inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary)]/90 transition-colors"
 >
 <RefreshCw className="w-4 h-4" />
 إعادة المحاولة
 </button>
 <button
 onClick={handleGoHome}
 className="inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-6 py-3 rounded-xl bg-[var(--hover)] text-[var(--text-secondary)] font-semibold hover:bg-muted transition-colors"
 >
 العودة للرئيسية
 </button>
 </div>
 )}

 {result === 'timeout' && (
 <div className="flex flex-col gap-[var(--spacing-small-gap)] justify-center">
 <button
 onClick={handleManualSync}
 className="inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary)]/[0.9] transition-colors"
 >
 <RefreshCw className="w-4 h-4" />
 تفعيل الاشتراك يدوياً
 </button>
 <button
 onClick={() => window.location.reload()}
 className="inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary)]/90 transition-colors"
 >
 <RefreshCw className="w-4 h-4" />
 تحديث الصفحة
 </button>
 <button
 onClick={handleGoHome}
 className="inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-6 py-3 rounded-xl bg-[var(--hover)] text-[var(--text-secondary)] font-semibold hover:bg-muted transition-colors"
 >
 العودة للرئيسية
 </button>
 </div>
 )}

 {result !== 'success' && result !== 'verifying' && (
 <div className="mt-6 p-[var(--spacing-card-padding)] bg-muted/[0.08] border border-[var(--secondary)]/[0.3] rounded-xl text-right">
 <p className="text-sm text-foreground mb-3 font-medium">
 واجهت مشكلة في الدفع؟ تواصل معنا عبر الاتصال أو واتساب
 </p>
 <div className="flex items-center justify-center gap-[var(--spacing-small-gap)]">
 <a
 href="tel:+966556534433"
 className="inline-flex items-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-[var(--card)] border border-ring/50 rounded-lg text-[var(--secondary)] text-sm font-medium hover:bg-muted/[0.1] transition-colors"
 >
 <Phone className="w-4 h-4" />
 اتصل بنا
 </a>
 <a
 href="https://wa.me/+966556534433"
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:bg-[var(--primary)]/[0.9] transition-colors"
 >
 <MessageCircle className="w-4 h-4" />
 واتساب
 </a>
 </div>
 <p className="text-xs text-[var(--secondary)] mt-2 text-center" dir="ltr">+966 55 653 4433</p>
 </div>
 )}
 </div>
 </div>
 );
}
