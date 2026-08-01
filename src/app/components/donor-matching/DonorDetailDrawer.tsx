import { cn } from '@/app/utils/cn';
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

const STATUS_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
 MATCHED: { label: 'مطابق', colorClass: 'text-[var(--primary)]', bgClass: 'bg-[var(--primary)]/[0.1] border-[var(--primary)]/[0.2]' },
 SUBMITTED: { label: 'تم الإرسال', colorClass: 'text-[var(--secondary)]', bgClass: 'bg-[var(--secondary)]/[0.1] border-[var(--secondary)]/[0.2]' },
 ACCEPTED: { label: 'تم القبول', colorClass: 'text-[var(--primary)]', bgClass: 'bg-[var(--primary)]/[0.1] border-[var(--primary)]/[0.2]' },
 REJECTED: { label: 'تم الاعتذار', colorClass: 'text-[var(--destructive)]', bgClass: 'bg-[var(--destructive)]/[0.1] border-[var(--destructive)]/[0.2]' },
 FUNDED: { label: 'تم التمويل', colorClass: 'text-[var(--warning)]', bgClass: 'bg-[var(--warning)]/[0.1] border-[var(--warning)]/[0.2]' },
 GENERATED: { label: 'تم إنشاء الخطة', colorClass: 'text-[var(--secondary)]', bgClass: 'bg-[var(--secondary)]/[0.1] border-[var(--secondary)]/[0.2]' },
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
 className="fixed inset-0 bg-[var(--text-primary)]/[0.3] z-40"
 onClick={onClose}
 />

 {/* Drawer */}
 <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-card shadow-2xl z-50 overflow-y-auto" dir="rtl">
 <div className="p-6">
 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-lg">
 {donor.name?.charAt(0)}
 </div>
 <div>
 <h2 className="text-xl font-bold">{donor.name}</h2>
 <span
 className={cn(
 'inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 border',
 statusCfg.bgClass,
 statusCfg.colorClass
 )}
 >
 {statusCfg.label}
 </span>
 </div>
 </div>
 <button
 onClick={onClose}
 className="p-2 hover:bg-muted rounded-lg transition-colors"
 >
 <X className="w-5 h-5 text-muted-foreground" />
 </button>
 </div>

 {/* Score */}
 <div className="mb-6 p-4 bg-[var(--secondary)]/[0.08] rounded-xl border border-[var(--secondary)]/[0.15]">
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium text-muted-foreground">درجة التطابق</span>
 <span className="text-lg font-bold text-[var(--secondary)]">{donor.matchingScore}%</span>
 </div>
 <div className="h-2 bg-muted rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--secondary)] rounded-full transition-all"
 style={{ width: `${donor.matchingScore}%` }}
 />
 </div>
 </div>

 {/* Description */}
 <div className="mb-6">
 <h3 className="text-sm font-medium text-muted-foreground mb-2">الوصف</h3>
 <p className="text-sm text-foreground leading-relaxed">{donor.description || 'لا يوجد وصف'}</p>
 </div>

 {/* Source */}
 <div className="mb-6">
 <h3 className="text-sm font-medium text-muted-foreground mb-2">المصدر</h3>
 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
 {donor.source === 'online' ? 'عبر الإنترنت' : donor.source === 'offline' ? 'قواعد البيانات' : donor.source || 'غير محدد'}
 </span>
 {donor.source === 'MANUAL' && (
 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--secondary)]/[0.1] text-[var(--secondary)] mr-2">
 تمت الإضافة يدوياً
 </span>
 )}
 </div>

 {/* Actions */}
 <div className="mb-6 space-y-3">
 <h3 className="text-sm font-medium text-muted-foreground mb-2">الإجراءات</h3>
 
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
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
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
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--secondary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--secondary)]/90 transition-colors disabled:opacity-50"
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
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--destructive)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--destructive)]/90 transition-colors disabled:opacity-50"
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
