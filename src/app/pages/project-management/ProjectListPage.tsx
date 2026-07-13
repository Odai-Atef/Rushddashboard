import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import {
  Plus,
  Search,
  Filter,
  List,
  LayoutGrid,
  GanttChart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  Pencil,
  Download,
  Eye,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Pin,
} from 'lucide-react';
import { useProjects } from '@/api/hooks/useProjects';
import { ProjectFilters, ProjectStatus, ProjectHealth, statusConfig, Project } from './project-types';
import apiClient from '@/api/client';
import { projectService } from '@/api/services/project-service';
import { onboardingService, IsivAssessmentResult, OrganizationResponse } from '@/api/services/onboarding-service';
import { useAuth } from '@/app/layouts/RootLayout';
import { toast } from 'sonner';

const STATUS_OPTIONS: { value: ProjectStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'draft', label: 'مسودة' },
  { value: 'charity-review', label: 'مراجعة الجمعية' },
  { value: 'incubator-modifications', label: 'تعديلات الحاضنة' },
  { value: 'charity-approval', label: 'موافقة الجمعية' },
  { value: 'pm-approval', label: 'موافقة مدير المشروع' },
  { value: 'financial-approval', label: 'موافقة مالية' },
  { value: 'approved', label: 'معتمد' },
  { value: 'design-team', label: 'فريق التصميم' },
  { value: 'ready-donor', label: 'جاهز للمانحين' },
  { value: 'submitted-donor', label: 'مقدم للمانحين' },
  { value: 'funded', label: 'ممول' },
  { value: 'execution', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'closed', label: 'مغلق' },
];

const HEALTH_OPTIONS: { value: ProjectHealth | 'all'; label: string }[] = [
  { value: 'all', label: 'جميع الحالات الصحية' },
  { value: 'excellent', label: 'ممتاز' },
  { value: 'good', label: 'جيد' },
  { value: 'at-risk', label: 'معرض للخطر' },
  { value: 'critical', label: 'حرج' },
];

const MANAGER_OPTIONS = [
  { id: 'all', name: 'جميع المدراء' },
  { id: 'manager-1', name: 'أحمد محمد' },
  { id: 'manager-2', name: 'سارة عبدالله' },
  { id: 'manager-3', name: 'خالد العلي' },
];

const ORGANIZATION_OPTIONS = [
  { id: 'all', name: 'جميع المؤسسات' },
  { id: 'org-1', name: 'جمعية البر الخيرية' },
  { id: 'org-2', name: 'جهه الرعاية الاجتماعية' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function ProjectListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProjectManager = user?.roleSlug === 'project-managers';
  const {
    projects,
    pagination,
    pendingFilters,
    isLoading,
    error,
    setPage,
    setLimit,
    setFilters,
    applyFilters,
    clearFilters,
    refetch,
  } = useProjects();
  const [listViewMode, setListViewMode] = useState<'list' | 'kanban' | 'timeline'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [organization, setOrganization] = useState<OrganizationResponse | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<IsivAssessmentResult | null>(null);
  const [qualificationLoading, setQualificationLoading] = useState(true);
  const [qualificationError, setQualificationError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const orgRes = await onboardingService.getMyOrganization();
        if (cancelled) return;
        const org = orgRes.data;
        setOrganization(org);
        if (!org?.id) {
          setQualificationLoading(false);
          return;
        }
        const resultRes = await onboardingService.getIsivAssessmentResults(org.id);
        if (cancelled) return;
        const resultData = (resultRes.data as any)?.data ?? resultRes.data;
        setAssessmentResult(resultData ?? null);
      } catch (err: any) {
        if (cancelled) return;
        if (err?.statusCode === 403 || err?.response?.status === 403) {
          setOrganization(null);
          setAssessmentResult(null);
        } else {
          setQualificationError(err?.message || 'تعذر التحقق من حالة التأهيل');
        }
      } finally {
        if (!cancelled) setQualificationLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const updateFilter = <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
    setFilters({ [key]: value === 'all' ? undefined : value });
  };


  const handleDownloadWord = async (projectId: string, projectName: string) => {
    setDownloadingId(projectId);
    try {
      const res = await projectService.getProjectPlanWord(projectId);
      const blob = res.data;
      if (!(blob instanceof Blob)) {
        throw new Error('تعذر الحصول على ملف Word');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'project'}-plan.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('تم تحميل خطة المشروع بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل تحميل ملف Word');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderLoading = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const renderError = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
      <div className="text-red-600 mb-4">{error}</div>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
      >
        <RotateCcw className="w-4 h-4" />
        إعادة المحاولة
      </button>
    </div>
  );

  const renderEmpty = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
      <p className="text-gray-600 mb-4">لا توجد مشاريع مطابقة للمعايير المحددة.</p>
      <button
        onClick={() => clearFilters()}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        مسح المعايير
      </button>
    </div>
  );

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-2">
          <select
            value={pagination.limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size} لكل صفحة</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            صفحة {pagination.page} من {pagination.totalPages} (إجمالي {pagination.total})
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const getProjectOrganization = (project: Project): string => {
    if (project.organization && typeof project.organization === 'object') {
      return (project.organization as { name?: string; id?: string }).name || (project.organization as { name?: string; id?: string }).id || '-';
    }
    return project.organization || project.organizationId || '-';
  };
  const getProjectManager = (project: Project): string => {
    if (project.manager && typeof project.manager === 'object') {
      return project.manager.name || project.manager.email || project.manager.id || '-';
    }
    return project.manager || project.managerId || '-';
  };

  const getBudgetAmount = (budget: Project['budget']): number => {
    if (typeof budget === 'number') return budget;
    if (budget && typeof budget === 'object' && 's' in budget) {
      const digits = Array.isArray((budget as Record<string, unknown>).d) ? (budget as Record<string, unknown>).d as number[] : [];
      const sign = (budget as Record<string, unknown>).s === -1 ? -1 : 1;
      const exponent = typeof (budget as Record<string, unknown>).e === 'number' ? (budget as Record<string, unknown>).e as number : 0;
      if (digits.length === 0) return 0;
      const coefficient = digits
        .map((chunk, index) => (index === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
        .join('');
      const normalizedExponent = exponent - (coefficient.length - 1);
      const amount = Number(`${coefficient}e${normalizedExponent}`);
      return Number.isFinite(amount) ? sign * amount : 0;
    }
    return 0;
  };

  const getDisplayStatus = (status: string): ProjectStatus => {
    const normalized = status.toLowerCase().replace(/_/g, '-');
    return normalized in statusConfig ? (normalized as ProjectStatus) : 'draft';
  };

  const getRawStatus = (status: string): string => status.toUpperCase().replace(/-/g, '_');

  const shouldShowPinIcon = (project: Project): boolean => {
    const rawStatus = getRawStatus(project.status);
    const roleSlug = user?.roleSlug;

    const projectManagerStatuses = [
      'COMMISSION_APPROVED',
      'DRAFT',
      'CHARITY_APPROVAL',
      'INCUBATOR_MODIFICATIONS',
      'OFFER_APPROVED',
      'DESIGN_APPROVED',
    ];
    const entityManagerStatuses = [
      'CHARITY_REVIEW',
      'DESIGN_REVIEW',
      'OFFER_REVIEW',
    ];

    if (roleSlug === 'project-managers' && projectManagerStatuses.includes(rawStatus)) {
      return true;
    }
    if (roleSlug === 'entity-managers' && entityManagerStatuses.includes(rawStatus)) {
      return true;
    }
    return false;
  };

  const renderTable = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم المشروع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الجهه</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التقدم</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => {
              const status = statusConfig[getDisplayStatus(project.status)];
              return (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
                      className="font-medium text-blue-600 hover:text-blue-700 text-right"
                    >
                      {project.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{getProjectOrganization(project)}</td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {shouldShowPinIcon(project) && (
                        <div className="relative flex items-center justify-center w-6 h-6">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                        </div>
                      )}
                      <a
                        href={`/dashboard/project-management/details/${project.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        عرض
                      </a>
                      <a
                        href={`/dashboard/collaboration/${project.id}/chat`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        متابعة تحديثات المشروع - شات
                      </a>
                      {isProjectManager && (
                        <a
                          href={`/dashboard/project-management/edit/${project.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderKanban = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {['draft', 'charity-review', 'pm-approval', 'funded', 'execution', 'completed'].map((status) => {
        const statusProjects = projects.filter((p) => getDisplayStatus(p.status) === status);
        const config = statusConfig[status as ProjectStatus];

        return (
          <div key={status} className="flex-shrink-0 w-80">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{config.label}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{statusProjects.length}</span>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {statusProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h4 className="font-medium mb-2">{project.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">{getProjectOrganization(project)}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{getBudgetAmount(project.budget).toLocaleString('ar-SA')} ر.س</span>
                      <span className="text-gray-500">{getProjectManager(project)}</span>
                    </div>
                    <div className="mt-3">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${project.progress}%` }}
                        />
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
  );

  const renderTimeline = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <div key={project.id} className="flex items-center gap-4">
            <div className="w-48 flex-shrink-0">
              <button
                onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
                className="font-medium text-sm text-blue-600 hover:text-blue-700 text-right"
              >
                {project.name}
              </button>
              <p className="text-xs text-gray-500 mt-1">{getProjectOrganization(project)}</p>
            </div>
            <div className="flex-1 relative h-12">
              <div className="absolute inset-0 flex items-center">
                <div className="h-2 bg-gray-100 rounded-full w-full"></div>
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 h-6 rounded-lg flex items-center px-3"
                style={{
                  backgroundColor: statusConfig[getDisplayStatus(project.status)].bg,
                  left: `${idx * 10}%`,
                  width: `${40 + project.progress / 3}%`,
                }}
              >
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{ color: statusConfig[getDisplayStatus(project.status)].color }}
                >
                  {project.progress}% - {statusConfig[getDisplayStatus(project.status)].label}
                </span>
              </div>
            </div>
            <div className="w-32 flex-shrink-0 text-left text-xs text-gray-500">{project.startDate}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const isQualified =
    assessmentResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED' ||
    assessmentResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED_WITH_IMPROVEMENT' ||
    assessmentResult?.qualificationStatus?.toUpperCase() === 'WITH_IMPROVEMENT';

  const renderQualificationBlocker = () => {
    const hasOrg = !!organization?.id;
    return (
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-12 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-red-700">
          {hasOrg ? 'جهتك غير مؤهلة لاستخدام خصائص منصة رشد' : 'لم يتم ربط جهة بحسابك بعد'}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {hasOrg
            ? 'لإجراء التقييم مرة أخرى، يرجى الضغط على الزر أدناه.'
            : 'يجب إنشاء حساب جهة أولاً لاستخدام خصائص منصة رشد.'}
        </p>
        <button
          onClick={() =>
            navigate(
              hasOrg
                ? '/dashboard/charity-assessment'
                : '/dashboard/onboarding/info?tab=info'
            )
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          {hasOrg ? 'إعادة التقييم مرة أخرى' : 'إنشاء حساب الجهة'}
        </button>
      </div>
    );
  };

  const renderListContent = () => {
    if (error) return renderError();
    if (projects.length === 0) return renderEmpty();

    switch (listViewMode) {
      case 'kanban':
        return renderKanban();
      case 'timeline':
        return renderTimeline();
      default:
        return renderTable();
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المشاريع</h1>
            <p className="text-gray-600">{pagination.total} مشروع</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard/project-management')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              لوحة القيادة
            </button>
            <button
              onClick={() => navigate('/dashboard/project-management/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              مشروع جديد
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={pendingFilters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="بحث في المشاريع..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setListViewMode('list')}
                className={`p-2 rounded ${listViewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${showFilters ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <Filter className="w-5 h-5" />
              تصفية
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <select
                    value={pendingFilters.status || 'all'}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الحالة الصحية</label>
                  <select
                    value={pendingFilters.health || 'all'}
                    onChange={(e) => updateFilter('health', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {HEALTH_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الجهه</label>
                  <select
                    value={pendingFilters.organizationId || 'all'}
                    onChange={(e) => updateFilter('organizationId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {ORGANIZATION_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">مدير المشروع</label>
                  <select
                    value={pendingFilters.managerId || 'all'}
                    onChange={(e) => updateFilter('managerId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {MANAGER_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">النوع</label>
                  <input
                    type="text"
                    value={pendingFilters.type || ''}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    placeholder="مثال: تنموي"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الفئة</label>
                  <input
                    type="text"
                    value={pendingFilters.category || ''}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    placeholder="مثال: التعليم"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => clearFilters()}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  مسح
                </button>
                <button
                  onClick={() => applyFilters()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  تطبيق
                </button>
              </div>
            </div>
          )}
        </div>

        {qualificationLoading || isLoading ? (
          renderLoading()
        ) : !isQualified ? (
          renderQualificationBlocker()
        ) : (
          renderListContent()
        )}

        {!isLoading && !error && projects.length > 0 && renderPagination()}
      </div>

    </div>
  );
}
