import { useState } from 'react';
import {
  Target, CheckCircle2, AlertCircle, AlertTriangle, XCircle,
  FileText, Clock, Shield, TrendingUp, Sparkles, ChevronDown,
  ChevronUp, RefreshCw, Upload, ExternalLink
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface FundingReadinessAssessmentProps {
  onNavigate: (view: string, donorId?: string) => void;
}

const readinessDimensions = [
  { subject: 'وثائق المشروع', score: 85 },
  { subject: 'الميزانية', score: 72 },
  { subject: 'الأهلية', score: 90 },
  { subject: 'الجغرافيا', score: 78 },
  { subject: 'المستفيدون', score: 88 },
  { subject: 'مؤشرات الأثر', score: 65 },
];

const missingRequirements = [
  { id: 1, req: 'خطة الاستدامة المالية', priority: 'high', impact: '+8% على درجة الجاهزية', canGenerate: true },
  { id: 2, req: 'إطار قياس الأثر والمخرجات', priority: 'high', impact: '+6% على درجة الجاهزية', canGenerate: true },
  { id: 3, req: 'تقييم المخاطر المفصّل', priority: 'medium', impact: '+4% على درجة الجاهزية', canGenerate: false },
  { id: 4, req: 'بيانات الفئة المستهدفة', priority: 'medium', impact: '+3% على درجة الجاهزية', canGenerate: false },
];

const missingDocuments = [
  { id: 1, doc: 'التقرير المالي السنوي 2025', status: 'missing', required: true },
  { id: 2, doc: 'شهادة التسجيل المحدثة', status: 'expired', required: true },
  { id: 3, doc: 'خطة الاستدامة', status: 'missing', required: true },
  { id: 4, doc: 'تقارير مشاريع سابقة', status: 'partial', required: false },
  { id: 5, doc: 'السيرة الذاتية لفريق الإدارة', status: 'ready', required: false },
  { id: 6, doc: 'خطاب دعم من شريك محلي', status: 'ready', required: false },
];

const approvalStatus = [
  { stage: 'مراجعة المنسق', status: 'done', date: '10 يونيو 2026' },
  { stage: 'تقييم الجاهزية الأولي', status: 'done', date: '12 يونيو 2026' },
  { stage: 'مراجعة المستندات', status: 'current', date: 'جارٍ' },
  { stage: 'اعتماد المشرف', status: 'pending', date: '-' },
  { stage: 'جاهز للإرسال', status: 'pending', date: '-' },
];

const riskIndicators = [
  { risk: 'وثيقة انتهت صلاحيتها (شهادة التسجيل)', level: 'high', mitigation: 'قم بتجديدها فوراً عبر المنصة الحكومية' },
  { risk: 'ميزانية المشروع أقل من الحد الأدنى للمانح FII', level: 'medium', mitigation: 'أعد تقدير الميزانية أو استهدف جهات أخرى' },
  { risk: 'مؤشرات الأثر غير كافية لمعيار SRCA', level: 'medium', mitigation: 'أضف مؤشرات قياس كمية وتفصيلية' },
  { risk: 'قِصَر خبرة المؤسسة في القطاع البيئي', level: 'low', mitigation: 'استهدف جهات تمويل التعليم بشكل أساسي' },
];

const docStatusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  ready: { icon: CheckCircle2, color: 'text-emerald-500', label: 'جاهز' },
  missing: { icon: XCircle, color: 'text-red-500', label: 'مفقود' },
  expired: { icon: AlertTriangle, color: 'text-amber-500', label: 'منتهي الصلاحية' },
  partial: { icon: AlertCircle, color: 'text-blue-500', label: 'جزئي' },
};

const overallScore = 79;

export function FundingReadinessAssessment({ onNavigate }: FundingReadinessAssessmentProps) {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const scoreColor = overallScore >= 85 ? 'text-emerald-600' : overallScore >= 70 ? 'text-amber-600' : 'text-red-500';
  const scoreBarColor = overallScore >= 85 ? 'bg-emerald-500' : overallScore >= 70 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" fill="none" stroke="var(--muted)" strokeWidth="8" />
              <circle cx="56" cy="56" r="48" fill="none"
                stroke={overallScore >= 85 ? '#10b981' : overallScore >= 70 ? '#f59e0b' : '#f87171'}
                strokeWidth="8"
                strokeDasharray={`${(overallScore / 100) * 301.6} 301.6`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl ${scoreColor}`}>{overallScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-right">
            <h2 className="text-foreground mb-1">درجة جاهزية التمويل</h2>
            <p className={`text-sm mb-3 ${scoreColor}`}>
              {overallScore >= 85 ? 'ممتاز — مشروعك جاهز للتقديم الفوري' : overallScore >= 70 ? 'جيد — إصلاح بعض النقاط سيرفع فرصك بشكل كبير' : 'يحتاج تحسين — اتبع الإجراءات الموصى بها'}
            </p>
            <div className="space-y-2">
              {readinessDimensions.slice(0, 3).map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{d.score}%</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.score >= 85 ? 'bg-emerald-500' : d.score >= 70 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${d.score}%` }} />
                  </div>
                  <span className="text-xs text-foreground w-24 text-right">{d.subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Requirements */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h3 className="text-foreground">المتطلبات الناقصة</h3>
          </div>
          <div className="space-y-3">
            {missingRequirements.map(req => (
              <div key={req.id} className={`p-3 rounded-xl border ${req.priority === 'high' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20' : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex gap-1.5">
                    {req.canGenerate && (
                      <button className="flex items-center gap-1 text-xs px-2 py-0.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full border border-violet-200 dark:border-violet-800">
                        <Sparkles className="w-3 h-3" /> توليد بالذكاء الاصطناعي
                      </button>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${req.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/50' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/50'}`}>
                      {req.priority === 'high' ? 'ضروري' : 'مهم'}
                    </span>
                  </div>
                  <span className="text-sm text-foreground text-right">{req.req}</span>
                </div>
                <p className="text-xs text-muted-foreground text-right">{req.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-3 text-right">توزيع درجات الجاهزية</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={readinessDimensions}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
              <Radar name="الجاهزية" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip formatter={v => `${v}%`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-foreground">حالة الوثائق المطلوبة</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {missingDocuments.map(doc => {
            const cfg = docStatusConfig[doc.status];
            const Icon = cfg.icon;
            return (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="flex gap-2 flex-shrink-0">
                  {doc.status !== 'ready' && (
                    <button className="text-xs px-2 py-0.5 border border-border rounded text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1">
                      <Upload className="w-3 h-3" /> رفع
                    </button>
                  )}
                  {doc.required && <span className="text-xs text-red-500">*</span>}
                </div>
                <div className="flex-1 text-right">
                  <span className="text-sm text-foreground">{doc.doc}</span>
                </div>
                <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval Pipeline */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-foreground">مسار الاعتماد الداخلي</h3>
        </div>
        <div className="relative">
          <div className="absolute right-5 top-5 bottom-5 w-0.5 bg-border" />
          <div className="space-y-4">
            {approvalStatus.map((stage, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-right flex-1">
                  <p className="text-sm text-foreground">{stage.stage}</p>
                  <p className="text-xs text-muted-foreground">{stage.date}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${stage.status === 'done' ? 'bg-emerald-500' : stage.status === 'current' ? 'bg-primary' : 'bg-muted border-2 border-border'}`}>
                  {stage.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-white" /> : stage.status === 'current' ? <RefreshCw className="w-4 h-4 text-primary-foreground animate-spin" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h3 className="text-foreground">مؤشرات المخاطر</h3>
        </div>
        <div className="space-y-2">
          {riskIndicators.map((risk, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-3 p-3 hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedRisk(expandedRisk === i ? null : i)}
              >
                <div className="flex items-center gap-2">
                  {expandedRisk === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex items-center gap-2 flex-1 text-right">
                  <span className="text-sm text-foreground">{risk.risk}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${risk.level === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-950/50' : risk.level === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50' : 'bg-blue-100 text-blue-600 dark:bg-blue-950/50'}`}>
                    {risk.level === 'high' ? 'عالي' : risk.level === 'medium' ? 'متوسط' : 'منخفض'}
                  </span>
                </div>
              </button>
              {expandedRisk === i && (
                <div className="px-4 pb-3 text-right bg-muted/20">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <TrendingUp className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                    <span>{risk.mitigation}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
