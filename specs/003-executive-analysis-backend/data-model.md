# Data Model: Executive Analysis Backend Integration

**Feature**: Executive Analysis Backend Integration  
**Date**: 2026-05-18  
**Source**: Feature spec requirements + existing patterns (`src/app/types/chat.ts`)

## Entities

### AnalysisCategory

Represents a grouping of executive analytics (e.g., Financial, Operational, HR).

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | UUID string | Yes | Valid UUID v4 | Unique identifier |
| `name` | string | Yes | Max 100 chars | Category name (e.g., "Financial", "Operational") |
| `nameAr` | string | Yes | Max 100 chars | Arabic category name for UI display |
| `description` | string | No | Max 500 chars | Category description |
| `icon` | string | No | Valid icon name | Lucide icon identifier (e.g., "DollarSign", "Users") |
| `sortOrder` | integer | Yes | ≥ 0 | Display order in category list |
| `isActive` | boolean | Yes | - | Whether category is visible to users |

**Relationships**:
- One AnalysisCategory has many KPIs
- One AnalysisCategory has one AnalyticsSummary
- One AnalysisCategory has many AnalysisOutputs (insights)

---

### KPIBlock

Represents a key performance indicator with current value, target, trend, and comparison.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | UUID string | Yes | Valid UUID v4 | Unique identifier |
| `categoryId` | UUID string | Yes | Valid UUID v4 | Parent category reference |
| `name` | string | Yes | Max 100 chars | KPI name (e.g., "Total Revenue") |
| `nameAr` | string | Yes | Max 100 chars | Arabic KPI name for UI display |
| `value` | number | Yes | - | Current KPI value |
| `unit` | string | No | Max 20 chars | Unit of measurement (e.g., "ر.س", "%", "count") |
| `target` | number | No | - | Target value for comparison |
| `previousValue` | number | No | - | Previous period value for trend calculation |
| `trendDirection` | enum | No | `up`, `down`, `flat` | Direction of change |
| `trendValue` | number | No | - | Absolute or percentage change value |
| `format` | enum | No | `currency`, `percentage`, `number`, `compact` | How to format the value for display |
| `color` | string | No | Valid CSS color | Override color for the KPI card |

**Relationships**:
- Belongs to one AnalysisCategory (via `categoryId`)

---

### AnalyticsSummary

Represents aggregated analytics data for a category, including charts and metrics.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | UUID string | Yes | Valid UUID v4 | Unique identifier |
| `categoryId` | UUID string | Yes | Valid UUID v4 | Parent category reference |
| `period` | object | Yes | `{ start: date, end: date }` | Date range for this summary |
| `metrics` | array | Yes | See MetricItem | Key metrics for the category |
| `charts` | array | Yes | See ChartConfig | Chart configurations with data |
| `lastUpdated` | ISO 8601 datetime | Yes | Valid datetime | When data was last refreshed |

**Relationships**:
- Belongs to one AnalysisCategory (via `categoryId`)
- Contains many MetricItems
- Contains many ChartConfigs

---

### MetricItem

A single metric within an AnalyticsSummary.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | Max 50 chars | Metric identifier (e.g., "total-revenue") |
| `label` | string | Yes | Max 100 chars | Display label |
| `labelAr` | string | Yes | Max 100 chars | Arabic display label |
| `value` | number | Yes | - | Metric value |
| `unit` | string | No | Max 20 chars | Unit of measurement |
| `change` | number | No | - | Change from previous period |
| `changeType` | enum | No | `positive`, `negative`, `neutral` | How to interpret the change |

---

### ChartConfig

Configuration and data for a single chart.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | Max 50 chars | Chart identifier (e.g., "revenue-trend") |
| `type` | enum | Yes | `line`, `bar`, `pie`, `area` | Chart type |
| `title` | string | Yes | Max 100 chars | Chart title |
| `titleAr` | string | Yes | Max 100 chars | Arabic chart title |
| `subtitle` | string | No | Max 200 chars | Chart subtitle or description |
| `data` | array | Yes | Array of objects | Chart data points |
| `xAxisKey` | string | Yes | Max 50 chars | Object key for X-axis values |
| `yAxisKeys` | array | Yes | Array of strings | Object keys for Y-axis series |
| `colors` | array | No | Array of CSS colors | Custom colors for series |
| `formatters` | object | No | See ValueFormatters | How to format axis/tooltip values |

---

### ValueFormatters

Formatting configuration for chart values.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `yAxis` | enum | No | `currency`, `percentage`, `number`, `compact`, `none` |
| `tooltip` | enum | No | `currency`, `percentage`, `number`, `compact`, `none` |
| `prefix` | string | No | String to prepend (e.g., "ر.س ") |
| `suffix` | string | No | String to append (e.g., " %") |

---

### AnalysisOutput

Represents generated insights or recommendations based on analytics.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | UUID string | Yes | Valid UUID v4 | Unique identifier |
| `categoryId` | UUID string | Yes | Valid UUID v4 | Parent category reference |
| `type` | enum | Yes | `alert`, `recommendation`, `summary`, `insight` | Type of analysis output |
| `title` | string | Yes | Max 200 chars | Output title |
| `titleAr` | string | Yes | Max 200 chars | Arabic output title |
| `description` | string | Yes | Max 2000 chars | Detailed description |
| `descriptionAr` | string | Yes | Max 2000 chars | Arabic detailed description |
| `priority` | enum | Yes | `urgent`, `high`, `medium`, `low` | Priority level |
| `impact` | string | No | Max 100 chars | Expected impact (e.g., "+32% revenue") |
| `confidenceScore` | number | No | 0-100 | AI confidence in this insight (percentage) |
| `metadata` | object | No | - | Additional structured data |
| `generatedAt` | ISO 8601 datetime | Yes | Valid datetime | When insight was generated |

**Relationships**:
- Belongs to one AnalysisCategory (via `categoryId`)

---

### FilterParameters

Represents user-selected filters for narrowing analysis scope.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `dateRange` | object | No | `{ start: date, end: date }` | Date range filter |
| `companyId` | UUID string | No | Valid UUID v4 | Company filter |
| `domainId` | UUID string | No | Valid UUID v4 | Business domain filter |
| `departmentId` | UUID string | No | Valid UUID v4 | Department filter |

**Notes**:
- All fields are optional; empty object means "no filters applied"
- Passed as query parameters in API requests
- Stored in analysis history for reproducibility

---

### SavedAnalysis

Represents a persisted analysis configuration and results. [Future feature]

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | UUID string | Yes | Valid UUID v4 | Unique identifier |
| `userId` | UUID string | Yes | Valid UUID v4 | Owner user reference |
| `categoryId` | UUID string | Yes | Valid UUID v4 | Selected category |
| `filters` | FilterParameters | Yes | Valid filters | Applied filters at save time |
| `title` | string | No | Max 200 chars | User-defined title |
| `createdAt` | ISO 8601 datetime | Yes | Valid datetime | When saved |
| `resultsSnapshot` | object | No | - | Snapshot of results at save time |

## Validation Rules

### Request Validation

**FilterParameters Request**:
- `dateRange.start`: optional, valid ISO date
- `dateRange.end`: optional, valid ISO date, must be >= start
- `companyId`: optional, valid UUID
- `domainId`: optional, valid UUID
- `departmentId`: optional, valid UUID

### Response Validation

All API responses validated with Zod schemas:
- `CategoriesResponseSchema`: `{ categories: AnalysisCategory[], total: number }`
- `AnalyticsSummaryResponseSchema`: `{ summary: AnalyticsSummary }`
- `InsightsResponseSchema`: `{ insights: AnalysisOutput[], total: number }`

## API to Entity Mapping

| API Endpoint | HTTP Method | Request Entity | Response Entity |
|--------------|-------------|----------------|-----------------|
| `/analysis/categories` | GET | - | `CategoriesResponse` |
| `/analysis/categories/:id/summary` | GET | `FilterParameters` (query) | `AnalyticsSummaryResponse` |
| `/analysis/categories/:id/insights` | GET | `FilterParameters` (query) | `InsightsResponse` |

## Zod Schemas

```typescript
export const AnalysisCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  nameAr: z.string().max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
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
```

## Data Flow

1. **Load Categories**: `GET /analysis/categories` → validate with `CategoriesResponseSchema` → store in AnalysisContext
2. **Select Category**: User clicks category → set `selectedCategory` in context → trigger analytics + insights fetch
3. **Load Analytics**: `GET /analysis/categories/:id/summary?{filters}` → validate with `AnalyticsSummaryResponseSchema` → render KPIs + charts
4. **Load Insights**: `GET /analysis/categories/:id/insights?{filters}` → validate with `InsightsResponseSchema` → render alerts/recommendations
5. **Apply Filters**: Update `filters` in context → re-fetch analytics + insights with new query parameters
6. **Error Handling**: Per-section error states → retry button re-triggers specific fetch
