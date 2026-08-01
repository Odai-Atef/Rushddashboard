import { useNavigate } from 'react-router';
import {
  Briefcase,
  Plus,
  List,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  User,
  AlertTriangle,
  Bell,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useProjectDashboard, timeAgo } from '@/api/hooks/useProjectDashboard';
import { useNotifications } from '@/api/hooks/useNotifications';
import { useEffect, useState } from 'react';
import { onboardingService } from '@/api/services';
import { AssessmentStatusValue } from '@/api/services/onboarding-service';
import { useAuth } from '@/app/layouts/RootLayout';
import { statusConfig, ProjectStatus } from './project-types';

export function ProjectDashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProjectDashboard();
  const { user } = useAuth();
  const roleSlug = user?.roleSlug ?? null;
  const isProjectManager = roleSlug === 'project-managers';

  const [hasOrg, setHasOrg] = useState(false);
  const [isQualified, setIsQualified] = useState(false);
  const [assessmentMissing, setAssessmentMissing] = useState(false);
  const [isCheckingQualification, setIsCheckingQualification] = useState(!isProjectManager);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (isProjectManager) {
        if (!cancelled) {
          setHasOrg(true);
          setIsQualified(true);
          setAssessmentMissing(false);
          setIsCheckingQualification(false);
        }
        return;
      }
      try {
        const orgRes = await onboardingService.getMyOrganization();
        const org = orgRes.data;
        if (!org?.id) {
          if (!cancelled) {
            setHasOrg(false);
            setIsQualified(false);
            setAssessmentMissing(false);
            setIsCheckingQualification(false);
          }
          return;
        }
        if (!cancelled) setHasOrg(true);

        // First check the lightweight assessment status to distinguish
        // "not started" from "completed but not qualified".
        let statusValue: AssessmentStatusValue | undefined;
        try {
          const statusRes = await onboardingService.getAssessmentStatus(org.id);
          const statusData = (statusRes.data as any)?.data ?? statusRes.data;
          statusValue = statusData?.status;
        } catch (statusErr: any) {
          const statusCode = statusErr?.statusCode || statusErr?.response?.status;
          if (statusCode === 422) {
            statusValue = 'NOT_STARTED';
          }
        }

        if (!cancelled) {
          setAssessmentMissing(statusValue === 'NOT_STARTED');
        }

        if (statusValue === 'NOT_STARTED') {
          if (!cancelled) {
            setIsQualified(false);
            setIsCheckingQualification(false);
          }
          return;
        }

        const resultRes = await onboardingService.getIsivAssessmentResults(org.id);
        const result = (resultRes.data as any)?.data ?? resultRes.data;
        const status = result?.qualificationStatus?.toUpperCase();
        if (!cancelled) {
          setIsQualified(
            status === 'QUALIFIED' ||
            status === 'QUALIFIED_WITH_IMPROVEMENT' ||
            status === 'WITH_IMPROVEMENT'
          );
        }
      } catch {
        if (!cancelled) { setIsQualified(false); }
      } finally {
        if (!cancelled) setIsCheckingQualification(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [isProjectManager]);

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    fetchNotifications,
  } = useNotifications();

  useEffect(() => {
    if (isProjectManager) {
      fetchNotifications({ page: 1, limit: 20 });
    }
  }, [isProjectManager, fetchNotifications]);

  // Only enforce qualification blocker for entity-managers
  // project-managers bypass this check entirely
  const requiresQualificationCheck = roleSlug === 'entity-managers';
  const showQualificationBlocker = requiresQualificationCheck && !isQualified;

  if (isLoading || isCheckingQualification || notificationsLoading) {
    return (
      <div className="min-h-full bg-secondary dark:bg-gray-950 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderQualificationBlocker = () => {
    const title = !hasOrg
      ? 'لم يتم ربط جهة بحسابك بعد'
      : assessmentMissing
      ? 'لم تبدأ عملية التقييم'
      : 'جهتك غير مؤهلة لاستخدام خصائص منصة رشد';

    const subtitle = !hasOrg
      ? 'يجب إنشاء حساب جهة أولاً لاستخدام خصائص منصة رشد.'
      : assessmentMissing
      ? 'يجب إجراء التقييم أولاً لاستخدام خصائص منصة رشد.'
      : 'لإجراء التقييم مرة أخرى، يرجى الضغط على الزر أدناه.';

    const cta = !hasOrg
      ? 'إنشاء حساب الجهة'
      : assessmentMissing
      ? 'ابدأ التقييم الآن'
      : 'إعادة التقييم مرة أخرى';

    const ctaPath = !hasOrg
      ? '/dashboard/onboarding/info?tab=info'
      : '/dashboard/charity-assessment';

    return (
      <div className="min-h-full bg-secondary dark:bg-gray-950 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center gap-4">
        <div className="bg-card rounded-xl border border-red-200 shadow-sm p-6 sm:p-12 text-center max-w-lg mx-4">
          <AlertTriangle className="w-12 sm:w-16 h-12 sm:h-16 text-red-500 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-red-700">{title}</h2>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">{subtitle}</p>
          {assessmentMissing && hasOrg && (
            <p className="text-muted-foreground dark:text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              يمكنك بدء التقييم الآن{" "}
              <button
                onClick={() => navigate('/dashboard/charity-assessment')}
                className="font-medium underline hover:no-underline text-blue-600"
              >
                بالضغط هنا
              </button>
              .
            </p>
          )}
          <button
            onClick={() => navigate(ctaPath)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
          >
            {cta}
          </button>
        </div>
      </div>
    );
  };

  if (error || !data) {
    const isForbidden = error === 'ليس لديك الصلاحية لعرض لوحة المشاريع.';
    if (isForbidden && !isProjectManager) {
      return renderQualificationBlocker();
    }
    if (!isProjectManager) {
      return (
        <div className="min-h-full bg-secondary dark:bg-gray-950 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center gap-4">
          <div className="text-red-600 text-center">{error || 'لا توجد بيانات'}</div>
        </div>
      );
    }
  }

  if (showQualificationBlocker) {
    return renderQualificationBlocker();
  }

  const { stats, statusDistribution, recentActivity } = data ?? {
    stats: { total: 0, active: 0, completed: 0, suspended: 0, totalBudget: 0, totalRaised: 0 },
    statusDistribution: [],
    recentActivity: [],
  };

  return (
    <div className="min-h-full bg-secondary dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">لوحة المشاريع</h1>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm sm:text-base">نظرة شاملة على جميع المشاريع والأنشطة</p>
          </div>
          {(roleSlug === 'entity-managers' || roleSlug === 'project-managers') && (
            <button
              onClick={() => navigate('/dashboard/project-management/create')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              مشروع جديد
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/dashboard/project-management/list')}
              className="p-3 sm:p-4 border-2 border-dashed border-border dark:border-border rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors text-center"
            >
              <List className="w-5 sm:w-6 h-5 sm:h-6 text-muted-foreground dark:text-muted-foreground mx-auto mb-2" />
              <p className="font-medium text-sm">عرض جميع المشاريع</p>
            </button>
            {(roleSlug === 'entity-managers' || roleSlug === 'project-managers') && (
              <button
                onClick={() => navigate('/dashboard/project-management/create')}
                className="p-3 sm:p-4 border-2 border-dashed border-border dark:border-border rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors text-center"
              >
                <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-muted-foreground dark:text-muted-foreground mx-auto mb-2" />
                <p className="font-medium text-sm">إنشاء مشروع جديد</p>
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard/project-management/reporting')}
              className="p-3 sm:p-4 border-2 border-dashed border-border dark:border-border rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors text-center"
            >
              <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-muted-foreground dark:text-muted-foreground mx-auto mb-2" />
              <p className="font-medium text-sm">التقارير الإدارية</p>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-6 items-stretch">
          {/* Total Projects */}
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-border/80 dark:border-border/50 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-emerald-500/10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-muted dark:bg-muted/80 w-fit mb-4">
                <Briefcase className="w-6 h-6 text-muted-foreground dark:text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">إجمالي المشاريع</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white tracking-tight">{stats.total}</p>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-blue-200/80 dark:border-blue-500/30 shadow-sm dark:shadow-lg dark:shadow-blue-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-blue-500/10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 w-fit mb-4">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">المشاريع النشطة</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">{stats.active}</p>
            </div>
          </div>

          {/* Drafts */}
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-border/80 dark:border-border/50 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-emerald-500/10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-muted dark:bg-muted/80 w-fit mb-4">
                <FileText className="w-6 h-6 text-muted-foreground dark:text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">مسودات</p>
              <p className="text-2xl sm:text-3xl font-bold text-muted-foreground dark:text-muted-foreground tracking-tight">{stats.draft}</p>
            </div>
          </div>

          {/* Awaiting Approval */}
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-yellow-200/80 dark:border-yellow-500/30 shadow-sm dark:shadow-lg dark:shadow-yellow-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-yellow-500/10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 w-fit mb-4">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">بانتظار الموافقة</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 tracking-tight">{stats.awaitingApproval}</p>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-green-200/80 dark:border-green-500/30 shadow-sm dark:shadow-lg dark:shadow-green-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-green-500/10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 w-fit mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">معتمد</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 tracking-tight">{stats.approved}</p>
            </div>
          </div>

          {/* Funded */}
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-emerald-200/80 dark:border-emerald-500/30 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-emerald-500/10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 w-fit mb-4">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">ممول</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{stats.funded}</p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-purple-200/80 dark:border-purple-500/30 shadow-sm dark:shadow-lg dark:shadow-purple-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-purple-500/10 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 w-fit mb-4">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">مكتمل</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Status Distribution Cards (for PM) */}
        {isProjectManager && statusDistribution.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 items-stretch">
            {statusDistribution
              .filter((item) => item.value > 0)
              .map((item, idx) => {
                const normalizedStatus = Object.keys(statusConfig).find(
                  (key) => statusConfig[key as ProjectStatus].label === item.name
                );
                const config = normalizedStatus
                  ? statusConfig[normalizedStatus as ProjectStatus]
                  : { label: item.name, color: item.color, bg: item.color + '15' };
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-card/60 dark:backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-border/80 dark:border-border/50 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5 transition-all duration-200 hover:shadow-md dark:hover:shadow-emerald-500/10 flex flex-col justify-between h-full"
                  >
                    <div className="p-2.5 rounded-xl w-fit mb-4" style={{ backgroundColor: `${config.color}15` }}>
                      <Activity className="w-6 h-6" style={{ color: config.color }} />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mb-1.5">{config.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: config.color }}>
                      {item.value}
                    </p>
                  </div>
                );
              })}
          </div>
        )}

        {/* Status Distribution Chart */}
        {isProjectManager && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">توزيع حالات المشاريع</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300} minWidth={300}>
                  <BarChart data={statusDistribution.filter((item) => item.value > 0)} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} interval={0} angle={-45} textAnchor="end" />
                    <YAxis tick={{ fill: '#6b7280' }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  لا توجد بيانات لتوزيع الحالات
                </div>
              )}
            </div>
          </div>
        )}

        {!isProjectManager && statusDistribution.length > 0 && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">توزيع حالات المشاريع</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <BarChart data={statusDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} interval={0} angle={-45} textAnchor="end" />
                  <YAxis tick={{ fill: '#6b7280' }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activity + Notifications */}
        <div className={`grid gap-4 sm:gap-6 ${isProjectManager ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">النشاط الأخير</h3>
              <button
                onClick={() => navigate('/dashboard/project-management/activity')}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                عرض الكل
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2 sm:p-3 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.userName}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        <span className="font-medium text-blue-600">{activity.projectName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">{timeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground dark:text-muted-foreground text-center py-4">لا يوجد نشاط حديث</div>
              )}
            </div>
          </div>

          {isProjectManager && (
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  إشعارات تتطلب إجراء
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => navigate('/dashboard/notifications')}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  عرض الكل
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {notifications.filter((n) => n.status !== 'READ').length > 0 ? (
                  notifications
                    .filter((n) => n.status !== 'READ')
                    .slice(0, 5)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => navigate('/dashboard/notifications')}
                        className="flex items-start gap-3 p-3 hover:bg-secondary dark:hover:bg-muted rounded-xl transition-colors cursor-pointer border-r-4 border-r-amber-500"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-100 dark:bg-amber-500/20">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground dark:text-muted-foreground line-clamp-2">{notification.body}</p>
                          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">{timeAgo(notification.createdAt)}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-muted-foreground dark:text-muted-foreground text-center py-4">لا توجد إشعارات تتطلب إجراء</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Latest Notifications (for PM) */}
        {isProjectManager && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                أحدث الإشعارات
              </h3>
              <button
                onClick={() => navigate('/dashboard/notifications')}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                عرض الكل
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => {
                  const isUnread = notification.status !== 'READ';
                  return (
                    <div
                      key={notification.id}
                      onClick={() => navigate('/dashboard/notifications')}
                      className={`flex items-start gap-3 p-3 hover:bg-secondary dark:hover:bg-muted rounded-xl transition-colors cursor-pointer ${
                        isUnread ? 'bg-amber-50/50 border-r-4 border-r-amber-500' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-500/20">
                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${isUnread ? 'font-medium' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground line-clamp-2">{notification.body}</p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">{timeAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground dark:text-muted-foreground text-center py-4">لا توجد إشعارات</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
