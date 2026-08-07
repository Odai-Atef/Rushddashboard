/**
 * Dashboard Pricing Page
 *
 * Allows logged-in users to view packages and subscribe from within the app.
 * Now includes SLA/terms acceptance modal before payment.
 * Uses real API data for SLA and package details.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Check, Shield, Star, Zap, Loader2, AlertTriangle, X, ScrollText, XCircle, Phone, MessageCircle, Tag } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import { useConfirm } from "@/app/hooks/useConfirm";
import { subscriptionService, CouponValidationResult } from "@/api/services/subscription-service";
import { onboardingService } from "@/api/services/onboarding-service";
import apiClient from "@/api/client";

interface SlaData {
 level: string;
 levelNum: number;
 responseTime: string;
 resolutionTime: string;
 uptime: string;
 supportHours: string;
}

interface PackageService {
 name: string;
 included: boolean;
}

interface PackageDetail {
 id: string;
 name: string;
 nameAr: string;
 tagline?: string;
 description: string;
 priceMonthly: number;
 priceAnnual: number;
 currency: string;
 billingCycle: string;
 projectLimit: number;
 consultingHours: number;
 features: {
 benefits?: string[];
 services?: PackageService[];
 goals?: string[];
 outcomes?: string[];
 exclusions?: string[];
 suitableFor?: string[];
 notes?: string[];
 opportunityManagement?: string;
 donorSupport?: string;
 impactReporting?: string;
 executionSupervision?: string;
 };
 deliverables?: { name: string; frequency: string }[];
 kpis?: { name: string; target: string }[];
 timeline?: { phase: string; months: string; activities: string[] }[];
 annualDeliverables?: { name: string; quantity: string }[];
 recommended: boolean;
 badge?: string | null;
 accent: string;
 gradientFrom: string;
 gradientTo: string;
 sla: SlaData;
 isActive: boolean;
}

interface PackageItem {
 id: string;
 name: string;
 description?: string;
 priceMonthly: number;
 priceAnnual: number;
 currency: string;
 projectLimit: number;
 features: string;
 sla?: string;
 isActive: boolean;
}

interface CouponPreview {
 code: string;
 type: string;
 valid: boolean;
 originalAmount: number;
 discountAmount: number;
 finalAmount: number;
 currency: string;
 extraMonths: number;
 extraProjects: number;
}

interface PackageDetailWithCoupon extends PackageDetail {
 couponPreview?: CouponPreview;
}

const accentIcons = [Zap, Star, Shield];
const accentColors = ["#2C4A6E", "#5FB8A8", "#C9A84C"];
const gradients = [
 { from: "#1a3554", to: "#2C4A6E" },
 { from: "#3d8f82", to: "#5FB8A8" },
 { from: "#9a7a2e", to: "#C9A84C" },
];

interface ParsedFeatures {
 benefits?: string[];
 services?: PackageService[];
}

function normalizeFeatures(features: unknown): string[] {
 let parsed: ParsedFeatures = {};
 if (typeof features === 'string') {
 try { parsed = JSON.parse(features); } catch { return []; }
 } else if (typeof features === 'object' && features !== null) {
 parsed = features as ParsedFeatures;
 }
 const benefits = (parsed.benefits ?? []).filter((b) => typeof b === 'string');
 const services = (parsed.services ?? [])
 .filter((s) => s.included)
 .map((s) => s.name)
 .filter((n) => typeof n === 'string');
 return [...benefits, ...services];
}

function parsePackageFeatures(featuresRaw: string | unknown): PackageDetail['features'] {
 if (typeof featuresRaw === 'string') {
 try { return JSON.parse(featuresRaw); } catch { return {}; }
 }
 return (featuresRaw as PackageDetail['features']) ?? {};
}

function parseJsonArray<T>(raw: string | unknown): T[] {
 if (typeof raw === 'string') {
 try { return JSON.parse(raw); } catch { return []; }
 }
 return Array.isArray(raw) ? raw : [];
}

/**
 * Generate SLA agreement text from API SLA data.
 * Returns pure HTML string (NOT JSX) for dangerouslySetInnerHTML.
 */
function generateSlaText(pkg: PackageDetail): string {
 const sla = pkg.sla;
 const feat = pkg.features;

 // Build plain HTML strings, never JSX inside a template literal
 const optionalFields: string[] = [];
 if (feat.opportunityManagement) {
 optionalFields.push(`<p>إدارة الفرص التمويلية: ${escapeHtml(feat.opportunityManagement)}</p>`);
 }
 if (feat.donorSupport) {
 optionalFields.push(`<p>دعم المانحين: ${escapeHtml(feat.donorSupport)}</p>`);
 }
 if (feat.impactReporting) {
 optionalFields.push(`<p>تقارير الأثر: ${escapeHtml(feat.impactReporting)}</p>`);
 }
 if (feat.executionSupervision) {
 optionalFields.push(`<p>الإشراف على التنفيذ: ${escapeHtml(feat.executionSupervision)}</p>`);
 }

 const benefitsHtml = (feat.benefits ?? [])
 .map((b: string) => `<p>• ${escapeHtml(b)}</p>`)
 .join('');

 const servicesHtml = (feat.services ?? [])
 .map((s: PackageService) => {
 const status = s.included ? '' : ' (غير متضمن)';
 return `<p>• ${escapeHtml(s.name)}${status}</p>`;
 })
 .join('');

 const goalsHtml = (feat.goals ?? [])
 .map((g: string) => `<p>• ${escapeHtml(g)}</p>`)
 .join('');

 const outcomesHtml = (feat.outcomes ?? [])
 .map((o: string) => `<p>• ${escapeHtml(o)}</p>`)
 .join('');

 const exclusionsHtml = (feat.exclusions ?? [])
 .map((e: string) => `<p>• ${escapeHtml(e)}</p>`)
 .join('');

 const suitableForHtml = (feat.suitableFor ?? [])
 .map((s: string) => `<p>• ${escapeHtml(s)}</p>`)
 .join('');

 return `
 <h3>1. التزامات المنصة</h3>
 <p>تتعهد منصة رشد بتوفير البيئة التقنية والاستشارية اللازمة لإدارة المشاريع والمبادرات غير الربحية، بما في ذلك: استضافة البيانات، النسخ الاحتياطي، الصيانة الدورية، والدعم الفني.</p>

 <h3>2. مستوى الخدمة (${escapeHtml(sla.level)})</h3>
 <p>• وقت الاستجابة الأولي: ${escapeHtml(sla.responseTime)}</p>
 <p>• وقت الحل المتوقع: ${escapeHtml(sla.resolutionTime)}</p>
 <p>• نسبة توفر المنصة: ${escapeHtml(sla.uptime)}</p>

 <h3>3. ساعات الدعم</h3>
 <p>${escapeHtml(sla.supportHours)}.</p>

 <h3>4. نطاق الخدمة</h3>
 <p>عدد المشاريع سنوياً: ${pkg.projectLimit} مشروع</p>
 <p>ساعات استشارية: ${pkg.consultingHours} ساعة</p>
 ${optionalFields.join('')}

 <h3>5. المزايا الرئيسية</h3>
 ${benefitsHtml}

 <h3>6. الخدمات المتضمنة</h3>
 ${servicesHtml}

 <h3>7. الأهداف المرتقبة</h3>
 ${goalsHtml}

 <h3>8. النتائج المتوقعة</h3>
 ${outcomesHtml}

 <h3>9. الاستثناءات</h3>
 ${exclusionsHtml}

 <h3>10. مناسب لـ</h3>
 ${suitableForHtml}

 <h3>11. التزامات العميل</h3>
 <p>يلتزم العميل بتزويد المنصة بالمعلومات والبيانات المطلوبة في الوقت المحدد، والالتزام بمواعيد الاجتماعات الاستشارية، والتعاون في مراجعات الوثائق.</p>

 <h3>12. السرية والامتثال</h3>
 <p>تلتزم المنصة بسرية بيانات العميل والامتثال لأنظمة حماية البيانات الشخصية في المملكة العربية السعودية.</p>

 <h3>13. التجديد والإلغاء</h3>
 <p>يتم التجديد تلقائياً ما لم يتم إرسال إشعار بالإلغاء قبل 30 يوماً من تاريخ التجديد.</p>
 `;
}

function escapeHtml(text: string): string {
 if (!text) return '';
 return text
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#039;');
}

export function PricingPage() {
 const navigate = useNavigate();
 const [packages, setPackages] = useState<PackageItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [subscribingId, setSubscribingId] = useState<string | null>(null);
 const [activeSubscription, setActiveSubscription] = useState<{
 packageId: string;
 packageName: string;
 status: string;
 } | null>(null);
 const [checkingSubscription, setCheckingSubscription] = useState(false);
 const [notStartedStatus, setNotStartedStatus] = useState(false);
 const [requiredDocumentsMissing, setRequiredDocumentsMissing] = useState(false);
 const [organizationId, setOrganizationId] = useState<string | null>(null);
 const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

 // SLA Modal state
  const [selectedPkg, setSelectedPkg] = useState<PackageDetailWithCoupon | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [slaModalOpen, setSlaModalOpen] = useState(false);
  const [slaAccepted, setSlaAccepted] = useState(false);
  const [slaScrollProgress, setSlaScrollProgress] = useState(0);
  const slaScrollRef = useRef<HTMLDivElement>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const { confirm, dialog } = useConfirm();

  const showError = useCallback((message: string) => {
    setError(message);
    toast.error(message);
  }, []);

  const checkActiveSubscription = useCallback(async () => {
 setCheckingSubscription(true);
 try {
 const res = await subscriptionService.getMySubscription();
 const subData = (res.data as unknown as { success?: boolean; data?: { status: string; packageId?: string; package?: { name?: string } } })?.data ?? res.data;
 if (subData?.status === 'active' && subData?.packageId) {
 setActiveSubscription({
 packageId: subData.packageId,
 packageName: subData.package?.name || 'الباقة الحالية',
 status: subData.status,
 });
 return true;
 }
 try {
 const syncRes = await apiClient.post('/api/v1/subscriptions/payments/sync');
 const syncData = (syncRes.data as any)?.data ?? syncRes.data;
 if ((syncRes.data as any)?.success && syncData?.status === 'active' && syncData?.packageId) {
 setActiveSubscription({
 packageId: syncData.packageId,
 packageName: syncData.package?.name || 'الباقة الحالية',
 status: syncData.status,
 });
 return true;
 }
 } catch (syncErr: any) {
 console.log('[PricingPage] Sync failed:', syncErr?.message);
 }
 } catch (err: any) {
 const errorCode = err?.code || err?.data?.code || err?.response?.data?.code;
 const errorStatus = err?.status || err?.data?.status || err?.response?.data?.status;
 if (errorStatus === 'NOT_STARTED' || errorCode === 'ORGANIZATION_NOT_QUALIFIED') {
 setNotStartedStatus(true);
 setError(err?.message || err?.data?.message || err?.response?.data?.message || "لم تبدأ عملية التقييم. يرجى البدء في التقييم أولاً.");
 return false;
 }
 if (errorCode === 'REQUIRED_DOCUMENTS_MISSING') {
 setRequiredDocumentsMissing(true);
 setError(err?.message || err?.data?.message || err?.response?.data?.message || "يجب رفع المستندات المطلوبة أولاً.");
 return false;
 }
 // Ignore other errors
 } finally {
 setCheckingSubscription(false);
 }
 return false;
 }, []);

 useEffect(() => {
 checkActiveSubscription();
 onboardingService.getMyOrganization().then((orgRes) => {
 const org = orgRes.data as unknown as { id?: string } | undefined;
 if (org?.id) setOrganizationId(org.id);
 }).catch(() => {
 // ignore; documents link will just use empty org id
 });
 subscriptionService
 .getPackages()
 .then((res) => {
 const raw = res.data as unknown as { success: boolean; data: PackageItem[] };
 if (res.success && raw?.data) {
 setPackages(raw.data.filter((p: PackageItem) => p.isActive));
 }
 setLoading(false);
 })
 .catch(() => {
 setError("فشل في تحميل الباقات");
 setLoading(false);
 });
 return () => {
 if (intervalRef.current) clearInterval(intervalRef.current);
 };
 }, []);

  const openSlaModal = async (pkg: PackageItem) => {
  setSlaAccepted(false);
  setSlaScrollProgress(0);
  setDetailLoading(true);
  setSlaModalOpen(true);

  try {
  // Fetch full package details with SLA and optional coupon preview
  const url = appliedCoupon
  ? `/api/v1/subscriptions/packages/${pkg.id}?code=${encodeURIComponent(appliedCoupon.code)}`
  : `/api/v1/subscriptions/packages/${pkg.id}`;
  const res = await apiClient.get<PackageDetailWithCoupon>(url);
  const detail = (res.data as unknown as { success?: boolean; data?: PackageDetailWithCoupon })?.data ?? res.data;
  if (detail) {
  // Parse nested JSON fields
  const parsed: PackageDetailWithCoupon = {
  ...detail,
  features: parsePackageFeatures(detail.features as any),
  deliverables: parseJsonArray(detail.deliverables as any),
  kpis: parseJsonArray(detail.kpis as any),
  timeline: parseJsonArray(detail.timeline as any),
  annualDeliverables: parseJsonArray(detail.annualDeliverables as any),
  };
  setSelectedPkg(parsed);
  }
  } catch (err: any) {
  console.error('[PricingPage] Failed to fetch package details:', err?.message);
  // Fallback: create minimal detail from list item
  setSelectedPkg({
  id: pkg.id,
  name: pkg.name,
  nameAr: pkg.name,
  description: pkg.description || '',
  priceMonthly: pkg.priceMonthly,
  priceAnnual: pkg.priceAnnual,
  currency: pkg.currency,
  billingCycle: 'annual',
  projectLimit: pkg.projectLimit,
  consultingHours: 0,
  features: {},
  recommended: false,
  accent: accentColors[0],
  gradientFrom: gradients[0].from,
  gradientTo: gradients[0].to,
  sla: {
  level: pkg.sla || 'مستوى أساسي',
  levelNum: 1,
  responseTime: 'غير محدد',
  resolutionTime: 'غير محدد',
  uptime: 'غير محدد',
  supportHours: 'غير محدد',
  },
  isActive: pkg.isActive,
  });
  } finally {
  setDetailLoading(false);
  }
  };

  const handleApplyCoupon = async () => {
  const code = couponCode.trim();
  if (!code) {
  const msg = 'الرجاء إدخال كود الخصم';
  setCouponError(msg);
  toast.error(msg);
  return;
  }
  setCouponLoading(true);
  setCouponError('');
  setCouponSuccess('');
  setAppliedCoupon(null);
  try {
  if (packages.length === 0) {
  const msg = 'لا توجد باقات لتحديد الباقة المناسبة';
  setCouponError(msg);
  toast.error(msg);
  return;
  }
  // Validate against the first active package; backend returns applicable package IDs
  const response = await subscriptionService.validateCoupon(code, packages[0].id);
  if (response.success && response.data?.data) {
  const result = (response.data as unknown as { data: CouponValidationResult }).data;
  setAppliedCoupon(result);
  const successMsg = 'تم تطبيق كود الخصم بنجاح';
  setCouponSuccess(successMsg);
  toast.success(successMsg);
  } else {
  const msg = response.message || 'كود الخصم غير صالح';
  setCouponError(msg);
  toast.error(msg);
  }
  } catch (err: any) {
  const msg = err?.message || 'كود الخصم غير صالح';
  setCouponError(msg);
  toast.error(msg);
  } finally {
  setCouponLoading(false);
  }
  };

  const handleRemoveCoupon = useCallback(() => {
  setCouponCode('');
  setAppliedCoupon(null);
  setCouponError('');
  setCouponSuccess('');
  }, []);

 const handleSlaScroll = () => {
 const el = slaScrollRef.current;
 if (!el) return;
 const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
 setSlaScrollProgress(Math.min(Math.round(progress), 100));
 };

 const confirmSlaAndProceed = () => {
 if (!slaAccepted || !selectedPkg) return;
 setSlaModalOpen(false);
 handleSubscribeFromDetail(selectedPkg);
 };

  const initiatePaymentFlow = async (pkg: PackageDetailWithCoupon, promoCode?: string) => {
  const subRes = await subscriptionService.createSubscription({
  packageId: pkg.id,
  promoCode,
  });
  const subRaw = subRes.data as unknown as { success: boolean; data: { id: string } };
  if (!subRes.success || !subRaw?.data?.id) {
  const msg = subRes.message || "فشل في إنشاء الاشتراك";
  showError(msg);
  setSubscribingId(null);
  return;
  }
  const subscriptionId = subRaw.data.id;
  const returnUrl = `${window.location.origin}/payment/callback`;
  const payRes = await subscriptionService.initiatePayment({
  subscriptionId,
  returnUrl,
  promoCode,
  });
 const payRaw = payRes.data as unknown as { success: boolean; data: { checkoutUrl: string } };
  if (!payRes.success || !payRaw?.data?.checkoutUrl) {
  const msg = payRes.message || "فشل في إنشاء فاتورة الدفع";
  showError(msg);
  setSubscribingId(null);
  return;
  }
  window.open(payRaw.data.checkoutUrl, '_blank');
  let attempts = 0;
  const maxAttempts = 24;
  if (intervalRef.current) clearInterval(intervalRef.current);
  intervalRef.current = setInterval(async () => {
  attempts += 1;
  const found = await checkActiveSubscription();
  if (found || attempts >= maxAttempts) {
  if (intervalRef.current) clearInterval(intervalRef.current);
  setSubscribingId(null);
  }
  }, 5000);
  };

  const handleSubscribeFromDetail = async (pkg: PackageDetailWithCoupon) => {
  setSubscribingId(pkg.id);
  setRequiredDocumentsMissing(false);
  try {
  await initiatePaymentFlow(pkg, appliedCoupon?.code);
  } catch (err: any) {
  const errorCode = err?.code || err?.data?.code || err?.response?.data?.code;
  const errorStatus = err?.status || err?.data?.status || err?.response?.data?.status;

  if (errorCode === 'PROMO_CODE_PACKAGE_NOT_ALLOWED') {
  const proceed = await confirm({
  title: 'كود الخصم غير متاح لهذه الباقة',
  description: 'هل تريد المتابعة بدون تطبيق كود الخصم؟',
  confirmLabel: 'المتابعة',
  cancelLabel: 'إلغاء',
  variant: 'default',
  });
  if (proceed) {
  handleRemoveCoupon();
  toast.warning('تم إزالة كود الخصم لأنه غير متاح لهذه الباقة');
  await initiatePaymentFlow(pkg, undefined);
  } else {
  setSubscribingId(null);
  }
  return;
  }

  if (errorStatus === 'NOT_STARTED' || errorCode === 'ORGANIZATION_NOT_QUALIFIED') {
  setNotStartedStatus(true);
  const msg = err?.message || err?.data?.message || err?.response?.data?.message || "لم تبدأ عملية التقييم. يرجى البدء في التقييم أولاً.";
  showError(msg);
  } else if (errorCode === 'REQUIRED_DOCUMENTS_MISSING') {
  setRequiredDocumentsMissing(true);
  const msg = err?.message || err?.data?.message || err?.response?.data?.message || "يجب رفع المستندات المطلوبة أولاً.";
  showError(msg);
  } else {
  setNotStartedStatus(false);
  setRequiredDocumentsMissing(false);
  const msg = err?.message || "حدث خطأ غير متوقع";
  showError(msg);
  }
  setSubscribingId(null);
  }
  };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <Loader2 className="w-8 h-8 animate-spin text-[var(--secondary)]" />
 </div>
 );
 }

  return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" dir="rtl">
  <div className="text-center mb-8 sm:mb-12">
  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">{activeSubscription ? 'باقات منصة رشد' : 'اختر الباقة المناسبة'}</h1>
 <p className="text-muted-foreground text-lg">
 {activeSubscription
 ? 'لديك اشتراك نشط حالياً. إذا كنت ترغب في تغيير الباقة، يرجى التواصل مع الدعم.'
 : 'باقات مصممة خصيصاً للمنظمات غير الربحية السعودية'}
 </p>
 </div>

   {/* Support contact — shown on all pricing views */}
    <div className="mb-8 sm:mb-10 p-4 sm:p-[var(--spacing-card-padding)] bg-muted/[0.08] border border-[var(--secondary)]/[0.3] rounded-xl text-right max-w-3xl mx-auto">
    <p className="text-sm text-foreground mb-3 font-medium text-center">
    واجهت مشكلة في الدفع؟ تواصل معنا عبر الاتصال أو واتساب
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-[var(--spacing-small-gap)]">
    <a
    href="tel:+966556534433"
    className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-[var(--card)] border border-ring/50 rounded-lg text-foreground text-sm font-medium transition-colors"
    >
    <Phone className="w-4 h-4" />
    اتصل بنا
    </a>
    <a
    href="https://wa.me/+966556534433"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:bg-[var(--primary)]/[0.9] transition-colors"
    >
    <MessageCircle className="w-4 h-4" />
    واتساب
    </a>
    </div>
    <p className="text-xs text-foreground mt-2 text-center" dir="ltr">+966 55 653 4433</p>
    </div>

  {activeSubscription && (
  <div className="mb-6 sm:mb-8 p-4 sm:p-[var(--spacing-card-padding)] rounded-xl bg-[var(--primary)]/[0.08] border border-green-200 text-[var(--primary)]/[0.8] flex items-start gap-[var(--spacing-small-gap)]">
  <Check className="w-5 h-5 shrink-0 mt-0.5" />
  <div>
  <p className="font-medium text-sm sm:text-base">
  لديك اشتراك نشط حالياً: {activeSubscription.packageName}
  </p>
  <p className="text-xs sm:text-sm mt-1">
  إذا كنت ترغب في تغيير الباقة، يرجى التواصل مع الدعم.
  </p>
  </div>
  </div>
  )}

  {error && (
  <div className={`mb-6 sm:mb-8 p-4 sm:p-[var(--spacing-card-padding)] rounded-xl flex items-start gap-[var(--spacing-small-gap)] ${notStartedStatus || requiredDocumentsMissing ? 'bg-[var(--warning)]/[0.08] border border-[var(--warning)]/[0.3] text-amber-800' : 'bg-[var(--destructive)]/[0.08] border border-[var(--destructive)]/[0.3] text-[var(--destructive)]'}`}>
  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
  <div className="flex-1">
  <div className="space-y-[var(--spacing-small-gap)] text-sm sm:text-base">
  <span>{error}</span>
  {notStartedStatus && (
  <p>
  ابدأ التقييم الآن{" "}
  <button
  onClick={() => navigate('/dashboard/charity-assessment')}
  className="inline font-medium underline hover:no-underline"
  >
  بالضغط هنا
  </button>{" "}
  وفتح صفحة تقييم الجمعية.
  </p>
  )}
  {requiredDocumentsMissing && (
  <p>
  لإتمام الاشتراك، يرجى رفع المستندات المطلوبة{" "}
  <button
  onClick={() => navigate(`/dashboard/onboarding/info?tab=documents&organizationId=${encodeURIComponent(organizationId || '')}`)}
  className="inline font-medium underline hover:no-underline"
  >
  بالضغط هنا
  </button>
  .
  </p>
  )}
  </div>
  {(notStartedStatus || requiredDocumentsMissing) && (
  <div className="mt-3 flex flex-col sm:flex-row gap-[var(--spacing-small-gap)]">
  {notStartedStatus && (
  <button
  onClick={() => navigate('/dashboard/charity-assessment')}
  className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-amber-600 text-[var(--primary-foreground)] rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
  >
  ابدأ التقييم الآن
  <Zap className="w-4 h-4" />
  </button>
  )}
  {requiredDocumentsMissing && (
  <button
  onClick={() => navigate(`/dashboard/onboarding/info?tab=documents&organizationId=${encodeURIComponent(organizationId || '')}`)}
  className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-amber-600 text-[var(--primary-foreground)] rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
  >
  رفع المستندات المطلوبة
  <Zap className="w-4 h-4" />
  </button>
  )}
  </div>
  )}
  </div>
  </div>
  )}

  {/* Coupon input */}
  {!activeSubscription && packages.length > 0 && (
  <div className="mb-8 sm:mb-10 p-4 sm:p-[var(--spacing-card-padding)] bg-[var(--card)] border border-[var(--border)] rounded-xl max-w-3xl mx-auto">
  <div className="flex items-start gap-[var(--spacing-small-gap)] mb-3">
  <Tag className="w-5 h-5 text-[var(--secondary)] mt-0.5 shrink-0" />
  <div>
  <h3 className="text-base font-bold text-foreground">كود الخصم</h3>
  <p className="text-sm text-muted-foreground">أدخل كود الخصم للحصول على سعر مخفض أو مزايا إضافية</p>
  </div>
  </div>
  <div className="flex flex-col sm:flex-row gap-[var(--spacing-small-gap)]">
  <div className="relative flex-1">
  <input
  type="text"
  value={couponCode}
  onChange={(e) => setCouponCode(e.target.value)}
  placeholder="مثال: SUMMER20"
  disabled={couponLoading}
  className="w-full px-4 py-2.5 min-h-[44px] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
  />
  </div>
  <button
  onClick={handleApplyCoupon}
  disabled={couponLoading || !couponCode.trim()}
  className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-4 py-2.5 min-h-[44px] bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 text-sm font-medium"
  >
  {couponLoading ? (
  <>
  <Loader2 className="w-4 h-4 animate-spin" />
  جاري التحقق...
  </>
  ) : (
  "تطبيق"
  )}
  </button>
  {appliedCoupon && (
  <button
  onClick={handleRemoveCoupon}
  className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-4 py-2.5 min-h-[44px] border border-[var(--border)] text-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
  >
  <X className="w-4 h-4" />
  إزالة
  </button>
  )}
  </div>
  {couponError && (
  <div className="mt-3 flex items-start gap-[var(--spacing-small-gap)] text-sm text-[var(--destructive)]">
  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
  <span>{couponError}</span>
  </div>
  )}
  {couponSuccess && (
  <div className="mt-3 flex items-start gap-[var(--spacing-small-gap)] text-sm text-green-700">
  <Check className="w-4 h-4 shrink-0 mt-0.5" />
  <span>{couponSuccess}</span>
  </div>
  )}
  </div>
  )}

  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-small-gap)] ${packages.length < 3 ? 'max-w-4xl mx-auto' : ''}`}>
  {packages.map((pkg, idx) => {
  const Icon = accentIcons[idx % accentIcons.length];
  const accent = accentColors[idx % accentColors.length];
  const grad = gradients[idx % gradients.length];
  const isRecommended = idx === 1;
  const isCurrentPackage = activeSubscription?.packageId === pkg.id;

  const couponApplicable = appliedCoupon
  ? appliedCoupon.applicablePackageIds.length === 0 || appliedCoupon.applicablePackageIds.includes(pkg.id)
  : false;
  const displayOriginalMonthly = couponApplicable ? appliedCoupon?.originalAmount ?? pkg.priceMonthly : pkg.priceMonthly;
  const displayFinalMonthly = couponApplicable ? appliedCoupon?.finalAmount ?? pkg.priceMonthly : pkg.priceMonthly;
  const hasDiscount = couponApplicable && displayFinalMonthly < displayOriginalMonthly;
  const extraMonths = couponApplicable ? appliedCoupon?.extraMonths ?? 0 : 0;
  const extraProjects = couponApplicable ? appliedCoupon?.extraProjects ?? 0 : 0;
  const showCouponNotApplicable = appliedCoupon && !couponApplicable;

  return (
  <div
  key={pkg.id}
  className={`rounded-2xl p-5 sm:p-6 lg:p-7 border relative transition-all hover:shadow-lg ${isCurrentPackage ? 'bg-[var(--primary)]/[0.08]/50' : 'bg-[var(--card)]'}`}
  style={{
  borderColor: isCurrentPackage ? '#10B981' : isRecommended ? accent : "#E2E8F0",
  boxShadow: isCurrentPackage ? '0 16px 48px rgba(16,185,129,0.15)' : isRecommended ? `0 16px 48px ${accent}20` : "0 4px 12px rgba(0,0,0,0.05)",
  }}
  >
  {isRecommended && !isCurrentPackage && (
  <div
  className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[var(--primary-foreground)] text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full"
  style={{ background: accent }}
  >
  الأكثر طلباً
  </div>
  )}
  {isCurrentPackage && (
  <div
  className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[var(--primary-foreground)] text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full bg-[var(--primary)]"
  >
  باقتك الحالية
  </div>
  )}

  <div
  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
  style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
  >
  <Icon size={22} color="#fff" className="sm:w-6 sm:h-6" />
  </div>

  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
  <p className="text-sm text-muted-foreground mb-4 sm:mb-5">{pkg.description}</p>

   <div className="mb-5 sm:mb-6">
   <div className="flex items-baseline gap-2 flex-wrap">
   {hasDiscount && (
   <span className="text-xl sm:text-2xl font-bold text-muted-foreground line-through">
   {displayOriginalMonthly.toLocaleString("ar-SA")} ريال/شهر
   </span>
   )}
   <span className="text-3xl sm:text-4xl font-extrabold" style={{ color: accent }}>
   {displayFinalMonthly.toLocaleString("ar-SA")}
   </span>
   <span className="text-sm sm:text-base text-muted-foreground">ريال/شهر</span>
   </div>
   <p className="text-sm text-card-foreground mt-1">
   {pkg.projectLimit} {extraProjects > 0 ? `(+ ${extraProjects} مشاريع إضافية)` : ""} مشاريع
   </p>
   {extraMonths > 0 && (
   <p className="text-sm text-[var(--primary)] mt-1 font-medium">
   مدة الاشتراك: شهر + {extraMonths} {extraMonths === 1 ? "شهر" : "أشهر"} إضافية
   </p>
   )}
   {showCouponNotApplicable && (
   <p className="text-xs text-muted-foreground mt-1">لا ينطبق على هذه الباقة</p>
   )}
   </div>

 {/* SLA Badge */}
  <div
  onClick={() => openSlaModal(pkg)}
  className="flex items-center gap-[var(--spacing-small-gap)] mb-3 sm:mb-4 p-3 sm:p-[var(--spacing-card-padding)] rounded-xl cursor-pointer hover:bg-opacity-100 transition-colors"
  style={{ background: `${accent}08` }}
  >
  <Shield size={16} color={accent} />
  <div className="flex-1">
   <div className="text-xs font-semibold text-card-foreground">اتفاقية مستوى الخدمة</div>
   <div className="text-xs text-muted-foreground">{pkg.sla || 'مستوى أساسي'}</div>
  </div>
  </div>

  {!activeSubscription && (
  <>
  <button
  onClick={() => openSlaModal(pkg)}
  disabled={subscribingId === pkg.id}
  className="w-full py-3 sm:py-3.5 rounded-xl text-[var(--primary-foreground)] font-bold text-base mb-3 transition-opacity hover:opacity-90 disabled:opacity-50"
  style={{ background: accent }}
  >
 {subscribingId === pkg.id ? (
 <span className="flex items-center justify-center gap-[var(--spacing-small-gap)]">
 <Loader2 className="w-4 h-4 animate-spin" />
 جاري التحضير...
 </span>
 ) : (
 "اشترك الآن"
 )}
 </button>

 {/* Alternative: checkout via website (new tab) */}
  <button
  onClick={() => window.open(`/pricing/checkout/${pkg.id}`, '_blank')}
  className="w-full py-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors mb-6"
  >
  أو اشترك عبر الموقع ↗
  </button>
 </>
 )}
 {isCurrentPackage && (
  <div className="w-full py-3.5 rounded-xl text-[var(--primary)] bg-emerald-100/90 font-bold text-base mb-3 text-center">
 باقتك الحالية
 </div>
 )}

 {/* Benefits */}
 {(() => {
 const parsed = parsePackageFeatures(pkg.features);
 const benefits = parsed.benefits ?? [];
 if (benefits.length === 0) return null;
 return (
 <div className="space-y-[var(--spacing-small-gap)] pr-1">
 {benefits.map((benefit, i) => (
 <div key={i} className="flex items-center gap-[var(--spacing-small-gap)].5">
 <div
 className="w-5 h-5 rounded-full flex items-center justify-center"
 style={{ background: `${accent}15` }}
 >
 <Check size={12} color={accent} strokeWidth={2.5} />
 </div>
  <span className="text-sm text-card-foreground">{benefit}</span>
 </div>
 ))}
 </div>
 );
 })()}

 {/* Notes */}
 {(() => {
 const parsed = parsePackageFeatures(pkg.features);
 const notes = parsed.notes ?? [];
 if (notes.length === 0) return null;
 return (
 <>
 <Separator className="my-4 bg-muted" />
 <h4 className="text-sm font-bold text-foreground mb-2">ملاحظات</h4>
 <div className="space-y-[var(--spacing-small-gap)] pr-1">
 {notes.map((note, i) => (
 <div key={i} className="flex items-start gap-[var(--spacing-small-gap)].5">
 <div
 className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
 style={{ background: `${accent}15` }}
 >
 <AlertTriangle size={12} color={accent} strokeWidth={2.5} />
 </div>
  <span className="text-sm text-card-foreground">{note}</span>
 </div>
 ))}
 </div>
 </>
 );
 })()}
 </div>
 );
 })}
 </div>

 {packages.length === 0 && !loading && (
 <div className="text-center py-20">
 <p className="text-muted-foreground">لا توجد باقات متاحة حالياً</p>
 </div>
 )}

  {/* SLA / Terms Modal */}
  {slaModalOpen && (
  <div className="fixed inset-0 bg-[var(--text-primary)]/[0.5] flex items-center justify-center z-50 p-3 sm:p-[var(--spacing-card-padding)]" dir="rtl">
  <div className="bg-[var(--card)] rounded-2xl w-full max-w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl">
  {/* Header */}
  <div className="p-4 sm:p-[var(--spacing-card-padding)] border-b border-border flex items-center justify-between">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <ScrollText className="w-6 h-6 text-[var(--secondary)]" />
 <div>
 <h3 className="text-lg font-bold text-foreground">اتفاقية مستوى الخدمة</h3>
 <p className="text-sm text-muted-foreground">{selectedPkg?.name || 'جاري التحميل...'}</p>
 </div>
 </div>
 <button
 onClick={() => setSlaModalOpen(false)}
 className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg transition-colors"
 >
 <X className="w-5 h-5 text-[var(--text-muted)]" />
 </button>
 </div>

  {/* Content */}
  <div
  ref={slaScrollRef}
  onScroll={handleSlaScroll}
  className="flex-1 overflow-y-auto p-4 sm:p-[var(--spacing-card-padding)] space-y-[var(--spacing-section-gap)]"
  >
 {detailLoading ? (
 <div className="flex items-center justify-center py-12">
 <Loader2 className="w-8 h-8 animate-spin text-[var(--secondary)]" />
 </div>
 ) : selectedPkg ? (
 <>
 {/* SLA Summary Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-small-gap)] mb-6">
 {[
 { label: 'مستوى SLA', value: selectedPkg.sla.level },
 { label: 'وقت الاستجابة', value: selectedPkg.sla.responseTime },
 { label: 'وقت الحل', value: selectedPkg.sla.resolutionTime },
 { label: 'نسبة التوفر', value: selectedPkg.sla.uptime },
 { label: 'ساعات الدعم', value: selectedPkg.sla.supportHours },
 { label: 'عدد المشاريع', value: `${selectedPkg.projectLimit} مشروع/سنة` },
 ].map((item, i) => (
 <div key={i} className="bg-muted rounded-xl p-[var(--spacing-card-padding)]">
 <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
 <div className="text-sm font-bold text-foreground">{item.value}</div>
 </div>
 ))}
 </div>

 {/* Package Features */}
 <div className="space-y-[var(--spacing-section-gap)]">
 {/* Benefits */}
 {selectedPkg.features.benefits && selectedPkg.features.benefits.length > 0 && (
 <div>
 <h4 className="text-base font-bold text-foreground mb-3">المزايا الرئيسية</h4>
 <ul className="space-y-[var(--spacing-small-gap)]">
 {selectedPkg.features.benefits.map((b, i) => (
  <li key={i} className="flex items-start gap-[var(--spacing-small-gap)] text-sm text-card-foreground">
  <Check size={14} className="mt-1 text-[var(--primary)] shrink-0" />
  <span>{b}</span>
  </li>
 ))}
 </ul>
 </div>
 )}

 {/* Services */}
 {selectedPkg.features.services && selectedPkg.features.services.length > 0 && (
 <div>
 <h4 className="text-base font-bold text-foreground mb-3">الخدمات المتضمنة</h4>
 <ul className="space-y-[var(--spacing-small-gap)]">
 {selectedPkg.features.services.map((s, i) => (
 <li key={i} className="flex items-start gap-[var(--spacing-small-gap)] text-sm text-[var(--text-secondary)]">
 {s.included ? (
 <Check size={14} className="mt-1 text-[var(--primary)] shrink-0" />
 ) : (
 <XCircle size={14} className="mt-1 text-[var(--text-muted)] shrink-0" />
 )}
  <span className={s.included ? "text-card-foreground" : "text-muted-foreground line-through"}>{s.name}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Goals */}
 {selectedPkg.features.goals && selectedPkg.features.goals.length > 0 && (
 <div>
 <h4 className="text-base font-bold text-foreground mb-3">الأهداف المرتقبة</h4>
 <ul className="space-y-[var(--spacing-small-gap)]">
 {selectedPkg.features.goals.map((g, i) => (
  <li key={i} className="flex items-start gap-[var(--spacing-small-gap)] text-sm text-card-foreground">
  <Check size={14} className="mt-1 text-[var(--secondary)] shrink-0" />
  <span>{g}</span>
  </li>
 ))}
 </ul>
 </div>
 )}

 {/* Outcomes */}
 {selectedPkg.features.outcomes && selectedPkg.features.outcomes.length > 0 && (
 <div>
 <h4 className="text-base font-bold text-foreground mb-3">النتائج المتوقعة</h4>
 <ul className="space-y-[var(--spacing-small-gap)]">
 {selectedPkg.features.outcomes.map((o, i) => (
  <li key={i} className="flex items-start gap-[var(--spacing-small-gap)] text-sm text-card-foreground">
  <Check size={14} className="mt-1 text-[var(--secondary)] shrink-0" />
  <span>{o}</span>
  </li>
 ))}
 </ul>
 </div>
 )}

 {/* Exclusions */}
 {selectedPkg.features.exclusions && selectedPkg.features.exclusions.length > 0 && (
 <div>
 <h4 className="text-base font-bold text-foreground mb-3">الاستثناءات</h4>
 <ul className="space-y-[var(--spacing-small-gap)]">
 {selectedPkg.features.exclusions.map((e, i) => (
  <li key={i} className="flex items-start gap-[var(--spacing-small-gap)] text-sm text-muted-foreground">
  <XCircle size={14} className="mt-1 text-destructive shrink-0" />
  <span>{e}</span>
  </li>
 ))}
 </ul>
 </div>
 )}

 {/* Suitable For */}
 {selectedPkg.features.suitableFor && selectedPkg.features.suitableFor.length > 0 && (
 <div>
 <h4 className="text-base font-bold text-foreground mb-3">مناسب لـ</h4>
 <ul className="space-y-[var(--spacing-small-gap)]">
 {selectedPkg.features.suitableFor.map((s, i) => (
  <li key={i} className="flex items-start gap-[var(--spacing-small-gap)] text-sm text-card-foreground">
  <Check size={14} className="mt-1 text-[var(--warning)] shrink-0" />
  <span>{s}</span>
  </li>
 ))}
 </ul>
 </div>
 )}
 </div>

 {/* Terms Checkbox */}
  <div className="mt-6 p-3 sm:p-[var(--spacing-card-padding)] bg-muted/[0.08] rounded-xl border border-[var(--secondary)]/[0.2]">
  <label className="flex items-start gap-[var(--spacing-small-gap)] cursor-pointer">
  <input
  type="checkbox"
  checked={slaAccepted}
  onChange={(e) => setSlaAccepted(e.target.checked)}
  className="w-5 h-5 mt-0.5 text-[var(--secondary)] rounded-lg focus:ring-ring shrink-0"
  />
   <span className="text-sm text-card-foreground leading-relaxed">
   قرأت ووافقت على اتفاقية مستوى الخدمة (SLA) وأقر بأنني فهمت جميع التزاماتي والتزامات المنصة الموضحة أعلاه.
   </span>
  </label>
  </div>
 </>
 ) : (
 <div className="text-center py-12 text-muted-foreground">تعذر تحميل تفاصيل الباقة</div>
 )}
 </div>

  {/* Footer with Progress */}
  {!detailLoading && selectedPkg && (
  <div className="p-4 sm:p-[var(--spacing-card-padding)] border-t border-border">
  <div className="flex items-center gap-[var(--spacing-small-gap)] mb-4">
  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
  <div
  className="h-full bg-[var(--primary)] transition-all duration-300"
  style={{ width: `${slaScrollProgress}%` }}
  />
  </div>
  <span className="text-xs font-semibold text-muted-foreground w-10 text-left">
  {slaScrollProgress}%
  </span>
  </div>

  {/* Coupon summary in modal footer */}
  {!activeSubscription && selectedPkg.couponPreview?.valid && (
  <div className="mb-4 p-3 bg-[var(--primary)]/[0.06] border border-[var(--primary)]/[0.2] rounded-lg text-sm">
  <div className="font-medium text-foreground mb-1">
  كود الخصم: {selectedPkg.couponPreview.code}
  </div>
  <div className="flex items-center gap-2 flex-wrap">
  {selectedPkg.couponPreview.discountAmount > 0 && (
  <>
  <span className="text-muted-foreground line-through">
  {selectedPkg.couponPreview.originalAmount.toLocaleString("ar-SA")} ريال/شهر
  </span>
  <span className="font-bold text-[var(--primary)]">
  {selectedPkg.couponPreview.finalAmount.toLocaleString("ar-SA")} ريال/شهر
  </span>
  </>
  )}
  {selectedPkg.couponPreview.discountAmount === 0 && selectedPkg.couponPreview.extraMonths > 0 && (
  <span className="font-bold text-[var(--primary)]">
  مدة الاشتراك: شهر + {selectedPkg.couponPreview.extraMonths} {selectedPkg.couponPreview.extraMonths === 1 ? "شهر" : "أشهر"} إضافية
  </span>
  )}
  </div>
  </div>
  )}

  {activeSubscription?.packageId === selectedPkg.id ? (
   <div className="w-full py-3.5 rounded-xl text-[var(--primary)] bg-emerald-100/90 font-bold text-base text-center">
  هذه باقتك الحالية
  </div>
  ) : activeSubscription ? (
   <div className="w-full py-3.5 rounded-xl text-card-foreground bg-[var(--hover)] font-bold text-base text-center">
  لديك اشتراك نشط. إذا كنت ترغب في تغيير الباقة، يرجى التواصل مع الدعم.
  </div>
  ) : (
  <button
  onClick={confirmSlaAndProceed}
  disabled={!slaAccepted}
  className="w-full py-3.5 rounded-xl text-[var(--primary-foreground)] font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  style={{
  background: slaAccepted ? 'var(--primary)' : 'var(--text-disabled)',
  boxShadow: slaAccepted ? '0 4px 20px rgba(var(--primary-rgb),0.3)' : 'none',
  }}
  >
  {slaAccepted ? "متابعة للدفع" : "يرجى قبول الاتفاقية أولاً"}
  </button>
  )}
  </div>
  )}
 </div>
 </div>
  )}

  {dialog}
 </div>
 );
}
