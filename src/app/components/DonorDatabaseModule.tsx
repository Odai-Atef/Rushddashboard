import { useState } from 'react';
import {
 Users,
 Building2,
 Calendar,
 TrendingUp,
 Search,
 Filter,
 Plus,
 Eye,
 Edit,
 MoreVertical,
 Globe,
 Mail,
 Phone,
 MapPin,
 DollarSign,
 FileText,
 CheckCircle2,
 AlertCircle,
 Clock,
 Target,
 Bookmark,
 ExternalLink,
 Download,
 Upload,
 Bell,
 Activity,
 BarChart3,
 PieChart,
 TrendingDown,
 Star,
 Flag,
 Link,
 Facebook,
 Twitter,
 Linkedin,
 Instagram,
 MessageSquare,
 Paperclip,
 XCircle,
 CheckCheck,
 ArrowRight,
 ArrowLeft,
 Grid3x3,
 List,
 CalendarDays,
 GitBranch,
 Zap,
 Award,
 Percent,
 Hash,
 RefreshCw,
 ChevronRight,
 ChevronDown,
 Info,
 AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

type ViewType = 'dashboard' | 'directory' | 'profile' | 'opportunities' | 'opportunity-details' | 'monitoring' | 'analytics';

interface Donor {
 id: string;
 name: string;
 nameEn: string;
 type: 'international' | 'local' | 'government' | 'private' | 'foundation';
 logo?: string;
 fundingAreas: string[];
 geographicCoverage: string[];
 minFunding: number;
 maxFunding: number;
 website: string;
 email: string;
 phone: string;
 country: string;
 city: string;
 socialMedia: {
 facebook?: string;
 twitter?: string;
 linkedin?: string;
 instagram?: string;
 };
 status: 'active' | 'inactive' | 'pending-verification';
 lastUpdated: string;
 totalOpportunities: number;
 activeOpportunities: number;
}

interface FundingOpportunity {
 id: string;
 name: string;
 donorId: string;
 donorName: string;
 openingDate: string;
 closingDate: string;
 minAmount: number;
 maxAmount: number;
 fundingArea: string;
 eligibilityStatus: 'eligible' | 'partially-eligible' | 'not-eligible' | 'needs-review';
 status: 'open' | 'closing-soon' | 'closed' | 'needs-verification';
 applicationLink: string;
 targetRegions: string[];
 requiredDocuments: string[];
 description: string;
}

interface Alert {
 id: string;
 type: 'new-opportunity' | 'closing-soon' | 'matching-project' | 'missed' | 'data-update';
 title: string;
 description: string;
 timestamp: string;
 priority: 'high' | 'medium' | 'low';
 read: boolean;
 relatedDonor?: string;
 relatedOpportunity?: string;
}

export function DonorDatabaseModule() {
 const [currentView, setCurrentView] = useState<ViewType>('dashboard');
 const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
 const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
 const [searchQuery, setSearchQuery] = useState('');
 const [directoryView, setDirectoryView] = useState<'table' | 'card'>('table');
 const [opportunityView, setOpportunityView] = useState<'list' | 'calendar' | 'timeline'>('list');

 console.log('✓ DonorDatabaseModule rendered');

 // Sample Data
 const donors: Donor[] = [
 {
 id: '1',
 name: 'جهه بيل وميليندا غيتس',
 nameEn: 'Bill & Melinda Gates Foundation',
 type: 'international',
 fundingAreas: ['التعليم', 'الصحة', 'التنمية الاقتصادية'],
 geographicCoverage: ['عالمي', 'الشرق الأوسط', 'أفريقيا'],
 minFunding: 100000,
 maxFunding: 5000000,
 website: 'https://www.gatesfoundation.org',
 email: 'info@gatesfoundation.org',
 phone: '+1-206-709-3100',
 country: 'الولايات المتحدة',
 city: 'سياتل',
 socialMedia: {
 twitter: '@gatesfoundation',
 linkedin: 'bill-melinda-gates-foundation'
 },
 status: 'active',
 lastUpdated: '2026-06-05',
 totalOpportunities: 12,
 activeOpportunities: 3
 },
 {
 id: '2',
 name: 'جهه الملك عبدالله للتنمية',
 nameEn: 'King Abdullah Foundation',
 type: 'local',
 fundingAreas: ['التعليم', 'الصحة', 'البحث العلمي', 'الابتكار'],
 geographicCoverage: ['السعودية', 'الخليج العربي'],
 minFunding: 50000,
 maxFunding: 2000000,
 website: 'https://www.kafd.gov.sa',
 email: 'info@kafd.gov.sa',
 phone: '+966-11-234-5678',
 country: 'السعودية',
 city: 'الرياض',
 socialMedia: {
 twitter: '@KAFoundation',
 linkedin: 'king-abdullah-foundation'
 },
 status: 'active',
 lastUpdated: '2026-06-06',
 totalOpportunities: 8,
 activeOpportunities: 2
 },
 {
 id: '3',
 name: 'الوكالة الأمريكية للتنمية الدولية',
 nameEn: 'USAID',
 type: 'government',
 fundingAreas: ['التنمية المجتمعية', 'الديمقراطية', 'البيئة', 'الزراعة'],
 geographicCoverage: ['عالمي', 'الشرق الأوسط'],
 minFunding: 200000,
 maxFunding: 10000000,
 website: 'https://www.usaid.gov',
 email: 'info@usaid.gov',
 phone: '+1-202-712-0000',
 country: 'الولايات المتحدة',
 city: 'واشنطن',
 socialMedia: {
 twitter: '@USAID',
 facebook: 'USAID',
 linkedin: 'usaid'
 },
 status: 'active',
 lastUpdated: '2026-06-07',
 totalOpportunities: 15,
 activeOpportunities: 5
 },
 {
 id: '4',
 name: 'جهه فورد',
 nameEn: 'Ford Foundation',
 type: 'foundation',
 fundingAreas: ['العدالة الاجتماعية', 'حقوق الإنسان', 'التعليم'],
 geographicCoverage: ['عالمي'],
 minFunding: 75000,
 maxFunding: 3000000,
 website: 'https://www.fordfoundation.org',
 email: 'office@fordfoundation.org',
 phone: '+1-212-573-5000',
 country: 'الولايات المتحدة',
 city: 'نيويورك',
 socialMedia: {
 twitter: '@FordFoundation',
 linkedin: 'ford-foundation'
 },
 status: 'active',
 lastUpdated: '2026-06-04',
 totalOpportunities: 10,
 activeOpportunities: 4
 }
 ];

 const opportunities: FundingOpportunity[] = [
 {
 id: '1',
 name: 'برنامج دعم التعليم في المناطق النائية',
 donorId: '1',
 donorName: 'جهه بيل وميليندا غيتس',
 openingDate: '2026-05-01',
 closingDate: '2026-07-15',
 minAmount: 150000,
 maxAmount: 1000000,
 fundingArea: 'التعليم',
 eligibilityStatus: 'eligible',
 status: 'open',
 applicationLink: 'https://gatesfoundation.org/apply/education-2026',
 targetRegions: ['الشرق الأوسط', 'أفريقيا'],
 requiredDocuments: ['خطة المشروع', 'الميزانية التفصيلية', 'السجل الضريبي', 'التقرير السنوي'],
 description: 'برنامج لدعم مبادرات التعليم في المناطق المحرومة'
 },
 {
 id: '2',
 name: 'مبادرة الابتكار في الصحة العامة',
 donorId: '2',
 donorName: 'جهه الملك عبدالله للتنمية',
 openingDate: '2026-06-01',
 closingDate: '2026-06-20',
 minAmount: 100000,
 maxAmount: 500000,
 fundingArea: 'الصحة',
 eligibilityStatus: 'eligible',
 status: 'closing-soon',
 applicationLink: 'https://kafd.gov.sa/health-innovation',
 targetRegions: ['السعودية', 'الخليج العربي'],
 requiredDocuments: ['خطة البحث', 'الميزانية', 'خطابات الدعم'],
 description: 'دعم مشاريع الابتكار في القطاع الصحي'
 },
 {
 id: '3',
 name: 'برنامج التنمية الزراعية المستدامة',
 donorId: '3',
 donorName: 'الوكالة الأمريكية للتنمية الدولية',
 openingDate: '2026-04-15',
 closingDate: '2026-08-30',
 minAmount: 250000,
 maxAmount: 2000000,
 fundingArea: 'الزراعة',
 eligibilityStatus: 'partially-eligible',
 status: 'open',
 applicationLink: 'https://usaid.gov/agriculture-2026',
 targetRegions: ['الشرق الأوسط', 'شمال أفريقيا'],
 requiredDocuments: ['خطة المشروع الكاملة', 'دراسة الجدوى', 'الميزانية', 'خطة الاستدامة'],
 description: 'تمويل مشاريع الزراعة المستدامة والأمن الغذائي'
 },
 {
 id: '4',
 name: 'منح حقوق الإنسان والعدالة',
 donorId: '4',
 donorName: 'جهه فورد',
 openingDate: '2026-03-01',
 closingDate: '2026-05-30',
 minAmount: 75000,
 maxAmount: 500000,
 fundingArea: 'حقوق الإنسان',
 eligibilityStatus: 'needs-review',
 status: 'closed',
 applicationLink: 'https://fordfoundation.org/human-rights',
 targetRegions: ['عالمي'],
 requiredDocuments: ['الخطة الإستراتيجية', 'الميزانية', 'التقرير المالي'],
 description: 'دعم منظمات حقوق الإنسان والعدالة الاجتماعية'
 },
 {
 id: '5',
 name: 'برنامج تمكين المرأة الاقتصادي',
 donorId: '1',
 donorName: 'جهه بيل وميليندا غيتس',
 openingDate: '2026-06-10',
 closingDate: '2026-09-15',
 minAmount: 200000,
 maxAmount: 1500000,
 fundingArea: 'التنمية الاقتصادية',
 eligibilityStatus: 'eligible',
 status: 'open',
 applicationLink: 'https://gatesfoundation.org/women-empowerment',
 targetRegions: ['عالمي'],
 requiredDocuments: ['خطة المشروع', 'الميزانية', 'دراسة الأثر'],
 description: 'تمويل برامج تمكين المرأة اقتصادياً'
 }
 ];

 const alerts: Alert[] = [
 {
 id: '1',
 type: 'closing-soon',
 title: 'فرصة تمويل تغلق قريباً',
 description: 'مبادرة الابتكار في الصحة العامة تغلق في 20 يونيو (متبقي 13 يوم)',
 timestamp: 'منذ ساعة',
 priority: 'high',
 read: false,
 relatedOpportunity: '2'
 },
 {
 id: '2',
 type: 'new-opportunity',
 title: 'فرصة تمويل جديدة',
 description: 'برنامج تمكين المرأة الاقتصادي - جهه بيل وميليندا غيتس',
 timestamp: 'منذ 3 ساعات',
 priority: 'medium',
 read: false,
 relatedOpportunity: '5'
 },
 {
 id: '3',
 type: 'matching-project',
 title: 'تطابق مع مشروع قائم',
 description: 'فرصة التعليم في المناطق النائية تتطابق مع برنامج الأسر المنتجة',
 timestamp: 'منذ يوم',
 priority: 'medium',
 read: true,
 relatedOpportunity: '1'
 },
 {
 id: '4',
 type: 'data-update',
 title: 'تحديث بيانات مطلوب',
 description: 'يرجى تحديث معلومات الاتصال لجهه الملك عبدالله للتنمية',
 timestamp: 'منذ يومين',
 priority: 'low',
 read: true,
 relatedDonor: '2'
 }
 ];

 // PAGE 1: Donor Dashboard
 const DashboardView = () => {
 const stats = {
 totalDonors: donors.length,
 activeDonors: donors.filter(d => d.status === 'active').length,
 openOpportunities: opportunities.filter(o => o.status === 'open' || o.status === 'closing-soon').length,
 upcomingDeadlines: opportunities.filter(o => o.status === 'closing-soon').length
 };

 const fundingTrendData = [
 { month: 'يناير', amount: 2.5 },
 { month: 'فبراير', amount: 3.2 },
 { month: 'مارس', amount: 2.8 },
 { month: 'أبريل', amount: 4.1 },
 { month: 'مايو', amount: 3.7 },
 { month: 'يونيو', amount: 4.5 }
 ];

 const opportunityByArea = [
 { name: 'التعليم', value: 35 },
 { name: 'الصحة', value: 25 },
 { name: 'التنمية', value: 20 },
 { name: 'البيئة', value: 12 },
 { name: 'أخرى', value: 8 }
 ];

 const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-3xl font-bold mb-2">لوحة قاعدة بيانات الجهات المانحة</h1>
 <p className="text-muted-foreground">نظرة شاملة على الجهات المانحة وفرص التمويل</p>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
 <div className="flex items-center justify-between mb-3">
 <Building2 className="w-8 h-8 text-primary" />
 <span className="text-sm text-[var(--primary)] flex items-center gap-[var(--spacing-small-gap)]">
 <TrendingUp className="w-4 h-4" />
 +12%
 </span>
 </div>
 <p className="text-3xl font-bold text-foreground">{stats.totalDonors}</p>
 <p className="text-sm text-muted-foreground mt-1">إجمالي الجهات المانحة</p>
 </div>

 <div className="bg-card rounded-xl p-6 border border-green-200 shadow-sm">
 <div className="flex items-center justify-between mb-3">
 <CheckCircle2 className="w-8 h-8 text-[var(--primary)]" />
 </div>
 <p className="text-3xl font-bold text-[var(--primary)]">{stats.activeDonors}</p>
 <p className="text-sm text-muted-foreground mt-1">جهات مانحة نشطة</p>
 </div>

 <div className="bg-card rounded-xl p-6 border border-[var(--secondary)]/[0.3] shadow-sm">
 <div className="flex items-center justify-between mb-3">
 <Target className="w-8 h-8 text-primary" />
 </div>
 <p className="text-3xl font-bold text-primary">{stats.openOpportunities}</p>
 <p className="text-sm text-muted-foreground mt-1">فرص تمويل مفتوحة</p>
 </div>

 <div className="bg-card rounded-xl p-6 border border-[var(--warning)]/[0.3] shadow-sm">
 <div className="flex items-center justify-between mb-3">
 <AlertCircle className="w-8 h-8 text-[var(--warning)]" />
 </div>
 <p className="text-3xl font-bold text-[var(--warning)]">{stats.upcomingDeadlines}</p>
 <p className="text-sm text-muted-foreground mt-1">مواعيد نهائية قريبة</p>
 </div>
 </div>

 {/* Charts Row */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Funding Trend */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <TrendingUp className="w-5 h-5 text-primary" />
 اتجاه الفرص التمويلية (مليون ريال)
 </h3>
 <ResponsiveContainer width="100%" height={250}>
 <LineChart data={fundingTrendData}>
 <CartesianGrid strokeDasharray="3 3" />
 <XAxis dataKey="month" />
 <YAxis />
 <Tooltip />
 <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
 </LineChart>
 </ResponsiveContainer>
 </div>

 {/* Opportunities by Area */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <PieChart className="w-5 h-5 text-[var(--primary)]" />
 توزيع الفرص حسب المجال
 </h3>
 <ResponsiveContainer width="100%" height={250}>
 <RePieChart>
 <Pie
 data={opportunityByArea}
 cx="50%"
 cy="50%"
 labelLine={false}
 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
 outerRadius={80}
 fill="#8884d8"
 dataKey="value"
 >
 {opportunityByArea.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 </RePieChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Recent Updates & Upcoming Deadlines */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Recent Updates */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold flex items-center gap-[var(--spacing-small-gap)]">
 <Activity className="w-5 h-5 text-purple-600" />
 آخر التحديثات
 </h3>
 <button className="text-sm text-primary hover:text-primary/80">عرض الكل</button>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 {[
 { donor: 'جهه بيل وميليندا غيتس', update: 'فرصة تمويل جديدة', time: 'منذ 3 ساعات', icon: Plus },
 { donor: 'USAID', update: 'تحديث متطلبات التقديم', time: 'منذ يوم', icon: RefreshCw },
 { donor: 'جهه الملك عبدالله', update: 'تمديد موعد التقديم', time: 'منذ يومين', icon: Calendar }
 ].map((item, idx) => (
 <div key={idx} className="flex items-start gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] bg-muted rounded-lg">
 <div className="p-[var(--spacing-small-gap)] bg-muted/[0.1] rounded-lg">
 <item.icon className="w-4 h-4 text-primary" />
 </div>
 <div className="flex-1">
 <p className="font-medium text-sm">{item.donor}</p>
 <p className="text-sm text-muted-foreground">{item.update}</p>
 <span className="text-xs text-muted-foreground">{item.time}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Upcoming Deadlines */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold flex items-center gap-[var(--spacing-small-gap)]">
 <Clock className="w-5 h-5 text-[var(--destructive)]" />
 المواعيد النهائية القادمة
 </h3>
 <button
 onClick={() => setCurrentView('opportunities')}
 className="text-sm text-primary hover:text-primary/80"
 >
 عرض الكل
 </button>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 {opportunities.filter(o => o.status === 'closing-soon').map((opp) => (
 <div key={opp.id} className="flex items-start justify-between p-[var(--spacing-card-padding)] bg-[var(--destructive)]/[0.08] rounded-lg border border-[var(--destructive)]/[0.3]">
 <div className="flex-1">
 <p className="font-medium text-sm">{opp.name}</p>
 <p className="text-sm text-muted-foreground mt-1">{opp.donorName}</p>
 </div>
 <div className="text-left">
 <span className="text-xs font-medium text-[var(--destructive)]">{opp.closingDate}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Quick Actions */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <button
 onClick={() => setCurrentView('directory')}
 className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
 >
 <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
 <p className="font-medium text-sm">تصفح الجهات المانحة</p>
 </button>
 <button
 onClick={() => setCurrentView('opportunities')}
 className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
 >
 <Target className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
 <p className="font-medium text-sm">فرص التمويل</p>
 </button>
 <button
 onClick={() => setCurrentView('monitoring')}
 className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
 >
 <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
 <p className="font-medium text-sm">التنبيهات والمتابعة</p>
 </button>
 <button
 onClick={() => setCurrentView('analytics')}
 className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
 >
 <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
 <p className="font-medium text-sm">التحليلات</p>
 </button>
 </div>
 </div>
 );
 };

 // PAGE 2: Donors Directory
 const DirectoryView = () => {
 const getDonorTypeLabel = (type: string) => {
 const labels: Record<string, string> = {
 'international': 'دولية',
 'local': 'محلية',
 'government': 'حكومية',
 'private': 'خاصة',
 'foundation': 'جهه'
 };
 return labels[type] || type;
 };

 const getDonorTypeColor = (type: string) => {
 const colors: Record<string, string> = {
 'international': 'bg-muted/[0.1] text-primary/80',
 'local': 'bg-[var(--primary)]/[0.1] text-[var(--primary)]',
 'government': 'bg-purple-100 text-purple-700',
 'private': 'bg-yellow-100 text-yellow-700',
 'foundation': 'bg-pink-100 text-pink-700'
 };
 return colors[type] || 'bg-muted text-foreground';
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold mb-2">دليل الجهات المانحة</h1>
 <p className="text-muted-foreground">تصفح جميع الجهات المانحة المسجلة</p>
 </div>
 <button className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 flex items-center gap-[var(--spacing-small-gap)]">
 <Plus className="w-5 h-5" />
 إضافة جهة مانحة
 </button>
 </div>

 {/* Search and Filters */}
 <div className="bg-card rounded-xl p-4 border border-border">
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 <div className="relative flex-1 min-w-64">
 <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="بحث عن جهة مانحة..."
 className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring"
 />
 </div>
 <select className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring">
 <option>جميع الأنواع</option>
 <option>دولية</option>
 <option>محلية</option>
 <option>حكومية</option>
 <option>خاصة</option>
 <option>جهه</option>
 </select>
 <select className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring">
 <option>جميع المجالات</option>
 <option>التعليم</option>
 <option>الصحة</option>
 <option>التنمية</option>
 <option>البيئة</option>
 </select>
 <div className="flex gap-[var(--spacing-small-gap)]">
 <button
 onClick={() => setDirectoryView('table')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${directoryView === 'table' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-muted'}`}
 >
 <List className="w-5 h-5" />
 </button>
 <button
 onClick={() => setDirectoryView('card')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${directoryView === 'card' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-muted'}`}
 >
 <Grid3x3 className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>

 {/* Table View */}
 {directoryView === 'table' && (
 <div className="bg-card rounded-xl border border-border">
 <table className="w-full">
 <thead className="border-b border-border">
 <tr>
 <th className="text-right p-4 font-semibold">الجهة المانحة</th>
 <th className="text-right p-4 font-semibold">النوع</th>
 <th className="text-right p-4 font-semibold">مجالات التمويل</th>
 <th className="text-right p-4 font-semibold">النطاق الجغرافي</th>
 <th className="text-right p-4 font-semibold">الفرص النشطة</th>
 <th className="text-right p-4 font-semibold">آخر تحديث</th>
 <th className="text-right p-4 font-semibold">إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {donors.map((donor) => (
 <tr key={donor.id} className="border-b border-border hover:bg-[var(--hover)]">
 <td className="p-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-10 h-10 bg-muted/[0.1] rounded-lg flex items-center justify-center">
 <Building2 className="w-5 h-5 text-primary" />
 </div>
 <div>
 <p className="font-semibold">{donor.name}</p>
 <p className="text-sm text-muted-foreground">{donor.nameEn}</p>
 </div>
 </div>
 </td>
 <td className="p-4">
 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDonorTypeColor(donor.type)}`}>
 {getDonorTypeLabel(donor.type)}
 </span>
 </td>
 <td className="p-4">
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 {donor.fundingAreas.slice(0, 2).map((area, idx) => (
 <span key={idx} className="px-2 py-1 bg-muted text-foreground text-xs rounded-lg">
 {area}
 </span>
 ))}
 {donor.fundingAreas.length > 2 && (
 <span className="px-2 py-1 bg-muted text-foreground text-xs rounded-lg">
 +{donor.fundingAreas.length - 2}
 </span>
 )}
 </div>
 </td>
 <td className="p-4 text-sm">{donor.geographicCoverage.slice(0, 2).join(', ')}</td>
 <td className="p-4">
 <span className="font-semibold text-primary">{donor.activeOpportunities}</span>
 <span className="text-muted-foreground text-sm"> / {donor.totalOpportunities}</span>
 </td>
 <td className="p-4 text-sm text-muted-foreground">{donor.lastUpdated}</td>
 <td className="p-4">
 <div className="flex gap-[var(--spacing-small-gap)]">
 <button
 onClick={() => {
 setSelectedDonor(donor.id);
 setCurrentView('profile');
 }}
 className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg"
 >
 <Eye className="w-4 h-4 text-muted-foreground" />
 </button>
 <button className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg">
 <Edit className="w-4 h-4 text-muted-foreground" />
 </button>
 <button className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg">
 <MoreVertical className="w-4 h-4 text-muted-foreground" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {/* Card View */}
 {directoryView === 'card' && (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {donors.map((donor) => (
 <div key={donor.id} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
 <div className="flex items-start justify-between mb-4">
 <div className="w-12 h-12 bg-muted/[0.1] rounded-lg flex items-center justify-center">
 <Building2 className="w-6 h-6 text-primary" />
 </div>
 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDonorTypeColor(donor.type)}`}>
 {getDonorTypeLabel(donor.type)}
 </span>
 </div>

 <h3 className="font-semibold mb-1">{donor.name}</h3>
 <p className="text-sm text-muted-foreground mb-4">{donor.nameEn}</p>

 <div className="space-y-[var(--spacing-small-gap)] mb-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <MapPin className="w-4 h-4 text-muted-foreground" />
 <span className="text-muted-foreground">{donor.city}, {donor.country}</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <Globe className="w-4 h-4 text-muted-foreground" />
 <span className="text-muted-foreground">{donor.geographicCoverage[0]}</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <Target className="w-4 h-4 text-muted-foreground" />
 <span className="text-primary font-semibold">{donor.activeOpportunities}</span>
 <span className="text-muted-foreground">فرصة نشطة</span>
 </div>
 </div>

 <div className="flex flex-wrap gap-[var(--spacing-small-gap)] mb-4">
 {donor.fundingAreas.slice(0, 3).map((area, idx) => (
 <span key={idx} className="px-2 py-1 bg-muted text-foreground text-xs rounded-lg">
 {area}
 </span>
 ))}
 </div>

 <div className="flex gap-[var(--spacing-small-gap)] pt-4 border-t border-border">
 <button
 onClick={() => {
 setSelectedDonor(donor.id);
 setCurrentView('profile');
 }}
 className="flex-1 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 text-sm"
 >
 عرض الملف
 </button>
 <button className="p-[var(--spacing-small-gap)] bg-muted rounded-lg hover:bg-muted">
 <Bookmark className="w-4 h-4 text-muted-foreground" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
 };

 // PAGE 3: Donor Profile
 const ProfileView = () => {
 const donor = donors.find(d => d.id === selectedDonor) || donors[0];
 const donorOpportunities = opportunities.filter(o => o.donorId === donor.id);

 return (
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <button
 onClick={() => setCurrentView('directory')}
 className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg"
 >
 <ArrowRight className="w-5 h-5" />
 </button>
 <div className="flex-1">
 <h1 className="text-3xl font-bold">{donor.name}</h1>
 <p className="text-muted-foreground">{donor.nameEn}</p>
 </div>
 <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted flex items-center gap-[var(--spacing-small-gap)]">
 <Edit className="w-4 h-4" />
 تعديل
 </button>
 <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 flex items-center gap-[var(--spacing-small-gap)]">
 <Bookmark className="w-4 h-4" />
 حفظ
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Main Info */}
 <div className="lg:col-span-2 space-y-6">
 {/* Basic Information */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Info className="w-5 h-5 text-primary" />
 المعلومات الأساسية
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="text-sm text-muted-foreground mb-1 block">النوع</label>
 <p className="font-medium">{donor.type === 'international' ? 'دولية' : donor.type === 'local' ? 'محلية' : 'حكومية'}</p>
 </div>
 <div>
 <label className="text-sm text-muted-foreground mb-1 block">الحالة</label>
 <span className="px-3 py-1 bg-[var(--primary)]/[0.1] text-[var(--primary)] rounded-full text-sm font-medium">
 {donor.status === 'active' ? 'نشط' : 'غير نشط'}
 </span>
 </div>
 <div>
 <label className="text-sm text-muted-foreground mb-1 block">الدولة</label>
 <p className="font-medium">{donor.country}</p>
 </div>
 <div>
 <label className="text-sm text-muted-foreground mb-1 block">المدينة</label>
 <p className="font-medium">{donor.city}</p>
 </div>
 </div>
 </div>

 {/* Contact Details */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Phone className="w-5 h-5 text-[var(--primary)]" />
 معلومات الاتصال
 </h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Globe className="w-5 h-5 text-muted-foreground" />
 <a href={donor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
 {donor.website}
 </a>
 <ExternalLink className="w-4 h-4 text-muted-foreground" />
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Mail className="w-5 h-5 text-muted-foreground" />
 <a href={`mailto:${donor.email}`} className="text-primary hover:underline">
 {donor.email}
 </a>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Phone className="w-5 h-5 text-muted-foreground" />
 <span>{donor.phone}</span>
 </div>
 </div>
 </div>

 {/* Social Media */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Share2 className="w-5 h-5 text-purple-600" />
 وسائل التواصل الاجتماعي
 </h3>
 <div className="flex gap-[var(--spacing-small-gap)]">
 {donor.socialMedia.twitter && (
 <a href={`https://twitter.com/${donor.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="p-[var(--spacing-card-padding)] bg-muted/[0.08] rounded-lg hover:bg-primary/20">
 <Twitter className="w-5 h-5 text-primary" />
 </a>
 )}
 {donor.socialMedia.linkedin && (
 <a href={`https://linkedin.com/company/${donor.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-[var(--spacing-card-padding)] bg-muted/[0.08] rounded-lg hover:bg-primary/20">
 <Linkedin className="w-5 h-5 text-primary" />
 </a>
 )}
 {donor.socialMedia.facebook && (
 <a href={`https://facebook.com/${donor.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="p-[var(--spacing-card-padding)] bg-muted/[0.08] rounded-lg hover:bg-primary/20">
 <Facebook className="w-5 h-5 text-primary" />
 </a>
 )}
 </div>
 </div>

 {/* Funding Areas */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Target className="w-5 h-5 text-[var(--warning)]" />
 مجالات التمويل
 </h3>
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 {donor.fundingAreas.map((area, idx) => (
 <span key={idx} className="px-4 py-2 bg-muted/[0.1] text-primary/80 rounded-lg font-medium">
 {area}
 </span>
 ))}
 </div>
 </div>

 {/* Geographic Coverage */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <MapPin className="w-5 h-5 text-[var(--destructive)]" />
 النطاق الجغرافي
 </h3>
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 {donor.geographicCoverage.map((region, idx) => (
 <span key={idx} className="px-4 py-2 bg-[var(--primary)]/[0.1] text-[var(--primary)] rounded-lg font-medium">
 {region}
 </span>
 ))}
 </div>
 </div>

 {/* Funding Range */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <DollarSign className="w-5 h-5 text-[var(--primary)]" />
 نطاق التمويل
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="p-4 bg-[var(--primary)]/[0.08] rounded-lg">
 <p className="text-sm text-muted-foreground mb-1">الحد الأدنى</p>
 <p className="text-2xl font-bold text-[var(--primary)]">{donor.minFunding.toLocaleString()} ريال</p>
 </div>
 <div className="p-4 bg-muted/[0.08] rounded-lg">
 <p className="text-sm text-muted-foreground mb-1">الحد الأقصى</p>
 <p className="text-2xl font-bold text-primary">{donor.maxFunding.toLocaleString()} ريال</p>
 </div>
 </div>
 </div>
 </div>

 {/* Sidebar */}
 <div className="space-y-6">
 {/* Quick Stats */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4">إحصائيات سريعة</h3>
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-sm text-muted-foreground">إجمالي الفرص</span>
 <span className="font-bold text-lg">{donor.totalOpportunities}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-muted-foreground">فرص نشطة</span>
 <span className="font-bold text-lg text-[var(--primary)]">{donor.activeOpportunities}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-muted-foreground">آخر تحديث</span>
 <span className="text-sm">{donor.lastUpdated}</span>
 </div>
 </div>
 </div>

 {/* Active Opportunities */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold">الفرص النشطة</h3>
 <button
 onClick={() => setCurrentView('opportunities')}
 className="text-sm text-primary hover:text-primary/80"
 >
 عرض الكل
 </button>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 {donorOpportunities.filter(o => o.status === 'open' || o.status === 'closing-soon').map((opp) => (
 <button
 key={opp.id}
 onClick={() => {
 setSelectedOpportunity(opp.id);
 setCurrentView('opportunity-details');
 }}
 className="w-full text-right p-[var(--spacing-card-padding)] bg-muted rounded-lg hover:bg-muted/[0.08] transition-colors"
 >
 <p className="font-medium text-sm mb-1">{opp.name}</p>
 <div className="flex items-center justify-between">
 <span className="text-xs text-muted-foreground">{opp.closingDate}</span>
 <span className={`px-2 py-1 text-xs rounded-full ${
 opp.status === 'closing-soon' ? 'bg-yellow-100 text-yellow-700' : 'bg-[var(--primary)]/[0.1] text-[var(--primary)]'
 }`}>
 {opp.status === 'closing-soon' ? 'تغلق قريباً' : 'مفتوحة'}
 </span>
 </div>
 </button>
 ))}
 </div>
 </div>

 {/* Communication History */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <MessageSquare className="w-5 h-5 text-purple-600" />
 سجل التواصل
 </h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 {[
 { type: 'email', date: '2026-06-05', note: 'طلب معلومات إضافية' },
 { type: 'call', date: '2026-05-28', note: 'مكالمة تنسيقية' },
 { type: 'meeting', date: '2026-05-15', note: 'اجتماع تعريفي' }
 ].map((item, idx) => (
 <div key={idx} className="p-[var(--spacing-card-padding)] bg-muted rounded-lg">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-1">
 {item.type === 'email' && <Mail className="w-4 h-4 text-primary" />}
 {item.type === 'call' && <Phone className="w-4 h-4 text-[var(--primary)]" />}
 {item.type === 'meeting' && <Users className="w-4 h-4 text-purple-600" />}
 <span className="text-xs text-muted-foreground">{item.date}</span>
 </div>
 <p className="text-sm">{item.note}</p>
 </div>
 ))}
 </div>
 <button className="w-full mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 text-sm">
 إضافة تواصل جديد
 </button>
 </div>
 </div>
 </div>
 </div>
 );
 };

 // PAGE 4: Funding Opportunities
 const OpportunitiesView = () => {
 const getStatusColor = (status: string) => {
 const colors: Record<string, string> = {
 'open': 'bg-[var(--primary)]/[0.1] text-[var(--primary)]',
 'closing-soon': 'bg-yellow-100 text-yellow-700',
 'closed': 'bg-muted text-foreground',
 'needs-verification': 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)]'
 };
 return colors[status] || 'bg-muted text-foreground';
 };

 const getStatusLabel = (status: string) => {
 const labels: Record<string, string> = {
 'open': 'مفتوحة',
 'closing-soon': 'تغلق قريباً',
 'closed': 'مغلقة',
 'needs-verification': 'تحتاج تحقق'
 };
 return labels[status] || status;
 };

 const getEligibilityColor = (status: string) => {
 const colors: Record<string, string> = {
 'eligible': 'bg-[var(--primary)]/[0.1] text-[var(--primary)]',
 'partially-eligible': 'bg-yellow-100 text-yellow-700',
 'not-eligible': 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)]',
 'needs-review': 'bg-muted/[0.1] text-primary/80'
 };
 return colors[status] || 'bg-muted text-foreground';
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold mb-2">فرص التمويل</h1>
 <p className="text-muted-foreground">تصفح جميع فرص التمويل المتاحة</p>
 </div>
 <button className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 flex items-center gap-[var(--spacing-small-gap)]">
 <Plus className="w-5 h-5" />
 إضافة فرصة
 </button>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="bg-card rounded-xl p-6 border border-green-200">
 <CheckCircle2 className="w-8 h-8 text-[var(--primary)] mb-3" />
 <p className="text-2xl font-bold text-[var(--primary)]">{opportunities.filter(o => o.status === 'open').length}</p>
 <p className="text-sm text-muted-foreground">فرص مفتوحة</p>
 </div>
 <div className="bg-card rounded-xl p-6 border border-[var(--warning)]/[0.3]">
 <Clock className="w-8 h-8 text-[var(--warning)] mb-3" />
 <p className="text-2xl font-bold text-[var(--warning)]">{opportunities.filter(o => o.status === 'closing-soon').length}</p>
 <p className="text-sm text-muted-foreground">تغلق قريباً</p>
 </div>
 <div className="bg-card rounded-xl p-6 border border-[var(--secondary)]/[0.3]">
 <Target className="w-8 h-8 text-primary mb-3" />
 <p className="text-2xl font-bold text-primary">{opportunities.filter(o => o.eligibilityStatus === 'eligible').length}</p>
 <p className="text-sm text-muted-foreground">فرص مؤهلة</p>
 </div>
 <div className="bg-card rounded-xl p-6 border border-border">
 <FileText className="w-8 h-8 text-muted-foreground mb-3" />
 <p className="text-2xl font-bold">{opportunities.length}</p>
 <p className="text-sm text-muted-foreground">إجمالي الفرص</p>
 </div>
 </div>

 {/* Filters and View Toggle */}
 <div className="bg-card rounded-xl p-4 border border-border">
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)] items-center">
 <div className="relative flex-1 min-w-64">
 <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
 <input
 type="text"
 placeholder="بحث عن فرصة..."
 className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring"
 />
 </div>
 <select className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring">
 <option>جميع الحالات</option>
 <option>مفتوحة</option>
 <option>تغلق قريباً</option>
 <option>مغلقة</option>
 </select>
 <select className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring">
 <option>جميع المجالات</option>
 <option>التعليم</option>
 <option>الصحة</option>
 <option>التنمية</option>
 </select>
 <div className="flex gap-[var(--spacing-small-gap)]">
 <button
 onClick={() => setOpportunityView('list')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${opportunityView === 'list' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-muted'}`}
 >
 <List className="w-5 h-5" />
 </button>
 <button
 onClick={() => setOpportunityView('calendar')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${opportunityView === 'calendar' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-muted'}`}
 >
 <CalendarDays className="w-5 h-5" />
 </button>
 <button
 onClick={() => setOpportunityView('timeline')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${opportunityView === 'timeline' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-muted'}`}
 >
 <GitBranch className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>

 {/* List View */}
 {opportunityView === 'list' && (
 <div className="bg-card rounded-xl border border-border">
 <table className="w-full">
 <thead className="border-b border-border">
 <tr>
 <th className="text-right p-4 font-semibold">اسم الفرصة</th>
 <th className="text-right p-4 font-semibold">الجهة المانحة</th>
 <th className="text-right p-4 font-semibold">تاريخ الإغلاق</th>
 <th className="text-right p-4 font-semibold">نطاق التمويل</th>
 <th className="text-right p-4 font-semibold">الأهلية</th>
 <th className="text-right p-4 font-semibold">الحالة</th>
 <th className="text-right p-4 font-semibold">إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {opportunities.map((opp) => (
 <tr key={opp.id} className="border-b border-border hover:bg-[var(--hover)]">
 <td className="p-4">
 <p className="font-semibold">{opp.name}</p>
 <p className="text-sm text-muted-foreground">{opp.fundingArea}</p>
 </td>
 <td className="p-4">{opp.donorName}</td>
 <td className="p-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Calendar className="w-4 h-4 text-muted-foreground" />
 <span className="text-sm">{opp.closingDate}</span>
 </div>
 </td>
 <td className="p-4">
 <p className="text-sm font-medium">{opp.minAmount.toLocaleString()} - {opp.maxAmount.toLocaleString()}</p>
 <p className="text-xs text-muted-foreground">ريال سعودي</p>
 </td>
 <td className="p-4">
 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEligibilityColor(opp.eligibilityStatus)}`}>
 {opp.eligibilityStatus === 'eligible' ? 'مؤهل' : opp.eligibilityStatus === 'partially-eligible' ? 'مؤهل جزئياً' : 'يحتاج مراجعة'}
 </span>
 </td>
 <td className="p-4">
 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(opp.status)}`}>
 {getStatusLabel(opp.status)}
 </span>
 </td>
 <td className="p-4">
 <div className="flex gap-[var(--spacing-small-gap)]">
 <button
 onClick={() => {
 setSelectedOpportunity(opp.id);
 setCurrentView('opportunity-details');
 }}
 className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg"
 >
 <Eye className="w-4 h-4 text-muted-foreground" />
 </button>
 <button className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg">
 <ExternalLink className="w-4 h-4 text-muted-foreground" />
 </button>
 <button className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg">
 <Bookmark className="w-4 h-4 text-muted-foreground" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {/* Calendar View */}
 {opportunityView === 'calendar' && (
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <CalendarDays className="w-5 h-5 text-primary" />
 عرض التقويم
 </h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 {opportunities.map((opp) => (
 <div key={opp.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
 <div className="text-center">
 <div className="w-16 h-16 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg flex flex-col items-center justify-center">
 <span className="text-2xl font-bold">{new Date(opp.closingDate).getDate()}</span>
 <span className="text-xs">يونيو</span>
 </div>
 </div>
 <div className="flex-1">
 <h4 className="font-semibold mb-1">{opp.name}</h4>
 <p className="text-sm text-muted-foreground mb-2">{opp.donorName}</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(opp.status)}`}>
 {getStatusLabel(opp.status)}
 </span>
 <span className="text-sm text-muted-foreground">
 {opp.minAmount.toLocaleString()} - {opp.maxAmount.toLocaleString()} ريال
 </span>
 </div>
 </div>
 <button
 onClick={() => {
 setSelectedOpportunity(opp.id);
 setCurrentView('opportunity-details');
 }}
 className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90"
 >
 التفاصيل
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Timeline View */}
 {opportunityView === 'timeline' && (
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-6 flex items-center gap-[var(--spacing-small-gap)]">
 <GitBranch className="w-5 h-5 text-purple-600" />
 الجدول الزمني
 </h3>
 <div className="space-y-6">
 {opportunities.map((opp, idx) => (
 <div key={opp.id} className="flex gap-4">
 <div className="flex flex-col items-center">
 <div className={`p-[var(--spacing-small-gap)] rounded-full ${getStatusColor(opp.status)}`}>
 <Target className="w-4 h-4" />
 </div>
 {idx < opportunities.length - 1 && (
 <div className="w-0.5 flex-1 bg-muted my-2"></div>
 )}
 </div>
 <div className="flex-1 pb-6">
 <div className="flex items-start justify-between mb-2">
 <div className="flex-1">
 <h4 className="font-semibold">{opp.name}</h4>
 <p className="text-sm text-muted-foreground mt-1">{opp.donorName}</p>
 </div>
 <span className="text-xs text-muted-foreground whitespace-nowrap mr-4">{opp.closingDate}</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)] mt-3">
 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(opp.status)}`}>
 {getStatusLabel(opp.status)}
 </span>
 <span className="text-sm text-muted-foreground">
 {opp.minAmount.toLocaleString()} - {opp.maxAmount.toLocaleString()} ريال
 </span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
 };

 // PAGE 5: Opportunity Details
 const OpportunityDetailsView = () => {
 const opportunity = opportunities.find(o => o.id === selectedOpportunity) || opportunities[0];
 const donor = donors.find(d => d.id === opportunity.donorId);

 return (
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <button
 onClick={() => setCurrentView('opportunities')}
 className="p-[var(--spacing-small-gap)] hover:bg-muted rounded-lg"
 >
 <ArrowRight className="w-5 h-5" />
 </button>
 <div className="flex-1">
 <h1 className="text-3xl font-bold">{opportunity.name}</h1>
 <p className="text-muted-foreground">{opportunity.donorName}</p>
 </div>
 <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted flex items-center gap-[var(--spacing-small-gap)]">
 <Download className="w-4 h-4" />
 تحميل
 </button>
 <a
 href={opportunity.applicationLink}
 target="_blank"
 rel="noopener noreferrer"
 className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 flex items-center gap-[var(--spacing-small-gap)]"
 >
 <ExternalLink className="w-4 h-4" />
 التقديم
 </a>
 </div>

 {/* Status Banner */}
 <div className={`p-6 rounded-xl ${
 opportunity.status === 'closing-soon' ? 'bg-[var(--warning)]/[0.1] border-2 border-[var(--warning)]/[0.3]' :
 opportunity.status === 'open' ? 'bg-[var(--primary)]/[0.08] border-2 border-green-200' :
 'bg-muted border-2 border-border'
 }`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 {opportunity.status === 'closing-soon' && <Clock className="w-8 h-8 text-[var(--warning)]" />}
 {opportunity.status === 'open' && <CheckCircle2 className="w-8 h-8 text-[var(--primary)]" />}
 <div>
 <p className="text-lg font-semibold">
 {opportunity.status === 'closing-soon' ? 'تحذير: تغلق قريباً' : 'الفرصة مفتوحة'}
 </p>
 <p className="text-sm text-muted-foreground mt-1">
 تاريخ الإغلاق: {opportunity.closingDate}
 </p>
 </div>
 </div>
 <span className={`px-4 py-2 rounded-full font-medium ${
 opportunity.eligibilityStatus === 'eligible' ? 'bg-[var(--primary)]/[0.1] text-[var(--primary)]' :
 opportunity.eligibilityStatus === 'partially-eligible' ? 'bg-yellow-100 text-yellow-700' :
 'bg-muted/[0.1] text-primary/80'
 }`}>
 {opportunity.eligibilityStatus === 'eligible' ? 'مؤهل' :
 opportunity.eligibilityStatus === 'partially-eligible' ? 'مؤهل جزئياً' :
 'يحتاج مراجعة'}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Main Content */}
 <div className="lg:col-span-2 space-y-6">
 {/* Description */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <FileText className="w-5 h-5 text-primary" />
 وصف الفرصة
 </h3>
 <p className="text-foreground leading-relaxed">{opportunity.description}</p>
 </div>

 {/* Funding Limits */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <DollarSign className="w-5 h-5 text-[var(--primary)]" />
 حدود التمويل
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="p-4 bg-[var(--primary)]/[0.08] rounded-lg">
 <p className="text-sm text-muted-foreground mb-1">الحد الأدنى</p>
 <p className="text-2xl font-bold text-[var(--primary)]">{opportunity.minAmount.toLocaleString()} ريال</p>
 </div>
 <div className="p-4 bg-muted/[0.08] rounded-lg">
 <p className="text-sm text-muted-foreground mb-1">الحد الأقصى</p>
 <p className="text-2xl font-bold text-primary">{opportunity.maxAmount.toLocaleString()} ريال</p>
 </div>
 </div>
 </div>

 {/* Target Regions */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <MapPin className="w-5 h-5 text-[var(--destructive)]" />
 المناطق المستهدفة
 </h3>
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 {opportunity.targetRegions.map((region, idx) => (
 <span key={idx} className="px-4 py-2 bg-[var(--destructive)]/[0.1] text-[var(--destructive)] rounded-lg font-medium">
 {region}
 </span>
 ))}
 </div>
 </div>

 {/* Required Documents */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Paperclip className="w-5 h-5 text-purple-600" />
 المستندات المطلوبة
 </h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 {opportunity.requiredDocuments.map((doc, idx) => (
 <div key={idx} className="flex items-center gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] bg-muted rounded-lg">
 <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
 <span>{doc}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Eligibility Criteria */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Award className="w-5 h-5 text-[var(--warning)]" />
 معايير الأهلية
 </h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle2 className="w-5 h-5 text-[var(--primary)] mt-1" />
 <div>
 <p className="font-medium">منظمة غير ربحية مسجلة</p>
 <p className="text-sm text-muted-foreground">يجب أن تكون المنظمة مسجلة رسمياً كمنظمة غير ربحية</p>
 </div>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle2 className="w-5 h-5 text-[var(--primary)] mt-1" />
 <div>
 <p className="font-medium">خبرة لا تقل عن سنتين</p>
 <p className="text-sm text-muted-foreground">سجل حافل في تنفيذ مشاريع مماثلة</p>
 </div>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <CheckCircle2 className="w-5 h-5 text-[var(--primary)] mt-1" />
 <div>
 <p className="font-medium">ميزانية واضحة ومفصلة</p>
 <p className="text-sm text-muted-foreground">خطة مالية شاملة مع تفاصيل التكاليف</p>
 </div>
 </div>
 </div>
 </div>

 {/* Application Process */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <GitBranch className="w-5 h-5 text-primary" />
 خطوات التقديم
 </h3>
 <div className="space-y-4">
 {[
 'التسجيل في بوابة التقديم الإلكترونية',
 'تعبئة نموذج الطلب الأولي',
 'رفع المستندات المطلوبة',
 'إرسال الطلب للمراجعة',
 'انتظار الرد (4-6 أسابيع)'
 ].map((step, idx) => (
 <div key={idx} className="flex items-start gap-[var(--spacing-small-gap)]">
 <div className="w-8 h-8 bg-muted/[0.1] rounded-full flex items-center justify-center flex-shrink-0">
 <span className="font-bold text-primary">{idx + 1}</span>
 </div>
 <p className="pt-1">{step}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Internal Notes */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <FileText className="w-5 h-5 text-[var(--warning)]" />
 ملاحظات داخلية
 </h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="p-4 bg-muted/[0.08] rounded-lg border border-[var(--secondary)]/[0.3]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
 <Info className="w-5 h-5 text-primary" />
 <span className="font-medium text-foreground">توصية</span>
 </div>
 <p className="text-sm text-foreground">
 هذه الفرصة مناسبة جداً لبرنامج الأسر المنتجة - يُنصح بالتقديم فوراً
 </p>
 </div>
 <button className="w-full px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-ring hover:bg-muted/[0.08] text-muted-foreground hover:text-primary transition-colors">
 + إضافة ملاحظة جديدة
 </button>
 </div>
 </div>
 </div>

 {/* Sidebar */}
 <div className="space-y-6">
 {/* Timeline */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4">الجدول الزمني</h3>
 <div className="space-y-4">
 <div>
 <p className="text-sm text-muted-foreground mb-1">تاريخ الفتح</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Calendar className="w-4 h-4 text-[var(--primary)]" />
 <span className="font-medium">{opportunity.openingDate}</span>
 </div>
 </div>
 <div>
 <p className="text-sm text-muted-foreground mb-1">تاريخ الإغلاق</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Calendar className="w-4 h-4 text-[var(--destructive)]" />
 <span className="font-medium">{opportunity.closingDate}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Donor Info */}
 {donor && (
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4">معلومات الجهة المانحة</h3>
 <button
 onClick={() => {
 setSelectedDonor(donor.id);
 setCurrentView('profile');
 }}
 className="w-full text-right hover:bg-[var(--hover)] p-[var(--spacing-card-padding)] rounded-lg transition-colors"
 >
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-3">
 <div className="w-10 h-10 bg-muted/[0.1] rounded-lg flex items-center justify-center">
 <Building2 className="w-5 h-5 text-primary" />
 </div>
 <div className="flex-1">
 <p className="font-semibold text-sm">{donor.name}</p>
 <p className="text-xs text-muted-foreground">{donor.nameEn}</p>
 </div>
 </div>
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <Globe className="w-4 h-4 text-muted-foreground" />
 <span className="text-muted-foreground">{donor.website}</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <Mail className="w-4 h-4 text-muted-foreground" />
 <span className="text-muted-foreground">{donor.email}</span>
 </div>
 </div>
 <div className="mt-3 pt-3 border-t border-border text-center">
 <span className="text-primary text-sm font-medium">عرض الملف الكامل →</span>
 </div>
 </button>
 </div>
 )}

 {/* Related Projects */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4">مشاريع ذات صلة</h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 {[
 { name: 'برنامج الأسر المنتجة', match: 95 },
 { name: 'مشروع التدريب المهني', match: 78 }
 ].map((project, idx) => (
 <div key={idx} className="p-[var(--spacing-card-padding)] bg-muted rounded-lg">
 <div className="flex items-center justify-between mb-2">
 <p className="font-medium text-sm">{project.name}</p>
 <span className="text-xs font-semibold text-[var(--primary)]">{project.match}%</span>
 </div>
 <div className="h-2 bg-muted rounded-full overflow-hidden">
 <div className="h-full bg-[var(--primary)]" style={{ width: `${project.match}%` }}></div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Actions */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4">إجراءات سريعة</h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 <button className="w-full px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 flex items-center justify-center gap-[var(--spacing-small-gap)]">
 <ExternalLink className="w-4 h-4" />
 فتح بوابة التقديم
 </button>
 <button className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted flex items-center justify-center gap-[var(--spacing-small-gap)]">
 <Bookmark className="w-4 h-4" />
 حفظ للمراجعة
 </button>
 <button className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted flex items-center justify-center gap-[var(--spacing-small-gap)]">
 <Share2 className="w-4 h-4" />
 مشاركة
 </button>
 <button className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted flex items-center justify-center gap-[var(--spacing-small-gap)]">
 <Download className="w-4 h-4" />
 تحميل PDF
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
 };

 // PAGE 6: Monitoring & Alerts
 const MonitoringView = () => {
 const getAlertIcon = (type: string) => {
 switch (type) {
 case 'new-opportunity': return <Plus className="w-5 h-5 text-primary" />;
 case 'closing-soon': return <Clock className="w-5 h-5 text-[var(--warning)]" />;
 case 'matching-project': return <Target className="w-5 h-5 text-[var(--primary)]" />;
 case 'missed': return <XCircle className="w-5 h-5 text-[var(--destructive)]" />;
 case 'data-update': return <RefreshCw className="w-5 h-5 text-purple-600" />;
 default: return <Bell className="w-5 h-5 text-muted-foreground" />;
 }
 };

 const getAlertTypeLabel = (type: string) => {
 const labels: Record<string, string> = {
 'new-opportunity': 'فرصة جديدة',
 'closing-soon': 'تغلق قريباً',
 'matching-project': 'تطابق مشروع',
 'missed': 'فرصة فائتة',
 'data-update': 'تحديث بيانات'
 };
 return labels[type] || type;
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold mb-2">مراقبة الفرص والتنبيهات</h1>
 <p className="text-muted-foreground">تتبع التحديثات والفرص الجديدة</p>
 </div>
 <button className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 flex items-center gap-[var(--spacing-small-gap)]">
 <CheckCheck className="w-5 h-5" />
 تعليم الكل كمقروء
 </button>
 </div>

 {/* Alert Stats */}
 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
 <div className="bg-card rounded-xl p-6 border border-[var(--secondary)]/[0.3]">
 <Plus className="w-8 h-8 text-primary mb-3" />
 <p className="text-2xl font-bold text-primary">
 {alerts.filter(a => a.type === 'new-opportunity').length}
 </p>
 <p className="text-sm text-muted-foreground">فرص جديدة</p>
 </div>
 <div className="bg-card rounded-xl p-6 border border-[var(--warning)]/[0.3]">
 <Clock className="w-8 h-8 text-[var(--warning)] mb-3" />
 <p className="text-2xl font-bold text-[var(--warning)]">
 {alerts.filter(a => a.type === 'closing-soon').length}
 </p>
 <p className="text-sm text-muted-foreground">تغلق قريباً</p>
 </div>
 <div className="bg-card rounded-xl p-6 border border-green-200">
 <Target className="w-8 h-8 text-[var(--primary)] mb-3" />
 <p className="text-2xl font-bold text-[var(--primary)]">
 {alerts.filter(a => a.type === 'matching-project').length}
 </p>
 <p className="text-sm text-muted-foreground">تطابق مشاريع</p>
 </div>
 <div className="bg-card rounded-xl p-6 border border-[var(--destructive)]/[0.3]">
 <XCircle className="w-8 h-8 text-[var(--destructive)] mb-3" />
 <p className="text-2xl font-bold text-[var(--destructive)]">0</p>
 <p className="text-sm text-muted-foreground">فرص فائتة</p>
 </div>
 <div className="bg-card rounded-xl p-6 border border-[var(--secondary)]/[0.2]">
 <RefreshCw className="w-8 h-8 text-purple-600 mb-3" />
 <p className="text-2xl font-bold text-purple-600">
 {alerts.filter(a => a.type === 'data-update').length}
 </p>
 <p className="text-sm text-muted-foreground">تحديثات</p>
 </div>
 </div>

 {/* Filters */}
 <div className="bg-card rounded-xl p-4 border border-border">
 <div className="flex flex-wrap gap-[var(--spacing-small-gap)]">
 <select className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring">
 <option>جميع الأنواع</option>
 <option>فرص جديدة</option>
 <option>تغلق قريباً</option>
 <option>تطابق مشاريع</option>
 <option>تحديثات البيانات</option>
 </select>
 <select className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring">
 <option>جميع الأولويات</option>
 <option>عالية</option>
 <option>متوسطة</option>
 <option>منخفضة</option>
 </select>
 <label className="flex items-center gap-[var(--spacing-small-gap)] px-4 py-2 cursor-pointer">
 <input type="checkbox" className="w-4 h-4" />
 <span className="text-sm">غير المقروء فقط</span>
 </label>
 </div>
 </div>

 {/* Alerts List */}
 <div className="space-y-[var(--spacing-small-gap)]">
 {alerts.map((alert) => (
 <div
 key={alert.id}
 className={`bg-card rounded-xl p-6 border ${
 !alert.read ? 'border-[var(--secondary)]/[0.3] shadow-md' : 'border-border'
 } hover:shadow-lg transition-shadow`}
 >
 <div className="flex items-start gap-4">
 <div className={`p-[var(--spacing-card-padding)] rounded-full ${!alert.read ? 'bg-muted/[0.08]' : 'bg-muted'}`}>
 {getAlertIcon(alert.type)}
 </div>
 <div className="flex-1">
 <div className="flex items-start justify-between mb-2">
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
 <h3 className="font-semibold">{alert.title}</h3>
 <span className={`px-2 py-1 text-xs rounded-full ${
 alert.priority === 'high' ? 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)]' :
 alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
 'bg-muted text-foreground'
 }`}>
 {alert.priority === 'high' ? 'عالية' : alert.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
 </span>
 {!alert.read && (
 <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
 )}
 </div>
 <p className="text-muted-foreground mb-3">{alert.description}</p>
 <div className="flex items-center gap-4">
 <span className="text-xs text-muted-foreground flex items-center gap-[var(--spacing-small-gap)]">
 <Clock className="w-3 h-3" />
 {alert.timestamp}
 </span>
 <span className="px-2 py-1 bg-muted text-foreground text-xs rounded-lg">
 {getAlertTypeLabel(alert.type)}
 </span>
 </div>
 </div>
 </div>
 <div className="flex gap-[var(--spacing-small-gap)] mt-4">
 {alert.type === 'new-opportunity' && (
 <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 text-sm">
 عرض الفرصة
 </button>
 )}
 {alert.type === 'closing-soon' && (
 <button className="px-4 py-2 bg-yellow-600 text-[var(--primary-foreground)] rounded-lg hover:bg-yellow-700 text-sm">
 عرض الفرصة
 </button>
 )}
 {alert.type === 'matching-project' && (
 <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/[0.9] text-sm">
 عرض التطابق
 </button>
 )}
 {!alert.read && (
 <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted text-sm">
 تعليم كمقروء
 </button>
 )}
 <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted text-sm">
 تجاهل
 </button>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Alert Settings */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Settings className="w-5 h-5 text-muted-foreground" />
 إعدادات التنبيهات
 </h3>
 <div className="space-y-[var(--spacing-small-gap)]">
 <label className="flex items-center justify-between p-[var(--spacing-card-padding)] bg-muted rounded-lg cursor-pointer">
 <span>تنبيهات الفرص الجديدة</span>
 <input type="checkbox" defaultChecked className="w-5 h-5" />
 </label>
 <label className="flex items-center justify-between p-[var(--spacing-card-padding)] bg-muted rounded-lg cursor-pointer">
 <span>تنبيهات المواعيد النهائية</span>
 <input type="checkbox" defaultChecked className="w-5 h-5" />
 </label>
 <label className="flex items-center justify-between p-[var(--spacing-card-padding)] bg-muted rounded-lg cursor-pointer">
 <span>تنبيهات تطابق المشاريع</span>
 <input type="checkbox" defaultChecked className="w-5 h-5" />
 </label>
 <label className="flex items-center justify-between p-[var(--spacing-card-padding)] bg-muted rounded-lg cursor-pointer">
 <span>تنبيهات البريد الإلكتروني</span>
 <input type="checkbox" className="w-5 h-5" />
 </label>
 </div>
 </div>
 </div>
 );
 };

 // PAGE 7: Donor Analytics
 const AnalyticsView = () => {
 const donorGrowthData = [
 { month: 'يناير', count: 45 },
 { month: 'فبراير', count: 52 },
 { month: 'مارس', count: 48 },
 { month: 'أبريل', count: 65 },
 { month: 'مايو', count: 58 },
 { month: 'يونيو', count: 72 }
 ];

 const fundingCategoryData = [
 { category: 'التعليم', amount: 8.5 },
 { category: 'الصحة', amount: 6.2 },
 { category: 'التنمية', amount: 5.8 },
 { category: 'البيئة', amount: 3.4 },
 { category: 'البحث', amount: 4.1 }
 ];

 const geographicData = [
 { name: 'السعودية', value: 35 },
 { name: 'الخليج', value: 25 },
 { name: 'الشرق الأوسط', value: 20 },
 { name: 'عالمي', value: 20 }
 ];

 const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-3xl font-bold mb-2">تحليلات الجهات المانحة</h1>
 <p className="text-muted-foreground">رؤى شاملة عن الجهات المانحة وفرص التمويل</p>
 </div>

 {/* Key Metrics */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/90 rounded-xl p-6 text-[var(--primary-foreground)]">
 <Building2 className="w-8 h-8 mb-3 opacity-80" />
 <p className="text-3xl font-bold">{donors.length}</p>
 <p className="text-sm opacity-80 mt-1">إجمالي الجهات المانحة</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)] mt-2">
 <TrendingUp className="w-4 h-4" />
 <span className="text-sm">+18% من الشهر الماضي</span>
 </div>
 </div>

 <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-[var(--primary-foreground)]">
 <Target className="w-8 h-8 mb-3 opacity-80" />
 <p className="text-3xl font-bold">{opportunities.length}</p>
 <p className="text-sm opacity-80 mt-1">فرص تمويل متاحة</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)] mt-2">
 <TrendingUp className="w-4 h-4" />
 <span className="text-sm">+25% من الشهر الماضي</span>
 </div>
 </div>

 <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-[var(--primary-foreground)]">
 <DollarSign className="w-8 h-8 mb-3 opacity-80" />
 <p className="text-3xl font-bold">28M</p>
 <p className="text-sm opacity-80 mt-1">إجمالي التمويل المتاح</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)] mt-2">
 <TrendingUp className="w-4 h-4" />
 <span className="text-sm">+12% من الشهر الماضي</span>
 </div>
 </div>

 <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-[var(--primary-foreground)]">
 <Percent className="w-8 h-8 mb-3 opacity-80" />
 <p className="text-3xl font-bold">78%</p>
 <p className="text-sm opacity-80 mt-1">معدل التطابق</p>
 <div className="flex items-center gap-[var(--spacing-small-gap)] mt-2">
 <TrendingUp className="w-4 h-4" />
 <span className="text-sm">+5% من الشهر الماضي</span>
 </div>
 </div>
 </div>

 {/* Charts Row 1 */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Donor Growth */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <TrendingUp className="w-5 h-5 text-primary" />
 نمو قاعدة الجهات المانحة
 </h3>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={donorGrowthData}>
 <CartesianGrid strokeDasharray="3 3" />
 <XAxis dataKey="month" />
 <YAxis />
 <Tooltip />
 <Bar dataKey="count" fill="#3b82f6" />
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Funding by Category */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
 التمويل حسب الفئة (مليون ريال)
 </h3>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={fundingCategoryData} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" />
 <XAxis type="number" />
 <YAxis type="category" dataKey="category" />
 <Tooltip />
 <Bar dataKey="amount" fill="#10b981" />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Charts Row 2 */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Geographic Distribution */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <MapPin className="w-5 h-5 text-[var(--destructive)]" />
 التوزيع الجغرافي
 </h3>
 <ResponsiveContainer width="100%" height={300}>
 <RePieChart>
 <Pie
 data={geographicData}
 cx="50%"
 cy="50%"
 labelLine={false}
 label={({ name, value }) => `${name}: ${value}%`}
 outerRadius={100}
 fill="#8884d8"
 dataKey="value"
 >
 {geographicData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 </RePieChart>
 </ResponsiveContainer>
 </div>

 {/* Engagement Metrics */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Activity className="w-5 h-5 text-purple-600" />
 مقاييس المشاركة
 </h3>
 <div className="space-y-4">
 {[
 { label: 'معدل الاستجابة', value: 85, color: 'bg-[var(--primary)]' },
 { label: 'معدل نجاح التقديم', value: 62, color: 'bg-[var(--primary)]' },
 { label: 'معدل التجديد', value: 78, color: 'bg-purple-600' },
 { label: 'متوسط وقت المعالجة', value: 45, color: 'bg-yellow-600' }
 ].map((metric, idx) => (
 <div key={idx}>
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm text-muted-foreground">{metric.label}</span>
 <span className="font-semibold">{metric.value}%</span>
 </div>
 <div className="h-2 bg-muted rounded-full overflow-hidden">
 <div className={`h-full ${metric.color}`} style={{ width: `${metric.value}%` }}></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Top Donors */}
 <div className="bg-card rounded-xl p-6 border border-border">
 <h3 className="font-semibold mb-4 flex items-center gap-[var(--spacing-small-gap)]">
 <Award className="w-5 h-5 text-[var(--warning)]" />
 أفضل الجهات المانحة
 </h3>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="border-b border-border">
 <tr>
 <th className="text-right p-4 font-semibold">المرتبة</th>
 <th className="text-right p-4 font-semibold">الجهة المانحة</th>
 <th className="text-right p-4 font-semibold">عدد الفرص</th>
 <th className="text-right p-4 font-semibold">إجمالي التمويل</th>
 <th className="text-right p-4 font-semibold">معدل النجاح</th>
 <th className="text-right p-4 font-semibold">التقييم</th>
 </tr>
 </thead>
 <tbody>
 {donors.map((donor, idx) => (
 <tr key={donor.id} className="border-b border-border hover:bg-[var(--hover)]">
 <td className="p-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <Hash className="w-4 h-4 text-muted-foreground" />
 <span className="font-bold">{idx + 1}</span>
 </div>
 </td>
 <td className="p-4">
 <p className="font-medium">{donor.name}</p>
 <p className="text-sm text-muted-foreground">{donor.nameEn}</p>
 </td>
 <td className="p-4 font-semibold">{donor.totalOpportunities}</td>
 <td className="p-4">
 <p className="font-semibold">{(donor.maxFunding / 1000000).toFixed(1)}M</p>
 <p className="text-xs text-muted-foreground">ريال سعودي</p>
 </td>
 <td className="p-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
 <div className="h-full bg-[var(--primary)]" style={{ width: '75%' }}></div>
 </div>
 <span className="font-medium text-sm">75%</span>
 </div>
 </td>
 <td className="p-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 {[1, 2, 3, 4, 5].map((star) => (
 <Star key={star} className="w-4 h-4 fill-yellow-400 text-[var(--warning)]" />
 ))}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
 };

 // Render views
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-6">
 {currentView === 'dashboard' && <DashboardView />}
 {currentView === 'directory' && <DirectoryView />}
 {currentView === 'profile' && <ProfileView />}
 {currentView === 'opportunities' && <OpportunitiesView />}
 {currentView === 'opportunity-details' && <OpportunityDetailsView />}
 {currentView === 'monitoring' && <MonitoringView />}
 {currentView === 'analytics' && <AnalyticsView />}
 </div>
 );
}
