import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Loader2,
  AlertTriangle,
  ArrowRight,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { useOrganizationInformation } from '@/api/hooks/useOrganizationInformation';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  OrganizationInformationDisplay,
  getExtractionStatusMeta,
} from '@/app/components/OrganizationInformationDisplay';

export function OrganizationInformationPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isSyncing, error, refetch, sync } = useOrganizationInformation(organizationId);

  // Poll while extraction is in progress.
  useEffect(() => {
    if (!data || data.extractionStatus !== 'PROCESSING') return;
    const timer = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(timer);
  }, [data, refetch]);

  const statusMeta = getExtractionStatusMeta(data?.extractionStatus ?? 'PENDING');
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
          <Badge className={statusMeta.className}>
            <StatusIcon className="w-3.5 h-3.5 ml-1" />
            {statusMeta.label}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sync()}
            disabled={isSyncing || data?.extractionStatus === 'PROCESSING'}
          >
            {isSyncing || data?.extractionStatus === 'PROCESSING' ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 ml-1" />
            )}
            مزامنة
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-1" />
            تحديث
          </Button>
        </div>
      </div>

      <OrganizationInformationDisplay data={data} />
    </div>
  );
}

export default OrganizationInformationPage;
