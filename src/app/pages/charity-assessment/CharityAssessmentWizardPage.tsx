import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
 ArrowRight,
 ArrowLeft,
 Save,
 Brain,
} from 'lucide-react';
import { categories } from './charity-assessment-data';

export function CharityAssessmentWizardPage() {
 const navigate = useNavigate();
 const { organizationId } = useParams<{ organizationId: string }>();
 const [currentStep, setCurrentStep] = useState(0);
 const [showAIInsights] = useState(true);

 useEffect(() => {
 if (!organizationId) {
 navigate('/dashboard/charity-assessment', { replace: true });
 }
 }, [organizationId, navigate]);

 const currentCategory = categories[currentStep];
 const progress = ((currentStep + 1) / categories.length) * 100;

 return (
 <div className="min-h-full bg-background">
 {/* Progress Header */}
 <div className="bg-card border-b border-border sticky top-0 z-10">
 <div className="max-w-4xl mx-auto p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-xl font-semibold">{currentCategory.name}</h2>
 <p className="text-sm text-muted-foreground">
 القسم {currentStep + 1} من {categories.length}
 </p>
 </div>
 <button className="flex items-center gap-[var(--spacing-small-gap)] px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
 <Save className="w-4 h-4" />
 حفظ ومتابعة لاحقاً
 </button>
 </div>
 <div className="w-full bg-muted rounded-full h-2">
 <div
 className="bg-gradient-to-r from-[var(--secondary)] to-[var(--chart-3)] h-2 rounded-full transition-all"
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>
 </div>

 {/* Questions */}
 <div className="max-w-4xl mx-auto p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="bg-card border border-border rounded-xl p-[var(--spacing-card-padding)] sm:p-8 mb-6">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-6">
 {(() => {
 const Icon = currentCategory.icon;
 return <Icon className="w-6 h-6 text-[var(--secondary)]" />;
 })()}
 <h3 className="text-lg font-medium">الأسئلة</h3>
 </div>

 <div className="space-y-[var(--spacing-section-gap)]">
 {currentCategory.questions.map((q, index) => (
 <div key={q.id} className="border border-border rounded-lg p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <p className="font-medium mb-4">
 {index + 1}. {q.question}
 </p>

 {q.type === 'yesno' && (
 <div className="flex gap-[var(--spacing-small-gap)]">
 <button className="flex-1 px-4 py-3 border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/[0.1] transition-colors">
 نعم
 </button>
 <button className="flex-1 px-4 py-3 border-2 border-border rounded-lg hover:bg-muted transition-colors">
 لا
 </button>
 </div>
 )}

 {q.type === 'scale' && (
 <div>
 <input
 type="range"
 min="0"
 max="100"
 defaultValue="50"
 className="w-full mb-2"
 />
 <div className="flex justify-between text-sm text-muted-foreground">
 <span>منخفض</span>
 <span>متوسط</span>
 <span>عالي</span>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* AI Insights */}
 {showAIInsights && (
 <div className="bg-gradient-to-br from-[var(--chart-3)]/10 to-[var(--secondary)]/10 border border-[var(--chart-3)]/20 rounded-xl p-[var(--spacing-card-padding)] mb-6">
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <Brain className="w-6 h-6 text-[var(--chart-3)] flex-shrink-0" />
 <div>
 <h4 className="font-medium mb-2">ملاحظة من الذكاء الاصطناعي</h4>
 <p className="text-sm text-muted-foreground mb-3">
 بناءً على إجاباتك السابقة، نلاحظ أن لديكم أساس قوي في {currentCategory.name}.
 للحصول على تقييم دقيق، يُنصح بالإجابة على جميع الأسئلة بموضوعية.
 </p>
 <button className="text-sm text-[var(--chart-3)] hover:underline">
 معرفة المزيد عن كيفية التقييم
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Navigation */}
 <div className="flex gap-[var(--spacing-grid-gap)]">
 {currentStep > 0 && (
 <button
 onClick={() => setCurrentStep(currentStep - 1)}
 className="flex items-center gap-[var(--spacing-small-gap)] px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
 >
 <ArrowRight className="w-5 h-5" />
 السابق
 </button>
 )}
 <button
 onClick={() => {
 if (currentStep < categories.length - 1) {
 setCurrentStep(currentStep + 1);
 } else {
 navigate(`/dashboard/charity-assessment/results/${organizationId}`);
 }
 }}
 className="flex-1 flex items-center justify-center gap-[var(--spacing-small-gap)] px-6 py-3 bg-gradient-to-r from-[var(--secondary)] to-[var(--chart-3)] text-[var(--primary-foreground)] rounded-lg hover:from-[var(--secondary)]/90 hover:to-[var(--chart-3)]/90 transition-all"
 >
 {currentStep < categories.length - 1 ? 'التالي' : 'إنهاء التقييم'}
 <ArrowLeft className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 );
}
