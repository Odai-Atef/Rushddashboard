/**
 * Shared formatting helpers
 *
 * Provides human-readable formatting for file sizes and ISO datetimes.
 */

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 B';

  const isNegative = bytes < 0;
  const absoluteBytes = Math.abs(bytes);
  const exponent = Math.min(
    Math.floor(Math.log(absoluteBytes) / Math.log(1024)),
    BYTE_UNITS.length - 1
  );
  const value = absoluteBytes / Math.pow(1024, exponent);
  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(2);

  return `${isNegative ? '-' : ''}${formatted} ${BYTE_UNITS[exponent]}`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;

  return formatRelativeArabic(date);
}

export function formatRelativeArabic(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Future dates fallback to a full Arabic date/time string.
  if (diffMs < 0) {
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} ${diffMins === 1 ? 'دقيقة' : 'دقائق'}`;
  if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
  if (diffDays < 7) return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : diffDays === 2 ? 'يومين' : 'أيام'}`;
  if (diffMonths < 1) return `منذ ${diffWeeks} ${diffWeeks === 1 ? 'أسبوع' : 'أسابيع'}`;
  if (diffYears < 1) return `منذ ${diffMonths} ${diffMonths === 1 ? 'شهر' : 'شهور'}`;
  return `منذ ${diffYears} ${diffYears === 1 ? 'سنة' : 'سنوات'}`;
}
