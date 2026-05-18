# Data Model: Dashboard Backend Integration

**Date**: 2026-05-18
**Feature**: Dashboard Backend Integration

## Entities

### Dashboard

Represents a configurable collection of widgets displayed to users.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| name | string (max 100) | Yes | Display name (English) |
| nameAr | string (max 100) | Yes | Display name (Arabic) |
| description | string (max 500) | No | Brief description |
| icon | string | No | Lucide icon name or emoji |
| layout | LayoutConfig | Yes | Widget positioning (grid/flex) |
| filters | FilterDefinition[] | No | Dashboard-level filters |
| companyId | UUID | No | Company-specific dashboard |
| userId | UUID | No | User-specific dashboard |
| isDefault | boolean | Yes | Whether this is the default dashboard |
| sortOrder | integer | Yes | Display order in list |
| isActive | boolean | Yes | Soft-delete flag |
| createdAt | datetime | Yes | Creation timestamp |
| updatedAt | datetime | Yes | Last update timestamp |

**Relationships**:
- Has many Widgets (1:N)
- Belongs to Company (optional, N:1)
- Belongs to User (optional, N:1)

### Widget

Represents a single data visualization or metric within a dashboard.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| dashboardId | UUID | Yes | Parent dashboard reference |
| type | WidgetType | Yes | Widget renderer type |
| title | string (max 100) | Yes | Display title (English) |
| titleAr | string (max 100) | Yes | Display title (Arabic) |
| subtitle | string (max 200) | No | Subtitle or description |
| dataSource | DataSource | Yes | Endpoint/config for fetching data |
| config | WidgetConfig | Yes | Type-specific configuration |
| layout | WidgetLayout | Yes | Position and size in dashboard grid |
| refreshInterval | integer | No | Auto-refresh interval in seconds |
| createdAt | datetime | Yes | Creation timestamp |
| updatedAt | datetime | Yes | Last update timestamp |

**Relationships**:
- Belongs to Dashboard (N:1)
- Has one WidgetData (fetched dynamically)

### WidgetData

Represents the actual data payload fetched for a widget at runtime.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| widgetId | UUID | Yes | Reference to widget |
| data | array[record] | Yes | Typed data array (structure varies by widget type) |
| metadata | record | No | Additional metadata (lastUpdated, total, etc.) |
| filtersApplied | FilterValue[] | No | Filters applied to this data |

**Notes**: Structure varies by widget type:
- **stat**: Single value object with `value`, `change`, `changeType`
- **chart**: Array of data points with `xAxisKey` and `yAxisKeys`
- **table**: Array of row objects with column definitions

### FilterDefinition

Defines a filter available on a dashboard.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (max 50) | Yes | Unique filter key |
| type | FilterType | Yes | `dateRange`, `dropdown`, `multiSelect`, `search` |
| label | string (max 100) | Yes | Display label (English) |
| labelAr | string (max 100) | Yes | Display label (Arabic) |
| defaultValue | any | No | Default filter value |
| options | FilterOption[] | No | Available options (for dropdown/multiSelect) |
| config | record | No | Type-specific config (min/max dates, placeholder, etc.) |

### FilterValue

Represents an applied filter value.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| filterId | string | Yes | Reference to filter definition |
| value | any | Yes | Applied value (type depends on filter type) |

## Type Definitions

```typescript
// Widget types supported by frontend
type WidgetType = 'stat' | 'line' | 'bar' | 'pie' | 'area' | 'table';

// Filter types
type FilterType = 'dateRange' | 'dropdown' | 'multiSelect' | 'search';

// Layout configuration for dashboard
type LayoutConfig = {
  type: 'grid' | 'flex';
  columns?: number;        // For grid layout
  gap?: number;            // Gap between widgets in pixels
  padding?: number;        // Dashboard padding
};

// Widget layout position
type WidgetLayout = {
  x: number;               // Grid column start
  y: number;               // Grid row start
  width: number;           // Columns to span
  height: number;          // Rows to span
  minWidth?: number;       // Minimum width in pixels
  minHeight?: number;      // Minimum height in pixels
};

// Data source configuration
type DataSource = {
  endpoint: string;        // API endpoint path (relative)
  method: 'GET' | 'POST';  // HTTP method
  params?: record;         // Static query parameters
  body?: record;           // Static body for POST
};

// Widget-specific configuration
type WidgetConfig = StatConfig | ChartConfig | TableConfig;

type StatConfig = {
  format: 'currency' | 'percentage' | 'number' | 'compact';
  prefix?: string;
  suffix?: string;
  comparison?: {
    label: string;
    labelAr: string;
  };
};

type ChartConfig = {
  xAxisKey: string;
  yAxisKeys: string[];
  colors?: string[];
  formatters?: ValueFormatters;
  showLegend?: boolean;
  showGrid?: boolean;
};

type TableConfig = {
  columns: TableColumn[];
  sortable?: boolean;
  pagination?: {
    pageSize: number;
    enabled: boolean;
  };
  searchable?: boolean;
};

type TableColumn = {
  key: string;
  label: string;
  labelAr: string;
  format?: 'currency' | 'percentage' | 'number' | 'date' | 'text';
  width?: string;
  sortable?: boolean;
};

type ValueFormatters = {
  yAxis?: 'currency' | 'percentage' | 'number' | 'compact' | 'none';
  tooltip?: 'currency' | 'percentage' | 'number' | 'compact' | 'none';
  prefix?: string;
  suffix?: string;
};

type FilterOption = {
  value: string;
  label: string;
  labelAr: string;
};
```

## Validation Rules

1. **Dashboard uniqueness**: `(companyId, name)` must be unique when `companyId` is present; `(userId, name)` must be unique when `userId` is present
2. **Widget layout constraints**: `x + width` ≤ dashboard grid columns; `y + height` ≤ max rows
3. **Widget type compatibility**: `config` must match the structure defined for `type`
4. **Filter options required**: `options` required when `type` is `dropdown` or `multiSelect`
5. **Data source endpoint**: Must be a valid relative path starting with `/`

## State Transitions

### Dashboard Lifecycle

```
Draft → Active → Archived
  ↑         ↓
         Inactive
```

- **Draft**: Created but not visible to users
- **Active**: Visible and functional
- **Inactive**: Temporarily hidden (soft disable)
- **Archived**: Permanently hidden but data retained

### Widget Lifecycle

```
Created → Active → Updated → Active
   ↓         ↓
Deleted   Deprecated
```

- Widget changes trigger dashboard `updatedAt` timestamp
- Deleting a widget is a soft delete (mark `isActive: false`)

## Data Volume Assumptions

- Dashboards per company: 5-20
- Widgets per dashboard: 4-15
- Filter definitions per dashboard: 0-5
- Widget data points: 10-1000 (depending on type)
- Concurrent dashboard viewers: 10-100 per company
