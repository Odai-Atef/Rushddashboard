# Data Model: Donors List Table

**Feature**: Donors List Table  
**Date**: 2026-06-08  
**Source**: Feature specification + API contract analysis

## Entities

### Donor

Represents a funding organization displayed in the donors table.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID string | Yes | Unique identifier (e.g., `8de74a21-f169-4dc7-a8b7-58680d6ffe79`) |
| name | string | Yes | Organization name (Arabic or English) |
| type | DonorType enum | Yes | Type of organization (e.g., FOUNDATION) |
| description | string \| null | No | Description of the organization |
| website | string \| null | No | Organization website URL |
| email | string \| null | No | Contact email |
| phone | string \| null | No | Contact phone number |
| fundingMinAmount | number \| null | No | Minimum funding amount (nullable) |
| fundingMaxAmount | number \| null | No | Maximum funding amount (nullable) |
| currencyCode | string \| null | No | Currency code (nullable) |
| geographicScope | string \| null | No | Geographic coverage area (e.g., "الرياض") |
| applicationUrl | string \| null | No | URL for funding applications |
| sourceUrl | string \| null | No | Source reference URL (e.g., dalel-manhin link) |
| source | string \| null | No | Source system name (e.g., "dalel-manhin") |
| lastUpdatedAt | ISO datetime string | Yes | Last data update timestamp |
| deletedAt | ISO datetime string \| null | No | Soft deletion timestamp |
| createdAt | ISO datetime string | Yes | Record creation timestamp |
| updatedAt | ISO datetime string | Yes | Record last modification timestamp |
| fundingAreas | FundingAreaRelation[] | Yes | Associated funding areas (always array, may be empty) |

### FundingAreaRelation

Join table representation between Donor and FundingArea.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| donorId | UUID string | Yes | Reference to donor |
| fundingAreaId | UUID string | Yes | Reference to funding area |
| createdAt | ISO datetime string | Yes | Relation creation timestamp |
| fundingArea | FundingArea | Yes | Nested funding area object |

### FundingArea

Represents a domain/category of funding.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID string | Yes | Unique identifier |
| name | string | Yes | Area name (e.g., "برامج خيرية") |
| description | string \| null | No | Area description |
| createdAt | ISO datetime string | Yes | Creation timestamp |
| updatedAt | ISO datetime string | Yes | Last update timestamp |

### PaginatedDonorList

API response wrapper for paginated donor queries.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| data | Donor[] | Yes | Array of donor records for the current page |
| total | number | Yes | Total count of all donor records |
| page | number | Yes | Current page number (1-indexed) |
| limit | number | Yes | Items per page for this request |
| totalPages | number | Yes | Total number of pages available |

## Enumerations

### DonorType

Values from the API contract. The frontend should handle additional values gracefully.

- `FOUNDATION` — مؤسسة خيرية
- `GOVERNMENT` — جهة حكومية
- `PRIVATE` — شركة/جهة خاصة
- `INTERNATIONAL` — منظمة دولية
- `LOCAL` — جهة محلية

## TypeScript Interfaces

```typescript
// src/types/donors.ts

export interface FundingArea {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FundingAreaRelation {
  donorId: string;
  fundingAreaId: string;
  createdAt: string;
  fundingArea: FundingArea;
}

export type DonorType = 'FOUNDATION' | 'GOVERNMENT' | 'PRIVATE' | 'INTERNATIONAL' | 'LOCAL';

export interface Donor {
  id: string;
  name: string;
  type: DonorType;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  fundingMinAmount: number | null;
  fundingMaxAmount: number | null;
  currencyCode: string | null;
  geographicScope: string | null;
  applicationUrl: string | null;
  sourceUrl: string | null;
  source: string | null;
  lastUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  fundingAreas: FundingAreaRelation[];
}

export interface PaginatedDonorList {
  data: Donor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DonorFilters {
  searchQuery?: string;
  type?: DonorType | null;
  fundingArea?: string | null;
}

export interface DonorListState {
  page: number;
  limit: number;
  filters: DonorFilters;
}
```

## Validation Rules

1. **id**: Must be a valid UUID v4 format string
2. **name**: Non-empty string; max length 255 characters (assumed from database constraints)
3. **type**: Must be one of the defined `DonorType` enum values
4. **fundingAreas**: Always an array; may be empty; each relation must have a valid `fundingArea` object
5. **sourceUrl**: If present, must be a valid HTTP/HTTPS URL
6. **lastUpdatedAt**: Valid ISO 8601 datetime string

## Relationships

```
Donor 1--* FundingAreaRelation *--1 FundingArea

- One Donor can have multiple FundingAreaRelations
- Each FundingAreaRelation links to exactly one FundingArea
- A FundingArea can be associated with multiple Donors (many-to-many via relation table)
```

## State Transitions

No state transitions for this read-only feature. The data model is static from the API perspective.

## Data Flow

1. **API Request**: `GET /api/v1/donors?page=1&limit=10`
2. **API Response**: `PaginatedDonorList` JSON
3. **Service Layer**: `DonorService.getDonors(page, limit)` returns typed `ApiResponse<PaginatedDonorList>`
4. **React Query Hook**: `useDonors(page, limit)` manages caching, refetching, and loading states
5. **Component State**: `DonorsPage` manages `page`, `limit`, `filters` (search, type, funding area)
6. **Client-side Filtering**: Applied to the current page of data only (as per FR-016)
7. **Render**: `DonorsTable` receives filtered data and renders rows

## Notes

- All monetary fields (`fundingMinAmount`, `fundingMaxAmount`) are nullable and currency is not always provided. Display logic must handle missing values gracefully.
- `deletedAt` is always null in active queries (soft-deleted donors are filtered server-side).
- Arabic names require bidirectional text support (RTL) in the UI.
