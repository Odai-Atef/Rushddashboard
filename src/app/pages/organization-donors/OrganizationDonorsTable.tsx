import { OrganizationDonorMatch } from '@/api/services/project-service';
import { Calendar, Coins, Building2, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface OrganizationDonorsTableProps {
  donors: OrganizationDonorMatch[];
  onRowClick?: (donor: OrganizationDonorMatch) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SUBMITTED: { label: 'تم الإرسال', color: 'var(--secondary)', bg: 'rgba(37, 99, 235, 0.12)' },
  ACCEPTED: { label: 'تم القبول', color: 'var(--primary)', bg: 'rgba(31, 169, 122, 0.12)' },
  FUNDED: { label: 'تم التمويل', color: 'var(--chart-3)', bg: 'rgba(2, 132, 199, 0.12)' },
  REJECTED: { label: 'تم الاعتذار', color: 'var(--destructive)', bg: 'rgba(220, 38, 38, 0.12)' },
};

function timeAgo(dateString: string | null): string {
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
}

function getDecimalAmount(budget: any): number {
  if (typeof budget === 'number') return budget;
  if (budget && typeof budget === 'object') {
    // Prisma Decimal serialization: { d: [digits], e: exponent, s: sign }
    if ('d' in budget && Array.isArray(budget.d)) {
      const digits = budget.d as number[];
      const sign = budget.s === -1 ? -1 : 1;
      const exponent = typeof budget.e === 'number' ? budget.e : 0;
      if (digits.length === 0) return 0;
      const coefficient = digits
        .map((chunk: number, index: number) => (index === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
        .join('');
      const normalizedExponent = exponent - (coefficient.length - 1);
      const amount = Number(`${coefficient}e${normalizedExponent}`);
      return Number.isFinite(amount) ? sign * amount : 0;
    }
    // Fallback for plain strings or other objects
    const parsed = parseFloat(String(budget));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatCurrency(amount: any, currency: string): string {
  const num = getDecimalAmount(amount);
  if (num === 0 && (!amount || (typeof amount === 'object' && (!('d' in amount) || (amount.d as number[]).length === 0)))) return '-';
  return `${num.toLocaleString('ar-SA')} ${currency || 'ر.س'}`;
}

export function OrganizationDonorsTable({ donors, onRowClick }: OrganizationDonorsTableProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedDonors = [...donors].sort((a, b) => {
    if (!sortField) return 0;
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ar');
        break;
      case 'projectName':
        comparison = a.projectName.localeCompare(b.projectName, 'ar');
        break;
      case 'organizationName':
        comparison = (a.organizationName || '').localeCompare(b.organizationName || '', 'ar');
        break;
      case 'matchingScore':
        comparison = (a.matchingScore || 0) - (b.matchingScore || 0);
        break;
      case 'proposalSubmissionDate':
        const da = a.proposalSubmissionDate ? new Date(a.proposalSubmissionDate).getTime() : 0;
        const db = b.proposalSubmissionDate ? new Date(b.proposalSubmissionDate).getTime() : 0;
        comparison = da - db;
        break;
      case 'status':
        comparison = (a.status || '').localeCompare(b.status || '');
        break;
      default:
        return 0;
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });

  if (donors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-muted-foreground px-4" dir="rtl">
        <Building2 className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-muted-foreground" />
        <p className="text-base sm:text-lg font-medium text-center">لا توجد جهات مانحة مقدمة</p>
        <p className="text-xs sm:text-sm mt-1 text-center">ستظهر هنا الجهات المانحة التي تم تقديم طلبات لها</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {[
                { key: 'name', label: 'الجهة المانحة' },
                { key: 'projectName', label: 'المشروع' },
                { key: 'organizationName', label: 'الجهة' },
                { key: 'projectBudget', label: 'ميزانية المشروع' },
                { key: 'proposalSubmissionDate', label: 'تاريخ التقديم' },
                { key: 'status', label: 'الحالة' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-card-foreground transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-[var(--spacing-small-gap)]">
                    {col.label}
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDonors.map((donor) => {
              const statusCfg = STATUS_CONFIG[donor.status] || { label: donor.status, color: 'var(--muted-foreground)', bg: 'var(--muted)' };
              return (
                <tr
                  key={donor.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(donor)}
                >
                  <td className="px-4 py-3 text-sm text-card-foreground whitespace-nowrap">
                    <div className="flex items-center gap-[var(--spacing-small-gap)]">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--secondary)] to-[var(--chart-3)] flex items-center justify-center text-[var(--primary-foreground)] text-xs shrink-0">
                        {donor.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{donor.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-card-foreground whitespace-nowrap">
                    {donor.projectName}
                  </td>
                  <td className="px-4 py-3 text-sm text-card-foreground whitespace-nowrap">
                    {donor.organizationName || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-card-foreground whitespace-nowrap">
                    <div className="flex items-center gap-[var(--spacing-small-gap)]">
                      <Coins className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {formatCurrency(donor.projectBudget, donor.projectCurrencyCode)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-card-foreground whitespace-nowrap">
                    <div className="flex items-center gap-[var(--spacing-small-gap)]">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {timeAgo(donor.proposalSubmissionDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-[var(--spacing-small-gap)] text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedDonors.map((donor) => {
          const statusCfg = STATUS_CONFIG[donor.status] || { label: donor.status, color: 'var(--muted-foreground)', bg: 'var(--muted)' };
          return (
            <div
              key={donor.id}
              className="bg-card border border-border rounded-xl p-4 space-y-3 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onRowClick?.(donor)}
            >
              {/* Header: Name + Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-[var(--spacing-small-gap)] min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--secondary)] to-[var(--chart-3)] flex items-center justify-center text-[var(--primary-foreground)] text-xs shrink-0">
                    {donor.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-card-foreground truncate">{donor.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{donor.projectName}</div>
                  </div>
                </div>
                <span
                  className="inline-flex items-center text-xs px-2 py-1 rounded-full font-medium shrink-0"
                  style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="text-muted-foreground">الجهة</div>
                  <div className="text-card-foreground font-medium">{donor.organizationName || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">الميزانية</div>
                  <div className="text-card-foreground font-medium flex items-center gap-1">
                    <Coins className="w-3 h-3 text-muted-foreground" />
                    {formatCurrency(donor.projectBudget, donor.projectCurrencyCode)}
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-muted-foreground">تاريخ التقديم</div>
                  <div className="text-card-foreground font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    {timeAgo(donor.proposalSubmissionDate)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
