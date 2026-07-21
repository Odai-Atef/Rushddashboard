import { useState } from 'react';
import { Send, CheckCircle, XCircle, Coins, Loader2, Calendar } from 'lucide-react';
import { projectService, UpdateDonorMatchStatusPayload } from '@/api/services/project-service';
import { useConfirm } from '@/app/hooks/useConfirm.tsx';
import { toast } from 'sonner';

interface DonorStatusActionsProps {
  matchId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  MATCHED: 'مطابق',
  SUBMITTED: 'تم الإرسال',
  ACCEPTED: 'تم القبول',
  REJECTED: 'تم الاعتذار',
  FUNDED: 'تم التمويل',
  GENERATED: 'تم إنشاء الخطة',
};

export function DonorStatusActions({ matchId, currentStatus, onStatusChange }: DonorStatusActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { confirm, dialog: confirmDialog } = useConfirm();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{ action: string; status: string } | null>(null);
  const [dateValue, setDateValue] = useState('');
  const [notesValue, setNotesValue] = useState('');

  const handleActionClick = async (action: string, newStatus: string) => {
    setModalData({ action, status: newStatus });
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!modalData) return;

    const confirmed = await confirm({
      title: `هل أنت متأكد من ${modalData.action}؟`,
      description: 'سيتم تحديث حالة الجهة المانحة.',
    });

    if (!confirmed) {
      setShowModal(false);
      return;
    }

    setIsLoading(true);
    try {
      const payload: UpdateDonorMatchStatusPayload = {
        status: modalData.status,
        proposalSubmissionDate: dateValue || undefined,
        responseNotes: notesValue || undefined,
      };

      const res = await projectService.updateDonorMatchStatus(matchId, payload);
      if (res.success) {
        toast.success(`تم ${modalData.action} بنجاح`);
        onStatusChange();
      } else {
        toast.error(res.message || 'فشل تحديث الحالة');
      }
    } catch (err: any) {
      toast.error(err?.message || 'حدث خطأ أثناء تحديث الحالة');
    } finally {
      setIsLoading(false);
      setShowModal(false);
      setDateValue('');
      setNotesValue('');
    }
  };

  const renderActions = () => {
    switch (currentStatus) {
      case 'MATCHED':
      case 'GENERATED':
        return (
          <button
            onClick={() => handleActionClick('إرسال الطلب', 'SUBMITTED')}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            إرسال الطلب
          </button>
        );
      case 'SUBMITTED':
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleActionClick('تسجيل القبول', 'ACCEPTED')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              تم القبول
            </button>
            <button
              onClick={() => handleActionClick('تسجيل الاعتذار', 'REJECTED')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              تم الاعتذار
            </button>
            <button
              onClick={() => handleActionClick('تسجيل التمويل', 'FUNDED')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              <Coins className="w-3.5 h-3.5" />
              تم التمويل
            </button>
          </div>
        );
      case 'ACCEPTED':
        return (
          <button
            onClick={() => handleActionClick('تسجيل التمويل', 'FUNDED')}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            <Coins className="w-3.5 h-3.5" />
            تم التمويل
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderActions()}

      {showModal && modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">{modalData.action}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">تاريخ التقديم/الرد</label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => {
                    const input = document.getElementById('status-action-date') as HTMLInputElement | null;
                    input?.showPicker?.();
                  }}
                >
                  <input
                    id="status-action-date"
                    type="date"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm cursor-pointer"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="أضف ملاحظات حول هذا الإجراء..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setDateValue('');
                  setNotesValue('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDialog}
    </>
  );
}
