import { BarChart3, Brain, CheckCircle2, ChevronRight, Heart, Lightbulb, Star, Target, Users, Zap, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { resolveIcon as resolveApiIcon } from '@/app/utils/icon-map';
import {
 Strength as StrengthItem,
 Weakness as WeaknessItem,
} from '@/api/services/onboarding-service';

export function AnalysisPage() {
 const { goToStep } = useOnboardingNavigate();
 const { assessmentResult } = useOnboardingContext();

 const apiStrengths = (assessmentResult?.strengths || []).filter(
 (s): s is StrengthItem => typeof s === 'object' && s !== null
 );
 const apiWeaknesses = (assessmentResult?.weaknesses || []).filter(
 (w): w is WeaknessItem => typeof w === 'object' && w !== null
 );

 const strengths =
 apiStrengths.length > 0
 ? apiStrengths.map((s) => ({
 area: s.area,
 score: s.score,
 insight: s.insight,
 icon: resolveApiIcon(s.icon),
 color: s.score >= 80 ? 'green' : s.score >= 50 ? 'blue' : 'yellow',
 }))
 : [
 {
 area: 'الحوكمة والامتثال',
 score: 85,
 insight:
 'لديكم هيكل حوكمة قوي مع سياسات واضحة ومجلس إدارة نشط',
 icon: Shield,
 color: 'green',
 },
 {
 area: 'التخطيط الاستراتيجي',
 score: 80,
 insight:
 'خطة استراتيجية واضحة مع مؤشرات أداء محددة ومراجعة دورية',
 icon: Target,
 color: 'green',
 },
 {
 area: 'إدارة المتطوعين',
 score: 78,
 insight:
 'برامج فعالة لاستقطاب وتدريب المتطوعين مع نظام متابعة جيد',
 icon: Heart,
 color: 'green',
 },
 ];

 const weaknesses =
 apiWeaknesses.length > 0
 ? apiWeaknesses.map((w) => ({
 area: w.area,
 score: w.score,
 insight: w.insight,
 severity: w.severity || 'medium',
 icon: resolveApiIcon(w.severity === 'high' ? 'AlertTriangle' : 'Zap'),
 color: w.severity === 'high' ? 'red' : 'yellow',
 }))
 : [
 {
 area: 'الجاهزية التقنية',
 score: 65,
 insight:
 'هناك حاجة لتحسين البنية التحتية التقنية وأنظمة إدارة البيانات',
 severity: 'high',
 icon: Zap,
 color: 'red',
 },
 {
 area: 'الموارد البشرية',
 score: 68,
 insight:
 'نقص في برامج التطوير المهني وأنظمة تقييم الأداء',
 severity: 'medium',
 icon: Users,
 color: 'yellow',
 },
 {
 area: 'قياس الأثر',
 score: 70,
 insight:
 'أدوات قياس الأثر موجودة لكن تحتاج إلى تطوير وأتمتة',
 severity: 'medium',
 icon: BarChart3,
 color: 'yellow',
 },
 ];

 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="max-w-5xl mx-auto">
 {/* Header */}
 <div className="mb-6 sm:mb-8">
 <button
 onClick={() => goToStep('results')}
 className="text-primary hover:text-primary font-medium flex items-center gap-[var(--spacing-small-gap)] mb-4"
 >
 <ChevronRight className="w-5 h-5" />
 رجوع إلى النتائج
 </button>
 <h1 className="text-2xl sm:text-3xl font-bold mb-2">تحليل نقاط القوة والضعف</h1>
 <p className="text-muted-foreground">
 تحليل تفصيلي لأداء مؤسستك عبر جميع المحاور
 </p>
 </div>

 {/* Strengths */}
 <div className="mb-6 sm:mb-8">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-4">
 <div className="w-10 h-10 bg-[var(--primary)]/[0.08] rounded-lg flex items-center justify-center">
 <Star className="w-5 h-5 text-[var(--primary)]" />
 </div>
 <h2 className="text-xl sm:text-2xl font-bold">نقاط القوة</h2>
 </div>
 <div className="space-y-[var(--spacing-section-gap)]">
 {strengths.map((item, idx) => {
 const Icon = item.icon;
 return (
 <div
 key={idx}
 className="bg-[var(--card)] rounded-2xl shadow-sm border border-[var(--primary)]/[0.3] p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] transition-all duration-200 hover:shadow-md"
 >
 <div className="flex items-start gap-[var(--spacing-grid-gap)]">
 <div className="w-12 h-12 bg-[var(--primary)]/[0.08] rounded-xl flex items-center justify-center flex-shrink-0">
 <Icon className="w-6 h-6 text-[var(--primary)]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-lg font-semibold text-foreground">{item.area}</h3>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className="text-3xl font-bold text-[var(--primary)] tracking-tight">
 {item.score}
 </span>
 <span className="text-muted-foreground">/100</span>
 </div>
 </div>
 <p className="text-muted-foreground">{item.insight}</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)] mt-3">
 <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
 <span className="text-sm text-[var(--primary)] font-medium">
 أداء ممتاز - استمروا في الحفاظ على هذا المستوى
 </span>
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Weaknesses */}
 <div className="mb-6 sm:mb-8">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-4">
 <div className="w-10 h-10 bg-[var(--destructive)]/[0.08] rounded-lg flex items-center justify-center">
 <AlertTriangle className="w-5 h-5 text-[var(--destructive)]" />
 </div>
 <h2 className="text-xl sm:text-2xl font-bold">مجالات التحسين</h2>
 </div>
 <div className="space-y-[var(--spacing-section-gap)]">
 {weaknesses.map((item, idx) => {
 const Icon = item.icon;
 const severityConfig =
 item.severity === 'high'
 ? {
 bg: 'bg-[var(--destructive)]/[0.08]',
 border: 'border-[var(--destructive)]/[0.3]',
 text: 'text-[var(--destructive)]',
 badge: 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)]',
 label: 'أولوية عالية',
 }
 : {
 bg: 'bg-[var(--warning)]/[0.1]',
 border: 'border-[var(--warning)]/[0.3]',
 text: 'text-[var(--warning)]',
 badge: 'bg-yellow-100 text-yellow-700',
 label: 'أولوية متوسطة',
 };

 return (
 <div
 key={idx}
 className={`bg-[var(--card)] rounded-2xl shadow-sm border-2 ${severityConfig.border.replace('200', '80')} dark:${severityConfig.border.replace('200', '500/30')} p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] transition-all duration-200 hover:shadow-md`}
 >
 <div className="flex items-start gap-[var(--spacing-grid-gap)]">
 <div
 className={`w-12 h-12 ${severityConfig.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
 >
 <Icon className={`w-6 h-6 ${severityConfig.text}`} />
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <h3 className="text-lg font-semibold text-foreground">{item.area}</h3>
 <span
 className={`text-xs px-2 py-1 rounded-full font-medium ${severityConfig.badge}`}
 >
 {severityConfig.label}
 </span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className={`text-3xl font-bold tracking-tight ${severityConfig.text}`}>
 {item.score}
 </span>
 <span className="text-muted-foreground">/100</span>
 </div>
 </div>
 <p className="text-muted-foreground mb-3">{item.insight}</p>
 <div
 className={`flex items-center gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] ${severityConfig.bg} rounded-lg`}
 >
 <Lightbulb className={`w-4 h-4 ${severityConfig.text}`} />
 <span className={`text-sm font-medium ${severityConfig.text.replace('600', '900')}`}>
 توصية: راجع خطة التطوير للحصول على خطوات محددة للتحسين
 </span>
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* AI Recommendations */}
 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] border border-[var(--secondary)]/[0.3]">
 <div className="flex items-start gap-[var(--spacing-grid-gap)]">
 <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
 <Brain className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>
 <div>
 <h3 className="text-lg font-semibold mb-2">توصيات الذكاء الاصطناعي</h3>
 <p className="text-foreground mb-4">
 بناءً على التحليل الشامل، نوصي بالتركيز على تطوير الجاهزية التقنية
 كأولوية قصوى. الاستثمار في البنية التحتية التقنية سيحسن كفاءة
 العمليات وجودة البيانات، مما ينعكس إيجاباً على جميع المحاور الأخرى.
 </p>
 <button
 onClick={() => goToStep('roadmap')}
 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)]"
 >
 عرض خطة التطوير الكاملة
 <ArrowRight className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
