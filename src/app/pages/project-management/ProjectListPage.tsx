import { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router';
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
import { ProjectFilters, ProjectStatus, statusConfig, Project } from './project-types';
import apiClient from '@/api/client';
import { projectService } from '@/api/services/project-service';
import { onboardingService, IsivAssessmentResult, OrganizationResponse } from '@/api/services/onboarding-service';
import { useAuth } from '@/app/layouts/RootLayout';
import { toast } from 'sonner';

const STATUS_OPTIONS: { value: ProjectStatus | 'all'; label: string }[] = [
 { value: 'all', label: 'جميع الحالات' },
 ...Object.entries(statusConfig).map(([value, config]) => ({
 value: value as ProjectStatus,
 label: config.label,
 })),
];

function toBackendStatus(status: ProjectStatus): string {
 return status.replace(/-/g, '_').toUpperCase();
}

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

 // Organization list for project-manager filter
 const [organizations, setOrganizations] = useState<Array<{ id: string; name: string }>>([]);
 const [organizationsLoading, setOrganizationsLoading] = useState(false);

 useEffect(() => {
 if (isProjectManager) {
 setQualificationLoading(false);
 return;
 }

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
 }, [isProjectManager]);

 // Load organizations for project-manager filter dropdown
 useEffect(() => {
 if (!isProjectManager) {
 setOrganizations([]);
 return;
 }
 let cancelled = false;
 const loadOrgs = async () => {
 setOrganizationsLoading(true);
 try {
 const res = await apiClient.get<{
 success: boolean;
 data: Array<{
 id: string;
 fullName: string;
 email: string;
 organization: { id: string; name: string } | null;
 }>;
 total: number;
 }>('/api/v1/users/project-managers/organizations');
 if (cancelled) return;
 const data = res.data?.data ?? [];
 const orgs = data
 .filter((item) => item.organization)
 .map((item) => ({ id: item.organization!.id, name: item.organization!.name }));
 // Deduplicate by org id
 const uniqueOrgs = Array.from(new Map(orgs.map((o) => [o.id, o])).values());
 setOrganizations(uniqueOrgs);
 } catch {
 if (!cancelled) setOrganizations([]);
 } finally {
 if (!cancelled) setOrganizationsLoading(false);
 }
 };
 loadOrgs();
 return () => { cancelled = true; };
 }, [isProjectManager]);

 const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
 if (e.key === 'Enter') {
 applyFilters();
 }
 };

 const updateFilter = <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
 setFilters({ [key]: value === 'all' ? undefined : value });
 };

 const updateStatusFilter = (value: ProjectFilters['status']) => {
 const status = value === 'all' ? undefined : value;
 setFilters({ status });
 void applyFilters({ status });
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
 <div className="bg-card rounded-xl border border-border shadow-sm p-12 flex items-center justify-center">
 <div className="w-8 h-8 border-4 border-ring border-t-transparent rounded-full animate-spin" />
 </div>
 );

 const renderError = () => (
 <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
 <div className="text-[var(--destructive)] mb-4">{error}</div>
 <button
 onClick={() => refetch()}
 className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)] mx-auto"
 >
 <RotateCcw className="w-4 h-4" />
 إعادة المحاولة
 </button>
 </div>
 );

 const renderEmpty = () => (
 <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center">
 <p className="text-muted-foreground mb-4">لا توجد مشاريع مطابقة للمعايير المحددة.</p>
 <button
 onClick={() => clearFilters()}
 className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
 >
 مسح المعايير
 </button>
 </div>
 );

 const renderPagination = () => {
 if (pagination.totalPages <= 1) return null;

 return (
 <div className="flex items-center justify-between bg-card rounded-xl border border-border shadow-sm p-[var(--spacing-card-padding)]">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <select
 value={pagination.limit}
 onChange={(e) => setLimit(Number(e.target.value))}
 className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring"
 >
 {PAGE_SIZE_OPTIONS.map((size) => (
 <option key={size} value={size}>{size} لكل صفحة</option>
 ))}
 </select>
 <span className="text-sm text-muted-foreground">
 صفحة {pagination.page} من {pagination.totalPages} (إجمالي {pagination.total})
 </span>
 </div>

 <div className="flex gap-[var(--spacing-small-gap)]">
 <button
 onClick={() => setPage(pagination.page - 1)}
 disabled={pagination.page <= 1}
 className="p-[var(--spacing-small-gap)] border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <ChevronRight className="w-5 h-5" />
 </button>
 <button
 onClick={() => setPage(pagination.page + 1)}
 disabled={pagination.page >= pagination.totalPages}
 className="p-[var(--spacing-small-gap)] border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
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

 const getProjectCreator = (project: Project): string => {
 if (project.creator && typeof project.creator === 'object') {
 return project.creator.name || project.creator.email || project.creator.id || '-';
 }
 return project.creator || project.creatorId || '-';
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

 const timeAgo = (dateString: string | undefined): string => {
 if (!dateString) return '-';
 const date = new Date(dateString);
 const now = new Date();
 const diffMs = now.getTime() - date.getTime();
 const diffSecs = Math.floor(diffMs / 1000);
 const diffMins = Math.floor(diffSecs / 60);
 const diffHours = Math.floor(diffMins / 60);
 const diffDays = Math.floor(diffHours / 24);

 if (diffDays > 0) return `منذ ${diffDays} يوم${diffDays > 1 ? 'ين' : ''}`;
 if (diffHours > 0) return `منذ ${diffHours} ساعة`;
 if (diffMins > 0) return `منذ ${diffMins} دقيقة`;
 return 'الآن';
 };

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
 'PM_APPROVAL',
 'DESIGN_TEAM',
 'DESIGN_TEAM_APPROVAL',
 ];
 const entityManagerStatuses = [
 'CHARITY_REVIEW',
 'MODIFICATIONS_DONE_WAITING_FOR_REVIEW',
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
 <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
 <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
 <table className="w-full">
 <thead className="bg-secondary border-b border-border">
 <tr>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">اسم المشروع</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">الجهه</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">المنشئ</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">الباقة</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">الحالة</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">آخر تحديث</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">عدد التعديلات</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">التقدم</th>
 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-200">
 {projects.map((project) => {
 const status = statusConfig[getDisplayStatus(project.status)];
 return (
 <tr key={project.id} className="hover:bg-secondary transition-colors">
 <td className="px-6 py-4">
 <button
 onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
 className="font-medium text-[var(--secondary)] hover:text-[var(--secondary)] text-right"
 >
 {project.name}
 </button>
 </td>
 <td className="px-6 py-4 text-sm text-muted-foreground">{getProjectOrganization(project)}</td>
 <td className="px-6 py-4 text-sm text-muted-foreground">{getProjectCreator(project)}</td>
 <td className="px-6 py-4 text-sm text-muted-foreground">{project.packageName || project.packageId || 'غير محددة'}</td>
 <td className="px-6 py-4">
 <span
 className="text-xs px-2 py-1 rounded-full font-medium"
 style={{ backgroundColor: status.bg, color: status.color }}
 >
 {status.label}
 </span>
 </td>
 <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
 {timeAgo(project.updatedAt)}
 </td>
 <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
 {typeof project.modificationsCount === 'number' ? project.modificationsCount.toLocaleString('ar-SA') : '0'}
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-[var(--spacing-small-gap)] min-w-[140px]">
 <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] transition-all"
 style={{ width: `${project.progress}%` }}
 />
 </div>
 <span className="text-xs font-medium text-muted-foreground">{project.progress}%</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-end gap-[var(--spacing-small-gap)] flex-wrap">
 {shouldShowPinIcon(project) && (
 <div className="relative flex items-center justify-center w-6 h-6">
 <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--destructive)]" />
 </div>
 )}
 <a
 href={`/dashboard/project-management/details/${project.id}`}
 className="inline-flex items-center gap-[var(--spacing-small-gap)].5 px-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary hover:text-primary transition-colors"
 >
 <Eye className="w-3.5 h-3.5" />
 عرض
 </a>
 <Link
 to={`/dashboard/collaboration/${project.id}/chat`}
 className="relative inline-flex items-center gap-[var(--spacing-small-gap)].5 px-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary hover:text-primary transition-colors"
 >
 <MessageSquare className="w-3.5 h-3.5" />
 متابعة تحديثات المشروع - شات
 {Number(project.unreadMessageCount) > 0 && (
 <span className="absolute -top-1.5 -left-1.5 min-w-4.5 h-4.5 bg-[var(--destructive)] rounded-full text-xs text-[var(--primary-foreground)] flex items-center justify-center font-bold px-1">
 {Number(project.unreadMessageCount) > 99 ? '99+' : project.unreadMessageCount}
 </span>
 )}
 </Link>
 {isProjectManager && (
 <a
 href={`/dashboard/project-management/edit/${project.id}`}
 className="inline-flex items-center gap-[var(--spacing-small-gap)].5 px-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary hover:text-primary transition-colors"
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
 <div className="flex gap-[var(--spacing-grid-gap)] overflow-x-auto pb-4">
 {['draft', 'charity-review', 'pm-approval', 'funded', 'execution', 'project-suspended', 'completed'].map((status) => {
 const statusProjects = projects.filter((p) => getDisplayStatus(p.status) === status);
 const config = statusConfig[status as ProjectStatus];

 return (
 <div key={status} className="flex-shrink-0 w-80">
 <div className="bg-[var(--card)] rounded-xl border border-border shadow-sm">
 <div className="p-[var(--spacing-card-padding)] border-b border-border">
 <div className="flex items-center justify-between">
 <h3 className="font-semibold">{config.label}</h3>
 <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">{statusProjects.length}</span>
 </div>
 </div>
 <div className="p-[var(--spacing-card-padding)] space-y-[var(--spacing-small-gap)] max-h-[600px] overflow-y-auto">
 {statusProjects.map((project) => (
 <div
 key={project.id}
 onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
 className="p-[var(--spacing-card-padding)] border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
 >
 <h4 className="font-medium mb-2">{project.name}</h4>
 <p className="text-xs text-muted-foreground mb-1">{getProjectOrganization(project)}</p>
 <p className="text-xs text-muted-foreground mb-3">{project.packageName || project.packageId || 'غير محددة'}</p>
 <div className="flex items-center justify-between text-xs">
 <span className="text-muted-foreground">{getBudgetAmount(project.budget).toLocaleString('ar-SA')} ر.س</span>
 <span className="text-muted-foreground">{getProjectManager(project)}</span>
 </div>
 <div className="mt-3">
 <div className="h-1 bg-muted rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)]"
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
 <div className="bg-card rounded-xl p-[var(--spacing-card-padding)] border border-border shadow-sm">
 <div className="space-y-[var(--spacing-section-gap)]">
 {projects.map((project, idx) => (
 <div key={project.id} className="flex items-center gap-[var(--spacing-grid-gap)]">
 <div className="w-48 flex-shrink-0">
 <button
 onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
 className="font-medium text-sm text-[var(--secondary)] hover:text-[var(--secondary)] text-right"
 >
 {project.name}
 </button>
 <p className="text-xs text-muted-foreground mt-1">{getProjectOrganization(project)}</p>
 <p className="text-xs text-muted-foreground mt-0.5">{project.packageName || project.packageId || 'غير محددة'}</p>
 </div>
 <div className="flex-1 relative h-12">
 <div className="absolute inset-0 flex items-center">
 <div className="h-2 bg-muted rounded-full w-full"></div>
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
 <div className="w-32 flex-shrink-0 text-left text-xs text-muted-foreground">{project.startDate}</div>
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
 <div className="bg-card rounded-xl border border-[var(--destructive)]/[0.3] shadow-sm p-12 text-center">
 <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
 <h2 className="text-2xl font-bold mb-4 text-[var(--destructive)]">
 {hasOrg ? 'جهتك غير مؤهلة لاستخدام خصائص منصة رشد' : 'لم يتم ربط جهة بحسابك بعد'}
 </h2>
 <p className="text-muted-foreground mb-8 max-w-md mx-auto">
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
 className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)] mx-auto"
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
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="space-y-[var(--spacing-section-gap)] sm:space-y-[var(--spacing-section-gap)]">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[var(--spacing-small-gap)]">
 <div className="w-full">
 <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">إدارة المشاريع</h1>
 <p className="text-muted-foreground text-sm sm:text-base">{pagination.total} مشروع</p>
 </div>
 <div className="flex gap-[var(--spacing-small-gap)] w-full sm:w-auto">
 <button
 onClick={() => navigate('/dashboard/project-management')}
 className="flex-1 sm:flex-none px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium text-sm sm:text-base"
 >
 لوحة القيادة
 </button>
 {(user?.roleSlug === 'entity-managers' || user?.roleSlug === 'project-managers') && (
 <button
 onClick={() => navigate('/dashboard/project-management/create')}
 className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium flex items-center justify-center gap-[var(--spacing-small-gap)] text-sm sm:text-base"
 >
 <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
 مشروع جديد
 </button>
 )}
 </div>
 </div>

 <div className="bg-card rounded-xl p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] border border-border shadow-sm">
 <div className="flex flex-col sm:flex-row gap-[var(--spacing-grid-gap)]">
 <div className="flex-1 relative">
 <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
 <input
 type="text"
 value={pendingFilters.search || ''}
 onChange={(e) => updateFilter('search', e.target.value)}
 onKeyDown={handleSearchKeyDown}
 placeholder="بحث في المشاريع..."
 className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base"
 />
 </div>

 <div className="flex gap-[var(--spacing-small-gap)] border border-border rounded-lg p-[var(--spacing-small-gap)] shrink-0">
 <button
 onClick={() => setListViewMode('list')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${listViewMode === 'list' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-muted-foreground hover:bg-muted'}`}
 >
 <List className="w-5 h-5" />
 </button>
 <button
 onClick={() => setListViewMode('kanban')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${listViewMode === 'kanban' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-muted-foreground hover:bg-muted'}`}
 >
 <LayoutGrid className="w-5 h-5" />
 </button>
 <button
 onClick={() => setListViewMode('timeline')}
 className={`p-[var(--spacing-small-gap)] rounded-lg ${listViewMode === 'timeline' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-muted-foreground hover:bg-muted'}`}
 >
 <GanttChart className="w-5 h-5" />
 </button>
 </div>

 <button
 onClick={() => setShowFilters(!showFilters)}
 className={`px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-[var(--spacing-small-gap)] text-sm sm:text-base shrink-0 ${showFilters ? 'border-ring text-[var(--secondary)] bg-[var(--secondary)]/[0.08]' : 'border-border hover:bg-secondary'}`}
 >
 <Filter className="w-5 h-5" />
 تصفية
 </button>
 </div>

 {showFilters && (
 <div className="mt-4 pt-4 border-t border-border">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-grid-gap)]">
 <div>
 <label className="block text-sm font-medium mb-2">الحالة</label>
 <select
 value={pendingFilters.status || 'all'}
 onChange={(e) => updateStatusFilter(e.target.value)}
 className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring"
 >
 {STATUS_OPTIONS.map((option) => (
 <option key={option.value} value={option.value}>{option.label}</option>
 ))}
 </select>
 </div>
 {isProjectManager && (
 <div>
 <label className="block text-sm font-medium mb-2">الجهة</label>
 <select
 value={pendingFilters.organizationId || 'all'}
 onChange={(e) => {
 const value = e.target.value;
 const orgId = value === 'all' ? undefined : value;
 setFilters({ organizationId: orgId });
 void applyFilters({ organizationId: orgId });
 }}
 disabled={organizationsLoading}
 className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring disabled:opacity-50"
 >
 <option value="all">جميع الجهات</option>
 {organizations.map((org) => (
 <option key={org.id} value={org.id}>{org.name}</option>
 ))}
 </select>
 </div>
 )}
 </div>

 <div className="flex justify-end gap-[var(--spacing-small-gap)] mt-4">
 <button
 onClick={() => clearFilters()}
 className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium flex items-center gap-[var(--spacing-small-gap)]"
 >
 <X className="w-4 h-4" />
 مسح
 </button>
 </div>
 </div>
 )}
 </div>

 {qualificationLoading || isLoading ? (
 renderLoading()
 ) : !isProjectManager && !isQualified ? (
 renderQualificationBlocker()
 ) : (
 <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">{renderListContent()}</div>
 )}

 {!isLoading && !error && projects.length > 0 && renderPagination()}
 </div>

 </div>
 );
}
