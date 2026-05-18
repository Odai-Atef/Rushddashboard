# Research: Executive Analysis Backend Integration

**Feature**: Executive Analysis Backend Integration  
**Date**: 2026-05-18  
**Branch**: `005-rushd-frontend-executive`

## Decision: API Endpoint Structure

**Decision**: Use separate REST endpoints fetched in parallel

**Rationale**:
- Aligns with existing chat service pattern (`/chat/sessions`, `/chat/sessions/:id/messages`)
- Allows independent caching and error boundaries per data type
- Matches the entity model (categories, KPIs, analytics, insights)
- Parallel fetching via `Promise.all` keeps load times within success criteria (3s)
- Consistent with constitution principle III (centralized service layer)

**Endpoints**:
- `GET /analysis/categories` - List all analysis categories
- `GET /analysis/categories/:id/summary` - Analytics summary + KPIs for category
- `GET /analysis/categories/:id/insights` - AI-generated insights for category

**Alternatives considered**:
- Single consolidated endpoint: Rejected because it couples unrelated data, prevents partial error handling, and violates modularity (FR-008)
- GraphQL: Rejected because backend uses REST, and introducing GraphQL adds complexity beyond scope

## Decision: State Management Approach

**Decision**: Extend existing React Context + hooks pattern (do not introduce new state library)

**Rationale**:
- Already established in codebase (useChatContext, useAuth)
- Sufficient for this feature's state needs (categories, selected category, filters, loading states)
- Avoids adding Zustand/Redux complexity when Context is adequate
- Keeps bundle size down (constitution IV: bundle monitoring)

**Structure**:
- `AnalysisContext` - holds categories, selectedCategory, filters, loading states
- `useAnalysis()` - hook to access context
- `useCategories()` - hook for category fetching/mutations
- `useAnalytics(categoryId)` - hook for analytics + KPIs fetching
- `useInsights(categoryId)` - hook for insights fetching

## Decision: Filter Parameter Strategy

**Decision**: Query string parameters for all filters

**Rationale**:
- RESTful and cache-friendly
- Easy to bookmark/share URLs
- Matches existing pagination pattern (`?limit=X&offset=Y`)
- Supports future URL-based filter persistence for analysis history

**Filter mapping**:
- `?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD`
- `?company_id=uuid`
- `?domain_id=uuid`
- `?department_id=uuid`

## Decision: Reusable Architecture Pattern

**Decision**: Generic analysis service layer + typed hooks

**Rationale**:
- All dashboard pages (Sales, Operations, Marketing, etc.) follow identical data patterns
- Extract common hooks/services to `src/app/hooks/useAnalysis.ts` and `src/app/services/analysis.ts`
- Each specific dashboard uses the same hooks with different category IDs
- Supports FR-008 (reusability) and FR-009 (future extensibility)

## Decision: Error Handling Strategy

**Decision**: Per-section error boundaries with retry capability

**Rationale**:
- Edge case "Partial API failure" requires categories to display even if analytics fail
- Toast notifications for transient errors (existing pattern: sonner toast)
- Inline error states with retry buttons for each data section
- Consistent with constitution III (resilient API integration)

## Decision: Loading State Pattern

**Decision**: Skeleton loaders for cards + spinners for charts

**Rationale**:
- Skeletons reduce perceived load time and prevent layout shift
- shadcn/ui `<Skeleton />` component already available
- Different loading indicators for different content types (text vs charts)
- Consistent with modern UX best practices

## Decision: Chart Data Format

**Decision**: Backend returns chart configuration + data arrays

**Rationale**:
- Charts need both data AND metadata (axis labels, formatters, colors)
- Recharts expects specific data shapes; backend should provide ready-to-use arrays
- Frontend transforms minimal data (e.g., locale formatting) rather than restructuring
- Keeps chart logic decoupled from backend schema changes

**Example response shape**:
```json
{
  "charts": [
    {
      "id": "revenue-trend",
      "type": "line",
      "title": "اتجاه الإيرادات",
      "data": [{"month": "محرم", "value": 2100000}]
    }
  ]
}
```

## Decision: Data Fetching Timing

**Decision**: Categories fetch on mount; analytics/insights fetch on category selection

**Rationale**:
- Categories are small (likely < 10 items), fast to load
- Analytics/KPIs/insights are category-specific and may be large
- Prevents unnecessary data transfer when user hasn't selected a category
- Supports default category selection (first category or user preference)

## Open Questions (Deferred to Planning/Implementation)

1. **Backend API spec availability**: Assumed available per spec assumption; if not, will need to coordinate with backend team
2. **Default category**: Will default to first category; can be enhanced with user preference later
3. **Real-time updates**: Out of scope; polling vs WebSocket decision deferred to future iteration
