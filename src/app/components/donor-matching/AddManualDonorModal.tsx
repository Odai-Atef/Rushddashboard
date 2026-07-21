import { useState } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { projectService, CreateManualDonorPayload } from '@/api/services/project-service';
import { toast } from 'sonner';

interface AddManualDonorModalProps {
  resultId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddManualDonorModal({ resultId, isOpen, onClose, onSuccess }: AddManualDonorModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [matchingScore, setMatchingScore] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('اسم الجهة المانحة مطلوب');
      return;
    }
    if (!resultId) {
      toast.error('لم يتم العثور على معرف نتيجة التطابق. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateManualDonorPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        website: website.trim() || undefined,
        matchingScore,
      };

      const res = await projectService.addManualDonor(resultId, payload);
      if (res.success) {
        toast.success('تم إضافة الجهة المانحة بنجاح');
        onSuccess();
        handleClose();
      } else {
        toast.error(res.message || 'فشل إضافة الجهة المانحة');
      }
    } catch (err: any) {
      toast.error(err?.message || 'حدث خطأ أثناء إضافة الجهة المانحة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setWebsite('');
    setMatchingScore(50);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">إضافة جهة مانحة يدوياً</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">اسم الجهة المانحة *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: مؤسسة الوليد للإنسانية"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="وصف موجز للجهة المانحة..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الموقع الإلكتروني</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">درجة التطابق: {matchingScore}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={matchingScore}
              onChange={(e) => setMatchingScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              إضافة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
