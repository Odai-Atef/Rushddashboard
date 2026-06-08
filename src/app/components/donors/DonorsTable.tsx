/**
 * Donors Table
 *
 * Displays donor data in a responsive table with all required columns:
 * Name, Type, Geographic Scope, Funding Areas, Contact, Source URL, Last Updated
 */

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ExternalLink, Mail, Phone } from 'lucide-react';
import { Donor, DonorType, DONOR_TYPE_LABELS } from '@/types/donors';
import { FundingAreaBadge } from './FundingAreaBadge';
import { cn } from '@/app/utils/cn';

interface DonorsTableProps {
  donors: Donor[];
  onRowClick?: (donor: Donor) => void;
}

const TYPE_COLORS: Record<DonorType, string> = {
  FOUNDATION: 'bg-blue-100 text-blue-700',
  GOVERNMENT: 'bg-purple-100 text-purple-700',
  PRIVATE: 'bg-amber-100 text-amber-700',
  INTERNATIONAL: 'bg-cyan-100 text-cyan-700',
  LOCAL: 'bg-green-100 text-green-700',
};

export function DonorsTable({ donors, onRowClick }: DonorsTableProps) {
  if (donors.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              الجهة المانحة
            </th>
            <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              النوع
            </th>
            <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              النطاق الجغرافي
            </th>
            <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              مجالات التمويل
            </th>
            <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              التواصل
            </th>
            <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              المصدر
            </th>
            <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              آخر تحديث
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {donors.map((donor) => (
            <tr
              key={donor.id}
              className={cn(
                'hover:bg-muted/50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(donor)}
            >
              {/* Name */}
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-sm">
                    {donor.name}
                  </span>
                  {donor.description && (
                    <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[200px]">
                      {donor.description}
                    </span>
                  )}
                </div>
              </td>

              {/* Type */}
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    TYPE_COLORS[donor.type] || 'bg-gray-100 text-gray-700'
                  )}
                >
                  {DONOR_TYPE_LABELS[donor.type] || donor.type}
                </span>
              </td>

              {/* Geographic Scope */}
              <td className="px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {donor.geographicScope || '—'}
                </span>
              </td>

              {/* Funding Areas */}
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {donor.fundingAreas.length > 0 ? (
                    donor.fundingAreas.slice(0, 3).map((relation) => (
                      <FundingAreaBadge
                        key={relation.fundingAreaId}
                        name={relation.fundingArea.name}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  {donor.fundingAreas.length > 3 && (
                    <span className="text-xs text-muted-foreground self-center">
                      +{donor.fundingAreas.length - 3}
                    </span>
                  )}
                </div>
              </td>

              {/* Contact */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {donor.phone && (
                    <a
                      href={`tel:${donor.phone}`}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title={donor.phone}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                  {donor.email && (
                    <a
                      href={`mailto:${donor.email}`}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title={donor.email}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                  {!donor.phone && !donor.email && (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </td>

              {/* Source URL */}
              <td className="px-4 py-3">
                {donor.sourceUrl ? (
                  <a
                    href={donor.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 p-1.5 hover:bg-muted rounded-md transition-colors"
                    title={donor.sourceUrl}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>

              {/* Last Updated */}
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(donor.lastUpdatedAt), 'yyyy/MM/dd', { locale: ar })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
