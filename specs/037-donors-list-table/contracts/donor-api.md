# API Contract: Donors

**Endpoint**: `GET /api/v1/api/v1/donors`  
**Feature**: Donors List Table  
**Date**: 2026-06-08

## Request

### HTTP Method
GET

### URL
`/api/v1/api/v1/donors`

### Query Parameters

| Parameter | Type | Required | Default | Constraints | Description |
|-----------|------|----------|---------|-------------|-------------|
| page | number | No | 1 | Must be ≥ 1 | Page number (1-indexed) |
| limit | number | No | 10 | Must be between 1 and 100 | Items per page |

### Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | `Bearer {token}` | Yes |
| Accept | `application/json` | Yes |
| Content-Type | `application/json` | No (GET request) |

## Response

### Success (200 OK)

```json
{
  "data": [
    {
      "id": "8de74a21-f169-4dc7-a8b7-58680d6ffe79",
      "name": "أوقاف محمد بن عبد العزيز الراجحي الخيرية",
      "type": "FOUNDATION",
      "description": "...",
      "website": "https://www.alrajhiawqaf.sa/",
      "email": "rc@rajhi.org",
      "phone": "114458484",
      "fundingMinAmount": null,
      "fundingMaxAmount": null,
      "currencyCode": null,
      "geographicScope": "الرياض",
      "applicationUrl": null,
      "sourceUrl": "https://dalel-manhin.com/organisations/bN6O2M/details",
      "source": "dalel-manhin",
      "lastUpdatedAt": "2026-06-08T20:01:05.987Z",
      "deletedAt": null,
      "createdAt": "2026-06-08T20:01:05.988Z",
      "updatedAt": "2026-06-08T20:01:05.988Z",
      "fundingAreas": [
        {
          "donorId": "8de74a21-f169-4dc7-a8b7-58680d6ffe79",
          "fundingAreaId": "f2a1b3c4-d5e6-7890-abcd-ef1234567890",
          "createdAt": "2026-06-08T20:01:05.988Z",
          "fundingArea": {
            "id": "f2a1b3c4-d5e6-7890-abcd-ef1234567890",
            "name": "برامج خيرية",
            "description": null,
            "createdAt": "2026-06-08T20:01:05.988Z",
            "updatedAt": "2026-06-08T20:01:05.988Z"
          }
        }
      ]
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}

```

### Error Responses

#### 401 Unauthorized
```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication required. Please log in.",
  "statusCode": 401
}
```

#### 403 Forbidden
```json
{
  "code": "FORBIDDEN",
  "message": "You do not have permission to view donors.",
  "statusCode": 403
}
```

#### 500 Internal Server Error
```json
{
  "code": "INTERNAL_ERROR",
  "message": "An unexpected error occurred. Please try again later.",
  "statusCode": 500
}
```

## TypeScript Interface

```typescript
interface GetDonorsRequest {
  page?: number;
  limit?: number;
}

interface GetDonorsResponse {
  data: Donor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Validation Rules

1. `page` must be an integer ≥ 1
2. `limit` must be an integer between 1 and 100
3. Invalid parameters return `400 Bad Request` with field-level error details

## Rate Limiting

No explicit rate limiting documented. Assume standard API rate limits apply.

## Frontend Usage

```typescript
// src/api/services/donor-service.ts
import apiClient from '../client';
import { ApiResponse } from '../types';
import { Donor, PaginatedDonorList } from '../../types/donors';

export class DonorService {
  private baseEndpoint = '/api/v1/api/v1/donors';

  async getDonors(
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<PaginatedDonorList>> {
    return apiClient.get<PaginatedDonorList>(this.baseEndpoint, {
      params: { page, limit }
    });
  }
}

export const donorService = new DonorService();
```

## Notes

- The API supports pagination only (page + limit). No server-side filtering or sorting parameters are currently available.
- Client-side filtering (search by name, filter by type, filter by funding area) must be applied to the current page of data.
- The `data` array may be empty if no donors exist or if the requested page exceeds `totalPages`.
