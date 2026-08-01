import { useNavigate } from 'react-router';
import { ChevronRight, BarChart3 } from 'lucide-react';

export function ProjectReportingPage() {
 const navigate = useNavigate();

 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="space-y-[var(--spacing-section-gap)]">
 <button
 onClick={() => navigate('/dashboard/project-management')}
 className="text-[var(--secondary)] hover:text-[var(--secondary)] font-medium flex items-center gap-[var(--spacing-small-gap)] mb-4"
 >
 <ChevronRight className="w-5 h-5" />
 رجوع إلى لوحة القيادة
 </button>
 <h1 className="text-3xl font-bold mb-4">التقارير الإدارية</h1>
 <div className="bg-card rounded-xl p-8 border border-border">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-6">
 <div className="w-12 h-12 bg-[var(--secondary)]/[0.1] rounded-lg flex items-center justify-center">
 <BarChart3 className="w-6 h-6 text-[var(--secondary)]" />
 </div>
 <p className="text-xl font-bold">تقارير تنفيذية شاملة</p>
 </div>
 <p className="text-muted-foreground text-center">تقارير تنفيذية شاملة - قريباً</p>
 </div>
 </div>
 </div>
 );
}
