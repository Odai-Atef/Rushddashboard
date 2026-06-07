import { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
  Download,
  Upload,
  Edit,
  Trash2,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  List,
  GanttChart,
  Save,
  GitBranch,
  History,
  Activity,
  BarChart3,
  Target,
  Building2,
  MapPin,
  User,
  Eye,
  RefreshCw,
  Lightbulb,
  Circle,
  Check,
  Send,
  Paperclip
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

type ViewType = 'dashboard' | 'list' | 'create' | 'details' | 'lifecycle' | 'versions' | 'activity' | 'reporting';
type ListViewMode = 'table' | 'kanban' | 'timeline';

interface Project {
  id: string;
  name: string;
  organization: string;
  type: string;
  category: string;
  status: ProjectStatus;
  budget: number;
  duration: string;
  startDate: string;
  endDate: string;
  progress: number;
  manager: string;
  description: string;
  beneficiaries: string;
  geographicScope: string;
  lastUpdated: string;
  version: number;
  health: 'excellent' | 'good' | 'at-risk' | 'critical';
}

type ProjectStatus =
  | 'draft'
  | 'charity-review'
  | 'incubator-modifications'
  | 'charity-approval'
  | 'pm-approval'
  | 'financial-approval'
  | 'approved'
  | 'design-team'
  | 'ready-donor'
  | 'submitted-donor'
  | 'funded'
  | 'execution'
  | 'completed'
  | 'closed';

interface ProjectVersion {
  id: string;
  version: number;
  author: string;
  date: string;
  summary: string;
  changes: string[];
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
  type: 'created' | 'updated' | 'status-change' | 'approval' | 'assignment' | 'upload';
}

export function ProjectManagementModule() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [listViewMode, setListViewMode] = useState<ListViewMode>('table');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const projects: Project[] = [
    {
      id: '1',
      name: 'برنامج الأسر المنتجة',
      organization: 'جمعية البر الخيرية',
      type: 'تنموي',
      category: 'التمكين الاقتصادي',
      status: 'execution',
      budget: 250000,
      duration: '12 شهر',
      startDate: '2026-01-15',
      endDate: '2027-01-15',
      progress: 65,
      manager: 'أحمد محمد',
      description: 'برنامج لتمكين الأسر المحتاجة اقتصادياً من خلال تدريبهم على مهارات إنتاجية وتوفير التمويل اللازم',
      beneficiaries: '150 أسرة',
      geographicScope: 'مدينة الرياض',
      lastUpdated: '2026-06-05',
      version: 3,
      health: 'good'
    },
    {
      id: '2',
      name: 'مشروع كفالة الأيتام',
      organization: 'مؤسسة الرعاية الاجتماعية',
      type: 'خيري',
      category: 'كفالة ورعاية',
      status: 'funded',
      budget: 500000,
      duration: '24 شهر',
      startDate: '2026-02-01',
      endDate: '2028-02-01',
      progress: 30,
      manager: 'فاطمة أحمد',
      description: 'برنامج كفالة ورعاية شاملة للأيتام تشمل التعليم والصحة والسكن',
      beneficiaries: '200 يتيم',
      geographicScope: 'المنطقة الشرقية',
      lastUpdated: '2026-06-06',
      version: 2,
      health: 'excellent'
    },
    {
      id: '3',
      name: 'برنامج التدريب المهني',
      organization: 'جمعية التنمية المجتمعية',
      type: 'تدريبي',
      category: 'التعليم والتدريب',
      status: 'pm-approval',
      budget: 180000,
      duration: '8 أشهر',
      startDate: '2026-03-01',
      endDate: '2026-11-01',
      progress: 0,
      manager: 'خالد سعيد',
      description: 'تدريب الشباب على المهارات المهنية المطلوبة في سوق العمل',
      beneficiaries: '100 متدرب',
      geographicScope: 'جدة',
      lastUpdated: '2026-06-07',
      version: 1,
      health: 'good'
    },
    {
      id: '4',
      name: 'مبادرة الإفطار الصباحي',
      organization: 'جمعية الخير',
      type: 'إغاثي',
      category: 'الإغاثة الإنسانية',
      status: 'charity-review',
      budget: 120000,
      duration: '6 أشهر',
      startDate: '2026-04-01',
      endDate: '2026-10-01',
      progress: 0,
      manager: 'سارة علي',
      description: 'توفير وجبات إفطار صحية للطلاب المحتاجين في المدارس',
      beneficiaries: '500 طالب',
      geographicScope: 'المدينة المنورة',
      lastUpdated: '2026-06-07',
      version: 1,
      health: 'at-risk'
    },
    {
      id: '5',
      name: 'مشروع الرعاية الصحية المتنقلة',
      organization: 'مؤسسة الصحة للجميع',
      type: 'صحي',
      category: 'الرعاية الصحية',
      status: 'draft',
      budget: 350000,
      duration: '18 شهر',
      startDate: '2026-05-01',
      endDate: '2027-11-01',
      progress: 0,
      manager: 'محمد عبدالله',
      description: 'عيادات صحية متنقلة لخدمة المناطق النائية وتقديم الرعاية الصحية الأولية',
      beneficiaries: '3000 مستفيد',
      geographicScope: 'القصيم',
      lastUpdated: '2026-06-07',
      version: 1,
      health: 'good'
    }
  ];

  const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
    'draft': { label: 'مسودة', color: '#6b7280', bg: '#f3f4f6' },
    'charity-review': { label: 'مراجعة الجمعية', color: '#3b82f6', bg: '#dbeafe' },
    'incubator-modifications': { label: 'تعديلات الحاضنة', color: '#f59e0b', bg: '#fef3c7' },
    'charity-approval': { label: 'موافقة الجمعية', color: '#8b5cf6', bg: '#ede9fe' },
    'pm-approval': { label: 'موافقة مدير المشروع', color: '#ec4899', bg: '#fce7f3' },
    'financial-approval': { label: 'موافقة مالية', color: '#14b8a6', bg: '#ccfbf1' },
    'approved': { label: 'معتمد', color: '#10b981', bg: '#d1fae5' },
    'design-team': { label: 'فريق التصميم', color: '#6366f1', bg: '#e0e7ff' },
    'ready-donor': { label: 'جاهز للمانحين', color: '#06b6d4', bg: '#cffafe' },
    'submitted-donor': { label: 'مقدم للمانحين', color: '#0891b2', bg: '#cffafe' },
    'funded': { label: 'ممول', color: '#10b981', bg: '#d1fae5' },
    'execution': { label: 'قيد التنفيذ', color: '#3b82f6', bg: '#dbeafe' },
    'completed': { label: 'مكتمل', color: '#22c55e', bg: '#dcfce7' },
    'closed': { label: 'مغلق', color: '#6b7280', bg: '#f3f4f6' }
  };

  const healthConfig = {
    'excellent': { label: 'ممتاز', color: '#10b981', icon: CheckCircle2 },
    'good': { label: 'جيد', color: '#3b82f6', icon: CheckCircle2 },
    'at-risk': { label: 'معرض للخطر', color: '#f59e0b', icon: AlertCircle },
    'critical': { label: 'حرج', color: '#ef4444', icon: XCircle }
  };

  // PAGE 1: Projects Dashboard
  const DashboardView = () => {
    const stats = {
      total: projects.length,
      active: projects.filter(p => ['execution', 'funded'].includes(p.status)).length,
      draft: projects.filter(p => p.status === 'draft').length,
      awaitingApproval: projects.filter(p => p.status.includes('approval')).length,
      approved: projects.filter(p => p.status === 'approved').length,
      funded: projects.filter(p => p.status === 'funded').length,
      completed: projects.filter(p => p.status === 'completed').length
    };

    const statusDistribution = [
      { name: 'مسودة', value: projects.filter(p => p.status === 'draft').length, color: '#6b7280' },
      { name: 'قيد المراجعة', value: projects.filter(p => p.status.includes('review') || p.status.includes('approval')).length, color: '#3b82f6' },
      { name: 'معتمد', value: projects.filter(p => p.status === 'approved').length, color: '#10b981' },
      { name: 'ممول', value: projects.filter(p => p.status === 'funded').length, color: '#22c55e' },
      { name: 'قيد التنفيذ', value: projects.filter(p => p.status === 'execution').length, color: '#06b6d4' },
      { name: 'مكتمل', value: projects.filter(p => p.status === 'completed').length, color: '#8b5cf6' }
    ];

    const budgetTrend = [
      { month: 'يناير', budget: 450000 },
      { month: 'فبراير', budget: 680000 },
      { month: 'مارس', budget: 820000 },
      { month: 'أبريل', budget: 950000 },
      { month: 'مايو', budget: 1150000 },
      { month: 'يونيو', budget: 1400000 }
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة المشاريع</h1>
            <p className="text-gray-600">نظرة شاملة على جميع المشاريع والأنشطة</p>
          </div>
          <button
            onClick={() => setCurrentView('create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            مشروع جديد
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <Briefcase className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">إجمالي المشاريع</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
            <Activity className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
            <p className="text-sm text-gray-600 mt-1">المشاريع النشطة</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <FileText className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
            <p className="text-sm text-gray-600 mt-1">مسودات</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-yellow-200 shadow-sm">
            <Clock className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="text-3xl font-bold text-yellow-600">{stats.awaitingApproval}</p>
            <p className="text-sm text-gray-600 mt-1">بانتظار الموافقة</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-gray-600 mt-1">معتمد</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-emerald-200 shadow-sm">
            <DollarSign className="w-8 h-8 text-emerald-600 mb-2" />
            <p className="text-3xl font-bold text-emerald-600">{stats.funded}</p>
            <p className="text-sm text-gray-600 mt-1">ممول</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm">
            <Target className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-3xl font-bold text-purple-600">{stats.completed}</p>
            <p className="text-sm text-gray-600 mt-1">مكتمل</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">توزيع حالات المشاريع</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">تطور الميزانيات</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={budgetTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip />
                <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">النشاط الأخير</h3>
              <button
                onClick={() => setCurrentView('activity')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                عرض الكل
              </button>
            </div>
            <div className="space-y-4">
              {[
                { user: 'أحمد محمد', action: 'حدّث حالة المشروع', project: 'برنامج الأسر المنتجة', time: 'منذ ساعتين' },
                { user: 'فاطمة أحمد', action: 'أضاف وثيقة', project: 'مشروع كفالة الأيتام', time: 'منذ 4 ساعات' },
                { user: 'خالد سعيد', action: 'طلب موافقة', project: 'برنامج التدريب المهني', time: 'منذ 6 ساعات' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-gray-600">{activity.action}</span>
                      {' '}
                      <span className="font-medium text-blue-600">{activity.project}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">المواعيد القادمة</h3>
            </div>
            <div className="space-y-4">
              {[
                { project: 'برنامج الأسر المنتجة', deadline: '2026-06-15', priority: 'high', daysLeft: 8 },
                { project: 'مشروع كفالة الأيتام', deadline: '2026-06-20', priority: 'medium', daysLeft: 13 },
                { project: 'برنامج التدريب المهني', deadline: '2026-06-25', priority: 'low', daysLeft: 18 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{item.project}</p>
                      <p className="text-xs text-gray-500">{item.deadline}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.daysLeft} يوم
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() => setCurrentView('list')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <List className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">عرض جميع المشاريع</p>
            </button>
            <button
              onClick={() => setCurrentView('create')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">إنشاء مشروع جديد</p>
            </button>
            <button
              onClick={() => setCurrentView('reporting')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">التقارير الإدارية</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
              <Download className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-sm">تصدير البيانات</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // PAGE 2: Projects List
  const ListView = () => {
    const filteredProjects = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المشاريع</h1>
            <p className="text-gray-600">{filteredProjects.length} مشروع</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              لوحة القيادة
            </button>
            <button
              onClick={() => setCurrentView('create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              مشروع جديد
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في المشاريع..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setListViewMode('table')}
                className={`p-2 rounded ${listViewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setListViewMode('kanban')}
                className={`p-2 rounded ${listViewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setListViewMode('timeline')}
                className={`p-2 rounded ${listViewMode === 'timeline' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <GanttChart className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              تصفية
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="draft">مسودة</option>
                    <option value="execution">قيد التنفيذ</option>
                    <option value="funded">ممول</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table View */}
        {listViewMode === 'table' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم المشروع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المؤسسة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الميزانية</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مدير المشروع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التقدم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const status = statusConfig[project.status];
                    return (
                      <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setCurrentView('details');
                            }}
                            className="font-medium text-blue-600 hover:text-blue-700 text-right"
                          >
                            {project.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{project.organization}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {project.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ backgroundColor: status.bg, color: status.color }}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {project.budget.toLocaleString('ar-SA')} ر.س
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{project.duration}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{project.manager}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 transition-all"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Kanban View */}
        {listViewMode === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {['draft', 'charity-review', 'pm-approval', 'funded', 'execution', 'completed'].map((status) => {
              const statusProjects = filteredProjects.filter(p => p.status === status);
              const config = statusConfig[status as ProjectStatus];

              return (
                <div key={status} className="flex-shrink-0 w-80">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{config.label}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {statusProjects.length}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                      {statusProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project);
                            setCurrentView('details');
                          }}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <h4 className="font-medium mb-2">{project.name}</h4>
                          <p className="text-xs text-gray-600 mb-3">{project.organization}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">{project.budget.toLocaleString('ar-SA')} ر.س</span>
                            <span className="text-gray-500">{project.manager}</span>
                          </div>
                          <div className="mt-3">
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline View */}
        {listViewMode === 'timeline' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="space-y-4">
              {filteredProjects.map((project, idx) => (
                <div key={project.id} className="flex items-center gap-4">
                  <div className="w-48 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setCurrentView('details');
                      }}
                      className="font-medium text-sm text-blue-600 hover:text-blue-700 text-right"
                    >
                      {project.name}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">{project.organization}</p>
                  </div>
                  <div className="flex-1 relative h-12">
                    <div className="absolute inset-0 flex items-center">
                      <div className="h-2 bg-gray-100 rounded-full w-full"></div>
                    </div>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-6 rounded-lg flex items-center px-3"
                      style={{
                        backgroundColor: statusConfig[project.status].bg,
                        left: `${idx * 10}%`,
                        width: `${40 + project.progress / 3}%`
                      }}
                    >
                      <span className="text-xs font-medium whitespace-nowrap" style={{ color: statusConfig[project.status].color }}>
                        {project.progress}% - {statusConfig[project.status].label}
                      </span>
                    </div>
                  </div>
                  <div className="w-32 flex-shrink-0 text-left text-xs text-gray-500">
                    {project.startDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // PAGE 3: Create New Project
  const CreateView = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: '',
      organization: '',
      category: '',
      description: '',
      beneficiaries: '',
      geographicScope: '',
      budget: '',
      duration: ''
    });

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('list')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى قائمة المشاريع
          </button>
          <h1 className="text-3xl font-bold mb-2">إنشاء مشروع جديد</h1>
          <p className="text-gray-600">املأ التفاصيل الأساسية للمشروع</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: برنامج الأسر المنتجة"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نوع المشروع *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر النوع</option>
                  <option value="تنموي">تنموي</option>
                  <option value="خيري">خيري</option>
                  <option value="تدريبي">تدريبي</option>
                  <option value="إغاثي">إغاثي</option>
                  <option value="صحي">صحي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المؤسسة *</label>
                <select
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر المؤسسة</option>
                  <option value="جمعية البر الخيرية">جمعية البر الخيرية</option>
                  <option value="مؤسسة الرعاية الاجتماعية">مؤسسة الرعاية الاجتماعية</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وصف المشروع *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="اكتب وصفاً تفصيلياً للمشروع..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الميزانية التقديرية (ر.س) *</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="250000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المدة الزمنية *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="12 شهر"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
              >
                إلغاء
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  حفظ كمسودة
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('list')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  إنشاء المشروع
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // PAGE 4: Project Details
  const DetailsView = () => {
    if (!selectedProject) {
      setCurrentView('list');
      return null;
    }

    const health = healthConfig[selectedProject.health];
    const HealthIcon = health.icon;
    const status = statusConfig[selectedProject.status];

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('list')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى قائمة المشاريع
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{selectedProject.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {selectedProject.organization}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedProject.manager}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit className="w-5 h-5" />
                تعديل
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">حالة المشروع</p>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">صحة المشروع</p>
            <div className="flex items-center gap-2">
              <HealthIcon className="w-5 h-5" style={{ color: health.color }} />
              <span className="font-medium" style={{ color: health.color }}>
                {health.label}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">نسبة الإنجاز</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{selectedProject.progress}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">نظرة عامة</h2>
              <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">معلومات المشروع</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">نوع المشروع</p>
                  <p className="font-medium">{selectedProject.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">التصنيف</p>
                  <p className="font-medium">{selectedProject.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">الفئة المستهدفة</p>
                  <p className="font-medium">{selectedProject.beneficiaries}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">النطاق الجغرافي</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedProject.geographicScope}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">ملخص الميزانية</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">إجمالي الميزانية</span>
                <span className="text-2xl font-bold text-gray-900">
                  {selectedProject.budget.toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentView('lifecycle')}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <GitBranch className="w-5 h-5 text-gray-400" />
                  <span>عرض دورة الحياة</span>
                </button>
                <button
                  onClick={() => setCurrentView('versions')}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <History className="w-5 h-5 text-gray-400" />
                  <span>الإصدارات</span>
                </button>
                <button
                  onClick={() => setCurrentView('activity')}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Activity className="w-5 h-5 text-gray-400" />
                  <span>النشاط</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">الفريق المسؤول</h3>
              <div className="space-y-3">
                {[
                  { name: selectedProject.manager, role: 'مدير المشروع' },
                  { name: 'محمد أحمد', role: 'مسؤول مالي' },
                  { name: 'نورة خالد', role: 'ممثل الجمعية' }
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // PAGE 5-8: Simplified placeholders with back navigation
  const LifecycleView = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentView('details')}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
      >
        <ChevronRight className="w-5 h-5" />
        رجوع إلى تفاصيل المشروع
      </button>
      <h1 className="text-3xl font-bold mb-4">دورة حياة المشروع</h1>
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <p className="text-gray-600 text-center">14 مرحلة من مسودة إلى مغلق - قريباً</p>
      </div>
    </div>
  );

  const VersionsView = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentView('details')}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
      >
        <ChevronRight className="w-5 h-5" />
        رجوع إلى تفاصيل المشروع
      </button>
      <h1 className="text-3xl font-bold mb-4">سجل الإصدارات</h1>
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <p className="text-gray-600 text-center">نظام تحكم في الإصدارات مثل GitHub - قريباً</p>
      </div>
    </div>
  );

  const ActivityView = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentView('details')}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
      >
        <ChevronRight className="w-5 h-5" />
        رجوع إلى تفاصيل المشروع
      </button>
      <h1 className="text-3xl font-bold mb-4">سجل النشاط</h1>
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <p className="text-gray-600 text-center">سجل كامل لجميع أنشطة المشروع - قريباً</p>
      </div>
    </div>
  );

  const ReportingView = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentView('dashboard')}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
      >
        <ChevronRight className="w-5 h-5" />
        رجوع إلى لوحة القيادة
      </button>
      <h1 className="text-3xl font-bold mb-4">التقارير الإدارية</h1>
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <p className="text-gray-600 text-center">تقارير تنفيذية شاملة - قريباً</p>
      </div>
    </div>
  );

  // Render the views based on current state
  return (
    <div className="min-h-full bg-gray-50 p-6">
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'list' && <ListView />}
      {currentView === 'create' && <CreateView />}
      {currentView === 'details' && <DetailsView />}
      {currentView === 'lifecycle' && <LifecycleView />}
      {currentView === 'versions' && <VersionsView />}
      {currentView === 'activity' && <ActivityView />}
      {currentView === 'reporting' && <ReportingView />}
    </div>
  );
}
