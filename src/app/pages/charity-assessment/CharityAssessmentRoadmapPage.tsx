import { useNavigate } from 'react-router';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Brain,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  roadmapItems,
  getPriorityColor,
  getPriorityBg,
  getPriorityLabel,
} from './charity-assessment-data';

export function CharityAssessmentRoadmapPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">خارطة الطريق للتحسين</h1>
              <p className="text-muted-foreground">خطة مخصصة لتحسين جاهزية منظمتك</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/charity-assessment/results')}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للنتائج
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">إجمالي المبادرات</p>
              <p className="text-2xl font-bold">{roadmapItems.length}</p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-blue-500">
                {roadmapItems.filter(i => i.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">مكتمل</p>
              <p className="text-2xl font-bold text-green-500">
                {roadmapItems.filter(i => i.status === 'completed').length}
              </p>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">التأثير المتوقع</p>
              <p className="text-2xl font-bold text-purple-500">+15%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Items */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-4">
          {roadmapItems.map((item, index) => (
            <div key={item.id} className={`border rounded-xl p-6 ${getPriorityBg(item.priority)}`}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'completed'
                        ? 'bg-green-500'
                        : item.status === 'in-progress'
                        ? 'bg-blue-500'
                        : 'bg-muted'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : item.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  {index < roadmapItems.length - 1 && (
                    <div className="w-0.5 h-16 bg-border" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(item.priority)}`}>
                          أولوية {getPriorityLabel(item.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground mb-1">موعد الانتهاء</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{item.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-card/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">الجهد المطلوب</p>
                      <p className="font-medium">{item.effort}</p>
                    </div>
                    <div className="bg-card/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">التأثير المتوقع</p>
                      <p className="font-medium">{item.impact}</p>
                    </div>
                  </div>

                  {item.status === 'in-progress' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>التقدم</span>
                        <span>35%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      عرض التفاصيل
                    </button>
                    {item.status === 'pending' && (
                      <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
                        بدء العمل
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="mt-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-purple-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-3">توصيات الذكاء الاصطناعي</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  بناءً على تحليل شامل لنتائج تقييمك ومقارنتها بأفضل الممارسات في القطاع، نوصي بالبدء بـ "تطوير البنية التحتية التقنية" و "إنشاء إطار إدارة المخاطر" كأولوية قصوى.
                </p>
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    إتمام هاتين المبادرتين سيرفع درجة جاهزيتك الإجمالية من <strong>73%</strong> إلى <strong>81%</strong> المتوقعة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
