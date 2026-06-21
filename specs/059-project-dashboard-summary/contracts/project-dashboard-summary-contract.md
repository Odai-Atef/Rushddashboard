# API Contract: Project Dashboard Summary

**Endpoint**: `GET /api/v1/projects/dashboard/summary`

**Authentication**: `Authorization: Bearer <jwt_token>`

**Purpose**: Return a single aggregate snapshot for the project dashboard, replacing all previously hardcoded sample data.

## Request

- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Query Parameters**: None
- **Body**: None

## Success Response

**Status**: `200 OK`

**Body**:

```json
{
  "stats": {
    "total": 42,
    "active": 15,
    "draft": 8,
    "awaitingApproval": 12,
    "approved": 5,
    "funded": 3,
    "completed": 4
  },
  "statusDistribution": [
    { "name": "مسودة", "value": 8, "color": "#6b7280" },
    { "name": "قيد المراجعة", "value": 12, "color": "#3b82f6" },
    { "name": "معتمد", "value": 5, "color": "#10b981" },
    { "name": "ممول", "value": 3, "color": "#22c55e" },
    { "name": "قيد التنفيذ", "value": 15, "color": "#06b6d4" },
    { "name": "مكتمل", "value": 4, "color": "#8b5cf6" }
  ],
  "budgetTrend": [
    { "month": "يناير", "budget": 450000 },
    { "month": "فبراير", "budget": 680000 }
  ],
  "recentActivity": [
    {
      "userName": "أحمد محمد",
      "action": "حدّث حالة المشروع",
      "projectName": "برنامج الأسر المنتجة",
      "timestamp": "2026-06-21T13:00:00Z"
    }
  ],
  "upcomingDeadlines": [
    {
      "projectName": "برنامج الأسر المنتجة",
      "deadline": "2026-06-15",
      "daysLeft": 8,
      "priority": "high"
    }
  ]
}
```

## Response Schema

### `DashboardStats`

| Field | Type | Description |
|-------|------|-------------|
| `total` | `number` | Total number of projects visible to the user |
| `active` | `number` | Projects considered active |
| `draft` | `number` | Projects in draft status |
| `awaitingApproval` | `number` | Projects awaiting approval |
| `approved` | `number` | Approved projects |
| `funded` | `number` | Funded projects |
| `completed` | `number` | Completed projects |

### `StatusDistributionItem`

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Arabic display label for the status group |
| `value` | `number` | Count of projects in this group |
| `color` | `string` | Hex color code for the chart slice |

### `BudgetTrendItem`

| Field | Type | Description |
|-------|------|-------------|
| `month` | `string` | Arabic month name |
| `budget` | `number` | Budget amount for that month |

### `RecentActivityItem`

| Field | Type | Description |
|-------|------|-------------|
| `userName` | `string` | Name of the user who performed the action |
| `action` | `string` | Description of the action performed |
| `projectName` | `string` | Name of the affected project |
| `timestamp` | `string` (ISO 8601) | When the action occurred |

### `UpcomingDeadlineItem`

| Field | Type | Description |
|-------|------|-------------|
| `projectName` | `string` | Name of the project |
| `deadline` | `string` (YYYY-MM-DD) | Deadline date |
| `daysLeft` | `number` | Days remaining until deadline |
| `priority` | `"high" \| "medium" \| "low"` | Deadline priority |

## Error Responses

- **401 Unauthorized**: Missing or invalid JWT token.
- **403 Forbidden**: User lacks permission to view dashboard summary.
- **500 Internal Server Error**: Server-side failure.

**Frontend handling**: On any non-2xx response, display an Arabic error message such as "تعذر تحميل بيانات لوحة المشاريع". Optionally provide a retry button.

## Assumptions

- The backend aggregates and groups status counts before returning them; the frontend does not transform status values.
- Color values provided in `statusDistribution` are already suitable for direct use in Recharts.
- `budgetTrend` months are pre-sorted and localized to Arabic by the backend.
- Timestamps are ISO 8601 and UTC; the frontend converts them to Arabic relative time using `date-fns` locale `ar`.
