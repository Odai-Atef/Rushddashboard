import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { applyFormatters } from '../../utils/analysis';
import type { ChartConfig } from '../../types/analysis';

interface ChartWidgetProps {
  config: ChartConfig;
}

export function ChartWidget({ config }: ChartWidgetProps) {
  const {
    type,
    data,
    xAxisKey,
    yAxisKeys,
    colors,
    formatters,
    titleAr,
    subtitle,
  } = config;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey={xAxisKey}
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value: number) =>
                formatters ? applyFormatters(value, formatters) : value.toString()
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: 'var(--color-foreground)', fontWeight: 'bold' }}
              formatter={(value: number) => [
                formatters ? applyFormatters(value, formatters) : value.toString(),
                '',
              ]}
            />
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors?.[index] || `var(--color-chart-${(index % 5) + 1})`}
                strokeWidth={3}
                dot={{ fill: colors?.[index] || `var(--color-chart-${(index % 5) + 1})`, r: 5 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey={xAxisKey}
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value: number) =>
                formatters ? applyFormatters(value, formatters) : value.toString()
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [
                formatters ? applyFormatters(value, formatters) : value.toString(),
                '',
              ]}
            />
            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors?.[index] || `var(--color-chart-${(index % 5) + 1})`}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey={xAxisKey}
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value: number) =>
                formatters ? applyFormatters(value, formatters) : value.toString()
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [
                formatters ? applyFormatters(value, formatters) : value.toString(),
                '',
              ]}
            />
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors?.[index] || `var(--color-chart-${(index % 5) + 1})`}
                fill={colors?.[index] || `var(--color-chart-${(index % 5) + 1})`}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey={yAxisKeys[0]}
              nameKey={xAxisKey}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors?.[index] || `var(--color-chart-${(index % 5) + 1})`}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [
                formatters ? applyFormatters(value, formatters) : value.toString(),
                '',
              ]}
            />
            <Legend />
          </PieChart>
        );

      default:
        return <div>نوع الرسم البياني غير مدعوم</div>;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg mb-1">{titleAr || config.title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
