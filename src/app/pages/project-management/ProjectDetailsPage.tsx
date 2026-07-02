import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ChevronRight,
  Edit,
  Sparkles,
  FileDown,
  Loader2,
  Building2,
  User,
  MapPin,
  GitBranch,
  History,
  Activity,
  RotateCcw,
  Eye,
  Save,
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MDEditor from '@uiw/react-md-editor';
import { useProjectDetails } from '@/api/hooks/useProjectDetails';
import { projectService } from '@/api/services/project-service';
import { ProjectNotFound } from './ProjectNotFound';
import { healthConfig, statusConfig, ProjectDetails as ProjectDetailsType, ProjectStatus } from './project-types';

import { toast } from 'sonner';

function getDisplayStatus(status: string): ProjectStatus {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return normalized in statusConfig ? (normalized as ProjectStatus) : 'draft';
}

function getBudgetAmount(budget: number | Record<string, unknown>): number {
  if (typeof budget === 'number') return budget;
  if (budget && typeof budget === 'object' && 's' in budget) {
    const digits = Array.isArray(budget.d) ? (budget.d as number[]) : [];
    const sign = budget.s === -1 ? -1 : 1;
    const exponent = typeof budget.e === 'number' ? budget.e : 0;
    if (digits.length === 0) return 0;
    const coefficient = digits
      .map((chunk, index) => (index === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
      .join('');
    const normalizedExponent = exponent - (coefficient.length - 1);
    const amount = Number(`${coefficient}e${normalizedExponent}`);
    return Number.isFinite(amount) ? sign * amount : 0;
  }
  return 0;
}

function getManagerName(project: ProjectDetailsType): string {
  return toDisplayString(project.manager, project.managerId || 'غير محدد');
}

function getOrganizationName(project: ProjectDetailsType): string {
  if (project.organization && typeof project.organization === 'object') {
    return project.organization.name || project.organization.id || 'غير محدد';
  }
  return project.organization || project.organizationId || 'غير محدد';
}

function toDisplayString(value: unknown, fallback = 'غير محدد'): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return (record.name as string) || (record.label as string) || (record.title as string) || fallback;
  }
  return fallback;
}

export function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading, error, refetch } = useProjectDetails(projectId);
  const [planOpen, setPlanOpen] = useState(false);
  const [planMarkdown, setPlanMarkdown] = useState<string>('');
  const [loadedPlanMarkdown, setLoadedPlanMarkdown] = useState<string>('');
  const [planLoading, setPlanLoading] = useState(false);
  const [wordLoading, setWordLoading] = useState(false);
  const [planView, setPlanView] = useState<'preview' | 'edit'>('preview');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenPlan = async () => {
    if (!projectId) return;
    setPlanOpen(true);
    setPlanLoading(true);
    setPlanMarkdown('');
    setLoadedPlanMarkdown('');
    setPlanView('preview');
    try {
      const res = await projectService.getProjectPlanMarkdown(projectId);
      const content = res.data ?? '';
      const markdown = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      setPlanMarkdown(markdown);
      setLoadedPlanMarkdown(markdown);
    } catch (err: any) {
      toast.error(err?.message || 'فشل تحميل خطة المشروع');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      await projectService.updateProjectPlanMarkdown(projectId, planMarkdown);
      setLoadedPlanMarkdown(planMarkdown);
      setPlanView('preview');
      toast.success('تم حفظ خطة المشروع بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ خطة المشروع');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!projectId) return;
    setWordLoading(true);
    try {
      const res = await projectService.getProjectPlanWord(projectId);
      const blob = res.data;
      if (!(blob instanceof Blob)) {
        throw new Error('تعذر الحصول على ملف Word');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name || 'project'}-plan.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('تم تحميل خطة المشروع بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل تحميل ملف Word');
    } finally {
      setWordLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex flex-col items-center justify-center gap-4">
        <div className="text-red-600 text-center">{error}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const displayHealth = getDisplayStatus(project.health as string);
  const health = healthConfig[displayHealth] || { label: displayHealth, color: '#6b7280', icon: Activity };
  const HealthIcon = health.icon;
  const displayStatus = getDisplayStatus(project.status as string);
  const status = statusConfig[displayStatus] || { label: displayStatus, color: '#6b7280', bg: '#f3f4f6' };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/project-management/list')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى قائمة المشاريع
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {getOrganizationName(project)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {getManagerName(project)}
                </span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate(`/dashboard/project-management/edit/${project.id}`)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                تعديل
              </button>
              <button
                onClick={handleOpenPlan}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                إنشاء دراسة باستخدام الذكاء الاصطناعي
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
              <span className="font-medium" style={{ color: health.color }}>{health.label}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">نسبة الإنجاز</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{project.progress}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">نظرة عامة</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">معلومات المشروع</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">نوع المشروع</p>
                  <p className="font-medium">{toDisplayString(project.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">التصنيف</p>
                  <p className="font-medium">{toDisplayString(project.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">الفئة المستهدفة</p>
                  <p className="font-medium">{toDisplayString(project.beneficiaries)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">النطاق الجغرافي</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {toDisplayString(project.geographicScope)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">ملخص الميزانية</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">إجمالي الميزانية</span>
                <span className="text-2xl font-bold text-gray-900">
                  {getBudgetAmount(project.budget).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            </div>

            {project.budgets && project.budgets.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">تفاصيل الميزانية</h2>
                <div className="space-y-3">
                  {project.budgets.map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{budget.category}</span>
                      <div className="text-sm text-gray-600">
                        مخصص: {budget.allocated.toLocaleString('ar-SA')} / منفق: {budget.spent.toLocaleString('ar-SA')} {budget.currencyCode}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.milestones && project.milestones.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">المعالم الرئيسية</h2>
                <div className="space-y-3">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{milestone.title}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{milestone.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>تاريخ الاستحقاق: {new Date(milestone.dueDate).toLocaleDateString('ar-SA')}</span>
                        <span>التقدم: {milestone.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/dashboard/project-management/lifecycle/${project.id}`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <GitBranch className="w-5 h-5 text-gray-400" />
                  <span>عرض دورة الحياة</span>
                </button>
                <button
                  onClick={() => navigate(`/dashboard/project-management/versions/${project.id}`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <History className="w-5 h-5 text-gray-400" />
                  <span>الإصدارات</span>
                </button>
                <button
                  onClick={() => navigate(`/dashboard/project-management/activity/${project.id}`)}
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
                {['مدير المشروع', 'مسؤول مالي', 'ممثل الجمعية'].map((role) => (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {project.activities && project.activities.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4">آخر الأنشطة</h3>
                <div className="space-y-3">
                  {project.activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-gray-600 text-xs">{activity.description}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(activity.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {planOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setPlanOpen(false)}
          />
          <div dir="rtl" className="relative z-10 flex flex-col w-full h-[90vh] max-w-[90vw] bg-white rounded-xl shadow-2xl overflow-hidden text-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-xl font-semibold">خطة المشروع</h2>
                <p className="text-sm text-gray-500 mt-1">تحرير ومعاينة خطة المشروع</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-lg p-1 ml-2">
                  <button
                    onClick={() => setPlanView('preview')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      planView === 'preview'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    معاينة
                  </button>
                  <button
                    onClick={() => setPlanView('edit')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      planView === 'edit'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                    تحرير
                  </button>
                </div>
                <button
                  onClick={handleSavePlan}
                  disabled={isSaving || planMarkdown === loadedPlanMarkdown}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  حفظ
                </button>
                <button
                  onClick={handleDownloadWord}
                  disabled={wordLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {wordLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  تحميل Word
                </button>
                <button
                  onClick={() => setPlanOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {planLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : planView === 'preview' ? (
                <div className="prose prose-sm max-w-none text-right w-full break-words bg-white rounded-xl p-6 border border-gray-200 min-h-full [&>*]:text-right">
                  <Markdown remarkPlugins={[remarkGfm]}>{planMarkdown || '\u00A0'}</Markdown>
                </div>
              ) : (
                <div dir="rtl" data-color-mode="light" className="bg-white rounded-xl border border-gray-200 min-h-full h-full">
                  <MDEditor
                    value={planMarkdown}
                    onChange={(val) => setPlanMarkdown(val || '')}
                    height="100%"
                    visibleDragBar={false}
                    preview="edit"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
