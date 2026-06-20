import {
  Shield,
  DollarSign,
  Users,
  Heart,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

export interface Question {
  id: string;
  question: string;
  type: 'scale' | 'yesno' | 'multiple';
  options?: string[];
  answer?: any;
}

export interface AssessmentCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  questions: Question[];
  score?: number;
}

export interface Strength {
  category: string;
  score: number;
  insight: string;
}

export interface Gap {
  category: string;
  severity: 'critical' | 'high' | 'medium';
  issue: string;
  recommendation: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  effort: string;
  impact: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export const categories: AssessmentCategory[] = [
  {
    id: 'governance',
    name: 'الحوكمة والامتثال',
    icon: Shield,
    questions: [
      { id: 'g1', question: 'هل لديك مجلس إدارة نشط ومستقل؟', type: 'yesno' },
      { id: 'g2', question: 'كم عدد اجتماعات مجلس الإدارة السنوية؟', type: 'scale' },
      { id: 'g3', question: 'هل لديكم سياسات وإجراءات موثقة؟', type: 'yesno' },
      { id: 'g4', question: 'مستوى الامتثال للأنظمة واللوائح', type: 'scale' }
    ],
    score: 85
  },
  {
    id: 'financial',
    name: 'الاستقرار المالي',
    icon: DollarSign,
    questions: [
      { id: 'f1', question: 'هل لديكم ميزانية سنوية معتمدة؟', type: 'yesno' },
      { id: 'f2', question: 'مستوى تنوع مصادر التمويل', type: 'scale' },
      { id: 'f3', question: 'هل تخضعون لتدقيق مالي خارجي؟', type: 'yesno' },
      { id: 'f4', question: 'نسبة السيولة المالية', type: 'scale' }
    ],
    score: 72
  },
  {
    id: 'hr',
    name: 'الموارد البشرية',
    icon: Users,
    questions: [
      { id: 'h1', question: 'عدد الموظفين بدوام كامل', type: 'scale' },
      { id: 'h2', question: 'هل لديكم خطة تطوير للموظفين؟', type: 'yesno' },
      { id: 'h3', question: 'مستوى رضا الموظفين', type: 'scale' },
      { id: 'h4', question: 'معدل الاحتفاظ بالموظفين', type: 'scale' }
    ],
    score: 68
  },
  {
    id: 'volunteers',
    name: 'إدارة المتطوعين',
    icon: Heart,
    questions: [
      { id: 'v1', question: 'عدد المتطوعين النشطين', type: 'scale' },
      { id: 'v2', question: 'هل لديكم برنامج تدريب للمتطوعين؟', type: 'yesno' },
      { id: 'v3', question: 'مستوى مشاركة المتطوعين', type: 'scale' },
      { id: 'v4', question: 'هل لديكم نظام لإدارة المتطوعين؟', type: 'yesno' }
    ],
    score: 78
  },
  {
    id: 'technology',
    name: 'التكنولوجيا والنضج الرقمي',
    icon: Zap,
    questions: [
      { id: 't1', question: 'هل لديكم موقع إلكتروني فعال؟', type: 'yesno' },
      { id: 't2', question: 'مستوى استخدام الأدوات الرقمية', type: 'scale' },
      { id: 't3', question: 'هل لديكم نظام لإدارة البيانات؟', type: 'yesno' },
      { id: 't4', question: 'مستوى الأمن السيبراني', type: 'scale' }
    ],
    score: 58
  },
  {
    id: 'projects',
    name: 'إدارة المشاريع',
    icon: Target,
    questions: [
      { id: 'p1', question: 'هل لديكم منهجية لإدارة المشاريع؟', type: 'yesno' },
      { id: 'p2', question: 'نسبة نجاح المشاريع المنفذة', type: 'scale' },
      { id: 'p3', question: 'هل تستخدمون أدوات لإدارة المشاريع؟', type: 'yesno' },
      { id: 'p4', question: 'مستوى توثيق المشاريع', type: 'scale' }
    ],
    score: 75
  },
  {
    id: 'fundraising',
    name: 'قدرة جمع التبرعات',
    icon: TrendingUp,
    questions: [
      { id: 'fr1', question: 'هل لديكم استراتيجية لجمع التبرعات؟', type: 'yesno' },
      { id: 'fr2', question: 'معدل نمو التبرعات السنوي', type: 'scale' },
      { id: 'fr3', question: 'عدد المانحين المنتظمين', type: 'scale' },
      { id: 'fr4', question: 'مستوى التواصل مع المانحين', type: 'scale' }
    ],
    score: 65
  },
  {
    id: 'impact',
    name: 'قياس الأثر',
    icon: BarChart3,
    questions: [
      { id: 'i1', question: 'هل لديكم مؤشرات أداء محددة؟', type: 'yesno' },
      { id: 'i2', question: 'مستوى قياس الأثر الاجتماعي', type: 'scale' },
      { id: 'i3', question: 'هل تصدرون تقارير أثر دورية؟', type: 'yesno' },
      { id: 'i4', question: 'مستوى استخدام البيانات في اتخاذ القرار', type: 'scale' }
    ],
    score: 70
  },
  {
    id: 'strategy',
    name: 'التخطيط الاستراتيجي',
    icon: Lightbulb,
    questions: [
      { id: 's1', question: 'هل لديكم خطة استراتيجية؟', type: 'yesno' },
      { id: 's2', question: 'مدى وضوح الرؤية والرسالة', type: 'scale' },
      { id: 's3', question: 'هل تراجعون الخطة الاستراتيجية بانتظام؟', type: 'yesno' },
      { id: 's4', question: 'مستوى تحقيق الأهداف الاستراتيجية', type: 'scale' }
    ],
    score: 80
  },
  {
    id: 'risk',
    name: 'إدارة المخاطر',
    icon: AlertTriangle,
    questions: [
      { id: 'r1', question: 'هل لديكم سجل للمخاطر؟', type: 'yesno' },
      { id: 'r2', question: 'مستوى إدارة المخاطر المالية', type: 'scale' },
      { id: 'r3', question: 'هل لديكم خطط طوارئ؟', type: 'yesno' },
      { id: 'r4', question: 'مستوى التأمين ضد المخاطر', type: 'scale' }
    ],
    score: 62
  }
];

export const overallScore = Math.round(
  categories.reduce((sum, cat) => sum + (cat.score || 0), 0) / categories.length
);

export const getReadinessLevel = (score: number) => {
  if (score >= 85) return { label: 'متميز', color: 'text-green-500', bg: 'bg-green-500' };
  if (score >= 70) return { label: 'جاهز', color: 'text-blue-500', bg: 'bg-blue-500' };
  if (score >= 55) return { label: 'متوسط', color: 'text-yellow-500', bg: 'bg-yellow-500' };
  return { label: 'يحتاج تحسين', color: 'text-red-500', bg: 'bg-red-500' };
};

export const readinessLevel = getReadinessLevel(overallScore);

export const radarData = categories.map(cat => ({
  category: cat.name.split(' ')[0],
  score: cat.score || 0,
  fullMark: 100
}));

export const strengths: Strength[] = [
  { category: 'الحوكمة والامتثال', score: 85, insight: 'لديكم هيكل حوكمة قوي ومجلس إدارة نشط مع امتثال ممتاز للأنظمة' },
  { category: 'التخطيط الاستراتيجي', score: 80, insight: 'رؤية واضحة وخطة استراتيجية محددة مع مراجعة دورية منتظمة' },
  { category: 'إدارة المتطوعين', score: 78, insight: 'برنامج متطوعين فعال مع مشاركة عالية ونظام إدارة منظم' }
];

export const gaps: Gap[] = [
  {
    category: 'التكنولوجيا والنضج الرقمي',
    severity: 'critical',
    issue: 'مستوى منخفض من التحول الرقمي وضعف في الأمن السيبراني',
    recommendation: 'الاستثمار في البنية التحتية التقنية وتدريب الفريق على الأدوات الرقمية'
  },
  {
    category: 'إدارة المخاطر',
    severity: 'high',
    issue: 'عدم وجود إطار شامل لإدارة المخاطر',
    recommendation: 'إنشاء سجل مخاطر وتطوير خطط طوارئ للمخاطر الحرجة'
  },
  {
    category: 'قدرة جمع التبرعات',
    severity: 'medium',
    issue: 'محدودية استراتيجيات جمع التبرعات وقاعدة محدودة من المانحين',
    recommendation: 'تطوير استراتيجية تنويع مصادر التمويل وبناء علاقات طويلة الأمد مع المانحين'
  }
];

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'r1',
    title: 'تطوير البنية التحتية التقنية',
    priority: 'high',
    effort: '3-6 أشهر',
    impact: 'عالي',
    category: 'التكنولوجيا',
    status: 'pending',
    dueDate: '2026-09-01'
  },
  {
    id: 'r2',
    title: 'إنشاء إطار إدارة المخاطر',
    priority: 'high',
    effort: '2-3 أشهر',
    impact: 'عالي',
    category: 'المخاطر',
    status: 'in-progress',
    dueDate: '2026-07-15'
  },
  {
    id: 'r3',
    title: 'تطوير استراتيجية جمع التبرعات',
    priority: 'medium',
    effort: '1-2 شهر',
    impact: 'متوسط',
    category: 'جمع التبرعات',
    status: 'in-progress',
    dueDate: '2026-07-01'
  },
  {
    id: 'r4',
    title: 'تحسين نظام قياس الأثر',
    priority: 'medium',
    effort: '2-4 أشهر',
    impact: 'عالي',
    category: 'قياس الأثر',
    status: 'pending',
    dueDate: '2026-08-15'
  },
  {
    id: 'r5',
    title: 'تعزيز القدرات المالية',
    priority: 'low',
    effort: '3-6 أشهر',
    impact: 'متوسط',
    category: 'المالية',
    status: 'pending',
    dueDate: '2026-10-01'
  }
];

export const progressData = [
  { month: 'يناير', score: 65 },
  { month: 'فبراير', score: 68 },
  { month: 'مارس', score: 70 },
  { month: 'أبريل', score: 71 },
  { month: 'مايو', score: 73 }
];

export const benchmarkData = [
  { name: 'منظمتك', value: overallScore, color: '#3b82f6' },
  { name: 'متوسط القطاع', value: 68, color: '#94a3b8' },
  { name: 'أفضل ممارسة', value: 85, color: '#10b981' }
];

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    default:
      return 'text-blue-500';
  }
};

export const getPriorityBg = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 border-red-500/20';
    case 'medium':
      return 'bg-yellow-500/10 border-yellow-500/20';
    default:
      return 'bg-blue-500/10 border-blue-500/20';
  }
};

export const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'عالي';
    case 'medium':
      return 'متوسط';
    default:
      return 'منخفض';
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    default:
      return 'text-yellow-500';
  }
};
