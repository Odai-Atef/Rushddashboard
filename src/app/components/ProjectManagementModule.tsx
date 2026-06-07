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
  Check
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
      description: 'برنامج لتمكين الأسر المحتاجة اقتصادياً من خلال تدريبهم على مهارات إنتاجية',
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
      description: 'برنامج كفالة ورعاية شاملة للأيتام',
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
      description: 'توفير وجبات إفطار صحية للطلاب المحتاجين',
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
      description: 'عيادات صحية متنقلة لخدمة المناطق النائية',
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

  console.log('✓ ProjectManagementModule rendered');

  // Render the appropriate view
  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">إدارة المشاريع - قريباً</h1>
        <p className="text-gray-600 mb-8">
          نظام شامل لإدارة المشاريع الخيرية بجميع مراحلها
        </p>

        {/* Quick Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Briefcase className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-sm text-gray-600 mt-1">إجمالي المشاريع</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <Activity className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-blue-600">
              {projects.filter(p => ['execution', 'funded'].includes(p.status)).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">المشاريع النشطة</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-green-200">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-3xl font-bold text-green-600">
              {(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}م
            </p>
            <p className="text-sm text-gray-600 mt-1">الميزانية الإجمالية</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-purple-200">
            <Target className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-3xl font-bold text-purple-600">
              {projects.filter(p => p.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">مكتمل</p>
          </div>
        </div>

        {/* Projects Table Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">المشاريع</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم المشروع</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المؤسسة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الميزانية</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التقدم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => {
                  const status = statusConfig[project.status];
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{project.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{project.organization}</td>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600">{project.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-3">الميزات الكاملة قادمة</h3>
          <p className="text-sm text-blue-800 mb-4">
            سيتضمن نظام إدارة المشاريع الكامل 8 صفحات رئيسية:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>لوحة المشاريع الرئيسية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>قائمة المشاريع المتقدمة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>إنشاء مشروع جديد</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تفاصيل المشروع</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>متتبع دورة الحياة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>إدارة الإصدارات</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>سجل النشاط</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>التقارير الإدارية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
