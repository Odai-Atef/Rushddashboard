import { useState } from 'react';
import {
  Search, Filter, Star, Bookmark, Send, Eye, Clock, MapPin,
  DollarSign, Tag, ChevronDown, Sparkles, SlidersHorizontal,
  Globe, CheckCircle2, AlertCircle, BookmarkCheck, ExternalLink
} from 'lucide-react';

interface AIRecommendedDonorsProps {
  onNavigate: (view: string, donorId?: string) => void;
}

interface Donor {
  id: string;
  name: string;
  nameEn: string;
  score: number;
  areas: string[];
  minFunding: string;
  maxFunding: string;
  status: 'open' | 'closing' | 'review' | 'closed';
  deadline: string;
  geography: string;
  sectors: string[];
  aiNote: string;
  saved: boolean;
  logo: string;
}

const donors: Donor[] = [
  {
    id: '1', name: 'صندوق الملك عبدالعزيز للأبحاث', nameEn: 'KACST',
    score: 94, areas: ['التعليم', 'البحث العلمي', 'التقنية'],
    minFunding: '200K', maxFunding: '2M', status: 'open', deadline: '15 يوليو 2026',
    geography: 'المملكة العربية السعودية', sectors: ['التعليم', 'الابتكار'],
    aiNote: 'تطابق ممتاز في مجال التعليم والبحث مع نسبة أهلية 96%',
    saved: false, logo: 'م'
  },
  {
    id: '2', name: 'مؤسسة أرامكو للاستدامة الاجتماعية', nameEn: 'Aramco Foundation',
    score: 89, areas: ['البيئة', 'المجتمع', 'الطاقة'],
    minFunding: '500K', maxFunding: '5M', status: 'open', deadline: '30 يوليو 2026',
    geography: 'المنطقة الشرقية والرياض', sectors: ['البيئة', 'الطاقة المتجددة'],
    aiNote: 'تطابق قوي في الاستدامة والمسؤولية الاجتماعية',
    saved: true, logo: 'أ'
  },
  {
    id: '3', name: 'صندوق تنمية المجتمع الخليجي', nameEn: 'GCC Community Fund',
    score: 83, areas: ['التنمية الاجتماعية', 'الصحة', 'التعليم'],
    minFunding: '100K', maxFunding: '1M', status: 'closing', deadline: '20 يوليو 2026',
    geography: 'دول الخليج العربي', sectors: ['التنمية المجتمعية'],
    aiNote: 'يستهدف مشاريع ذات أثر مجتمعي واسع النطاق',
    saved: false, logo: 'خ'
  },
  {
    id: '4', name: 'مؤسسة الوليد للإنسانية', nameEn: 'Alwaleed Philanthropies',
    score: 78, areas: ['التعليم', 'المرأة', 'الفقر'],
    minFunding: '250K', maxFunding: '3M', status: 'open', deadline: '10 أغسطس 2026',
    geography: 'عالمي مع تركيز على السعودية', sectors: ['التعليم', 'تمكين المرأة'],
    aiNote: 'تطابق جيد في مجال التعليم، يحتاج توضيح مؤشرات الأثر',
    saved: false, logo: 'و'
  },
  {
    id: '5', name: 'هيئة الهلال الأحمر السعودي', nameEn: 'SRCA',
    score: 71, areas: ['الصحة', 'الطوارئ', 'الإغاثة'],
    minFunding: '50K', maxFunding: '500K', status: 'review', deadline: '5 أغسطس 2026',
    geography: 'المملكة العربية السعودية', sectors: ['الصحة العامة'],
    aiNote: 'تطابق متوسط — يُنصح بمراجعة معايير الأهلية',
    saved: false, logo: 'ه'
  },
  {
    id: '6', name: 'مبادرة مستقبل الاستثمار (FII)', nameEn: 'FII Institute',
    score: 67, areas: ['الاقتصاد', 'التقنية', 'الابتكار'],
    minFunding: '1M', maxFunding: '10M', status: 'open', deadline: '1 سبتمبر 2026',
    geography: 'عالمي', sectors: ['التقنية', 'الاقتصاد الرقمي'],
    aiNote: 'الحد الأدنى للميزانية أعلى من ميزانية مشروعك الحالية',
    saved: false, logo: 'م'
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: 'مفتوح', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', icon: CheckCircle2 },
  closing: { label: 'ينتهي قريباً', color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400', icon: AlertCircle },
  review: { label: 'قيد المراجعة', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', icon: Clock },
  closed: { label: 'مغلق', color: 'bg-muted text-muted-foreground', icon: AlertCircle },
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? '#10b981' : score >= 80 ? '#6366f1' : score >= 70 ? '#f59e0b' : '#94a3b8';
  const r = 28, c = 175.9;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--muted)" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${(score / 100) * c} ${c}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm text-foreground leading-none">{score}%</span>
        <span className="text-[9px] text-muted-foreground">تطابق</span>
      </div>
    </div>
  );
}

export function AIRecommendedDonors({ onNavigate }: AIRecommendedDonorsProps) {
  const [search, setSearch] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [savedDonors, setSavedDonors] = useState<Set<string>>(new Set(['2']));

  const filtered = donors.filter(d => {
    const matchSearch = search === '' || d.name.includes(search) || d.areas.some(a => a.includes(search));
    const matchScore = filterScore === 'all' || (filterScore === 'high' && d.score >= 80) || (filterScore === 'medium' && d.score >= 60 && d.score < 80);
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchScore && matchStatus;
  });

  const toggleSave = (id: string) => {
    setSavedDonors(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* AI Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
        <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0" />
        <p className="text-sm text-violet-800 dark:text-violet-300 text-right flex-1">
          حلّل الذكاء الاصطناعي <strong>147 معياراً</strong> عبر <strong>6 أبعاد توافق</strong> لتحديد أفضل الجهات المانحة لمشروعك في <strong>التعليم والتنمية المجتمعية</strong>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن جهة مانحة أو مجال تمويل..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground text-right"
          />
        </div>
        <select value={filterScore} onChange={e => setFilterScore(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2.5 bg-background text-foreground">
          <option value="all">كل درجات التطابق</option>
          <option value="high">تطابق عالي (≥80%)</option>
          <option value="medium">تطابق متوسط (60-79%)</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2.5 bg-background text-foreground">
          <option value="all">كل الحالات</option>
          <option value="open">مفتوح</option>
          <option value="closing">ينتهي قريباً</option>
          <option value="review">قيد المراجعة</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground text-right">عرض {filtered.length} من {donors.length} جهة مانحة</p>

      {/* Donor Cards */}
      <div className="space-y-4">
        {filtered.map(donor => {
          const StatusIcon = statusConfig[donor.status].icon;
          const isSaved = savedDonors.has(donor.id);
          return (
            <div key={donor.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg flex-shrink-0">
                  {donor.logo}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <ScoreRing score={donor.score} />
                    <div>
                      <div className="flex items-center justify-end gap-2 mb-0.5">
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusConfig[donor.status].color}`}>
                          <StatusIcon className="w-3 h-3" />{statusConfig[donor.status].label}
                        </span>
                        <h3 className="text-foreground">{donor.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{donor.nameEn}</p>
                    </div>
                  </div>

                  {/* AI Note */}
                  <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900">
                    <Sparkles className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-violet-700 dark:text-violet-300 text-right">{donor.aiNote}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-end mb-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />{donor.deadline}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="w-3.5 h-3.5" />{donor.minFunding} – {donor.maxFunding} ر.س
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />{donor.geography}
                    </span>
                  </div>

                  {/* Areas */}
                  <div className="flex flex-wrap gap-1.5 justify-end mb-4">
                    {donor.areas.map(area => (
                      <span key={area} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{area}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-start gap-2 flex-wrap">
                    <button
                      onClick={() => onNavigate('submission', donor.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5" /> بدء التقديم
                    </button>
                    <button
                      onClick={() => toggleSave(donor.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors ${isSaved ? 'border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/30' : 'border-border text-foreground hover:bg-muted'}`}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      {isSaved ? 'محفوظ' : 'حفظ'}
                    </button>
                    <button
                      onClick={() => onNavigate('analysis', donor.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> تحليل التطابق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
