/**
 * OrganizationInformationDisplay
 *
 * Reusable read-only display for the automated LLM-extracted organization
 * information. Used by the review page and the project-manager modal.
 */

import {
 Building2,
 FileText,
 MapPin,
 Calendar,
 Users,
 CheckCircle,
 XCircle,
 Clock,
 Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { OrganizationInformation } from '@/api/services/user-service';

export function formatDate(dateString: string | null | undefined): string {
 if (!dateString) return '-';
 try {
 return new Date(dateString).toLocaleDateString('ar-SA');
 } catch {
 return dateString;
 }
}

export function formatList(items: string[] | null | undefined): string {
 if (!items || items.length === 0) return '-';
 return items.join(' • ');
}

export function getExtractionStatusMeta(status: string) {
 switch (status) {
 case 'COMPLETED':
 return {
 label: 'مكتمل',
 icon: CheckCircle,
 className: 'bg-[var(--primary)]/[0.1] text-[var(--primary)] border-green-200',
 };
 case 'PROCESSING':
 return {
 label: 'قيد المعالجة',
 icon: Loader2,
 className: 'bg-muted/[0.1] text-[var(--secondary)] border-[var(--secondary)]/[0.3]',
 };
 case 'FAILED':
 return {
 label: 'فشل الاستخراج',
 icon: XCircle,
 className: 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)] border-[var(--destructive)]/[0.3]',
 };
 case 'PENDING':
 default:
 return {
 label: 'معلق',
 icon: Clock,
 className: 'bg-muted text-foreground border-border',
 };
 }
}

interface ReadOnlyFieldProps {
 label: string;
 value: string | null | undefined;
 icon?: React.ElementType;
}

export function ReadOnlyField({ label, value, icon: Icon }: ReadOnlyFieldProps) {
 return (
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)].5 text-xs text-muted-foreground">
 {Icon && <Icon className="w-3.5 h-3.5" />}
 <span>{label}</span>
 </div>
 <div className="text-sm font-medium text-foreground break-words">
 {value && value.trim() ? value : '-'}
 </div>
 </div>
 );
}

interface ReadOnlyListFieldProps {
 label: string;
 items: string[] | null | undefined;
 icon?: React.ElementType;
}

export function ReadOnlyListField({ label, items, icon: Icon }: ReadOnlyListFieldProps) {
 const hasItems = items && items.length > 0;
 return (
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)].5 text-xs text-muted-foreground">
 {Icon && <Icon className="w-3.5 h-3.5" />}
 <span>{label}</span>
 </div>
 <div className="text-sm font-medium text-foreground">
 {hasItems ? (
 <ul className="list-disc list-inside space-y-0.5">
 {items.map((item, idx) => (
 <li key={idx}>{item}</li>
 ))}
 </ul>
 ) : (
 '-'
 )}
 </div>
 </div>
 );
}

interface SectionCardProps {
 title: string;
 icon?: React.ElementType;
 children: React.ReactNode;
}

export function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
 return (
 <Card>
 <CardHeader className="pb-3">
 <CardTitle className="text-base font-semibold flex items-center gap-[var(--spacing-small-gap)] text-foreground">
 {Icon && <Icon className="w-5 h-5 text-[var(--secondary)]" />}
 {title}
 </CardTitle>
 </CardHeader>
 <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {children}
 </CardContent>
 </Card>
 );
}

interface OrganizationInformationDisplayProps {
 data: OrganizationInformation;
}

export function OrganizationInformationDisplay({ data }: OrganizationInformationDisplayProps) {
 const statusMeta = getExtractionStatusMeta(data.extractionStatus);

 return (
 <div className="space-y-6" dir="rtl">
 {data.extractionError && (
 <div className="p-4 bg-[var(--destructive)]/[0.08] border border-[var(--destructive)]/[0.3] rounded-xl flex items-start gap-[var(--spacing-small-gap)]">
 <XCircle className="w-5 h-5 text-[var(--destructive)] shrink-0 mt-0.5" />
 <div>
 <h3 className="font-semibold text-[var(--destructive)] text-sm">خطأ أثناء الاستخراج</h3>
 <p className="text-sm text-[var(--destructive)] mt-0.5">{data.extractionError}</p>
 </div>
 </div>
 )}

 <SectionCard title="المعلومات الأساسية" icon={Building2}>
 <ReadOnlyField label="اسم المنظمة" value={data.organizationName} icon={Building2} />
 <ReadOnlyField label="رقم الترخيص" value={data.licenseNumber} icon={FileText} />
 <ReadOnlyField label="نوع المنظمة" value={data.organizationType} />
 <ReadOnlyField label="الرقم الموحد (700)" value={data.unifiedNumber700} />
 <ReadOnlyField label="المنطقة" value={data.region} icon={MapPin} />
 <ReadOnlyField label="المدينة" value={data.city} icon={MapPin} />
 <ReadOnlyField label="تاريخ التسجيل" value={formatDate(data.registrationDate)} icon={Calendar} />
 <ReadOnlyField label="تاريخ انتهاء الترخيص" value={formatDate(data.licenseExpiryDate)} icon={Calendar} />
 </SectionCard>

 <SectionCard title="التصنيف والأنشطة" icon={FileText}>
 <ReadOnlyField label="التصنيف الرئيسي" value={data.mainClassification} />
 <ReadOnlyField label="التصنيف الفرعي 1" value={data.subClassification1} />
 <ReadOnlyField label="التصنيف الفرعي 2" value={data.subClassification2} />
 <ReadOnlyListField label="الأنشطة المعتمدة" items={data.approvedActivities} icon={CheckCircle} />
 <ReadOnlyListField label="الفئات المستهدفة" items={data.targetGroups} icon={Users} />
 <ReadOnlyField label="الجهة الإشرافية" value={data.supervisingAuthority} />
 <ReadOnlyListField label="أهداف المنظمة" items={data.organizationObjectives} icon={FileText} />
 </SectionCard>

 <SectionCard title="مجلس الإدارة" icon={Users}>
 <ReadOnlyField label="رئيس مجلس الإدارة" value={data.chairmanName} icon={Users} />
 <ReadOnlyField label="رقم هوية الرئيس" value={data.chairmanNationalId} />
 <ReadOnlyField label="نائب رئيس مجلس الإدارة" value={data.viceChairmanName} icon={Users} />
 <ReadOnlyField label="رقم هوية النائب" value={data.viceChairmanNationalId} />
 <ReadOnlyField label="تاريخ تعيين المجلس" value={formatDate(data.boardAppointmentDate)} icon={Calendar} />
 <ReadOnlyField label="تاريخ نهاية المجلس" value={formatDate(data.boardEndDate)} icon={Calendar} />
 </SectionCard>

 <SectionCard title="بيانات الاستخراج" icon={Clock}>
 <ReadOnlyField label="حالة الاستخراج" value={statusMeta.label} />
 <ReadOnlyField label="تاريخ آخر استخراج" value={formatDate(data.extractedAt)} />
 <ReadOnlyField label="تاريخ الإنشاء" value={formatDate(data.createdAt)} />
 <ReadOnlyField label="تاريخ التحديث" value={formatDate(data.updatedAt)} />
 </SectionCard>
 </div>
 );
}
