import { z } from 'zod';

// Widget types supported by frontend
export const WidgetTypeSchema = z.enum(['stat', 'line', 'bar', 'pie', 'area', 'table']);
export type WidgetType = z.infer<typeof WidgetTypeSchema>;

// Filter types
export const FilterTypeSchema = z.enum(['dateRange', 'dropdown', 'multiSelect', 'search']);
export type FilterType = z.infer<typeof FilterTypeSchema>;

// Layout configuration for dashboard
export const LayoutConfigSchema = z.object({
  type: z.enum(['grid', 'flex']),
  columns: z.number().int().positive().optional(),
  gap: z.number().int().nonnegative().optional(),
  padding: z.number().int().nonnegative().optional(),
});
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;

// Widget layout position
export const WidgetLayoutSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  minWidth: z.number().int().positive().optional(),
  minHeight: z.number().int().positive().optional(),
});
export type WidgetLayout = z.infer<typeof WidgetLayoutSchema>;

// Data source configuration
export const DataSourceSchema = z.object({
  endpoint: z.string().min(1),
  method: z.enum(['GET', 'POST']),
  params: z.record(z.any()).optional(),
  body: z.record(z.any()).optional(),
});
export type DataSource = z.infer<typeof DataSourceSchema>;

// Filter option
export const FilterOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  labelAr: z.string(),
});
export type FilterOption = z.infer<typeof FilterOptionSchema>;

// Filter definition
export const FilterDefinitionSchema = z.object({
  id: z.string().max(50),
  type: FilterTypeSchema,
  label: z.string().max(100),
  labelAr: z.string().max(100),
  defaultValue: z.any().optional(),
  options: z.array(FilterOptionSchema).optional(),
  config: z.record(z.any()).optional(),
});
export type FilterDefinition = z.infer<typeof FilterDefinitionSchema>;

// Filter value
export const FilterValueSchema = z.object({
  filterId: z.string(),
  value: z.any(),
});
export type FilterValue = z.infer<typeof FilterValueSchema>;

// Widget configurations
export const StatConfigSchema = z.object({
  format: z.enum(['currency', 'percentage', 'number', 'compact']).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  comparison: z.object({
    label: z.string(),
    labelAr: z.string(),
  }).optional(),
});
export type StatConfig = z.infer<typeof StatConfigSchema>;

export const ChartConfigSchema = z.object({
  xAxisKey: z.string(),
  yAxisKeys: z.array(z.string()),
  colors: z.array(z.string()).optional(),
  formatters: z.object({
    yAxis: z.enum(['currency', 'percentage', 'number', 'compact', 'none']).optional(),
    tooltip: z.enum(['currency', 'percentage', 'number', 'compact', 'none']).optional(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
  }).optional(),
  showLegend: z.boolean().optional(),
  showGrid: z.boolean().optional(),
});
export type ChartConfig = z.infer<typeof ChartConfigSchema>;

export const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  labelAr: z.string(),
  format: z.enum(['currency', 'percentage', 'number', 'date', 'text']).optional(),
  width: z.string().optional(),
  sortable: z.boolean().optional(),
});
export type TableColumn = z.infer<typeof TableColumnSchema>;

export const TableConfigSchema = z.object({
  columns: z.array(TableColumnSchema),
  sortable: z.boolean().optional(),
  pagination: z.object({
    pageSize: z.number().int().positive(),
    enabled: z.boolean(),
  }).optional(),
  searchable: z.boolean().optional(),
});
export type TableConfig = z.infer<typeof TableConfigSchema>;

export const WidgetConfigSchema = z.union([StatConfigSchema, ChartConfigSchema, TableConfigSchema]);
export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

// Widget
export const WidgetSchema = z.object({
  id: z.string().uuid(),
  dashboardId: z.string().uuid(),
  type: WidgetTypeSchema,
  title: z.string().max(100),
  titleAr: z.string().max(100),
  subtitle: z.string().max(200).optional(),
  dataSource: DataSourceSchema,
  config: WidgetConfigSchema,
  layout: WidgetLayoutSchema,
  refreshInterval: z.number().int().nonnegative().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Widget = z.infer<typeof WidgetSchema>;

// Widget data
export const WidgetDataSchema = z.object({
  widgetId: z.string().uuid(),
  data: z.array(z.record(z.any())),
  metadata: z.record(z.any()).optional(),
  filtersApplied: z.array(FilterValueSchema).optional(),
});
export type WidgetData = z.infer<typeof WidgetDataSchema>;

// Dashboard
export const DashboardSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  nameAr: z.string().max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  layout: LayoutConfigSchema,
  filters: z.array(FilterDefinitionSchema).optional(),
  companyId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  isDefault: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Dashboard = z.infer<typeof DashboardSchema>;

// API Response schemas
export const DashboardsResponseSchema = z.object({
  dashboards: z.array(DashboardSchema),
  total: z.number().int().nonnegative(),
});
export type DashboardsResponse = z.infer<typeof DashboardsResponseSchema>;

export const DashboardDetailResponseSchema = z.object({
  dashboard: DashboardSchema,
  widgets: z.array(WidgetSchema),
});
export type DashboardDetailResponse = z.infer<typeof DashboardDetailResponseSchema>;

export const WidgetDataResponseSchema = WidgetDataSchema;
export type WidgetDataResponse = z.infer<typeof WidgetDataResponseSchema>;

// Request schemas
export const CreateDashboardRequestSchema = z.object({
  name: z.string().min(1).max(100),
  nameAr: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  layout: LayoutConfigSchema,
  filters: z.array(FilterDefinitionSchema).optional(),
  companyId: z.string().uuid().optional(),
  isDefault: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});
export type CreateDashboardRequest = z.infer<typeof CreateDashboardRequestSchema>;

export const UpdateDashboardRequestSchema = CreateDashboardRequestSchema.partial();
export type UpdateDashboardRequest = z.infer<typeof UpdateDashboardRequestSchema>;
