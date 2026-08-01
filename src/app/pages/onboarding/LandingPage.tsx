import { ArrowRight, Brain, Sparkles, Target, Award, Clock, FileText, Upload, Save } from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';

export function LandingPage() {
  console.log('[LandingPage] render');
  const { goToStep } = useOnboardingNavigate();

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-blue-500/5 border border-border/80 dark:border-border/50 transition-all duration-200 hover:shadow-md flex flex-col justify-start h-full">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-5">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">تقييم شامل</h3>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">تقييم متعمق لـ 9 محاور رئيسية لقياس جاهزية مؤسستك</p>
          </div>

          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-green-500/5 border border-border/80 dark:border-border/50 transition-all duration-200 hover:shadow-md flex flex-col justify-start h-full">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-5">
              <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">تحليل ذكي</h3>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">تحليل مدعوم بالذكاء الاصطناعي مع توصيات مخصصة</p>
          </div>

          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-purple-500/5 border border-border/80 dark:border-border/50 transition-all duration-200 hover:shadow-md flex flex-col justify-start h-full">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-5">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">خطة تطوير</h3>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">خارطة طريق واضحة للتطوير والتحسين المستمر</p>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">ماذا يتضمن التقييم؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">المدة الزمنية</p>
                <p className="text-sm text-muted-foreground">٣٠ - ٤٥ دقيقة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">عدد الأسئلة</p>
                <p className="text-sm text-muted-foreground">٢٤ سؤالاً موزعة على ٦ محاور</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">المستندات المطلوبة</p>
                <p className="text-sm text-muted-foreground">رخصة الجمعية، شهادة الحساب البنكي، العنوان الوطني</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Save className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">حفظ تلقائي</p>
                <p className="text-sm text-muted-foreground">احفظ تقدمك وعُد متى شئت</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => goToStep('registration')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              ابدأ التقييم
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium">
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
