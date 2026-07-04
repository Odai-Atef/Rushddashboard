/**
 * Dashboard Pricing Page
 *
 * Allows logged-in users to view packages and subscribe from within the app.
 * Now includes SLA/terms acceptance modal before payment.
 * Uses real API data for SLA and package details.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Check, Shield, Star, Zap, Loader2, AlertTriangle, X, ScrollText, XCircle } from "lucide-react";
import { subscriptionService } from "@/api/services/subscription-service";
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
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // SLA Modal state
  const [selectedPkg, setSelectedPkg] = useState<PackageDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [slaModalOpen, setSlaModalOpen] = useState(false);
  const [slaAccepted, setSlaAccepted] = useState(false);
  const [slaScrollProgress, setSlaScrollProgress] = useState(0);
  const slaScrollRef = useRef<HTMLDivElement>(null);

  const checkActiveSubscription = useCallback(async () => {
    setCheckingSubscription(true);
    try {
      const res = await subscriptionService.getMySubscription();
      const subData = (res.data as unknown as { success?: boolean; data?: { status: string } })?.data ?? res.data;
      if (subData?.status === 'active') {
        setHasActiveSubscription(true);
        navigate('/dashboard');
        return true;
      }
      try {
        const syncRes = await apiClient.post('/api/v1/subscriptions/payments/sync');
        if ((syncRes.data as any)?.success) {
          setHasActiveSubscription(true);
          navigate('/dashboard');
          return true;
        }
      } catch (syncErr: any) {
        console.log('[PricingPage] Sync failed:', syncErr?.message);
      }
    } catch {
      // Ignore
    } finally {
      setCheckingSubscription(false);
    }
    return false;
  }, [navigate]);

  useEffect(() => {
    checkActiveSubscription();
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
      // Fetch full package details with SLA
      const res = await apiClient.get<PackageDetail>(`/api/v1/subscriptions/packages/${pkg.id}`);
      const detail = (res.data as unknown as { success?: boolean; data?: PackageDetail })?.data ?? res.data;
      if (detail) {
        // Parse nested JSON fields
        const parsed: PackageDetail = {
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

  const handleSubscribeFromDetail = async (pkg: PackageDetail) => {
    setSubscribingId(pkg.id);
    try {
      const subRes = await subscriptionService.createSubscription({ packageId: pkg.id });
      const subRaw = subRes.data as unknown as { success: boolean; data: { id: string } };
      if (!subRes.success || !subRaw?.data?.id) {
        setError(subRes.message || "فشل في إنشاء الاشتراك");
        setSubscribingId(null);
        return;
      }
      const subscriptionId = subRaw.data.id;
      const returnUrl = `${window.location.origin}/payment/callback`;
      const payRes = await subscriptionService.initiatePayment({ subscriptionId, returnUrl });
      const payRaw = payRes.data as unknown as { success: boolean; data: { checkoutUrl: string } };
      if (!payRes.success || !payRaw?.data?.checkoutUrl) {
        setError(payRes.message || "فشل في إنشاء فاتورة الدفع");
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
    } catch (err: any) {
      setError(err?.message || "حدث خطأ غير متوقع");
      setSubscribingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8" dir="rtl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">اختر الباقة المناسبة</h1>
        <p className="text-slate-500 text-lg">
          باقات مصممة خصيصاً للمنظمات غير الربحية السعودية
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => {
          const Icon = accentIcons[idx % accentIcons.length];
          const accent = accentColors[idx % accentColors.length];
          const grad = gradients[idx % gradients.length];
          const isRecommended = idx === 1;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-7 border relative transition-all hover:shadow-lg"
              style={{
                borderColor: isRecommended ? accent : "#E2E8F0",
                boxShadow: isRecommended ? `0 16px 48px ${accent}20` : "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              {isRecommended && (
                <div
                  className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: accent }}
                >
                  الأكثر طلباً
                </div>
              )}

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
              >
                <Icon size={24} color="#fff" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{pkg.name}</h3>
              <p className="text-sm text-slate-500 mb-5">{pkg.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold" style={{ color: accent }}>
                  {pkg.priceMonthly.toLocaleString("ar-SA")}
                </span>
                <span className="text-base text-slate-500 mr-2">ريال/شهر</span>
                <p className="text-sm text-slate-400 mt-1">{pkg.projectLimit} مشاريع</p>
              </div>

              {/* SLA Badge */}
              <div
                onClick={() => openSlaModal(pkg)}
                className="flex items-center gap-2 mb-4 p-3 rounded-xl cursor-pointer hover:bg-opacity-100 transition-colors"
                style={{ background: `${accent}08` }}
              >
                <Shield size={16} color={accent} />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">اتفاقية مستوى الخدمة</div>
                  <div className="text-xs text-slate-500">{pkg.sla || 'مستوى أساسي'}</div>
                </div>
              </div>

              <button
                onClick={() => openSlaModal(pkg)}
                disabled={subscribingId === pkg.id}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base mb-6 transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: accent }}
              >
                {subscribingId === pkg.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري التحضير...
                  </span>
                ) : (
                  "اشترك الآن"
                )}
              </button>

              {/* Benefits + Included Services */}
              <div className="space-y-3 pr-1">
                {(() => {
                  const list = normalizeFeatures(pkg.features);
                  return list.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: `${accent}15` }}
                      >
                        <Check size={12} color={accent} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {packages.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-slate-500">لا توجد باقات متاحة حالياً</p>
        </div>
      )}

      {/* SLA / Terms Modal */}
      {slaModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ScrollText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">اتفاقية مستوى الخدمة</h3>
                  <p className="text-sm text-slate-500">{selectedPkg?.name || 'جاري التحميل...'}</p>
                </div>
              </div>
              <button
                onClick={() => setSlaModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div
              ref={slaScrollRef}
              onScroll={handleSlaScroll}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : selectedPkg ? (
                <>
                  {/* SLA Summary Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: 'مستوى SLA', value: selectedPkg.sla.level },
                      { label: 'وقت الاستجابة', value: selectedPkg.sla.responseTime },
                      { label: 'وقت الحل', value: selectedPkg.sla.resolutionTime },
                      { label: 'نسبة التوفر', value: selectedPkg.sla.uptime },
                      { label: 'ساعات الدعم', value: selectedPkg.sla.supportHours },
                      { label: 'عدد المشاريع', value: `${selectedPkg.projectLimit} مشروع/سنة` },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3">
                        <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                        <div className="text-sm font-bold text-slate-800">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Package Features */}
                  <div className="space-y-6">
                    {/* Benefits */}
                    {selectedPkg.features.benefits && selectedPkg.features.benefits.length > 0 && (
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-3">المزايا الرئيسية</h4>
                        <ul className="space-y-2">
                          {selectedPkg.features.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <Check size={14} className="mt-1 text-emerald-600 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Services */}
                    {selectedPkg.features.services && selectedPkg.features.services.length > 0 && (
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-3">الخدمات المتضمنة</h4>
                        <ul className="space-y-2">
                          {selectedPkg.features.services.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              {s.included ? (
                                <Check size={14} className="mt-1 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle size={14} className="mt-1 text-slate-400 shrink-0" />
                              )}
                              <span className={s.included ? "" : "text-slate-400 line-through"}>{s.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Goals */}
                    {selectedPkg.features.goals && selectedPkg.features.goals.length > 0 && (
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-3">الأهداف المرتقبة</h4>
                        <ul className="space-y-2">
                          {selectedPkg.features.goals.map((g, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <Check size={14} className="mt-1 text-blue-600 shrink-0" />
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Outcomes */}
                    {selectedPkg.features.outcomes && selectedPkg.features.outcomes.length > 0 && (
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-3">النتائج المتوقعة</h4>
                        <ul className="space-y-2">
                          {selectedPkg.features.outcomes.map((o, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <Check size={14} className="mt-1 text-violet-600 shrink-0" />
                              <span>{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exclusions */}
                    {selectedPkg.features.exclusions && selectedPkg.features.exclusions.length > 0 && (
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-3">الاستثناءات</h4>
                        <ul className="space-y-2">
                          {selectedPkg.features.exclusions.map((e, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                              <XCircle size={14} className="mt-1 text-red-400 shrink-0" />
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suitable For */}
                    {selectedPkg.features.suitableFor && selectedPkg.features.suitableFor.length > 0 && (
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-3">مناسب لـ</h4>
                        <ul className="space-y-2">
                          {selectedPkg.features.suitableFor.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <Check size={14} className="mt-1 text-amber-600 shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slaAccepted}
                        onChange={(e) => setSlaAccepted(e.target.checked)}
                        className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        قرأت ووافقت على اتفاقية مستوى الخدمة (SLA) وأقر بأنني فهمت جميع التزاماتي والتزامات المنصة الموضحة أعلاه.
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500">تعذر تحميل تفاصيل الباقة</div>
              )}
            </div>

            {/* Footer with Progress */}
            {!detailLoading && selectedPkg && (
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${slaScrollProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 w-10 text-left">
                    {slaScrollProgress}%
                  </span>
                </div>
                <button
                  onClick={confirmSlaAndProceed}
                  disabled={!slaAccepted}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: slaAccepted ? '#2563EB' : '#94A3B8',
                    boxShadow: slaAccepted ? '0 4px 20px rgba(37,99,235,0.3)' : 'none',
                  }}
                >
                  {slaAccepted ? "متابعة للدفع" : "يرجى قبول الاتفاقية أولاً"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
