import { ArrowRight, Brain, Sparkles, Target, Award, Clock, FileText, Upload, Save } from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';

export function LandingPage() {
 console.log('[LandingPage] render');
 const { goToStep } = useOnboardingNavigate();

 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)]">
 <div className="max-w-6xl mx-auto">
 {/* Header */}
 <div className="text-center mb-12 pt-8">
 <div className="inline-flex items-center gap-[var(--spacing-small-gap)] bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
 <Sparkles className="w-4 h-4" />
 <span className="text-sm font-medium">حاضنة رشد الافتراضية</span>
 </div>
 <h1 className="text-5xl font-bold mb-4 text-foreground">
 انضم إلى حاضنة رشد للمشاريع الخيرية
 </h1>
 <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
 قيّم جاهزية مؤسستك الخيرية للانضمام إلى برنامج الحاضنة واحصل على خطة تطوير شاملة مدعومة بالذكاء الاصطناعي
 </p>
 </div>

 {/* Benefits */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-grid-gap)] mb-12 items-stretch">
 <div className="bg-[var(--card)] rounded-2xl p-[var(--spacing-card-padding)] shadow-sm border border-border/80/50 transition-all duration-200 hover:shadow-md flex flex-col justify-start h-full">
 <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
 <Target className="w-8 h-8 text-primary" />
 </div>
 <h3 className="text-xl font-semibold text-foreground mb-2">تقييم شامل</h3>
 <p className="text-muted-foreground text-sm">تقييم متعمق لـ 9 محاور رئيسية لقياس جاهزية مؤسستك</p>
 </div>

 <div className="bg-[var(--card)] rounded-2xl p-[var(--spacing-card-padding)] shadow-sm border border-border/80/50 transition-all duration-200 hover:shadow-md flex flex-col justify-start h-full">
 <div className="w-14 h-14 bg-[var(--primary)]/[0.08] rounded-xl flex items-center justify-center mb-5">
 <Brain className="w-8 h-8 text-[var(--primary)]" />
 </div>
 <h3 className="text-xl font-semibold text-foreground mb-2">تحليل ذكي</h3>
 <p className="text-muted-foreground text-sm">تحليل مدعوم بالذكاء الاصطناعي مع توصيات مخصصة</p>
 </div>

 <div className="bg-[var(--card)] rounded-2xl p-[var(--spacing-card-padding)] shadow-sm border border-border/80/50 transition-all duration-200 hover:shadow-md flex flex-col justify-start h-full">
 <div className="w-14 h-14 bg-muted/[0.08] rounded-xl flex items-center justify-center mb-5">
 <Award className="w-8 h-8 text-purple-600" />
 </div>
 <h3 className="text-xl font-semibold text-foreground mb-2">خطة تطوير</h3>
 <p className="text-muted-foreground text-sm">خارطة طريق واضحة للتطوير والتحسين المستمر</p>
 </div>
 </div>

 {/* Assessment Info */}
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-8 mb-8">
 <h2 className="text-2xl font-semibold mb-6">ماذا يتضمن التقييم؟</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-grid-gap)] mb-8">
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
 <div>
 <p className="font-medium">المدة الزمنية</p>
 <p className="text-sm text-muted-foreground">٣٠ - ٤٥ دقيقة</p>
 </div>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
 <div>
 <p className="font-medium">عدد الأسئلة</p>
 <p className="text-sm text-muted-foreground">٢٤ سؤالاً موزعة على ٦ محاور</p>
 </div>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <Upload className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
 <div>
 <p className="font-medium">المستندات المطلوبة</p>
 <p className="text-sm text-muted-foreground">رخصة الجمعية، شهادة الحساب البنكي، العنوان الوطني</p>
 </div>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <Save className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
 <div>
 <p className="font-medium">حفظ تلقائي</p>
 <p className="text-sm text-muted-foreground">احفظ تقدمك وعُد متى شئت</p>
 </div>
 </div>
 </div>

 {/* CTAs */}
 <div className="flex gap-[var(--spacing-grid-gap)] justify-center">
 <button
 onClick={() => goToStep('registration')}
 className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)]"
 >
 ابدأ التقييم
 <ArrowRight className="w-5 h-5" />
 </button>
 <button className="px-8 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium">
 اعرف المزيد
 </button>
 </div>
 </div>

 {/* Progress Explanation */}
 <div className="text-center text-sm text-muted-foreground">
 <p>سيتم إرشادك خلال ٤ خطوات رئيسية: التسجيل → الملف التعريفي → التقييم → النتائج</p>
 </div>
 </div>
 </div>
 );
}
