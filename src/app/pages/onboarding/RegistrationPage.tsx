import { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { OrganizationType } from '@/api/services/onboarding-service';
import { toast } from 'sonner';

interface RegistrationData {
  orgName: string;
  licenseNumber: string;
  registrationDate: string;
  orgType: string;
  city: string;
  website: string;
  contactPerson: string;
  email: string;
  mobile: string;
}

export function RegistrationPage() {
  const { goToStep } = useOnboardingNavigate();
  const { organization, refreshOrganization } = useOnboardingContext();

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    orgName: '',
    licenseNumber: '',
    registrationDate: '',
    orgType: '',
    city: '',
    website: '',
    contactPerson: '',
    email: '',
    mobile: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});

  useEffect(() => {
    if (organization) {
      setRegistrationData({
        orgName: organization.name || '',
        licenseNumber: organization.licenseNumber || '',
        registrationDate: organization.registrationDate
          ? organization.registrationDate.slice(0, 10)
          : '',
        orgType: organization.type ? organization.type.toLowerCase() : '',
        city: organization.city || '',
        website: organization.website || '',
        contactPerson: organization.contactPerson || '',
        email: organization.email || '',
        mobile: organization.mobile || '',
      });
    }
  }, [organization]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (!registrationData.orgName.trim()) {
      nextErrors.orgName = 'اسم الجمعية مطلوب';
    }

    if (!registrationData.licenseNumber.trim()) {
      nextErrors.licenseNumber = 'رقم الترخيص مطلوب';
    }

    if (!registrationData.registrationDate) {
      nextErrors.registrationDate = 'تاريخ التسجيل مطلوب';
    }

    if (!registrationData.orgType) {
      nextErrors.orgType = 'نوع الجمعية مطلوب';
    }

    if (!registrationData.city.trim()) {
      nextErrors.city = 'المدينة / المنطقة مطلوبة';
    }

    if (!registrationData.contactPerson.trim()) {
      nextErrors.contactPerson = 'اسم الشخص المسؤول مطلوب';
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
      await onboardingService.saveMyOrganization(buildOrganizationDto());
      await refreshOrganization();
      goToStep('profile');
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ بيانات الجمعية');
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

  const handleFieldChange = (field: keyof RegistrationData, value: string) => {
    setRegistrationData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const buildOrganizationDto = () => ({
    name: registrationData.orgName.trim(),
    licenseNumber: registrationData.licenseNumber.trim(),
    registrationDate: registrationData.registrationDate,
    type: registrationData.orgType.toUpperCase() as OrganizationType,
    city: registrationData.city.trim(),
    website: registrationData.website.trim() || undefined,
    contactPerson: registrationData.contactPerson.trim(),
    email: registrationData.email.trim(),
    mobile: registrationData.mobile.trim(),
  });

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
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">الخطوة ١ من ٤</span>
            <span className="text-sm font-medium text-blue-600">٢٥٪</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6 text-center">
            <img
              src="/logo.png"
              alt="منصة رشد"
              className="h-14 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold mb-2">معلومات الجمعية الخيرية</h1>
            <p className="text-gray-600">يرجى تعبئة البيانات الأساسية للجمعية</p>
          </div>

          <form className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium mb-2">اسم الجمعية *</label>
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
                <label className="block text-sm font-medium mb-2">نوع الجمعية *</label>
                <select
                  value={registrationData.orgType}
                  onChange={(e) => handleFieldChange('orgType', e.target.value)}
                  className={getInputClassName('orgType')}
                >
                  <option value="">اختر نوع الجمعية</option>
                  <option value="charity">جمعية خيرية</option>
                  <option value="foundation">جمعية خيرية</option>
                  <option value="ngo">منظمة غير ربحية</option>
                  <option value="coop">جمعية تعاونية</option>
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

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-2">الموقع الإلكتروني</label>
              <div className="relative">
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={registrationData.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className={getIconInputClassName('website')}
                  placeholder="https://example.org"
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium mb-2">اسم الشخص المسؤول *</label>
              <input
                type="text"
                value={registrationData.contactPerson}
                onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                className={getInputClassName('contactPerson')}
                placeholder="أحمد محمد"
              />
              {errors.contactPerson && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
              )}
            </div>

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
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => goToStep('landing')}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                رجوع
              </button>
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
