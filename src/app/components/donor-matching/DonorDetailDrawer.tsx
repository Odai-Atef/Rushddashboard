import { X, ExternalLink, FileText, Download, Send, Trash2 } from 'lucide-react';
import { projectService } from '@/api/services/project-service';
import { DonorStatusActions } from './DonorStatusActions';
import { DonorHistoryAccordion } from './DonorHistoryAccordion';
import { toast } from 'sonner';
import { useState } from 'react';

interface DonorDetailDrawerProps {
  donor: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: () => void;
  projectId?: string;
  isExecution?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  MATCHED: { label: 'مطابق', color: '#10b981', bg: '#d1fae5' },
  SUBMITTED: { label: 'تم الإرسال', color: '#3b82f6', bg: '#dbeafe' },
  ACCEPTED: { label: 'تم القبول', color: '#059669', bg: '#d1fae5' },
  REJECTED: { label: 'تم الاعتذار', color: '#ef4444', bg: '#fee2e2' },
  FUNDED: { label: 'تم التمويل', color: '#d97706', bg: '#fef3c7' },
  GENERATED: { label: 'تم إنشاء الخطة', color: '#8b5cf6', bg: '#ede9fe' },
};

export function DonorDetailDrawer({ donor, isOpen, onClose, onStatusChange, projectId, isExecution }: DonorDetailDrawerProps) {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen || !donor) return null;

  const statusCfg = STATUS_CONFIG[donor.status || 'MATCHED'] || STATUS_CONFIG.MATCHED;

  const handleGeneratePlan = async () => {
    setGeneratingId(donor.id);
    try {
      const res = await projectService.generateDonorPlan(donor.id);
      const blob = res.data;
      if (!(blob instanceof Blob)) {
        throw new Error('تعذر الحصول على ملف الخطة');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${donor.name}-plan.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('تم إنشاء خطة المشروع وتحميلها بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل إنشاء خطة المشروع');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه الجهة المانحة؟')) return;
    setDeletingId(donor.id);
    try {
      const res = await projectService.deleteDonorMatch(donor.id);
      if (res.success) {
        toast.success('تم حذف الجهة المانحة بنجاح');
        onStatusChange();
        onClose();
      } else {
        toast.error(res.message || 'فشل حذف الجهة المانحة');
      }
    } catch (err: any) {
      toast.error(err?.message || 'حدث خطأ أثناء الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto" dir="rtl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg">
                {donor.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{donor.name}</h2>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                  style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Score */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">درجة التطابق</span>
              <span className="text-lg font-bold text-indigo-600">{donor.matchingScore}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${donor.matchingScore}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">الوصف</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{donor.description || 'لا يوجد وصف'}</p>
          </div>

          {/* Source */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">المصدر</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {donor.source === 'online' ? 'عبر الإنترنت' : donor.source === 'offline' ? 'قواعد البيانات' : donor.source || 'غير محدد'}
            </span>
            {donor.source === 'MANUAL' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mr-2">
                تمت الإضافة يدوياً
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-medium text-gray-500 mb-2">الإجراءات</h3>
            
            <div className="flex flex-wrap gap-2">
              <a
                href={donor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                زيارة الموقع
              </a>

              {!isExecution && (
                <>
                  {donor.hasGeneratedPlan ? (
                    <button
                      onClick={handleGeneratePlan}
                      disabled={generatingId === donor.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {generatingId === donor.id ? (
                        <FileText className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      تحميل الملف المطور
                    </button>
                  ) : (
                    <button
                      onClick={handleGeneratePlan}
                      disabled={generatingId === donor.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
                    >
                      {generatingId === donor.id ? (
                        <FileText className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      إنشاء نسخة مشروع
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
                    disabled={deletingId === donor.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </>
              )}
            </div>

            {!isExecution && (
              <DonorStatusActions
                matchId={donor.id}
                currentStatus={donor.status || 'MATCHED'}
                onStatusChange={onStatusChange}
              />
            )}
          </div>

          {/* History */}
          <DonorHistoryAccordion matchId={donor.id} />
        </div>
      </div>
    </>
  );
}
