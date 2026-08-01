import { useNavigate } from 'react-router';
import { AlertCircle, ArrowRight } from 'lucide-react';

export function ProjectNotFound() {
 const navigate = useNavigate();

 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--destructive)]/[0.3] p-8 max-w-md w-full text-center">
 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h1 className="text-xl font-bold mb-2">المشروع غير موجود</h1>
 <p className="text-muted-foreground mb-6">
 لم يتم العثور على المشروع المطلوب. ربما تم حذفه أو أن الرابط غير صحيح.
 </p>
 <button
 onClick={() => navigate('/dashboard/project-management/list')}
 className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium flex items-center justify-center gap-[var(--spacing-small-gap)] mx-auto"
 >
 <span>العودة إلى قائمة المشاريع</span>
 <ArrowRight className="w-5 h-5" />
 </button>
 </div>
 </div>
 );
}
