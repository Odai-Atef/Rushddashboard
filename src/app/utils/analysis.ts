import type { FilterParameters, ValueFormatters } from '../types/analysis';

export function formatValue(value: number, format?: string, unit?: string): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'compact':
      return new Intl.NumberFormat('ar-SA', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);
    case 'number':
    default:
      return new Intl.NumberFormat('ar-SA').format(value);
  }
}

export function serializeFilters(filters?: FilterParameters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.dateRange?.start) {
    params.append('date_from', filters.dateRange.start);
  }
  if (filters.dateRange?.end) {
    params.append('date_to', filters.dateRange.end);
  }
  if (filters.companyId) {
    params.append('company_id', filters.companyId);
  }
  if (filters.domainId) {
    params.append('domain_id', filters.domainId);
  }
  if (filters.departmentId) {
    params.append('department_id', filters.departmentId);
  }

  return params.toString();
}

export function applyFormatters(value: number, formatters?: ValueFormatters): string {
  if (!formatters) return value.toString();

  let formatted = value.toString();

  switch (formatters.tooltip || formatters.yAxis) {
    case 'currency':
      formatted = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }).format(value);
      break;
    case 'percentage':
      formatted = `${value.toFixed(1)}%`;
      break;
    case 'compact':
      formatted = new Intl.NumberFormat('ar-SA', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);
      break;
    case 'number':
      formatted = new Intl.NumberFormat('ar-SA').format(value);
      break;
    case 'none':
    default:
      formatted = value.toString();
  }

  if (formatters.prefix) {
    formatted = `${formatters.prefix}${formatted}`;
  }
  if (formatters.suffix) {
    formatted = `${formatted}${formatters.suffix}`;
  }

  return formatted;
}

export function getTrendColor(direction?: 'up' | 'down' | 'flat', changeType?: 'positive' | 'negative' | 'neutral'): string {
  if (changeType) {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-muted-foreground';
    }
  }

  switch (direction) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'flat':
    default:
      return 'text-muted-foreground';
  }
}

export function getPriorityColor(priority: 'urgent' | 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500';
    case 'high':
      return 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500';
    case 'low':
      return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
}

export function getInsightTypeLabel(type: 'alert' | 'recommendation' | 'summary' | 'insight'): string {
  switch (type) {
    case 'alert':
      return 'تنبيه';
    case 'recommendation':
      return 'توصية';
    case 'summary':
      return 'ملخص';
    case 'insight':
      return 'تحليل';
    default:
      return type;
  }
}
