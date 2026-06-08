# Tasks: Dynamic Analysis Cards in Modal

**Input**: Design documents from `/specs/036-dynamic-analysis-cards/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this feature — not explicitly requested in the spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory scaffolding for new components and utilities.

- [x] T001 [P] Create directory `src/app/components/analysis/` for reusable modal component

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data types, service methods, and icon mapping that MUST exist before any user story work begins.

**⚠️ CRITICAL**: No user story code can compile until this phase is complete.

- [x] T002 [P] Add `AnalysisLibraryItem` interface and `getLibraryItems(categoryId: string)` method to `src/api/services/analysis-service.ts` following existing `AnalysisService` pattern
- [x] T003 [P] Create `src/app/utils/icon-map.ts` exporting a `Record<string, LucideIcon>` that maps API icon names (`Users`, `DollarSign`, etc.) to `lucide-react` imports with a sensible fallback icon for unknown names

**Checkpoint**: `AnalysisLibraryItem` type, `getLibraryItems` endpoint, and icon resolution utility are available for import.

---

## Phase 3: User Story 1 - Browse Analysis Cards by Category (Priority: P1) 🎯 MVP

**Goal**: When a category filter is selected in the modal, fetch and render API-driven analysis cards for that category instead of hardcoded boxes.

**Independent Test**: Open the modal, select a category, verify the network call to `GET /api/v1/analysis/categories/:categoryId/library-items` fires, and cards render with Arabic title/description, resolved icon, API-provided gradient, badges, complexity, impact, and duration, sorted by `sortOrder` ascending, with inactive items excluded.

### Implementation for User Story 1

- [x] T004 [US1] Create `src/app/hooks/useAnalysisLibraryItems.ts` hook accepting `categoryId: string`, returning `{ items, isLoading, error, retry }` where `items` are filtered active-only and sorted ascending by `sortOrder`; hook must cancel stale in-flight requests via `AbortController`
- [x] T005 [US1] Create `src/app/components/analysis/AnalysisLibraryModal.tsx` component accepting props `{ open, onClose, categories, onSelectAnalysis }`; render category filter buttons, search bar, and a grid of cards populated from `useAnalysisLibraryItems`; each card must display `titleAr || title`, `descriptionAr || description`, resolved icon, `iconBackground`, `badges`, `complexity`, `impact`, and `duration`
- [x] T006 [US1] Refactor `src/app/components/AIAnalysisPage.tsx` to replace the inline modal JSX (~lines 1019–1200) with `<AnalysisLibraryModal open={showAnalysisLibrary} ... />`; pass `apiCategories` and `handleStartAnalysis` callback; keep `showAnalysisLibrary` state in the page component

**Checkpoint**: At this point, User Story 1 should be fully functional: category-filtered modal cards are API-driven, Arabic fields render, and the modal opens/closes correctly.

---

## Phase 4: User Story 2 - Browse All Analysis Cards (Priority: P2)

**Goal**: When the "All" filter is selected, show all active library items across all categories using a backend-supported dynamic strategy instead of hardcoded cards.

**Independent Test**: Open the modal with the "All" filter selected and confirm no hardcoded cards are rendered; all visible cards come from API data, are sorted by `sortOrder`, and inactive items are excluded.

### Implementation for User Story 2

- [x] T007 [US2] Update `src/app/hooks/useAnalysisLibraryItems.ts` to support `categoryId: 'all'` by calling `GET /api/v1/analysis/library-items` if available; on 404, fall back to fetching categories and issuing parallel `getLibraryItems(cat.id)` calls, then merging and deduplicating results by `id` and applying active-only + sort-by-`sortOrder` rules
- [x] T008 [US2] Update `src/app/components/analysis/AnalysisLibraryModal.tsx` so the "الكل" (All) filter button triggers the all-items strategy from `useAnalysisLibraryItems('all')` instead of using a hardcoded list

**Checkpoint**: User Stories 1 and 2 are both independently functional.

---

## Phase 5: User Story 3 - Interact with a Dynamic Analysis Card (Priority: P3)

**Goal**: Preserve the existing click flow and modal interaction after switching to API-driven cards.

**Independent Test**: Click any dynamically rendered card in the modal and verify that `handleStartAnalysis` runs without error, the modal closes, and the downstream analysis workflow starts exactly as it did with hardcoded cards.

### Implementation for User Story 3

- [x] T009 [US3] In `src/app/components/AIAnalysisPage.tsx`, ensure `handleStartAnalysis` receives data in the expected shape from the modal; map the selected `AnalysisLibraryItem` (passed via `onSelectAnalysis`) to the fields required by the existing analysis workflow so that `activeAnalysis` and progress steps work seamlessly

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Clean up modal-specific hardcoded code and ensure no dead imports remain in the refactored page component.

- [x] T010 [P] Remove inline modal-specific hardcoded filtering logic (`filteredCards` using hardcoded `analysisCards`, modal header count using `analysisCards.length`) from `src/app/components/AIAnalysisPage.tsx`; the `analysisCards` array may remain for main-page starter cards if out of scope, but no modal JSX or modal-only filtering may reference it
- [x] T011 [P] Scan `src/app/components/AIAnalysisPage.tsx` for unused imports and dead code after modal extraction; remove any imports only used by the removed inline modal

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories should be implemented sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P2)**: Can start after US1 is complete. Extends the same hook and modal.
- **User Story 3 (P3)**: Can start after US1 is complete. Depends on the modal being integrated in the page.

### Within Each User Story

- Models/types are created in Phase 2 (Foundational).
- Hooks are created before components that consume them.
- Components are created before page-level integration.
- Each story is complete when its acceptance criteria are met.

### Parallel Opportunities

- **Phase 2**: T002 (service methods) and T003 (icon map) are independent and can run in parallel.
- **Phase 6**: T010 (remove modal hardcoded logic) and T011 (clean up imports) are independent and can run in parallel.
- **Cross-phase**: T003 (icon map) can be developed in parallel with T002 (service) because they touch different files.

---

## Parallel Example: Foundational Phase

```bash
# Run in parallel once Setup directory exists:
Task: "Add AnalysisLibraryItem and getLibraryItems to src/api/services/analysis-service.ts"
Task: "Create src/app/utils/icon-map.ts with icon string-to-component mapping"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup directory
2. Complete Phase 2: Foundational (service method, type, icon map)
3. Complete Phase 3: User Story 1 (hook + modal + page refactor for category-filtered dynamic cards)
4. **STOP and VALIDATE**: Test User Story 1 independently — verify category-filtered modal renders API-driven cards correctly
5. Demo if ready; proceed to US2/US3 only after MVP is stable

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test "All" filter independently → Deploy/Demo
4. Add User Story 3 → Test card click flow independently → Deploy/Demo
5. Polish → Remove dead code, clean imports

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001–T003 in parallel where possible).
2. Once Foundational is done:
   - Developer A: T004 + T005 (hook + modal component)
   - Developer B: T002 + T003 (service + icon map)
3. Integrate at T006 (page refactor).
4. Then sequential P2 → P3 → Polish.

---

## Notes

- Each user story is independently completable and testable.
- The modal component (`AnalysisLibraryModal`) is the core deliverable for US1 and US2.
- `AnalysisLibraryItem` fields should be rendered directly in the modal (Arabic fields preferred); mapping back to old `AnalysisCard` shapes should only happen at click time for backward compatibility with `handleStartAnalysis`.
- Commit after each task or logical group.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
