import { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { OrganizationType } from '@/api/services/onboarding-service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

type OrgTypeOption = 'charity' | 'private_company';

interface RegistrationData {
  orgName: string;
  licenseNumber: string;
  registrationDate: string;
  orgType: OrgTypeOption | '';
  city: string;
  email: string;
  mobile: string;
  activity: string;
  fundingAreas: string[];
}

export function RegistrationPage() {
  const { goToStep } = useOnboardingNavigate();
  const navigate = useNavigate();
  const { organization, refreshOrganization, fundingAreas, loadFundingAreas } = useOnboardingContext();

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    orgName: '',
    licenseNumber: '',
    registrationDate: '',
    orgType: '',
    city: '',
    email: '',
    mobile: '',
    activity: '',
    fundingAreas: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});

  useEffect(() => {
    loadFundingAreas();
  }, [loadFundingAreas]);

  useEffect(() => {
    if (organization) {
      const profile = organization.profile;
      setRegistrationData({
        orgName: organization.name || '',
        licenseNumber: organization.licenseNumber || '',
        registrationDate: organization.registrationDate
          ? organization.registrationDate.slice(0, 10)
          : '',
        orgType: mapOrganizationTypeToOption(organization.type),
        city: organization.city || '',
        email: organization.email || '',
        mobile: organization.mobile || '',
        activity: profile?.overview || '',
        fundingAreas: (profile?.fundingAreas || []).map((fa) => fa.fundingAreaId).filter(Boolean),
      });
    }
  }, [organization]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (!registrationData.orgName.trim()) {
      nextErrors.orgName = 'اسم الجهه مطلوب';
    }

    if (!registrationData.licenseNumber.trim()) {
      nextErrors.licenseNumber = 'رقم الترخيص مطلوب';
    }

    if (!registrationData.registrationDate) {
      nextErrors.registrationDate = 'تاريخ التسجيل مطلوب';
    }

    if (!registrationData.orgType) {
      nextErrors.orgType = 'نوع الجهه مطلوب';
    }

    if (!registrationData.city.trim()) {
      nextErrors.city = 'المدينة / المنطقة مطلوبة';
    }

    if (registrationData.orgType === 'private_company') {
      if (!registrationData.activity.trim()) {
        nextErrors.activity = 'النشاط مطلوب';
      }
    } else if (registrationData.orgType === 'charity') {
      if (registrationData.fundingAreas.length === 0) {
        nextErrors.fundingAreas = 'مجالات العمل مطلوبة';
      }
    }

    const email = registrationData.email.trim();
    if (!email) {
      nextErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    const mobile = registrationData.mobile.trim();
    if (!mobile) {
      nextErrors.mobile = 'رقم الجوال مطلوب';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveAndProceed = async () => {
    if (!validate()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج قبل المتابعة');
      return;
    }

    const { onboardingService } = await import('@/api/services');
    setIsSaving(true);
    try {
      const org = await onboardingService.saveMyOrganization(buildOrganizationDto());
      const orgId = org?.data?.org?.id || organization?.id;
      if (orgId) {
        const isPrivate = registrationData.orgType === 'private_company';
        await onboardingService.createProfile(orgId, {
          overview: isPrivate ? registrationData.activity.trim() : '',
          targetBeneficiaries: '',
          geographicCoverage: undefined,
          employeeCount: undefined,
          volunteerCount: undefined,
          activeProjects: undefined,
          areasOfWork: isPrivate ? [] : registrationData.fundingAreas,
        });
        if (!isPrivate && registrationData.fundingAreas.length > 0) {
          await onboardingService.setFundingAreas(orgId, {
            fundingAreaIds: registrationData.fundingAreas,
          });
        }
      }
      await refreshOrganization();
      navigate('/dashboard/charity-assessment', { replace: true });
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ بيانات الجهه');
    } finally {
      setIsSaving(false);
    }
  };

  const clearFieldError = (field: keyof RegistrationData) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleFieldChange = (field: keyof RegistrationData, value: string | string[]) => {
    setRegistrationData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const toggleFundingArea = (areaId: string) => {
    setRegistrationData((prev) => {
      const nextAreas = prev.fundingAreas.includes(areaId)
        ? prev.fundingAreas.filter((a) => a !== areaId)
        : [...prev.fundingAreas, areaId];
      return { ...prev, fundingAreas: nextAreas };
    });
    clearFieldError('fundingAreas');
  };

  const mapOrgTypeOptionToApiType = (option: OrgTypeOption): OrganizationType => {
    return option === 'private_company' ? 'COOP' : 'CHARITY';
  };

  const mapOrganizationTypeToOption = (type: string): OrgTypeOption | '' => {
    if (!type) return '';
    const normalized = type.toUpperCase();
    if (normalized === 'COOP') return 'private_company';
    return 'charity';
  };

  const buildOrganizationDto = () => ({
    name: registrationData.orgName.trim(),
    licenseNumber: registrationData.licenseNumber.trim(),
    registrationDate: registrationData.registrationDate,
    type: mapOrgTypeOptionToApiType(registrationData.orgType),
    city: registrationData.city.trim(),
    email: registrationData.email.trim(),
    mobile: registrationData.mobile.trim(),
  });

  const isCharitySelected = registrationData.orgType === 'charity';
  const isPrivateCompanySelected = registrationData.orgType === 'private_company';

  const getInputClassName = (field: keyof RegistrationData) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300'
    }`;

  const getIconInputClassName = (field: keyof RegistrationData) =>
    `w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300'
    }`;

  if (!organization && isSaving) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6 text-center">
                <img
                  src="/logo.png"
                  alt="منصة رشد"
                  className="h-14 w-auto mx-auto mb-4"
                />
                <h1 className="text-3xl font-bold mb-2">معلومات الجهه</h1>
                <p className="text-gray-600">يرجى تعبئة البيانات الأساسية للجهه</p>
              </div>

              <form className="space-y-6">
                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الجهه *</label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registrationData.orgName}
                      onChange={(e) => handleFieldChange('orgName', e.target.value)}
                      className={getIconInputClassName('orgName')}
                      placeholder="مثال: جمعية البر الخيرية"
                    />
                  </div>
                  {errors.orgName && (
                    <p className="mt-1 text-sm text-red-600">{errors.orgName}</p>
                  )}
                </div>

                {/* License Number & Registration Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الترخيص *</label>
                    <input
                      type="text"
                      value={registrationData.licenseNumber}
                      onChange={(e) => handleFieldChange('licenseNumber', e.target.value)}
                      className={getInputClassName('licenseNumber')}
                      placeholder="١٢٣٤٥٦"
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">تاريخ التسجيل *</label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={registrationData.registrationDate}
                        onChange={(e) => handleFieldChange('registrationDate', e.target.value)}
                        className={getIconInputClassName('registrationDate')}
                      />
                    </div>
                    {errors.registrationDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.registrationDate}</p>
                    )}
                  </div>
                </div>

                {/* Organization Type & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع الجهه *</label>
                    <select
                      value={registrationData.orgType}
                      onChange={(e) => handleFieldChange('orgType', e.target.value as OrgTypeOption | '')}
                      className={getInputClassName('orgType')}
                    >
                      <option value="">اختر نوع الجهه</option>
                      <option value="charity">جمعية خيرية</option>
                      <option value="private_company">شركة أهلية</option>
                    </select>
                    {errors.orgType && (
                      <p className="mt-1 text-sm text-red-600">{errors.orgType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المدينة / المنطقة *</label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={registrationData.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        className={getIconInputClassName('city')}
                        placeholder="الرياض"
                      />
                    </div>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                </div>

                {/* Private company activity */}
                {isPrivateCompanySelected && (
                  <div>
                    <label className="block text-sm font-medium mb-2">النشاط *</label>
                    <input
                      type="text"
                      value={registrationData.activity}
                      onChange={(e) => handleFieldChange('activity', e.target.value)}
                      className={getInputClassName('activity')}
                      placeholder="مثال: تجارة عامة، مقاولات، خدمات استشارية"
                    />
                    {errors.activity && (
                      <p className="mt-1 text-sm text-red-600">{errors.activity}</p>
                    )}
                  </div>
                )}

                {/* Charity funding areas */}
                {isCharitySelected && (
                  <div>
                    <label className="block text-sm font-medium mb-2">مجالات العمل *</label>
                    {fundingAreas.length === 0 && (
                      <p className="text-sm text-gray-500 mb-2">
                        لا توجد مجالات عمل متاحة حالياً. يرجى المحاولة لاحقاً.
                      </p>
                    )}
                    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-2 rounded-lg border ${errors.fundingAreas ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                      {fundingAreas.map((area) => (
                        <label
                          key={area.id}
                          className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white"
                        >
                          <input
                            type="checkbox"
                            checked={registrationData.fundingAreas.includes(area.id)}
                            onChange={() => toggleFundingArea(area.id)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm">{area.name}</span>
                        </label>
                      ))}
                    </div>
                    {errors.fundingAreas && (
                      <p className="mt-1 text-sm text-red-600">{errors.fundingAreas}</p>
                    )}
                  </div>
                )}

                {/* Email & Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={getIconInputClassName('email')}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الجوال *</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={registrationData.mobile}
                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                    className={getIconInputClassName('mobile')}
                    placeholder="+966 5X XXX XXXX"
                    dir="ltr"
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveAndProceed}
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
                    تسجيل وبدء التقييم
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
