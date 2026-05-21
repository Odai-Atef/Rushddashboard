# API Contract: Analysis Categories

**Feature**: specs/029-ai-analysis-categories
**Date**: 2026-05-21
**Endpoint**: `GET /api/v1/analysis/categories`

## Request

### HTTP Method
GET

### URL Path
`/api/v1/analysis/categories`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Maximum number of categories to return. |
| `offset` | integer | No | 0 | Offset for pagination (not expected to be used for categories). |

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <token>` | Yes |
| `Content-Type` | `application/json` | Yes (implied by `apiFetch`). |

## Response

### HTTP 200 OK

Content-Type: `application/json`

```json
{
  "categories": [
    {
      "id": "a3f1c2b4-d5e6-7890-abcd-ef1234567890",
      "key": "sales",
      "name": "Sales",
      "nameAr": "المبيعات",
      "description": "Sales performance metrics and trends",
      "descriptionAr": "مقاييس الأداء واتجاهات المبيعات",
      "icon": "TrendingUp",
      "sortOrder": 1,
      "count": 5
    },
    {
      "id": "b4c2d3e4-f5a6-7890-bcde-ef1234567891",
      "key": "customers",
      "name": "Customers",
      "nameAr": "العملاء",
      "description": "Customer behavior and segmentation",
      "descriptionAr": "سلوك العملاء والتقسيم",
      "icon": "Users",
      "sortOrder": 2,
      "count": 3
    }
  ],
  "total": 10
}
```

### Response Schema (Zod)

```typescript
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

export const CategoriesResponseSchema = z.object({
  categories: z.array(AnalysisCategorySchema),
  total: z.number().int().nonnegative(),
});
```

### HTTP Error Responses

| Status | Meaning | Frontend Behavior |
|--------|---------|-------------------|
| `401 Unauthorized` | Invalid or missing auth token | Redirect to login page. |
| `403 Forbidden` | Authenticated user lacks access | Show error toast; do not retry automatically. |
| `404 Not Found` | Endpoint not found (server not deployed) | Show error state with "الخدمة غير متوفرة". |
| `429 Too Many Requests` | Rate limited | Display error toast; retry not automatic. |
| `500 Internal Server Error` | Server error | Show error state with retry button. |
| Network timeout | Client-side timeout | Show error state with retry button after timeout threshold (e.g., 10s). |

## Failure Handling

- **Retry policy**: No automatic retry. User must click a manual retry button.
- **Degraded UI**: If categories fail to load, the page still renders the "الكل" option and other page sections. The category filter section shows the `ErrorState` component.

## Notes

- The backend should sort categories by `sortOrder` before returning them, but the frontend must sort again defensively (to protect against drift).
- The frontend MUST NOT cache categories in localStorage or sessionStorage; categories should be fetched fresh on each mount.
