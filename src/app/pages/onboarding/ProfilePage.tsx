import { useEffect, useState } from 'react';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  Users,
} from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { toast } from 'sonner';

interface ProfileData {
  overview: string;
  areasOfWork: string[];
  targetBeneficiaries: string;
  geographicCoverage: string;
  employeeCount: string;
  volunteerCount: string;
  activeProjects: string;
}

export function ProfilePage() {
  const { goToStep } = useOnboardingNavigate();
  const { organization, profile, fundingAreas, loadFundingAreas, refreshOrganization } =
    useOnboardingContext();

  const [profileData, setProfileData] = useState<ProfileData>({
    overview: '',
    areasOfWork: [],
    targetBeneficiaries: '',
    geographicCoverage: '',
    employeeCount: '',
    volunteerCount: '',
    activeProjects: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  useEffect(() => {
    loadFundingAreas();
  }, [loadFundingAreas]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        overview: profile.overview || '',
        targetBeneficiaries: profile.targetBeneficiaries || '',
        geographicCoverage: profile.geographicCoverage
          ? profile.geographicCoverage.toLowerCase()
          : '',
        employeeCount: profile.employeeCount != null ? String(profile.employeeCount) : '',
        volunteerCount: profile.volunteerCount != null ? String(profile.volunteerCount) : '',
        activeProjects: profile.activeProjects != null ? String(profile.activeProjects) : '',
        areasOfWork: (profile.fundingAreas || []).map((fa) => fa.id).filter(Boolean),
      });
    } else if (organization?.profile) {
      const p = organization.profile;
      setProfileData({
        overview: p.overview || '',
        targetBeneficiaries: p.targetBeneficiaries || '',
        geographicCoverage: p.geographicCoverage
          ? p.geographicCoverage.toLowerCase()
          : '',
        employeeCount: p.employeeCount != null ? String(p.employeeCount) : '',
        volunteerCount: p.volunteerCount != null ? String(p.volunteerCount) : '',
        activeProjects: p.activeProjects != null ? String(p.activeProjects) : '',
        areasOfWork: (p.fundingAreas || []).map((fa) => fa.fundingAreaId).filter(Boolean),
      });
    }
  }, [profile, organization?.profile]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ProfileData, string>> = {};

    if (!profileData.overview.trim()) {
      nextErrors.overview = 'نبذة عن الجمعية مطلوبة';
    }

    if (profileData.areasOfWork.length === 0) {
      nextErrors.areasOfWork = 'مجالات العمل مطلوبة';
    }

    if (!profileData.targetBeneficiaries.trim()) {
      nextErrors.targetBeneficiaries = 'الفئات المستهدفة مطلوبة';
    }

    if (!profileData.geographicCoverage) {
      nextErrors.geographicCoverage = 'النطاق الجغرافي مطلوب';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearFieldError = (field: keyof ProfileData) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleProfileNext = async () => {
    if (!validate()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج قبل المتابعة');
      return;
    }

    const orgId = organization?.id;
    if (!orgId) {
      toast.error('لم يتم العثور على معرف الجمعية. يرجى إكمال التسجيل أولاً.');
      return;
    }

    const { onboardingService } = await import('@/api/services');
    setIsSaving(true);
    try {
      await onboardingService.createProfile(orgId, {
        overview: profileData.overview.trim(),
        targetBeneficiaries: profileData.targetBeneficiaries.trim(),
        geographicCoverage: profileData.geographicCoverage.toUpperCase() as any,
        employeeCount: profileData.employeeCount
          ? parseInt(profileData.employeeCount, 10)
          : undefined,
        volunteerCount: profileData.volunteerCount
          ? parseInt(profileData.volunteerCount, 10)
          : undefined,
        activeProjects: profileData.activeProjects
          ? parseInt(profileData.activeProjects, 10)
          : undefined,
        areasOfWork: profileData.areasOfWork,
      });
      await onboardingService.setFundingAreas(orgId, {
        fundingAreaIds: profileData.areasOfWork,
      });
      await refreshOrganization();
      goToStep('assessment');
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ الملف التعريفي');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {isSaving && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">الخطوة ٢ من ٤</span>
            <span className="text-sm font-medium text-blue-600">٥٠٪</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">الملف التعريفي للجمعية</h1>
            <p className="text-gray-600">معلومات تفصيلية عن نشاط الجمعية وبرامجها</p>
          </div>

          <form className="space-y-6">
            {/* Organization Overview */}
            <div>
              <label className="block text-sm font-medium mb-2">نبذة عن الجمعية *</label>
              <textarea
                value={profileData.overview}
                onChange={(e) => {
                  setProfileData((prev) => ({ ...prev, overview: e.target.value }));
                  clearFieldError('overview');
                }}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.overview
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="اكتب نبذة مختصرة عن رؤية ورسالة وأهداف الجمعية..."
              />
              {errors.overview ? (
                <p className="mt-1 text-sm text-red-600">{errors.overview}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">٢٠٠ - ٥٠٠ كلمة</p>
              )}
            </div>

            {/* Areas of Work */}
            <div>
              <label className="block text-sm font-medium mb-2">مجالات العمل *</label>
              {fundingAreas.length === 0 && (
                <p className="text-sm text-gray-500 mb-2">
                  لا توجد مجالات عمل متاحة حالياً. يرجى المحاولة لاحقاً.
                </p>
              )}
              <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-2 rounded-lg border ${errors.areasOfWork ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                {fundingAreas.map((area) => (
                  <label
                    key={area.id}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={profileData.areasOfWork.includes(area.id)}
                      onChange={(e) => {
                        setProfileData((prev) => {
                          const nextAreas = e.target.checked
                            ? [...prev.areasOfWork, area.id]
                            : prev.areasOfWork.filter((a) => a !== area.id);
                          return { ...prev, areasOfWork: nextAreas };
                        });
                        clearFieldError('areasOfWork');
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{area.name}</span>
                  </label>
                ))}
              </div>
              {errors.areasOfWork && (
                <p className="mt-1 text-sm text-red-600">{errors.areasOfWork}</p>
              )}
            </div>

            {/* Target Beneficiaries */}
            <div>
              <label className="block text-sm font-medium mb-2">الفئات المستهدفة *</label>
              <input
                type="text"
                value={profileData.targetBeneficiaries}
                onChange={(e) => {
                  setProfileData((prev) => ({ ...prev, targetBeneficiaries: e.target.value }));
                  clearFieldError('targetBeneficiaries');
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.targetBeneficiaries
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="مثال: الأسر المحتاجة، الأيتام، كبار السن"
              />
              {errors.targetBeneficiaries && (
                <p className="mt-1 text-sm text-red-600">{errors.targetBeneficiaries}</p>
              )}
            </div>

            {/* Geographic Coverage */}
            <div>
              <label className="block text-sm font-medium mb-2">النطاق الجغرافي *</label>
              <select
                value={profileData.geographicCoverage}
                onChange={(e) => {
                  setProfileData((prev) => ({ ...prev, geographicCoverage: e.target.value }));
                  clearFieldError('geographicCoverage');
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.geographicCoverage
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option value="">اختر النطاق الجغرافي</option>
                <option value="local">محلي (مدينة واحدة)</option>
                <option value="regional">إقليمي (منطقة واحدة)</option>
                <option value="national">وطني (على مستوى المملكة)</option>
                <option value="international">دولي</option>
              </select>
              {errors.geographicCoverage && (
                <p className="mt-1 text-sm text-red-600">{errors.geographicCoverage}</p>
              )}
            </div>

            {/* Team Statistics */}
            <div>
              <label className="block text-sm font-medium mb-4">حجم الفريق والمتطوعين</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">عدد الموظفين</label>
                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={profileData.employeeCount}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, employeeCount: e.target.value }))
                      }
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">عدد المتطوعين</label>
                  <div className="relative">
                    <Heart className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={profileData.volunteerCount}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, volunteerCount: e.target.value }))
                      }
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">المشاريع النشطة</label>
                  <div className="relative">
                    <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={profileData.activeProjects}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, activeProjects: e.target.value }))
                      }
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => goToStep('registration')}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                رجوع
              </button>
              <button
                type="button"
                onClick={handleProfileNext}
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جارٍ الحفظ...
                  </>
                ) : (
                  <>
                    التالي
                    <ChevronLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
