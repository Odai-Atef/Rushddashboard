import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Loader2,
  AlertTriangle,
  ArrowRight,
  Building2,
  FileText,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOrganizationInformation } from '@/api/hooks/useOrganizationInformation';
import { userService, OrganizationInformation } from '@/api/services/user-service';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('ar-SA');
  } catch {
    return dateString;
  }
}

function formatList(items: string[] | null | undefined): string {
  if (!items || items.length === 0) return '-';
  return items.join(' • ');
}

function getExtractionStatusMeta(status: string) {
  switch (status) {
    case 'COMPLETED':
      return {
        label: 'مكتمل',
        icon: CheckCircle,
        variant: 'default' as const,
        className: 'bg-green-100 text-green-700 border-green-200',
      };
    case 'PROCESSING':
      return {
        label: 'قيد المعالجة',
        icon: Loader2,
        variant: 'secondary' as const,
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      };
    case 'FAILED':
      return {
        label: 'فشل الاستخراج',
        icon: XCircle,
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-700 border-red-200',
      };
    case 'PENDING':
    default:
      return {
        label: 'معلق',
        icon: Clock,
        variant: 'outline' as const,
        className: 'bg-gray-100 text-gray-700 border-gray-200',
      };
  }
}

interface ReadOnlyFieldProps {
  label: string;
  value: string | null | undefined;
  icon?: React.ElementType;
}

function ReadOnlyField({ label, value, icon: Icon }: ReadOnlyFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900 break-words">
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

function ReadOnlyListField({ label, items, icon: Icon }: ReadOnlyListFieldProps) {
  const hasItems = items && items.length > 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900">
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

function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </CardContent>
    </Card>
  );
}

export function OrganizationInformationPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useOrganizationInformation(organizationId);

  const handleReExtract = async () => {
    if (!organizationId) return;
    try {
      // Backend re-extraction is triggered by uploading any official document. We
      // do not have a dedicated re-extract endpoint yet, so inform the user.
      toast.info('يمكنك إعادة تشغيل الاستخراج برفع مستند رسمي جديد أو تحديث مستند موجود.');
    } catch {
      // no-op
    }
  };

  const statusMeta = useMemo(() => {
    if (!data) {
      return getExtractionStatusMeta('PENDING');
    }
    return getExtractionStatusMeta(data.extractionStatus);
  }, [data]);

  const StatusIcon = statusMeta.icon;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">جاري تحميل بيانات المنظمة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4" dir="rtl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/manage/org')}>
            <ArrowRight className="w-4 h-4 ml-1" />
            العودة لإدارة الجهات
          </Button>
        </div>
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center text-center gap-3">
          <AlertTriangle className="w-10 h-10 text-red-600" />
          <h2 className="text-lg font-semibold text-red-900">تعذر تحميل البيانات</h2>
          <p className="text-sm text-red-800 max-w-md">{error}</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-2">
            <RefreshCw className="w-4 h-4 ml-1" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-4" dir="rtl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/manage/org')}>
            <ArrowRight className="w-4 h-4 ml-1" />
            العودة لإدارة الجهات
          </Button>
        </div>
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">لا توجد بيانات مستخرجة</h2>
          <p className="text-sm text-gray-600 mb-4">
            لم يتم استخراج المعلومات التنظيمية لهذه الجهة بعد. سيتم تشغيل الاستخراج تلقائياً عند
            رفع المستندات الرسمية.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-1" />
            تحديث
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/manage/org')}>
            <ArrowRight className="w-4 h-4 ml-1" />
            العودة لإدارة الجهات
          </Button>
          <h1 className="text-xl font-bold text-gray-900">بيانات الجهة المستخرجة</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusMeta.variant} className={statusMeta.className}>
            <StatusIcon className="w-3.5 h-3.5 ml-1" />
            {statusMeta.label}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-1" />
            تحديث
          </Button>
        </div>
      </div>

      {data.extractionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 text-sm">خطأ أثناء الاستخراج</h3>
            <p className="text-sm text-red-800 mt-0.5">{data.extractionError}</p>
          </div>
        </div>
      )}

      {/* Basic Information */}
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

      {/* Classification & Activities */}
      <SectionCard title="التصنيف والأنشطة" icon={FileText}>
        <ReadOnlyField label="التصنيف الرئيسي" value={data.mainClassification} />
        <ReadOnlyField label="التصنيف الفرعي 1" value={data.subClassification1} />
        <ReadOnlyField label="التصنيف الفرعي 2" value={data.subClassification2} />
        <ReadOnlyListField label="الأنشطة المعتمدة" items={data.approvedActivities} icon={CheckCircle} />
        <ReadOnlyListField label="الفئات المستهدفة" items={data.targetGroups} icon={Users} />
        <ReadOnlyField label="الجهة الإشرافية" value={data.supervisingAuthority} />
        <ReadOnlyListField label="أهداف المنظمة" items={data.organizationObjectives} icon={FileText} />
      </SectionCard>

      {/* Board Information */}
      <SectionCard title="مجلس الإدارة" icon={Users}>
        <ReadOnlyField label="رئيس مجلس الإدارة" value={data.chairmanName} icon={Users} />
        <ReadOnlyField label="رقم هوية الرئيس" value={data.chairmanNationalId} />
        <ReadOnlyField label="نائب رئيس مجلس الإدارة" value={data.viceChairmanName} icon={Users} />
        <ReadOnlyField label="رقم هوية النائب" value={data.viceChairmanNationalId} />
        <ReadOnlyField label="تاريخ تعيين المجلس" value={formatDate(data.boardAppointmentDate)} icon={Calendar} />
        <ReadOnlyField label="تاريخ نهاية المجلس" value={formatDate(data.boardEndDate)} icon={Calendar} />
      </SectionCard>

      {/* Metadata */}
      <SectionCard title="بيانات الاستخراج" icon={Clock}>
        <ReadOnlyField label="حالة الاستخراج" value={statusMeta.label} />
        <ReadOnlyField label="تاريخ آخر استخراج" value={formatDate(data.extractedAt)} />
        <ReadOnlyField label="تاريخ الإنشاء" value={formatDate(data.createdAt)} />
        <ReadOnlyField label="تاريخ التحديث" value={formatDate(data.updatedAt)} />
      </SectionCard>
    </div>
  );
}

export default OrganizationInformationPage;
