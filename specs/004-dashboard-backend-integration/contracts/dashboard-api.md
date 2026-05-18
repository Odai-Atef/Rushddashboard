# Dashboard API Contracts

**Date**: 2026-05-18
**Version**: 1.0.0
**Base URL**: `{API_BASE_URL}/dashboards`

## Authentication

All endpoints require Bearer token authentication:
```
Authorization: Bearer {access_token}
```

## Endpoints

### 1. List Dashboards

**GET** `/dashboards`

Retrieve all dashboards accessible to the current user.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| companyId | UUID | No | Filter by company |
| limit | integer | No | Page size (default: 20, max: 100) |
| offset | integer | No | Pagination offset (default: 0) |

#### Response: 200 OK

```json
{
  "dashboards": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Executive Overview",
      "nameAr": "نظرة عامة تنفيذية",
      "description": "High-level business metrics",
      "icon": "layout-dashboard",
      "layout": {
        "type": "grid",
        "columns": 12,
        "gap": 16,
        "padding": 24
      },
      "filters": [
        {
          "id": "dateRange",
          "type": "dateRange",
          "label": "Date Range",
          "labelAr": "نطاق التاريخ",
          "defaultValue": {
            "start": "2026-01-01T00:00:00Z",
            "end": "2026-05-18T23:59:59Z"
          }
        }
      ],
      "companyId": "550e8400-e29b-41d4-a716-446655440001",
      "isDefault": true,
      "sortOrder": 1,
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-05-18T10:00:00Z"
    }
  ],
  "total": 5
}
```

#### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | User lacks permission to view dashboards |

---

### 2. Get Dashboard Details

**GET** `/dashboards/{id}`

Retrieve a single dashboard with its widget definitions.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Dashboard ID |

#### Response: 200 OK

```json
{
  "dashboard": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Executive Overview",
    "nameAr": "نظرة عامة تنفيذية",
    "description": "High-level business metrics",
    "icon": "layout-dashboard",
    "layout": {
      "type": "grid",
      "columns": 12,
      "gap": 16,
      "padding": 24
    },
    "filters": [
      {
        "id": "dateRange",
        "type": "dateRange",
        "label": "Date Range",
        "labelAr": "نطاق التاريخ",
        "defaultValue": {
          "start": "2026-01-01T00:00:00Z",
          "end": "2026-05-18T23:59:59Z"
        }
      },
      {
        "id": "department",
        "type": "dropdown",
        "label": "Department",
        "labelAr": "القسم",
        "options": [
          { "value": "sales", "label": "Sales", "labelAr": "المبيعات" },
          { "value": "marketing", "label": "Marketing", "labelAr": "التسويق" }
        ]
      }
    ],
    "companyId": "550e8400-e29b-41d4-a716-446655440001",
    "isDefault": true,
    "sortOrder": 1,
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-05-18T10:00:00Z"
  },
  "widgets": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "dashboardId": "550e8400-e29b-41d4-a716-446655440000",
      "type": "stat",
      "title": "Total Sales",
      "titleAr": "إجمالي المبيعات",
      "subtitle": "Current period",
      "dataSource": {
        "endpoint": "/dashboards/550e8400-e29b-41d4-a716-446655440000/widgets/550e8400-e29b-41d4-a716-446655440010/data",
        "method": "GET"
      },
      "config": {
        "format": "currency",
        "prefix": "ر.س "
      },
      "layout": {
        "x": 0,
        "y": 0,
        "width": 3,
        "height": 1
      },
      "refreshInterval": 300
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "dashboardId": "550e8400-e29b-41d4-a716-446655440000",
      "type": "line",
      "title": "Sales Trend",
      "titleAr": "اتجاه المبيعات",
      "dataSource": {
        "endpoint": "/dashboards/550e8400-e29b-41d4-a716-446655440000/widgets/550e8400-e29b-41d4-a716-446655440011/data",
        "method": "GET"
      },
      "config": {
        "xAxisKey": "month",
        "yAxisKeys": ["value"],
        "colors": ["#3b82f6"],
        "showLegend": true,
        "showGrid": true
      },
      "layout": {
        "x": 0,
        "y": 1,
        "width": 6,
        "height": 2
      }
    }
  ]
}
```

#### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | User lacks access to this dashboard |
| 404 | NOT_FOUND | Dashboard does not exist |

---

### 3. Get Widget Data

**GET** `/dashboards/{dashboardId}/widgets/{widgetId}/data`

Fetch live data for a specific widget.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dashboardId | UUID | Yes | Dashboard ID |
| widgetId | UUID | Yes | Widget ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dateRange[start] | datetime | No | Filter start date |
| dateRange[end] | datetime | No | Filter end date |
| department | string | No | Department filter (example) |
| * | any | No | Additional filter parameters as defined by dashboard |

#### Response: 200 OK

**Stat Widget**:
```json
{
  "widgetId": "550e8400-e29b-41d4-a716-446655440010",
  "data": [
    {
      "value": 245000,
      "change": 12.5,
      "changeType": "positive"
    }
  ],
  "metadata": {
    "lastUpdated": "2026-05-18T10:00:00Z",
    "currency": "SAR"
  }
}
```

**Chart Widget**:
```json
{
  "widgetId": "550e8400-e29b-41d4-a716-446655440011",
  "data": [
    { "month": "يناير", "value": 4000 },
    { "month": "فبراير", "value": 3000 },
    { "month": "مارس", "value": 5000 }
  ],
  "metadata": {
    "lastUpdated": "2026-05-18T10:00:00Z",
    "totalPoints": 12
  }
}
```

**Table Widget**:
```json
{
  "widgetId": "550e8400-e29b-41d4-a716-446655440012",
  "data": [
    { "name": "Product A", "sales": 50000, "growth": 15 },
    { "name": "Product B", "sales": 35000, "growth": -5 }
  ],
  "metadata": {
    "lastUpdated": "2026-05-18T10:00:00Z",
    "total": 25
  }
}
```

#### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | User lacks access |
| 404 | NOT_FOUND | Widget or dashboard not found |
| 422 | VALIDATION_ERROR | Invalid filter parameters |

---

### 4. Create Dashboard

**POST** `/dashboards`

Create a new dashboard (admin/permission required).

#### Request Body

```json
{
  "name": "Marketing Dashboard",
  "nameAr": "لوحة التسويق",
  "description": "Marketing metrics and KPIs",
  "icon": "trending-up",
  "layout": {
    "type": "grid",
    "columns": 12,
    "gap": 16,
    "padding": 24
  },
  "filters": [],
  "companyId": "550e8400-e29b-41d4-a716-446655440001",
  "isDefault": false,
  "sortOrder": 2
}
```

#### Response: 201 Created

Returns the created dashboard object (same structure as GET /dashboards/{id}).

#### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | User lacks permission to create dashboards |
| 409 | CONFLICT | Dashboard with this name already exists |
| 422 | VALIDATION_ERROR | Invalid request body |

---

### 5. Update Dashboard

**PATCH** `/dashboards/{id}`

Update an existing dashboard (admin/permission required).

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Dashboard ID |

#### Request Body

Partial update - only include fields to change:

```json
{
  "name": "Updated Marketing Dashboard",
  "layout": {
    "type": "grid",
    "columns": 12,
    "gap": 24
  }
}
```

#### Response: 200 OK

Returns the updated dashboard object.

#### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | User lacks permission |
| 404 | NOT_FOUND | Dashboard does not exist |
| 409 | CONFLICT | Name conflict |
| 422 | VALIDATION_ERROR | Invalid request body |

---

## Common Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "Specific field with error",
    "reason": "Why it failed"
  }
}
```

## HTTP Status Codes

| Status | Usage |
|--------|-------|
| 200 | Successful GET/PATCH |
| 201 | Successful creation |
| 400 | Bad request (malformed JSON) |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Resource not found |
| 409 | Conflict (duplicate, etc.) |
| 422 | Validation error |
| 500 | Server error |

## Data Types

| Type | Format | Example |
|------|--------|---------|
| UUID | RFC 4122 v4 | `550e8400-e29b-41d4-a716-446655440000` |
| datetime | ISO 8601 UTC | `2026-05-18T10:00:00Z` |
| integer | 32-bit signed | `42` |
| string | UTF-8 | `Hello` |
| boolean | true/false | `true` |
| record | JSON object | `{"key": "value"}` |
| array[T] | JSON array | `[{"id": "1"}]` |
