import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle2,
  Play,
  Clock,
  Loader2,
  AlertTriangle,
  Building,
  Shield,
  Brain,
  TrendingUp
} from 'lucide-react';
import { onboardingService, OrganizationResponse } from '@/api/services/onboarding-service';

// ISIV Dimensions Configuration
const isivDimensions = [
  { id: 'institutional_building', code: 'I', name: 'البناء المؤسسي', nameEn: 'Institutional Building', icon: Building },
  { id: 'governance', code: 'S', name: 'الحوكمة', nameEn: 'Governance', icon: Shield },
  { id: 'org_intelligence', code: 'I', name: 'الذكاء المؤسسي', nameEn: 'Organizational Intelligence', icon: Brain },
  { id: 'value_sustainability', code: 'V', name: 'القيمة والاستدامة', nameEn: 'Value & Sustainability', icon: TrendingUp },
];

export function CharityAssessmentStartPage() {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<OrganizationResponse | null>(null);
  const [assessmentStatus, setAssessmentStatus] = useState<{ status: string; overallScore: number | null; completedAt: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveOrganization = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const orgRes = await onboardingService.getMyOrganization();
      const org = orgRes.data;
      setOrganization(org);

      if (org?.id) {
        try {
          const statusRes = await onboardingService.getAssessmentStatus(org.id);
          const statusPayload = (statusRes?.data as any)?.data ?? statusRes?.data;
          if (statusPayload) {
            setAssessmentStatus(statusPayload);
          }
        } catch (statusErr) {
          // Assessment may not exist yet; ignore.
        }
      }
    } catch (err: any) {
      if (err?.statusCode === 404 || err?.response?.status === 404) {
        setError('لم يتم العثور على جهه مرتبطة بحسابك. يرجى إنشاء جهه أولاً.');
      } else {
        setError(err?.message || 'تعذر تحميل معلومات الجهه. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    resolveOrganization();
  }, [resolveOrganization]);

  const organizationId = organization?.id ?? null;
  const isAssessmentCompleted = assessmentStatus?.status === 'COMPLETED' || assessmentStatus?.status === 'completed';

  if (isLoading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-[var(--secondary)]/5 to-[var(--chart-3)]/5 dark:from-background dark:to-muted flex items-center justify-center p-[var(--spacing-card-padding)]">
        <div className="flex flex-col items-center gap-[var(--spacing-grid-gap)]">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--secondary)]" />
          <p className="text-muted-foreground">جاري تحميل بيانات الجهه...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-br from-[var(--secondary)]/5 to-[var(--chart-3)]/5 dark:from-background dark:to-muted flex items-center justify-center p-[var(--spacing-card-padding)]">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-[var(--destructive)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">تعذر تحميل الجهه</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-[var(--spacing-small-gap)] justify-center">
            <button
              onClick={() => navigate('/dashboard/onboarding/info?tab=info')}
              className="inline-flex items-center gap-[var(--spacing-small-gap)] px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
            >
              إنشاء جهه
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-[var(--secondary)]/5 to-[var(--chart-3)]/5 dark:from-background dark:to-muted flex items-center justify-center p-[var(--spacing-card-padding)]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">تقييم ISIV</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-2">
            تقييم جاهزية المنظمات الخيرية - نموذج ISIV
          </p>
          <p className="text-muted-foreground">
            4 أبعاد • 24 سؤال • 120 نقطة
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-[var(--spacing-card-padding)] sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">أبعاد التقييم</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-small-gap)] sm:gap-[var(--spacing-grid-gap)]">
            {isivDimensions.map((dim) => {
              const Icon = dim.icon;
              return (
                <div key={dim.id} className="flex items-center gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] bg-muted/50 rounded-lg">
                  <Icon className="w-5 h-5 text-[var(--secondary)]" />
                  <div>
                    <span className="font-medium">{dim.name}</span>
                    <p className="text-xs text-muted-foreground">{dim.nameEn} ({dim.code})</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-[var(--spacing-card-padding)] bg-muted/[0.08] rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>ISIV</strong> = <strong>I</strong>nstitutional Building + <strong>S</strong>ustainability + <strong>I</strong>ntelligence + <strong>V</strong>alue
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              كل بُعد يحتوي على 6 أسئلة، بحد أقصى 30 نقطة لكل بُعد (5 نقاط للسؤال)
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-[var(--spacing-card-padding)] sm:p-8 mb-6">
          <h3 className="font-semibold mb-4">ما الذي ستحصل عليه:</h3>
          <div className="space-y-[var(--spacing-small-gap)]">
            {[
              'تقييم شامل عبر 4 أبعاد استراتيجية (ISIV)',
              'درجة إجمالية من 120 نقطة مع حالة التأهيل',
              'تحليل الفجوات ونقاط القوة لكل بُعد',
              'خارطة طريق مخصصة للتحسين',
              'توصيات مدعومة بالذكاء الاصطناعي',
              'مقارنة مع معايير القطاع'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-[var(--spacing-small-gap)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-[var(--spacing-small-gap)] sm:gap-[var(--spacing-grid-gap)]">
          <button
            disabled={!organizationId}
            onClick={() =>
              organizationId &&
              navigate(`/dashboard/onboarding/assessment?organizationId=${organizationId}`)
            }
            className="flex-1 flex items-center justify-center gap-[var(--spacing-small-gap)] px-6 py-4 bg-gradient-to-r from-[var(--secondary)] to-[var(--chart-3)] text-[var(--primary-foreground)] rounded-xl hover:from-[var(--secondary)]/90 hover:to-[var(--chart-3)]/90 transition-all text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            بدء التقييم
          </button>
          <button
            disabled={!organizationId}
            onClick={() =>
              organizationId &&
              navigate(`/dashboard/charity-assessment/results/${organizationId}`)
            }
            className="px-6 py-4 border border-border rounded-xl hover:bg-muted transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            عرض نتائج سابقة
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Clock className="w-4 h-4 inline mr-1" />
          المدة المتوقعة: 15-20 دقيقة (6 أسئلة لكل بُعد)
        </p>
      </div>
    </div>
  );
}
