# API Contract: Library Items Endpoint

**Feature**: Dynamic Analysis Cards in Modal
**Date**: 2026-06-08

---

## 1. GET `/api/v1/analysis/categories/:categoryId/library-items`

Fetch active library items for a specific category.

### Request

```
GET /api/v1/analysis/categories/{categoryId}/library-items
Authorization: Bearer <token>
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | UUID string | Yes | The backend category identifier |

### Response — 200 OK

```json
{
  "data": [
    {
      "id": "7dd7b32c-6268-41b9-8e5e-468ef633cb67",
      "categoryId": "61294550-ca0b-4e49-84af-3715d0fa8874",
      "key": "customer-churn",
      "title": "Customer Churn Analysis",
      "titleAr": "تحليل تسرب العملاء",
      "description": null,
      "descriptionAr": "فهم أسباب فقدان العملاء وتقديم استراتيجيات الاحتفاظ",
      "complexity": "متقدم",
      "impact": "حرج",
      "duration": "3 دقائق",
      "badges": ["موصى به"],
      "sortOrder": 6,
      "isActive": true,
      "icon": "Users",
      "iconBackground": "from-red-500 to-pink-600"
    }
  ]
}
```

### Response — 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Response — 404 Not Found

Returned if the category does not exist.

```json
{
  "success": false,
  "message": "Category not found"
}
```

### Frontend Processing Rules
1. Extract `response.data` (array).
2. Filter out items where `isActive === false`.
3. Sort remaining items by `sortOrder` ascending.
4. Map each item to the card view model (Arabic fields preferred).

---

## 2. GET `/api/v1/analysis/library-items` (Optional / Backend-Supported)

Fetch all active library items across all categories (for the "All" filter).

### Request

```
GET /api/v1/analysis/library-items
Authorization: Bearer <token>
```

### Response — 200 OK

Same shape as the per-category endpoint; `data` may include items from multiple categories.

### Fallback Strategy

If this endpoint returns 404, the frontend MUST fall back to:
1. Fetch categories via existing `analysisService.getCategories()`.
2. Issue parallel `GET /api/v1/analysis/categories/{cat.id}/library-items` for each category.
3. Merge and deduplicate results by `id`.
4. Apply the same filtering (`isActive`) and sorting (`sortOrder`) rules.

---

## Error Handling Contract

- **Network failure** → `error` state in hook; UI shows retry button.
- **Timeout** → `ApiClient` throws `ApiError` with `code: 'TIMEOUT'`.
- **4xx/5xx** → `ApiClient` throws typed `ApiError`; hook surfaces `message` to UI.
