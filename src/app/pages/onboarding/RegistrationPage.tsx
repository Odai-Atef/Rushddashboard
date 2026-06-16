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

  const handleFieldChange = (field: keyof RegistrationData, value: string) => {
    setRegistrationData((prev) => ({ ...prev, [field]: value }));
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

  const handleSaveAndProceed = async () => {
    const { onboardingService } = await import('@/api/services');
    setIsSaving(true);
    try {
      await onboardingService.saveMyOrganization(buildOrganizationDto());
      await refreshOrganization();
      goToStep('profile');
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ بيانات المؤسسة');
    } finally {
      setIsSaving(false);
    }
  };

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">معلومات المؤسسة الخيرية</h1>
            <p className="text-gray-600">يرجى تعبئة البيانات الأساسية للمؤسسة</p>
          </div>

          <form className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium mb-2">اسم المؤسسة *</label>
              <div className="relative">
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registrationData.orgName}
                  onChange={(e) => handleFieldChange('orgName', e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: جمعية البر الخيرية"
                />
              </div>
            </div>

            {/* License Number & Registration Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">رقم الترخيص *</label>
                <input
                  type="text"
                  value={registrationData.licenseNumber}
                  onChange={(e) => handleFieldChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="١٢٣٤٥٦"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ التسجيل *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={registrationData.registrationDate}
                    onChange={(e) => handleFieldChange('registrationDate', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Organization Type & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نوع المؤسسة *</label>
                <select
                  value={registrationData.orgType}
                  onChange={(e) => handleFieldChange('orgType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر نوع المؤسسة</option>
                  <option value="charity">جمعية خيرية</option>
                  <option value="foundation">مؤسسة خيرية</option>
                  <option value="ngo">منظمة غير ربحية</option>
                  <option value="coop">جمعية تعاونية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المدينة / المنطقة *</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registrationData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="الرياض"
                  />
                </div>
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
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.org"
                />
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium mb-2">اسم الشخص المسؤول *</label>
              <input
                type="text"
                value={registrationData.contactPerson}
                onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أحمد محمد"
              />
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
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الجوال *</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={registrationData.mobile}
                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+966 5X XXX XXXX"
                    dir="ltr"
                  />
                </div>
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
