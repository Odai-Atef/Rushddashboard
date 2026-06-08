# Quick Start: Dynamic Analysis Cards Feature

**Feature**: Load modal analysis cards by category API instead of hardcoded boxes
**Date**: 2026-06-08

---

## Prerequisites

- Backend API running with endpoints:
  - `GET /api/v1/analysis/categories` (already existing)
  - `GET /api/v1/analysis/categories/:categoryId/library-items` (new, per spec)
  - Optional: `GET /api/v1/analysis/library-items` (for "All" filter aggregation)
- Frontend dependencies already installed (`lucide-react`, `tailwindcss`, etc.)

---

## Setup Steps

### 1. Add Library Item Types and Service Methods

Update `src/api/services/analysis-service.ts`:

- Add `AnalysisLibraryItem` interface.
- Add `getLibraryItems(categoryId)` method.
- Add optional `getAllLibraryItems()` method or implement fallback in hook.

### 2. Create Icon Map Utility

Create `src/app/utils/icon-map.ts`:

- Export a `Record<string, LucideIcon>` mapping API icon names to `lucide-react` imports.
- Export a `resolveIcon(name)` function with a default fallback.

### 3. Create Data Fetching Hook

Create `src/app/hooks/useAnalysisLibraryItems.ts`:

- Accept `categoryId` or `'all'` as parameter.
- Return `{ items, isLoading, error, retry }`.
- Filter out `!isActive`, sort by `sortOrder` ascending.
- Handle stale request cancellation via `AbortController`.

### 4. Extract Modal Component

Create `src/app/components/analysis/AnalysisLibraryModal.tsx`:

- Accept props: `open`, `onClose`, `onSelectAnalysis`, `categories`.
- Render category filter buttons, search bar, and card grid.
- Use `useAnalysisLibraryItems(selectedCategoryId)`.
- Preserve existing card layout, badge rendering, and click behavior.

### 5. Refactor AIAnalysisPage

Update `src/app/components/AIAnalysisPage.tsx`:

- Remove inline modal JSX (lines ~1019–1200).
- Render `AnalysisLibraryModal` instead.
- Pass `handleStartAnalysis` as `onSelectAnalysis` callback.
- Keep `recommendedAnalyses` (the permanent starter cards on the main page) as-is for now; they are out of modal scope.

---

## Verification

1. Open `/dashboard/ai-analysis`.
2. Click **"تحليل جديد"** (New Analytics).
3. Select a category filter.
4. Observe network request to `GET /api/v1/analysis/categories/:id/library-items`.
5. Verify cards render with:
   - Arabic title/description (`titleAr` / `descriptionAr`)
   - Correct icons from API `icon` field
   - Gradient backgrounds from API `iconBackground` field
   - Badges, complexity, impact, duration from API
   - Sorted by `sortOrder`
6. Select **"الكل"** (All) filter.
7. Verify no hardcoded cards are shown; all data is API-driven.
8. Click a card and verify the existing analysis workflow starts.

---

## Rollback

If issues arise, revert `AIAnalysisPage.tsx` to the previous commit and remove the newly created files. The inline modal and hardcoded cards are self-contained in the original file.
