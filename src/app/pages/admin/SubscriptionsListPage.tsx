import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { CreditCard, Search, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { subscriptionService, ManagedSubscription } from '@/api/services/subscription-service';
import { DonorsPagination } from '@/app/components/DonorsPagination';

interface Filters {
  organizationId: string;
  organizationName: string;
  packageId: string;
  status: string;
}

const statusOptions = [
  { value: '', label: 'كل الحالات' },
  { value: 'active', label: 'نشط' },
  { value: 'trial', label: 'تجريبي' },
  { value: 'pending', label: 'معلق' },
  { value: 'expired', label: 'منتهي' },
  { value: 'cancelled', label: 'ملغي' },
];

export function SubscriptionsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<ManagedSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState(Number(searchParams.get('limit') || '20'));
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    organizationId: searchParams.get('organizationId') || '',
    organizationName: searchParams.get('organizationName') || '',
    packageId: searchParams.get('packageId') || '',
    status: searchParams.get('status') || '',
  });

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionService.getManagedSubscriptions({
        page,
        limit,
        organizationId: filters.organizationId || undefined,
        organizationName: filters.organizationName || undefined,
        packageId: filters.packageId || undefined,
        status: filters.status || undefined,
      });

      if (response.success && response.data?.data) {
        setSubscriptions(response.data.data.data);
        setTotal(response.data.data.total);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError(response.message || 'تعذر تحميل الاشتراكات');
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تحميل الاشتراكات');
      toast.error(err?.message || 'حدث خطأ أثناء تحميل الاشتراكات');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = String(page);
    if (limit !== 20) params.limit = String(limit);
    if (filters.organizationId) params.organizationId = filters.organizationId;
    if (filters.organizationName) params.organizationName = filters.organizationName;
    if (filters.packageId) params.packageId = filters.packageId;
    if (filters.status) params.status = filters.status;
    setSearchParams(params, { replace: true });
  }, [page, limit, filters, setSearchParams]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      organizationId: '',
      organizationName: '',
      packageId: '',
      status: '',
    });
    setPage(1);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA');
  };

  const hasActiveFilters = filters.organizationId || filters.organizationName || filters.packageId || filters.status;

  return (
    <div className="min-h-full bg-secondary p-3 sm:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة الاشتراكات</h1>
          </div>
          <span className="text-sm text-muted-foreground">إجمالي: {total}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-foreground mb-1">اسم الجهة</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={filters.organizationName}
                  onChange={(e) => updateFilter('organizationName', e.target.value)}
                  placeholder="ابحث باسم الجهة"
                  className="w-full pr-9 pl-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-foreground mb-1">معرف الجهة</label>
              <input
                type="text"
                value={filters.organizationId}
                onChange={(e) => updateFilter('organizationId', e.target.value)}
                placeholder="UUID الجهة"
                className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-foreground mb-1">معرف الباقة</label>
              <input
                type="text"
                value={filters.packageId}
                onChange={(e) => updateFilter('packageId', e.target.value)}
                placeholder="UUID الباقة"
                className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-foreground mb-1">الحالة</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center justify-center sm:justify-start gap-1 px-3 py-2.5 min-h-[44px] text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <X className="w-4 h-4" />
                  مسح الفلاتر
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && subscriptions.length === 0 ? (
            <div className="p-12 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري تحميل الاشتراكات...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">{error}</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">لا توجد اشتراكات مطابقة</div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="sm:hidden space-y-3 p-4">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {subscription.organization?.name || '-'}
                      </span>
                      <span className={getStatusBadgeClass(subscription.status)}>
                        {getStatusLabel(subscription.status)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subscription.package.nameAr || subscription.package.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(subscription.startDate)} → {formatDate(subscription.endDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      التجديد التلقائي: {subscription.autoRenew ? 'مفعل' : 'معطل'}
                    </div>
                  </div>
                ))}
              </div>
              <table className="w-full text-sm hidden sm:table">
                <thead className="bg-secondary border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium text-foreground">الجهة</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">الباقة</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">تاريخ البدء</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">تاريخ الانتهاء</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">الحالة</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">التجديد التلقائي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-secondary">
                      <td className="px-4 py-3">
                        {subscription.organization ? (
                          <div>
                            <p className="font-medium text-foreground">{subscription.organization.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{subscription.organization.id}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">
                          {subscription.package.nameAr || subscription.package.name}
                        </span>
                        <p className="text-xs text-muted-foreground font-mono">{subscription.package.id}</p>
                      </td>
                      <td className="px-4 py-3 text-foreground">{formatDate(subscription.startDate)}</td>
                      <td className="px-4 py-3 text-foreground">{formatDate(subscription.endDate)}</td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadgeClass(subscription.status)}>
                          {getStatusLabel(subscription.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.autoRenew
                              ? 'bg-green-100 text-green-800'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {subscription.autoRenew ? 'مفعل' : 'معطل'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <DonorsPagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                total={total}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeClass(status: string) {
  const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  switch (status.toLowerCase()) {
    case 'active':
      return `${base} bg-green-100 text-green-800`;
    case 'trial':
      return `${base} bg-blue-100 text-blue-800`;
    case 'pending':
      return `${base} bg-yellow-100 text-yellow-800`;
    case 'expired':
      return `${base} bg-muted text-foreground`;
    case 'cancelled':
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-muted text-foreground`;
  }
}

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'نشط';
    case 'trial':
      return 'تجريبي';
    case 'pending':
      return 'معلق';
    case 'expired':
      return 'منتهي';
    case 'cancelled':
      return 'ملغي';
    default:
      return status;
  }
}
