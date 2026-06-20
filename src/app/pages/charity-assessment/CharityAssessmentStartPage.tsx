import { useNavigate } from 'react-router';
import {
  Sparkles,
  CheckCircle2,
  Play,
  Clock,
} from 'lucide-react';
import { categories } from './charity-assessment-data';

export function CharityAssessmentStartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">تقييم جاهزية المنظمة</h1>
          <p className="text-xl text-muted-foreground mb-2">
            منصة ذكية لتقييم مستوى استعداد المنظمات الخيرية
          </p>
          <p className="text-muted-foreground">
            مدعوم بالذكاء الاصطناعي • تحليل شامل • توصيات مخصصة
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6">ما الذي سنقيمه؟</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 mb-6">
          <h3 className="font-semibold mb-4">ما الذي ستحصل عليه:</h3>
          <div className="space-y-3">
            {[
              'تقييم شامل لجاهزية المنظمة عبر 10 مجالات رئيسية',
              'درجة جاهزية إجمالية مع مقارنة بمعايير القطاع',
              'تحليل ذكي لنقاط القوة والضعف',
              'خارطة طريق مخصصة للتحسين',
              'توصيات مدعومة بالذكاء الاصطناعي',
              'تتبع التقدم مع مرور الوقت'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard/charity-assessment/assessment')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-lg font-medium"
          >
            <Play className="w-5 h-5" />
            بدء التقييم
          </button>
          <button
            onClick={() => navigate('/dashboard/charity-assessment/results')}
            className="px-6 py-4 border border-border rounded-xl hover:bg-muted transition-colors font-medium"
          >
            عرض نتائج سابقة
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Clock className="w-4 h-4 inline mr-1" />
          المدة المتوقعة: 20-30 دقيقة
        </p>
      </div>
    </div>
  );
}
