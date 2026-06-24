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

  return date.toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
