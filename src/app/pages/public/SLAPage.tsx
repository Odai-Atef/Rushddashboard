/**
 * Public SLA Details Page
 *
 * Shows full package details and SLA agreement for a specific package.
 * Fetches data from API, no auth required.
 * URL: /sla/:packageId
 */

import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import {
  Check,
  Shield,
  Loader2,
  AlertTriangle,
  ArrowRight,
  XCircle,
} from "lucide-react";
import apiClient from "@/api/client";

interface PackageService {
  name: string;
  included: boolean;
}

interface SlaData {
  level: string;
  levelNum: number;
  responseTime: string;
  resolutionTime: string;
  uptime: string;
  supportHours: string;
}

interface PackageDetail {
  id: string;
  name: string;
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
  sla: SlaData;
  isActive: boolean;
}

function parsePackageFeatures(featuresRaw: string | unknown): PackageDetail["features"] {
  if (typeof featuresRaw === "string") {
    try {
      return JSON.parse(featuresRaw);
    } catch {
      return {};
    }
  }
  return (featuresRaw as PackageDetail["features"]) ?? {};
}

function parseJsonArray<T>(raw: string | unknown): T[] {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateSlaText(pkg: PackageDetail): string {
  const sla = pkg.sla;
  const feat = pkg.features;

  const optionalFields: string[] = [];
  if (feat.opportunityManagement) {
    optionalFields.push(
      `<p>إدارة الفرص التمويلية: ${escapeHtml(feat.opportunityManagement)}</p>`
    );
  }
  if (feat.donorSupport) {
    optionalFields.push(`<p>دعم المانحين: ${escapeHtml(feat.donorSupport)}</p>`);
  }
  if (feat.impactReporting) {
    optionalFields.push(`<p>تقارير الأثر: ${escapeHtml(feat.impactReporting)}</p>`);
  }
  if (feat.executionSupervision) {
    optionalFields.push(
      `<p>الإشراف على التنفيذ: ${escapeHtml(feat.executionSupervision)}</p>`
    );
  }

  const benefitsHtml = (feat.benefits ?? [])
    .map((b: string) => `<p>• ${escapeHtml(b)}</p>`)
    .join("");

  const servicesHtml = (feat.services ?? [])
    .map((s: PackageService) => {
      const status = s.included ? "" : " (غير متضمن)";
      return `<p>• ${escapeHtml(s.name)}${status}</p>`;
    })
    .join("");

  const goalsHtml = (feat.goals ?? [])
    .map((g: string) => `<p>• ${escapeHtml(g)}</p>`)
    .join("");

  const outcomesHtml = (feat.outcomes ?? [])
    .map((o: string) => `<p>• ${escapeHtml(o)}</p>`)
    .join("");

  const exclusionsHtml = (feat.exclusions ?? [])
    .map((e: string) => `<p>• ${escapeHtml(e)}</p>`)
    .join("");

  const suitableForHtml = (feat.suitableFor ?? [])
    .map((s: string) => `<p>• ${escapeHtml(s)}</p>`)
    .join("");

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
    ${optionalFields.join("")}

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

export function SLAPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!packageId) {
      setError("معرف الباقة غير موجود");
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await apiClient.get<PackageDetail>(
          `/api/v1/subscriptions/packages/${packageId}`
        );
        const detail =
          (res.data as unknown as { success?: boolean; data?: PackageDetail })?.data ??
          res.data;
        if (detail) {
          const parsed: PackageDetail = {
            ...detail,
            features: parsePackageFeatures(detail.features as any),
          };
          setPkg(parsed);
        } else {
          setError("تعذر تحميل تفاصيل الباقة");
        }
      } catch (err: any) {
        console.error("[SLAPage] Failed to fetch:", err?.message);
        setError(err?.message || "فشل في تحميل تفاصيل الباقة");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [packageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12" dir="rtl">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-700 mb-2">{error || "تعذر تحميل الباقة"}</h2>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
          >
            <ArrowRight size={16} />
            العودة إلى الباقات
          </Link>
        </div>
      </div>
    );
  }

  const feat = pkg.features;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
        >
          <ArrowRight size={16} />
          العودة إلى الباقات
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h1>
        <p className="text-slate-500 mb-6">{pkg.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "السعر السنوي", value: `${pkg.priceAnnual.toLocaleString("ar-SA")} ريال` },
            { label: "السعر الشهري", value: `${pkg.priceMonthly.toLocaleString("ar-SA")} ريال` },
            { label: "عدد المشاريع", value: `${pkg.projectLimit} مشروع` },
            { label: "مستوى SLA", value: pkg.sla.level },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-xs text-slate-500 mb-1">{item.label}</div>
              <div className="text-sm font-bold text-slate-800">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            اشترك الآن
          </Link>
        </div>
      </div>

      {/* SLA Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          { label: "مستوى SLA", value: pkg.sla.level },
          { label: "وقت الاستجابة", value: pkg.sla.responseTime },
          { label: "وقت الحل", value: pkg.sla.resolutionTime },
          { label: "نسبة التوفر", value: pkg.sla.uptime },
          { label: "ساعات الدعم", value: pkg.sla.supportHours },
          { label: "ساعات استشارية", value: `${pkg.consultingHours} ساعة` },
        ].map((item, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">{item.label}</div>
            <div className="text-sm font-bold text-slate-800">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Package Features */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">تفاصيل الباقة</h2>

        <div className="space-y-8">
          {/* Benefits */}
          {feat.benefits && feat.benefits.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3">المزايا الرئيسية</h4>
              <ul className="space-y-2">
                {feat.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={14} className="mt-1 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {feat.services && feat.services.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3">الخدمات المتضمنة</h4>
              <ul className="space-y-2">
                {feat.services.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    {s.included ? (
                      <Check size={14} className="mt-1 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle size={14} className="mt-1 text-slate-400 shrink-0" />
                    )}
                    <span className={s.included ? "" : "text-slate-400 line-through"}>
                      {s.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Goals */}
          {feat.goals && feat.goals.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3">الأهداف المرتقبة</h4>
              <ul className="space-y-2">
                {feat.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={14} className="mt-1 text-blue-600 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outcomes */}
          {feat.outcomes && feat.outcomes.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3">النتائج المتوقعة</h4>
              <ul className="space-y-2">
                {feat.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={14} className="mt-1 text-violet-600 shrink-0" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions */}
          {feat.exclusions && feat.exclusions.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3">الاستثناءات</h4>
              <ul className="space-y-2">
                {feat.exclusions.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                    <XCircle size={14} className="mt-1 text-red-400 shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suitable For */}
          {feat.suitableFor && feat.suitableFor.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3">مناسب لـ</h4>
              <ul className="space-y-2">
                {feat.suitableFor.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={14} className="mt-1 text-amber-600 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SLA Agreement */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={22} className="text-blue-600" />
          اتفاقية مستوى الخدمة (SLA)
        </h2>
        <div
          className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: generateSlaText(pkg) }}
        />
      </div>
    </div>
  );
}
