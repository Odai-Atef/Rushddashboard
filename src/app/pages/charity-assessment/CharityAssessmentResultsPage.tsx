import { useNavigate } from 'react-router';
import {
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Star,
  Sparkles,
  Lightbulb,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
  Activity,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  overallScore,
  readinessLevel,
  radarData,
  strengths,
  gaps,
  benchmarkData,
  progressData,
  getSeverityColor,
} from './charity-assessment-data';

export function CharityAssessmentResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">نتائج تقييم الجاهزية</h1>
              <p className="text-blue-100">تم إكمال التقييم بنجاح • تم التحديث في 11 مايو 2026</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                تصدير PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
              <button
                onClick={() => navigate('/dashboard/charity-assessment/assessment')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة التقييم
              </button>
            </div>
          </div>

          {/* Overall Score */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <p className="text-blue-100 mb-2">درجة الجاهزية الإجمالية</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{overallScore}%</span>
                <span className={`px-3 py-1 ${readinessLevel.bg}/20 border border-white/20 rounded-full text-sm mb-2`}>
                  {readinessLevel.label}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <p className="text-blue-100 mb-2">مقارنة بمتوسط القطاع</p>
              <div className="flex items-end gap-2">
                <TrendingUp className="w-6 h-6 mb-1" />
                <span className="text-3xl font-bold">+5%</span>
              </div>
              <p className="text-sm text-blue-100 mt-2">أعلى من المتوسط</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <p className="text-blue-100 mb-2">التقدم منذ آخر تقييم</p>
              <div className="flex items-end gap-2">
                <Activity className="w-6 h-6 mb-1" />
                <span className="text-3xl font-bold">+8%</span>
              </div>
              <p className="text-sm text-blue-100 mt-2">تحسن ملحوظ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Radar Chart */}
          <div className="col-span-2 bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">نظرة شاملة على الأداء</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="درجتك" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="المتوسط" dataKey={80} stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <Award className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mb-1">3</p>
              <p className="text-sm text-muted-foreground">نقاط قوة رئيسية</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold mb-1">3</p>
              <p className="text-sm text-muted-foreground">مجالات تحتاج تحسين</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Lightbulb className="w-8 h-8 text-purple-500" />
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mb-1">5</p>
              <p className="text-sm text-muted-foreground">توصيات مخصصة</p>
            </div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">المقارنة المعيارية</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benchmarkData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {benchmarkData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">نقاط القوة الرئيسية</h2>
          </div>
          <div className="space-y-4">
            {strengths.map((strength, index) => (
              <div key={index} className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium mb-1">{strength.category}</h3>
                    <p className="text-sm text-muted-foreground">{strength.insight}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-green-500">{strength.score}%</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gaps */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">تحليل الفجوات</h2>
          </div>
          <div className="space-y-4">
            {gaps.map((gap, index) => (
              <div
                key={index}
                className={`border rounded-lg p-5 ${
                  gap.severity === 'critical'
                    ? 'bg-red-500/5 border-red-500/20'
                    : gap.severity === 'high'
                    ? 'bg-orange-500/5 border-orange-500/20'
                    : 'bg-yellow-500/5 border-yellow-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{gap.category}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(gap.severity)}`}>
                        {gap.severity === 'critical' ? 'حرج' : gap.severity === 'high' ? 'عالي' : 'متوسط'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{gap.issue}</p>
                    <div className="flex items-start gap-2 bg-card/50 rounded-lg p-3">
                      <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{gap.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">تتبع التقدم</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} name="درجة الجاهزية" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-3">جاهز للخطوة التالية؟</h3>
          <p className="text-muted-foreground mb-6">
            استعرض خارطة الطريق المخصصة لتحسين جاهزية منظمتك
          </p>
          <button
            onClick={() => navigate('/dashboard/charity-assessment/roadmap')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            عرض خارطة الطريق
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
