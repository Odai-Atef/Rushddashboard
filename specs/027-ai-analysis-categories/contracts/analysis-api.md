# Analysis API Contract

## Endpoint

GET /api/v1/analysis/categories

## Request

No request body. Supports optional query parameters for pagination:

| Parameter | Type    | Default | Description           |
|-----------|---------|---------|-----------------------|
| limit     | integer | 20      | Maximum items to return |
| offset    | integer | 0       | Number of items to skip |

## Headers

| Header          | Required | Value              |
|-----------------|----------|--------------------|
| Authorization   | Yes      | Bearer <access_token> |
| Accept          | No       | application/json   |

## Response

### Success (200)

```json
{
  "categories": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "nameAr": "string",
      "description": "string",
      "descriptionAr": "string",
      "icon": "string",
      "sortOrder": 0,
      "count": 0
    }
  ],
  "total": 0
}
```

### Client Error (400)

```json
{
  "error": "INVALID_PARAMETERS",
  "message": "Limit must be between 1 and 100"
}
```

### Authentication (401)

```json
{
  "error": "UNAUTHORIZED",
  "message": "Missing or invalid token"
}
```

### Server Error (500)

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Failed to fetch categories"
}
```

## Notes

- The `"الكل"` aggregate option is NOT returned by this endpoint. It is a UI-level construct maintained by the frontend.
- `description`, `descriptionAr`, `icon`, and `count` may be null or omitted when not applicable.
