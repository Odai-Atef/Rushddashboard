import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

export function formatChatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return format(date, 'HH:mm', { locale: arSA });
  } else if (diffInDays === 1) {
    return 'أمس';
  } else if (diffInDays < 7) {
    return format(date, 'EEEE', { locale: arSA });
  } else {
    return format(date, 'dd MMM yyyy', { locale: arSA });
  }
}

export function truncateTitle(content: string, maxLength = 50): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
}

export function generateSessionTitle(content: string): string {
  return truncateTitle(content, 50);
}