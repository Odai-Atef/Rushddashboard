import { useEffect, useState } from 'react';
import {
 Building2,
 Calendar,
 ChevronLeft,
 Loader2,
} from 'lucide-react';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { OrganizationType } from '@/api/services/onboarding-service';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { toast } from 'sonner';

type OrgTypeOption = 'charity' | 'private_company';

interface RegistrationData {
 orgName: string;
 licenseNumber: string;
 registrationDate: string;
 orgType: OrgTypeOption | '';
 activity: string;
 fundingAreas: string[];
}

const TOAST_DURATION = 5000;

export function EntityInfoForm() {
 const { organization, refreshOrganization, fundingAreas, loadFundingAreas } = useOnboardingContext();

 const [registrationData, setRegistrationData] = useState<RegistrationData>({
 orgName: '',
 licenseNumber: '',
 registrationDate: '',
 orgType: '',
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

 if (registrationData.orgType === 'private_company') {
 if (!registrationData.activity.trim()) {
 nextErrors.activity = 'النشاط مطلوب';
 }
 } else if (registrationData.orgType === 'charity') {
 if (registrationData.fundingAreas.length === 0) {
 nextErrors.fundingAreas = 'مجالات المشاريع مطلوبة';
 }
 }

 setErrors(nextErrors);
 return Object.keys(nextErrors).length === 0;
 };

 const handleSave = async () => {
 if (!validate()) {
 toast.error('يرجى تصحيح الأخطاء في النموذج قبل الحفظ', { duration: TOAST_DURATION });
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
 toast.success('تم حفظ معلومات الجهه بنجاح', { duration: TOAST_DURATION });
 } catch (err: any) {
 toast.error(err?.message || 'فشل حفظ معلومات الجهه، يرجى المحاولة مرة أخرى', { duration: TOAST_DURATION });
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
 email: organization?.email || '',
 mobile: organization?.mobile || '',
 });

 const isCharitySelected = registrationData.orgType === 'charity';
 const isPrivateCompanySelected = registrationData.orgType === 'private_company';

 const getInputClassName = (field: keyof RegistrationData) =>
 `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent ${
 errors[field]
 ? 'border-red-500 focus:ring-red-500'
 : 'border-border'
 }`;

 const getIconInputClassName = (field: keyof RegistrationData) =>
 `w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent ${
 errors[field]
 ? 'border-red-500 focus:ring-red-500'
 : 'border-border'
 }`;

 if (!organization && isSaving) {
 return (
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-8 flex items-center justify-center">
 <Loader2 className="w-8 h-8 text-primary animate-spin" />
 </div>
 );
 }

 return (
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-8">
 <form className="space-y-6">
 {/* Organization Name */}
 <div>
 <label className="block text-sm font-medium mb-2">اسم الجهه *</label>
 <div className="relative">
 <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
 <input
 type="text"
 value={registrationData.orgName}
 onChange={(e) => handleFieldChange('orgName', e.target.value)}
 className={getIconInputClassName('orgName')}
 placeholder="مثال: جمعية البر الخيرية"
 />
 </div>
 {errors.orgName && (
 <p className="mt-1 text-sm text-[var(--destructive)]">{errors.orgName}</p>
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
 <p className="mt-1 text-sm text-[var(--destructive)]">{errors.licenseNumber}</p>
 )}
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">تاريخ التسجيل *</label>
 <div className="relative">
 <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
 <input
 type="date"
 value={registrationData.registrationDate}
 onChange={(e) => handleFieldChange('registrationDate', e.target.value)}
 className={getIconInputClassName('registrationDate')}
 />
 </div>
 {errors.registrationDate && (
 <p className="mt-1 text-sm text-[var(--destructive)]">{errors.registrationDate}</p>
 )}
 </div>
 </div>

 {/* Organization Type */}
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
 <p className="mt-1 text-sm text-[var(--destructive)]">{errors.orgType}</p>
 )}
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
 <p className="mt-1 text-sm text-[var(--destructive)]">{errors.activity}</p>
 )}
 </div>
 )}

 {/* Charity funding areas */}
 {isCharitySelected && (
 <div>
 <label className="block text-sm font-medium mb-2">مجالات المشاريع *</label>
 {fundingAreas.length === 0 && (
 <p className="text-sm text-muted-foreground mb-2">
 لا توجد مجالات مشاريع متاحة حالياً. يرجى المحاولة لاحقاً.
 </p>
 )}
 {fundingAreas.length > 0 && (
 <MultiSelect
 options={fundingAreas.map((area) => ({ value: area.id, label: area.name }))}
 selected={registrationData.fundingAreas}
 onChange={(next) => {
 setRegistrationData((prev) => ({ ...prev, fundingAreas: next }));
 if (errors.fundingAreas) {
 setErrors((prev) => ({ ...prev, fundingAreas: undefined }));
 }
 }}
 placeholder="اختر مجالات المشاريع"
 searchPlaceholder="ابحث في مجالات المشاريع..."
 emptyMessage="لا توجد نتائج مطابقة"
 error={!!errors.fundingAreas}
 className="min-h-[46px]"
 />
 )}
 {errors.fundingAreas && (
 <p className="mt-1 text-sm text-[var(--destructive)]">{errors.fundingAreas}</p>
 )}
 </div>
 )}

 {/* Action Buttons */}
 <div className="flex items-center justify-end pt-6 border-t">
 <button
 type="button"
 onClick={handleSave}
 disabled={isSaving}
 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isSaving ? (
 <>
 <Loader2 className="w-5 h-5 animate-spin" />
 جارٍ الحفظ...
 </>
 ) : (
 <>
 حفظ
 <ChevronLeft className="w-5 h-5" />
 </>
 )}
 </button>
 </div>
 </form>
 </div>
 );
}
