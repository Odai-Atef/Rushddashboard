/**
 * Public Packages Page
 *
 * Marketing page showing subscription packages.
 * Fetches data from API, no auth required.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Check, Shield, Star, Zap, Loader2, AlertTriangle } from "lucide-react";
import { subscriptionService } from "@/api/services/subscription-service";

interface PackageService {
  name: string;
  included: boolean;
}

interface ParsedFeatures {
  benefits?: string[];
  services?: PackageService[];
}

interface SlaData {
  level: string;
  levelNum: number;
  responseTime: string;
  resolutionTime: string;
  uptime: string;
  supportHours: string;
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

function normalizeFeatures(features: unknown): string[] {
  let parsed: ParsedFeatures = {};
  if (typeof features === "string") {
    try {
      parsed = JSON.parse(features);
    } catch {
      return [];
    }
  } else if (typeof features === "object" && features !== null) {
    parsed = features as ParsedFeatures;
  }
  const benefits = (parsed.benefits ?? []).filter((b) => typeof b === "string");
  const services = (parsed.services ?? [])
    .filter((s) => s.included)
    .map((s) => s.name)
    .filter((n) => typeof n === "string");
  return [...benefits, ...services];
}

export function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12" dir="rtl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">باقات رشد</h1>
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
          const featuresList = normalizeFeatures(pkg.features);

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-7 border relative transition-all hover:shadow-lg flex flex-col"
              style={{
                borderColor: isRecommended ? accent : "#E2E8F0",
                boxShadow: isRecommended
                  ? `0 16px 48px ${accent}20`
                  : "0 4px 12px rgba(0,0,0,0.05)",
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
                style={{
                  background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                }}
              >
                <Icon size={24} color="#fff" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{pkg.name}</h3>
              <p className="text-sm text-slate-500 mb-5">{pkg.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold" style={{ color: accent }}>
                  {pkg.priceAnnual.toLocaleString("ar-SA")}
                </span>
                <span className="text-base text-slate-500 mr-2">ريال/سنة</span>
                <p className="text-sm text-slate-400 mt-1">{pkg.projectLimit} مشاريع</p>
              </div>

              {/* SLA Badge */}
              <div
                className="flex items-center gap-2 mb-4 p-3 rounded-xl cursor-pointer hover:bg-opacity-100 transition-colors"
                style={{ background: `${accent}08` }}
              >
                <Shield size={16} color={accent} />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">
                    اتفاقية مستوى الخدمة
                  </div>
                  <div className="text-xs text-slate-500">
                    {pkg.sla || "مستوى أساسي"}
                  </div>
                </div>
              </div>

              <Link
                to={`/sla/${pkg.id}`}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base mb-6 text-center transition-opacity hover:opacity-90 block"
                style={{ background: accent }}
              >
                عرض تفاصيل الباقة والـ SLA
              </Link>

              <div className="space-y-3 pr-1 flex-1">
                {featuresList.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: `${accent}15` }}
                    >
                      <Check size={12} color={accent} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm text-slate-600">{feature}</span>
                  </div>
                ))}
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
    </div>
  );
}
