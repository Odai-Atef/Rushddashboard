# API Contract: Analysis Endpoints

**Feature**: Executive Analysis Backend Integration
**Date**: 2026-05-18
**Base URL**: `${VITE_API_BASE_URL}/analysis`

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /analysis/categories

List all active analysis categories for the authenticated user.

**Query Parameters**:
- `limit` (optional): number, default 20, max 100
- `offset` (optional): number, default 0

**Response (200 OK)**:
```json
{
  "categories": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Financial",
      "nameAr": "المالية",
      "description": "Financial performance metrics and analytics",
      "icon": "DollarSign",
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "total": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

### GET /analysis/categories/:id/summary

Get analytics summary (KPIs + charts) for a specific category.

**Path Parameters**:
- `id`: string (UUID) - Category ID

**Query Parameters**:
- `date_from` (optional): ISO date string - Start of date range
- `date_to` (optional): ISO date string - End of date range
- `company_id` (optional): UUID string - Company filter
- `domain_id` (optional): UUID string - Domain filter
- `department_id` (optional): UUID string - Department filter

**Response (200 OK)**:
```json
{
  "summary": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "categoryId": "550e8400-e29b-41d4-a716-446655440000",
    "period": {
      "start": "2026-01-01T00:00:00Z",
      "end": "2026-06-30T23:59:59Z"
    },
    "metrics": [
      {
        "id": "total-revenue",
        "label": "Total Revenue",
        "labelAr": "إجمالي الإيرادات",
        "value": 3150000,
        "unit": "ر.س",
        "change": 18.7,
        "changeType": "positive"
      }
    ],
    "charts": [
      {
        "id": "revenue-trend",
        "type": "line",
        "title": "Revenue Trend",
        "titleAr": "اتجاه الإيرادات",
        "subtitle": "Monthly revenue over last 6 months",
        "data": [
          { "month": "محرم", "revenue": 2100000 },
          { "month": "صفر", "revenue": 2350000 }
        ],
        "xAxisKey": "month",
        "yAxisKeys": ["revenue"],
        "colors": ["var(--color-chart-1)"],
        "formatters": {
          "yAxis": "currency",
          "tooltip": "currency",
          "prefix": "",
          "suffix": " ر.س"
        }
      }
    ],
    "lastUpdated": "2026-05-18T12:00:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Category not found or not accessible
- `500 Internal Server Error`: Server error

---

### GET /analysis/categories/:id/insights

Get AI-generated insights, alerts, and recommendations for a specific category.

**Path Parameters**:
- `id`: string (UUID) - Category ID

**Query Parameters**:
- `date_from` (optional): ISO date string - Start of date range
- `date_to` (optional): ISO date string - End of date range
- `company_id` (optional): UUID string - Company filter
- `domain_id` (optional): UUID string - Domain filter
- `department_id` (optional): UUID string - Department filter
- `limit` (optional): number, default 20, max 100
- `offset` (optional): number, default 0

**Response (200 OK)**:
```json
{
  "insights": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "categoryId": "550e8400-e29b-41d4-a716-446655440000",
      "type": "alert",
      "title": "Conversion Rate Drop",
      "titleAr": "انخفاض معدل التحويل",
      "description": "Conversion rate dropped from 34.5% to 28.2%",
      "descriptionAr": "انخفض معدل التحويل من 34.5% إلى 28.2%",
      "priority": "high",
      "impact": "-6.3%",
      "confidenceScore": 92,
      "metadata": {
        "previousValue": 34.5,
        "currentValue": 28.2
      },
      "generatedAt": "2026-05-18T12:00:00Z"
    }
  ],
  "total": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Category not found or not accessible
- `500 Internal Server Error`: Server error

## Error Response Format

```json
{
  "statusCode": number,
  "message": "string",
  "error": "string"
}
```

## Notes

- All endpoints return data ordered by relevance/importance (not chronological).
- The `/summary` endpoint aggregates KPIs and charts in a single response for efficiency.
- The `/insights` endpoint supports pagination for categories with many insights.
- Filter parameters are optional; omitting them returns unfiltered data for the current period.
- Token refresh follows the same pattern as auth: on 401, attempt refresh; if refresh fails, redirect to login.
- Date range defaults to last 6 months if not specified.
