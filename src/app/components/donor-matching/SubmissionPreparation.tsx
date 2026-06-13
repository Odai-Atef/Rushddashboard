import { useState } from 'react';
import {
  Send, Download, CheckCircle2, Circle, AlertCircle, FileText,
  Clock, Shield, Sparkles, ArrowLeft, Users, DollarSign, MapPin,
  Package, ChevronRight, Loader2, CheckCheck
} from 'lucide-react';

interface SubmissionPreparationProps {
  donorId: string;
  onNavigate: (view: string, donorId?: string) => void;
}

const donorInfo = {
  name: 'صندوق الملك عبدالعزيز للأبحاث',
  score: 94,
  deadline: '15 يوليو 2026',
  fundingRange: '200K – 2M ر.س',
  area: 'التعليم والبحث العلمي',
};

interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  note?: string;
}

const initialChecklist: ChecklistItem[] = [
  { id: '1', label: 'نموذج الطلب الرسمي مكتمل', required: true, checked: true },
  { id: '2', label: 'وصف المشروع التفصيلي (لا يقل عن 10 صفحات)', required: true, checked: true },
  { id: '3', label: 'الميزانية التفصيلية مع مبررات البنود', required: true, checked: true },
  { id: '4', label: 'خطة الاستدامة المالية', required: true, checked: false, note: 'يمكن توليدها بالذكاء الاصطناعي' },
  { id: '5', label: 'إطار قياس الأثر والنتائج', required: true, checked: false, note: 'يمكن توليدها بالذكاء الاصطناعي' },
  { id: '6', label: 'السيرة الذاتية للفريق المنفذ', required: true, checked: true },
  { id: '7', label: 'خطابات دعم من شركاء المشروع', required: false, checked: false },
  { id: '8', label: 'تقارير مشاريع مماثلة سابقة', required: false, checked: true },
];

const requiredDocuments = [
  { name: 'نموذج طلب التمويل (PDF)', status: 'ready', size: '2.4 MB' },
  { name: 'خطة المشروع التفصيلية', status: 'ready', size: '5.1 MB' },
  { name: 'الميزانية التفصيلية (Excel)', status: 'ready', size: '0.8 MB' },
  { name: 'شهادة التسجيل الرسمية', status: 'expired', size: '-' },
  { name: 'التقرير المالي السنوي 2025', status: 'missing', size: '-' },
  { name: 'خطة الاستدامة المالية', status: 'missing', size: '-' },
  { name: 'خريطة المستفيدين الجغرافية', status: 'ready', size: '1.2 MB' },
];

const submissionRequirements = [
  { label: 'طريقة التقديم', value: 'إلكترونياً عبر البوابة الرسمية' },
  { label: 'اللغة المطلوبة', value: 'العربية (مع ملخص إنجليزي)' },
  { label: 'الحد الأقصى للصفحات', value: '40 صفحة للطلب الكامل' },
  { label: 'صيغة الملفات', value: 'PDF — حجم أقصى 20 MB' },
  { label: 'المراجع المطلوبة', value: 'شريكان مؤسسيان على الأقل' },
  { label: 'المتابعة بعد التقديم', value: 'خلال 45 يوم عمل' },
];

const readinessSteps = [
  { label: 'استيفاء المتطلبات الأساسية', done: true },
  { label: 'اكتمال الوثائق الإلزامية', done: false },
  { label: 'مراجعة فريق المنسق', done: false },
  { label: 'اعتماد المشرف', done: false },
  { label: 'الإرسال للجهة المانحة', done: false },
];

export function SubmissionPreparation({ donorId, onNavigate }: SubmissionPreparationProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<string | null>(null);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);

  const checkedCount = checklist.filter(i => i.checked).length;
  const requiredChecked = checklist.filter(i => i.required && i.checked).length;
  const requiredTotal = checklist.filter(i => i.required).length;
  const pct = Math.round((checkedCount / checklist.length) * 100);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const handleGenerate = (id: string) => {
    setIsGenerating(true);
    setGeneratedItem(id);
    setTimeout(() => {
      setChecklist(prev => prev.map(i => i.id === id ? { ...i, checked: true } : i));
      setIsGenerating(false);
      setGeneratedItem(null);
    }, 2000);
  };

  const docStatusStyle: Record<string, string> = {
    ready: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
    missing: 'text-red-500 bg-red-50 dark:bg-red-950/40',
    expired: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  };
  const docStatusLabel: Record<string, string> = { ready: 'جاهز', missing: 'مفقود', expired: 'منتهي' };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => onNavigate('analysis', donorId)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> العودة لتحليل التطابق
      </button>

      {/* Donor Info */}
      <div className="bg-gradient-to-l from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="text-left">
            <div className="text-2xl opacity-90">{donorInfo.score}%</div>
            <div className="text-xs opacity-70">تطابق</div>
          </div>
          <div className="text-right flex-1">
            <p className="text-violet-200 text-xs mb-1">الجهة المانحة المستهدفة</p>
            <h2 className="text-lg mb-2">{donorInfo.name}</h2>
            <div className="flex flex-wrap gap-3 justify-end">
              <span className="flex items-center gap-1 text-xs text-violet-200"><Clock className="w-3.5 h-3.5" />{donorInfo.deadline}</span>
              <span className="flex items-center gap-1 text-xs text-violet-200"><DollarSign className="w-3.5 h-3.5" />{donorInfo.fundingRange}</span>
              <span className="flex items-center gap-1 text-xs text-violet-200"><MapPin className="w-3.5 h-3.5" />{donorInfo.area}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Progress */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground">{pct}%</span>
          <h3 className="text-foreground">حالة جاهزية التقديم</h3>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {readinessSteps.map((step, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border ${step.done ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'bg-muted border-border text-muted-foreground'}`}>
              {step.done ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
              {step.label}
            </div>
          ))}
        </div>
        {requiredChecked < requiredTotal && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-right">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {requiredTotal - requiredChecked} متطلبات إلزامية لم تكتمل بعد
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility Checklist */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-foreground">قائمة التحقق من الأهلية</h3>
          </div>
          <div className="space-y-2">
            {checklist.map(item => (
              <div key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${item.checked ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20' : 'border-border hover:bg-muted/30'}`}>
                <button onClick={() => toggleCheck(item.id)} className="mt-0.5 flex-shrink-0">
                  {item.checked
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <Circle className="w-4 h-4 text-muted-foreground" />
                  }
                </button>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-2 mb-0.5">
                    {!item.checked && item.note && (
                      <button
                        onClick={() => handleGenerate(item.id)}
                        disabled={isGenerating && generatedItem === item.id}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full border border-violet-200 dark:border-violet-800 hover:bg-violet-200 transition-colors disabled:opacity-70"
                      >
                        {isGenerating && generatedItem === item.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Sparkles className="w-3 h-3" />
                        }
                        {isGenerating && generatedItem === item.id ? 'جارٍ التوليد...' : 'توليد بالذكاء الاصطناعي'}
                      </button>
                    )}
                    {item.required && <span className="text-xs text-red-500">إلزامي</span>}
                  </div>
                  <p className={`text-sm ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-foreground">الوثائق المطلوبة</h3>
          </div>
          <div className="space-y-2 mb-5">
            {requiredDocuments.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2">
                  {doc.status === 'ready' && <span className="text-xs text-muted-foreground">{doc.size}</span>}
                  {doc.status !== 'ready' && (
                    <button className="text-xs px-2 py-0.5 border border-border rounded text-muted-foreground hover:bg-muted transition-colors">
                      رفع
                    </button>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${docStatusStyle[doc.status]}`}>
                    {docStatusLabel[doc.status]}
                  </span>
                </div>
                <span className="text-sm text-foreground text-right">{doc.name}</span>
              </div>
            ))}
          </div>

          {/* Submission Requirements */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm text-foreground mb-3 text-right">متطلبات التقديم</h4>
            <div className="space-y-2">
              {submissionRequirements.map((req, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-foreground text-right">{req.value}</span>
                  <span className="text-muted-foreground text-right flex-shrink-0">{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-foreground mb-4 text-right">إجراءات التقديم</h3>
        <div className="flex flex-wrap gap-3 justify-start">
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-l from-indigo-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            <Package className="w-4 h-4" /> توليد حزمة التقديم الكاملة
          </button>
          <button
            onClick={() => setSubmittedForApproval(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-colors ${submittedForApproval ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400' : 'border-border text-foreground hover:bg-muted'}`}
          >
            {submittedForApproval ? <CheckCheck className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {submittedForApproval ? 'تم الإرسال للاعتماد' : 'إرسال للاعتماد الداخلي'}
          </button>
          <button
            disabled={pct < 80}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" /> تعليم جاهز للإرسال
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> تحميل القائمة
          </button>
        </div>
        {pct < 80 && (
          <p className="text-xs text-muted-foreground mt-3 text-right flex items-center gap-1 justify-end">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            أكمل المتطلبات الناقصة لتفعيل زر الإرسال
          </p>
        )}
      </div>
    </div>
  );
}
