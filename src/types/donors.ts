/**
 * Donor TypeScript Types
 *
 * Type definitions for the Donors List Table feature.
 * Matches the backend API contract for GET /api/v1/donors
 */

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

export const DONOR_TYPE_LABELS: Record<DonorType, string> = {
  FOUNDATION: 'جهه',
  GOVERNMENT: 'حكومية',
  PRIVATE: 'خاصة',
  INTERNATIONAL: 'دولية',
  LOCAL: 'محلية',
};

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
