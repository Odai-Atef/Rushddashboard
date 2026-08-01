import { useEffect, useState, useCallback } from 'react';
import { Ticket, Plus, Search, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { subscriptionService, Coupon, CreateCouponDto, Package } from '@/api/services/subscription-service';
import { MultiSelect } from '@/app/components/ui/multi-select';

interface CouponFilters {
  status: string;
  code: string;
}

const statusOptions = [
  { value: '', label: 'كل الحالات' },
  { value: 'ACTIVE', label: 'نشط' },
  { value: 'INACTIVE', label: 'معطل' },
];

const typeOptions = [
  { value: 'PERCENTAGE', label: 'نسبة مئوية' },
  { value: 'FIXED_AMOUNT', label: 'مبلغ ثابت' },
  { value: 'EXTRA_MONTHS', label: 'أشهر إضافية' },
  { value: 'EXTRA_PROJECTS', label: 'مشاريع إضافية' },
];

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CouponFilters>({ status: '', code: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [packages, setPackages] = useState<{ id: string; name: string }[]>([]);
  const [packagesMap, setPackagesMap] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CreateCouponDto>({
    code: '',
    type: 'PERCENTAGE',
    discountValue: undefined,
    maxDiscountAmount: undefined,
    extraMonths: undefined,
    extraProjects: undefined,
    currency: 'SAR',
    maxUses: undefined,
    validFrom: new Date().toISOString().slice(0, 16),
    validUntil: '',
    applicablePackageIds: [],
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionService.getCoupons({
        status: filters.status || undefined,
        code: filters.code || undefined,
      });
      if (response.success && response.data?.data) {
        setCoupons(response.data.data);
      } else {
        setError(response.message || 'تعذر تحميل الكوبونات');
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تحميل الكوبونات');
      toast.error(err?.message || 'حدث خطأ أثناء تحميل الكوبونات');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchPackages = useCallback(async () => {
    try {
      const response = await subscriptionService.getPackages();
      if (response.success && response.data?.data) {
        const packagesData = response.data.data;
        const list = packagesData.map((p: Package) => ({ id: p.id, name: p.name }));
        const map: Record<string, string> = {};
        packagesData.forEach((p: Package) => {
          map[p.id] = p.name;
        });
        setPackages(list);
        setPackagesMap(map);
      }
    } catch {
      // ignore package load errors
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: CreateCouponDto = {
        ...form,
        code: form.code.trim(),
      };
      const response = await subscriptionService.createCoupon(payload);
      if (response.success) {
        toast.success('تم إنشاء الكوبون بنجاح');
        setShowAdd(false);
        resetForm();
        fetchCoupons();
      } else {
        toast.error(response.message || 'تعذر إنشاء الكوبون');
      }
    } catch (err: any) {
      toast.error(err?.message || 'حدث خطأ أثناء إنشاء الكوبون');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      code: '',
      type: 'PERCENTAGE',
      discountValue: undefined,
      maxDiscountAmount: undefined,
      extraMonths: undefined,
      extraProjects: undefined,
      currency: 'SAR',
      maxUses: undefined,
      validFrom: new Date().toISOString().slice(0, 16),
      validUntil: '',
      applicablePackageIds: [],
    });
  };

  const needsDiscount = form.type === 'PERCENTAGE' || form.type === 'FIXED_AMOUNT';
  const needsExtraMonths = form.type === 'EXTRA_MONTHS';
  const needsExtraProjects = form.type === 'EXTRA_PROJECTS';

  return (
    <div className="min-h-full bg-background p-3 sm:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Ticket className="w-7 h-7 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة الكوبونات</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 min-h-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            إضافة كوبون
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-foreground mb-1">الكود</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={filters.code}
                  onChange={(e) => setFilters((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="ابحث بكود الكوبون"
                  className="w-full pr-9 pl-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-foreground mb-1">الحالة</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {(filters.code || filters.status) && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setFilters({ status: '', code: '' })}
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
          {loading && coupons.length === 0 ? (
            <div className="p-12 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري تحميل الكوبونات...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">{error}</div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">لا توجد كوبونات</div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="sm:hidden space-y-3 p-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{coupon.code}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-muted text-foreground'
                      }`}>
                        {coupon.status === 'ACTIVE' ? 'نشط' : 'معطل'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{getTypeLabel(coupon.type)}</div>
                    <div className="text-sm text-foreground">{formatValue(coupon)}</div>
                    <div className="text-xs text-muted-foreground">
                      {coupon.maxUses !== undefined && coupon.maxUses !== null
                        ? `${coupon.usedCount} / ${coupon.maxUses} استخدام`
                        : `${coupon.usedCount} استخدام`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      من {new Date(coupon.validFrom).toLocaleDateString('ar-SA')}
                      {coupon.validUntil && ` إلى ${new Date(coupon.validUntil).toLocaleDateString('ar-SA')}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPackageNames(coupon.applicablePackageIds, packagesMap)}
                    </div>
                  </div>
                ))}
              </div>
              <table className="w-full text-sm hidden sm:table">
                <thead className="bg-secondary border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium text-foreground">الكود</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">النوع</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">القيمة</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">الاستخدامات</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">تاريخ البداية</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">تاريخ النهاية</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">الباقات المطبقة</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-secondary">
                      <td className="px-4 py-3 font-medium text-foreground">{coupon.code}</td>
                      <td className="px-4 py-3 text-foreground">{getTypeLabel(coupon.type)}</td>
                      <td className="px-4 py-3 text-foreground">
                        {formatValue(coupon)}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {coupon.maxUses !== undefined && coupon.maxUses !== null
                          ? `${coupon.usedCount} / ${coupon.maxUses}`
                          : coupon.usedCount}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {new Date(coupon.validFrom).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {coupon.validUntil
                          ? new Date(coupon.validUntil).toLocaleDateString('ar-SA')
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {formatPackageNames(coupon.applicablePackageIds, packagesMap)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            coupon.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {coupon.status === 'ACTIVE' ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">إضافة كوبون جديد</h2>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">الكود *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="مثال: SUMMER20"
                    className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">النوع *</label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {needsDiscount && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">قيمة الخصم *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required={needsDiscount}
                        value={form.discountValue ?? ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            discountValue: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                        className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">حد أقصى للخصم</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.maxDiscountAmount ?? ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                        className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {needsExtraMonths && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">عدد الأشهر الإضافية *</label>
                    <input
                      type="number"
                      min="1"
                      required={needsExtraMonths}
                      value={form.extraMonths ?? ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          extraMonths: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {needsExtraProjects && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">عدد المشاريع الإضافية *</label>
                    <input
                      type="number"
                      min="1"
                      required={needsExtraProjects}
                      value={form.extraProjects ?? ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          extraProjects: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">العملة</label>
                  <input
                    type="text"
                    value={form.currency}
                    onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">حد أقصى للاستخدام</label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxUses ?? ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        maxUses: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">تاريخ البداية *</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.validFrom}
                    onChange={(e) => setForm((prev) => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">تاريخ النهاية</label>
                  <input
                    type="datetime-local"
                    value={form.validUntil}
                    onChange={(e) => setForm((prev) => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">الباقات المطبقة</label>
                <MultiSelect
                  options={packages.map((p) => ({ value: p.id, label: p.name }))}
                  selected={form.applicablePackageIds || []}
                  onChange={(next) => setForm((prev) => ({ ...prev, applicablePackageIds: next }))}
                  placeholder="اختر الباقات"
                  searchPlaceholder="ابحث في الباقات..."
                  emptyMessage="لا توجد نتائج"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="w-full sm:w-auto px-4 py-3 min-h-[44px] text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'PERCENTAGE':
      return 'نسبة مئوية';
    case 'FIXED_AMOUNT':
      return 'مبلغ ثابت';
    case 'EXTRA_MONTHS':
      return 'أشهر إضافية';
    case 'EXTRA_PROJECTS':
      return 'مشاريع إضافية';
    default:
      return type;
  }
}

function formatValue(coupon: Coupon) {
  if (coupon.type === 'PERCENTAGE') {
    return coupon.discountValue ? `${coupon.discountValue}%` : '-';
  }
  if (coupon.type === 'FIXED_AMOUNT') {
    return coupon.discountValue ? `${coupon.discountValue} ${coupon.currency}` : '-';
  }
  if (coupon.type === 'EXTRA_MONTHS') {
    return coupon.extraMonths ? `${coupon.extraMonths} شهر` : '-';
  }
  if (coupon.type === 'EXTRA_PROJECTS') {
    return coupon.extraProjects ? `${coupon.extraProjects} مشروع` : '-';
  }
  return '-';
}

function formatPackageNames(packageIds: string[] | undefined, packagesMap: Record<string, string>) {
  if (!packageIds || packageIds.length === 0) return 'جميع الباقات';
  return packageIds.map((id) => packagesMap[id] || id).join(', ');
}
