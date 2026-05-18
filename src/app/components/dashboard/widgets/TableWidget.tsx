import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import type { TableConfig } from '../../types/dashboard';

interface TableWidgetProps {
  data: Record<string, unknown>[];
  config?: TableConfig;
  title: string;
  subtitle?: string;
}

export function TableWidget({ data, config, title, subtitle }: TableWidgetProps) {
  const columns = config?.columns || [];

  if (columns.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-muted-foreground">لا توجد أعمدة محددة للجدول</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} style={{ width: column.width }}>
                  {column.labelAr || column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column.key}`}>
                    {formatCellValue(row[column.key], column.format)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatCellValue(value: unknown, format?: string): string {
  if (value === null || value === undefined) return '-';

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }).format(Number(value));
    case 'percentage':
      return `${Number(value).toFixed(1)}%`;
    case 'number':
      return new Intl.NumberFormat('ar-SA').format(Number(value));
    case 'date':
      return new Date(String(value)).toLocaleDateString('ar-SA');
    case 'text':
    default:
      return String(value);
  }
}
