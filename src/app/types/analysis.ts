import { z } from 'zod';

export const AnalysisCategorySchema = z.object({
  id: z.string().uuid(),
  key: z.string().max(100),
  name: z.string().max(100),
  nameAr: z.string().max(100),
  description: z.string().max(500).optional(),
  descriptionAr: z.string().max(500).optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().nonnegative(),
  count: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export const KPIBlockSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().max(100),
  nameAr: z.string().max(100),
  value: z.number(),
  unit: z.string().max(20).optional(),
  target: z.number().optional(),
  previousValue: z.number().optional(),
  trendDirection: z.enum(['up', 'down', 'flat']).optional(),
  trendValue: z.number().optional(),
  format: z.enum(['currency', 'percentage', 'number', 'compact']).optional(),
  color: z.string().optional(),
});

export const MetricItemSchema = z.object({
  id: z.string().max(50),
  label: z.string().max(100),
  labelAr: z.string().max(100),
  value: z.number(),
  unit: z.string().max(20).optional(),
  change: z.number().optional(),
  changeType: z.enum(['positive', 'negative', 'neutral']).optional(),
});

export const ValueFormattersSchema = z.object({
  yAxis: z.enum(['currency', 'percentage', 'number', 'compact', 'none']).optional(),
  tooltip: z.enum(['currency', 'percentage', 'number', 'compact', 'none']).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export const ChartConfigSchema = z.object({
  id: z.string().max(50),
  type: z.enum(['line', 'bar', 'pie', 'area']),
  title: z.string().max(100),
  titleAr: z.string().max(100),
  subtitle: z.string().max(200).optional(),
  data: z.array(z.record(z.any())),
  xAxisKey: z.string().max(50),
  yAxisKeys: z.array(z.string()),
  colors: z.array(z.string()).optional(),
  formatters: ValueFormattersSchema.optional(),
});

export const AnalyticsSummarySchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  metrics: z.array(MetricItemSchema),
  charts: z.array(ChartConfigSchema),
  lastUpdated: z.string().datetime(),
});

export const AnalysisOutputSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: z.enum(['alert', 'recommendation', 'summary', 'insight']),
  title: z.string().max(200),
  titleAr: z.string().max(200),
  description: z.string().max(2000),
  descriptionAr: z.string().max(2000),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  impact: z.string().max(100).optional(),
  confidenceScore: z.number().min(0).max(100).optional(),
  metadata: z.record(z.any()).optional(),
  generatedAt: z.string().datetime(),
});

export const FilterParametersSchema = z.object({
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
  }).optional(),
  companyId: z.string().uuid().optional(),
  domainId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
}).optional();

export const CategoriesResponseSchema = z.object({
  categories: z.array(AnalysisCategorySchema),
  total: z.number().int().nonnegative(),
});

export const AnalyticsSummaryResponseSchema = z.object({
  summary: AnalyticsSummarySchema,
});

export const InsightsResponseSchema = z.object({
  insights: z.array(AnalysisOutputSchema),
  total: z.number().int().nonnegative(),
});

export const SavedAnalysisSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  filters: FilterParametersSchema,
  title: z.string().max(200).optional(),
  createdAt: z.string().datetime(),
  resultsSnapshot: z.record(z.any()).optional(),
});

export type AnalysisCategory = z.infer<typeof AnalysisCategorySchema>;
export type KPIBlock = z.infer<typeof KPIBlockSchema>;
export type MetricItem = z.infer<typeof MetricItemSchema>;
export type ValueFormatters = z.infer<typeof ValueFormattersSchema>;
export type ChartConfig = z.infer<typeof ChartConfigSchema>;
export type AnalyticsSummary = z.infer<typeof AnalyticsSummarySchema>;
export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;
export type FilterParameters = z.infer<typeof FilterParametersSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
export type AnalyticsSummaryResponse = z.infer<typeof AnalyticsSummaryResponseSchema>;
export type InsightsResponse = z.infer<typeof InsightsResponseSchema>;
export type SavedAnalysis = z.infer<typeof SavedAnalysisSchema>;
