import { OrganizationDonorMatch } from '@/api/services/project-service';
import { Calendar, Coins, Building2, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface OrganizationDonorsTableProps {
  donors: OrganizationDonorMatch[];
  onRowClick?: (donor: OrganizationDonorMatch) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SUBMITTED: { label: 'تم الإرسال', color: '#3b82f6', bg: '#dbeafe' },
  ACCEPTED: { label: 'تم القبول', color: '#059669', bg: '#d1fae5' },
  FUNDED: { label: 'تم التمويل', color: '#d97706', bg: '#fef3c7' },
  REJECTED: { label: 'تم الاعتذار', color: '#ef4444', bg: '#fee2e2' },
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(amount: number, currency: string): string {
  if (!amount && amount !== 0) return '-';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
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
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground" dir="rtl">
        <Building2 className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-lg font-medium">لا توجد جهات مانحة مقدمة</p>
        <p className="text-sm mt-1">ستظهر هنا الجهات المانحة التي تم تقديم طلبات لها</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border" dir="rtl">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {[
              { key: 'name', label: 'الجهة المانحة' },
              { key: 'projectName', label: 'المشروع' },
              { key: 'projectBudget', label: 'ميزانية المشروع' },
              { key: 'proposalSubmissionDate', label: 'تاريخ التقديم' },
              { key: 'status', label: 'الحالة' },
            ].map((col) => (
              <th
                key={col.key}
                className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDonors.map((donor) => {
            const statusCfg = STATUS_CONFIG[donor.status] || { label: donor.status, color: '#6b7280', bg: '#f3f4f6' };
            return (
              <tr
                key={donor.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(donor)}
              >
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs">
                      {donor.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{donor.name}</div>
                      {donor.website && (
                        <a
                          href={donor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {donor.website}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {donor.projectName}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatCurrency(donor.projectBudget, donor.projectCurrencyCode)}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatDate(donor.proposalSubmissionDate)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
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
  );
}
