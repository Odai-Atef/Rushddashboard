/**
 * Dashboard Pricing Page
 *
 * Allows logged-in users to view packages and subscribe from within the app.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Check, Shield, Star, Zap, Loader2, AlertTriangle } from "lucide-react";
import { subscriptionService } from "@/api/services/subscription-service";

interface PackageItem {
  id: string;
  name: string;
  description?: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: string;
  projectLimit: number;
  features: string[];
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
  if (Array.isArray(features)) {
    return features.filter((f): f is string => typeof f === 'string');
  }
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) {
        return parsed.filter((f: unknown): f is string => typeof f === 'string');
      }
    } catch {
      // Not JSON — treat as a single feature string
      return features.trim() ? [features] : [];
    }
  }
  return [];
}

export function PricingPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  useEffect(() => {
    subscriptionService
      .getPackages()
      .then((res) => {
        // API returns { success: true, data: [packages] } inside ApiResponse wrapper
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

  const handleSubscribe = async (pkg: PackageItem) => {
    setSubscribingId(pkg.id);
    try {
      // 1. Create subscription
      const subRes = await subscriptionService.createSubscription({ packageId: pkg.id });
      // Unwrap double-wrapped backend response: ApiResponse<{ success: true, data: Subscription }>
      const subRaw = subRes.data as unknown as { success: boolean; data: { id: string } };
      if (!subRes.success || !subRaw?.data?.id) {
        setError(subRes.message || "فشل في إنشاء الاشتراك");
        setSubscribingId(null);
        return;
      }

      const subscriptionId = subRaw.data.id;
      const returnUrl = `${window.location.origin}/payment/callback`;

      // 2. Initiate payment
      const payRes = await subscriptionService.initiatePayment({ subscriptionId, returnUrl });
      // Unwrap double-wrapped backend response: ApiResponse<{ success: true, data: PaymentInitiation }>
      const payRaw = payRes.data as unknown as { success: boolean; data: { checkoutUrl: string } };
      if (!payRes.success || !payRaw?.data?.checkoutUrl) {
        setError(payRes.message || "فشل في إنشاء فاتورة الدفع");
        setSubscribingId(null);
        return;
      }

      // 3. Redirect to Moyasar
      window.location.href = payRaw.data.checkoutUrl;
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
                  {pkg.priceAnnual.toLocaleString("ar-SA")}
                </span>
                <span className="text-base text-slate-500 mr-2">ريال/سنة</span>
                <p className="text-sm text-slate-400 mt-1">{pkg.projectLimit} مشاريع</p>
              </div>

              <button
                onClick={() => handleSubscribe(pkg)}
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

              <div className="space-y-3">
                {normalizeFeatures(pkg.features).slice(0, 5).map((feature, i) => (
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
