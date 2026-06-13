import {
  Sparkles, CheckCircle2, AlertCircle, ChevronRight, Brain,
  Target, Users, DollarSign, MapPin, Shield, TrendingUp,
  Lightbulb, ArrowLeft, Send
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid
} from 'recharts';

interface MatchAnalysisProps {
  donorId: string;
  onNavigate: (view: string, donorId?: string) => void;
}

const donorData: Record<string, any> = {
  '1': {
    name: 'صندوق الملك عبدالعزيز للأبحاث',
    score: 94,
    dimensions: [
      { name: 'مجال التمويل', score: 98, icon: Target, status: 'excellent', desc: 'مشروعك في التعليم يتطابق تماماً مع الأولويات الاستراتيجية للصندوق' },
      { name: 'المستفيدون', score: 92, icon: Users, status: 'excellent', desc: 'شريحة المستفيدين (الطلاب 6-18 سنة) تتوافق مع 94% من مشاريع الصندوق الممولة' },
      { name: 'توافق الميزانية', score: 88, icon: DollarSign, status: 'good', desc: 'ميزانيتك (850K ر.س) تقع في النطاق الأمثل للصندوق (200K–2M ر.س)' },
      { name: 'التوافق الجغرافي', score: 95, icon: MapPin, status: 'excellent', desc: 'منطقة العمل (الرياض وجدة) تتطابق مع النطاق الجغرافي للصندوق' },
      { name: 'توافق الأهلية', score: 96, icon: Shield, status: 'excellent', desc: 'مؤسستك مسجلة ومعتمدة وتستوفي جميع شروط الأهلية الأساسية' },
    ],
    radarData: [
      { subject: 'مجال التمويل', score: 98 },
      { subject: 'المستفيدون', score: 92 },
      { subject: 'الميزانية', score: 88 },
      { subject: 'الجغرافيا', score: 95 },
      { subject: 'الأهلية', score: 96 },
      { subject: 'الأثر', score: 85 },
    ],
    historicalFunded: [
      { year: '2022', amount: 12 },
      { year: '2023', amount: 18 },
      { year: '2024', amount: 24 },
      { year: '2025', amount: 31 },
    ],
    aiRecommendations: [
      { type: 'success', text: 'أبرز خبرة مؤسستك في تطوير المناهج الرقمية — هذا يُضاعف احتمالية القبول' },
      { type: 'action', text: 'أضف مؤشرات قياس الأثر طويل المدى لمشروعك (مثل معدل توظيف الخريجين)' },
      { type: 'action', text: 'اذكر شراكتك مع وزارة التعليم في ملف التقديم — الصندوق يُفضّل المشاريع المدعومة حكومياً' },
      { type: 'warning', text: 'تأكد من إرفاق آخر تقرير مالي مدقق — مطلوب منذ 2024' },
    ],
    gaps: [
      { label: 'تقرير الاستدامة', severity: 'medium' },
      { label: 'خطة قياس الأثر', severity: 'low' },
    ],
    successRate: 87,
    avgFunding: '680K ر.س',
    avgTime: '45 يوم',
  },
};

const defaultDonor = donorData['1'];

function DimensionCard({ dim }: { dim: any }) {
  const Icon = dim.icon;
  const colorMap = { excellent: { bar: 'bg-emerald-500', badge: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400', text: 'ممتاز' }, good: { bar: 'bg-blue-500', badge: 'text-blue-700 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400', text: 'جيد' }, medium: { bar: 'bg-amber-500', badge: 'text-amber-700 bg-amber-100', text: 'متوسط' }, low: { bar: 'bg-red-400', badge: 'text-red-600 bg-red-100', text: 'منخفض' } };
  const c = colorMap[dim.status as keyof typeof colorMap] || colorMap.medium;
  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{c.text}</span>
            <span className="text-sm text-foreground">{dim.name}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">{dim.score}%</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${dim.score}%` }} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{dim.desc}</p>
        </div>
      </div>
    </div>
  );
}

export function MatchAnalysis({ donorId, onNavigate }: MatchAnalysisProps) {
  const donor = donorData[donorId] || defaultDonor;
  const scoreColor = donor.score >= 90 ? '#10b981' : donor.score >= 80 ? '#6366f1' : '#f59e0b';

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => onNavigate('recommended')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> العودة للقائمة
        </button>
        <div className="text-right">
          <h2 className="text-foreground">{donor.name}</h2>
          <p className="text-xs text-muted-foreground">تحليل التطابق الشامل</p>
        </div>
      </div>

      {/* Score Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="var(--muted)" strokeWidth="6" />
                <circle cx="48" cy="48" r="40" fill="none" stroke={scoreColor} strokeWidth="6"
                  strokeDasharray={`${(donor.score / 100) * 251.3} 251.3`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl text-foreground">{donor.score}%</span>
                <span className="text-xs text-muted-foreground">تطابق</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="flex items-center gap-2 mb-2 justify-end">
              <Brain className="w-4 h-4 text-violet-500" />
              <span className="text-xs text-muted-foreground">تحليل الذكاء الاصطناعي</span>
            </div>
            <p className="text-sm text-foreground mb-3">
              هذا المانح <strong className="text-emerald-600">مناسب جداً</strong> لمشروعك — التوافق في 5 أبعاد رئيسية يجعل هذه الفرصة من أعلى الأولويات للتقديم.
            </p>
            <div className="flex flex-wrap gap-4 justify-end">
              <div className="text-center">
                <p className="text-emerald-600">{donor.successRate}%</p>
                <p className="text-xs text-muted-foreground">معدل النجاح</p>
              </div>
              <div className="text-center">
                <p className="text-foreground">{donor.avgFunding}</p>
                <p className="text-xs text-muted-foreground">متوسط التمويل</p>
              </div>
              <div className="text-center">
                <p className="text-foreground">{donor.avgTime}</p>
                <p className="text-xs text-muted-foreground">متوسط زمن القبول</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dimensions Grid */}
      <div>
        <h3 className="text-foreground mb-3 text-right">أبعاد التوافق</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {donor.dimensions.map((dim: any, i: number) => <DimensionCard key={i} dim={dim} />)}
        </div>
      </div>

      {/* Radar + Historical */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-3 text-right">خريطة التوافق الشاملة</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={donor.radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <Radar name="التوافق" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip formatter={v => `${v}%`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-3 text-right">المشاريع الممولة تاريخياً</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={donor.historicalFunded}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `${v} مشروع`} />
              <Bar dataKey="amount" name="مشاريع ممولة" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <h3 className="text-foreground">توصيات الذكاء الاصطناعي لتحسين فرص القبول</h3>
        </div>
        <div className="space-y-3">
          {donor.aiRecommendations.map((rec: any, i: number) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${rec.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : rec.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'}`}>
              {rec.type === 'success' ? <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> : rec.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> : <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
              <p className="text-sm text-foreground text-right flex-1">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps */}
      {donor.gaps.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-3 text-right">المتطلبات الناقصة</h3>
          <div className="space-y-2">
            {donor.gaps.map((gap: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <span className={`text-xs px-2 py-0.5 rounded-full ${gap.severity === 'high' ? 'bg-red-100 text-red-600' : gap.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                  {gap.severity === 'high' ? 'ضروري' : gap.severity === 'medium' ? 'مهم' : 'مقترح'}
                </span>
                <span className="text-sm text-foreground">{gap.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3 justify-start">
        <button onClick={() => onNavigate('submission', donorId)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Send className="w-4 h-4" /> بدء إعداد الطلب
        </button>
        <button onClick={() => onNavigate('readiness')} className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
          <Target className="w-4 h-4" /> تقييم الجاهزية
        </button>
      </div>
    </div>
  );
}
