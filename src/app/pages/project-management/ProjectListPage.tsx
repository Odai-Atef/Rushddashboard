import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  List,
  LayoutGrid,
  GanttChart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react';
import { useProjects } from '@/api/hooks/useProjects';
import { ProjectFilters, ProjectStatus, ProjectHealth, statusConfig } from './project-types';

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
  { id: 'org-2', name: 'مؤسسة الرعاية الاجتماعية' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function ProjectListPage() {
  const navigate = useNavigate();
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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const updateFilter = <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
    setFilters({ [key]: value === 'all' ? undefined : value });
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

  const renderTable = () => (
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
            {projects.map((project) => {
              const status = statusConfig[project.status];
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
                  <td className="px-6 py-4 text-sm text-gray-600">{project.organization}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{project.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{project.budget.toLocaleString('ar-SA')} ر.س</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.duration}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.manager}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
  );

  const renderKanban = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {['draft', 'charity-review', 'pm-approval', 'funded', 'execution', 'completed'].map((status) => {
        const statusProjects = projects.filter((p) => p.status === status);
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
                  width: `${40 + project.progress / 3}%`,
                }}
              >
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{ color: statusConfig[project.status].color }}
                >
                  {project.progress}% - {statusConfig[project.status].label}
                </span>
              </div>
            </div>
            <div className="w-32 flex-shrink-0 text-left text-xs text-gray-500">{project.startDate}</div>
          </div>
        ))}
      </div>
    </div>
  );

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
                  <label className="block text-sm font-medium mb-2">المؤسسة</label>
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

        {isLoading ? renderLoading() : renderListContent()}

        {!isLoading && !error && projects.length > 0 && renderPagination()}
      </div>
    </div>
  );
}
