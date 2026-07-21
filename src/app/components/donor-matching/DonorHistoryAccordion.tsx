import { useState } from 'react';
import { ChevronDown, Clock, Loader2 } from 'lucide-react';
import { projectService, DonorSubmissionHistoryItem } from '@/api/services/project-service';
import { toast } from 'sonner';

interface DonorHistoryAccordionProps {
  matchId: string;
}

const ACTION_LABELS: Record<string, string> = {
  STATUS_CHANGED: 'تغيير الحالة',
};

const STATUS_LABELS: Record<string, string> = {
  MATCHED: 'مطابق',
  SUBMITTED: 'تم الإرسال',
  ACCEPTED: 'تم القبول',
  REJECTED: 'تم الاعتذار',
  FUNDED: 'تم التمويل',
  GENERATED: 'تم إنشاء الخطة',
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `منذ ${diffDays} يوم${diffDays > 1 ? 'ين' : ''}`;
  if (diffHours > 0) return `منذ ${diffHours} ساعة`;
  if (diffMins > 0) return `منذ ${diffMins} دقيقة`;
  return 'الآن';
}

export function DonorHistoryAccordion({ matchId }: DonorHistoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<DonorSubmissionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleToggle = async () => {
    if (!isOpen && !hasLoaded) {
      setIsLoading(true);
      try {
        const res = await projectService.getDonorMatchHistory(matchId);
        const payload = (res.data as any)?.data;
        const data = Array.isArray(payload) ? payload : (payload?.history ?? []);
        setHistory(data);
        setHasLoaded(true);
      } catch (err: any) {
        toast.error(err?.message || 'فشل تحميل سجل التتبع');
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
        <span>سجل التتبع</span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-gray-400">لا يوجد سجل</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{ACTION_LABELS[item.action] || item.action}</span>
                    {item.fromStatus && item.toStatus && (
                      <span className="text-xs text-gray-500">
                        من {STATUS_LABELS[item.fromStatus] || item.fromStatus} → إلى {STATUS_LABELS[item.toStatus] || item.toStatus}
                      </span>
                    )}
                  </div>
                  {item.message && <p className="text-gray-500 mt-0.5">{item.message}</p>}
                  <span className="text-xs text-gray-400">
                    {timeAgo(item.createdAt)} - {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
