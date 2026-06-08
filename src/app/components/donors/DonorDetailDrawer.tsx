/**
 * Donor Detail Drawer
 *
 * Side drawer that displays full donor profile information.
 * Opens when a table row is clicked. Preserves list state when closed.
 */

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  X,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Building2,
  Target,
  Clock,
} from 'lucide-react';
import { Donor, DONOR_TYPE_LABELS } from '@/types/donors';
import { FundingAreaBadge } from './FundingAreaBadge';
import { cn } from '@/app/utils/cn';

interface DonorDetailDrawerProps {
  donor: Donor | null;
  open: boolean;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  FOUNDATION: 'bg-blue-100 text-blue-700',
  GOVERNMENT: 'bg-purple-100 text-purple-700',
  PRIVATE: 'bg-amber-100 text-amber-700',
  INTERNATIONAL: 'bg-cyan-100 text-cyan-700',
  LOCAL: 'bg-green-100 text-green-700',
};

export function DonorDetailDrawer({ donor, open, onClose }: DonorDetailDrawerProps) {
  if (!donor) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 transition-opacity z-40',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-background shadow-xl transition-transform duration-300 ease-in-out z-50 overflow-y-auto',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{donor.name}</h2>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  TYPE_COLORS[donor.type] || 'bg-gray-100 text-gray-700'
                )}
              >
                {DONOR_TYPE_LABELS[donor.type] || donor.type}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Description */}
          {donor.description && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                الوصف
              </h3>
              <p className="text-sm text-foreground leading-relaxed">{donor.description}</p>
            </section>
          )}

          {/* Geographic Scope */}
          {donor.geographicScope && (
            <section className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                  النطاق الجغرافي
                </h3>
                <p className="text-sm text-foreground">{donor.geographicScope}</p>
              </div>
            </section>
          )}

          {/* Funding Areas */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground">
                مجالات التمويل
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {donor.fundingAreas.length > 0 ? (
                donor.fundingAreas.map((relation) => (
                  <FundingAreaBadge
                    key={relation.fundingAreaId}
                    name={relation.fundingArea.name}
                  />
                ))
              ) : (
                <span className="text-sm text-muted-foreground">لا توجد مجالات تمويل مسجلة</span>
              )}
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              معلومات التواصل
            </h3>
            <div className="space-y-3">
              {donor.website && (
                <a
                  href={donor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Globe className="w-5 h-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">الموقع الإلكتروني</p>
                    <p className="text-xs text-muted-foreground truncate">{donor.website}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              )}

              {donor.email && (
                <a
                  href={`mailto:${donor.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">البريد الإلكتروني</p>
                    <p className="text-xs text-muted-foreground">{donor.email}</p>
                  </div>
                </a>
              )}

              {donor.phone && (
                <a
                  href={`tel:${donor.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">الهاتف</p>
                    <p className="text-xs text-muted-foreground">{donor.phone}</p>
                  </div>
                </a>
              )}

              {!donor.website && !donor.email && !donor.phone && (
                <p className="text-sm text-muted-foreground">لا توجد معلومات تواصل متاحة</p>
              )}
            </div>
          </section>

          {/* Source URL */}
          {donor.sourceUrl && (
            <section>
              <a
                href={donor.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">رابط المصدر</p>
                  <p className="text-xs text-muted-foreground truncate">{donor.sourceUrl}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </section>
          )}

          {/* Last Updated */}
          <section className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              آخر تحديث:{' '}
              {format(new Date(donor.lastUpdatedAt), 'yyyy/MM/dd HH:mm', { locale: ar })}
            </span>
          </section>
        </div>
      </div>
    </>
  );
}
