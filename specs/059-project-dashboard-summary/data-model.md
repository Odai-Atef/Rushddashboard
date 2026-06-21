# Data Model: Project Dashboard Summary

## Entities

### DashboardStats

Aggregate counts displayed in the top stat cards of the project dashboard.

| Field | Type | Description |
|-------|------|-------------|
| `total` | `number` | Total number of projects visible to the user |
| `active` | `number` | Projects currently active |
| `draft` | `number` | Draft projects |
| `awaitingApproval` | `number` | Projects awaiting approval |
| `approved` | `number` | Approved projects |
| `funded` | `number` | Funded projects |
| `completed` | `number` | Completed projects |

### StatusDistributionItem

A single slice of the status distribution pie chart.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Arabic label for the status group |
| `value` | `number` | Count of projects in this group |
| `color` | `string` | Hex color for chart rendering |

### BudgetTrendItem

A monthly budget data point for the line chart.

| Field | Type | Description |
|-------|------|-------------|
| `month` | `string` | Arabic month name |
| `budget` | `number` | Budget amount |

### RecentActivityItem

A recent project-related action for the activity feed.

| Field | Type | Description |
|-------|------|-------------|
| `userName` | `string` | Name of the user who performed the action |
| `action` | `string` | Action description |
| `projectName` | `string` | Affected project name |
| `timestamp` | `string` (ISO 8601) | UTC timestamp of the action |

### UpcomingDeadlineItem

A future project deadline for the deadlines list.

| Field | Type | Description |
|-------|------|-------------|
| `projectName` | `string` | Name of the project |
| `deadline` | `string` (YYYY-MM-DD) | Deadline date |
| `daysLeft` | `number` | Days remaining until deadline |
| `priority` | `"high" \| "medium" \| "low"` | Deadline priority |

### ProjectDashboardData

Top-level aggregate returned by the dashboard summary endpoint.

| Field | Type | Description |
|-------|------|-------------|
| `stats` | `DashboardStats` | Aggregate project counts |
| `statusDistribution` | `StatusDistributionItem[]` | Pie chart data |
| `budgetTrend` | `BudgetTrendItem[]` | Line chart data |
| `recentActivity` | `RecentActivityItem[]` | Recent activity feed |
| `upcomingDeadlines` | `UpcomingDeadlineItem[]` | Upcoming deadlines list |
