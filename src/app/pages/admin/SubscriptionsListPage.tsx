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

      if (response.success && response.data) {
        setSubscriptions(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
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
    <div className="min-h-full bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">إدارة الاشتراكات</h1>
          </div>
          <span className="text-sm text-gray-500">إجمالي: {total}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الجهة</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.organizationName}
                  onChange={(e) => updateFilter('organizationName', e.target.value)}
                  placeholder="ابحث باسم الجهة"
                  className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">معرف الجهة</label>
              <input
                type="text"
                value={filters.organizationId}
                onChange={(e) => updateFilter('organizationId', e.target.value)}
                placeholder="UUID الجهة"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">معرف الباقة</label>
              <input
                type="text"
                value={filters.packageId}
                onChange={(e) => updateFilter('packageId', e.target.value)}
                placeholder="UUID الباقة"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <div className="p-12 flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري تحميل الاشتراكات...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">{error}</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">لا توجد اشتراكات مطابقة</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">الجهة</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">الباقة</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">تاريخ البدء</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">تاريخ الانتهاء</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">الحالة</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">التجديد التلقائي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {subscription.organization ? (
                          <div>
                            <p className="font-medium text-gray-900">{subscription.organization.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{subscription.organization.id}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {subscription.package.nameAr || subscription.package.name}
                        </span>
                        <p className="text-xs text-gray-500 font-mono">{subscription.package.id}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(subscription.startDate)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(subscription.endDate)}</td>
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
                              : 'bg-gray-100 text-gray-800'
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
      return `${base} bg-gray-100 text-gray-800`;
    case 'cancelled':
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
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
