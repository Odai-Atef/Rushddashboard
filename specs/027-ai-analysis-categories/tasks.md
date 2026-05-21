# Tasks: AI Analysis Dynamic Categories

**Input**: Design documents from `/specs/027-ai-analysis-categories/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/analysis-api.md

**Tests**: Not explicitly requested; test tasks omitted.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps to user story (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm project readiness — no new initialization required.

- [ ] T001 [P] Confirm existing Vite + React + TypeScript environment has all required dependencies for this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type schema updates, hook creation, and utility setup. **ALL user stories depend on this phase.**

- [X] T002 [P] Update `AnalysisCategory` Zod schema in `src/app/types/analysis.ts` to add `key`, `count`, and `descriptionAr` fields.
- [X] T003 [P] Update `getCategories` service in `src/app/services/analysis.ts` to ensure endpoint path, query params, and response parsing align with the updated schema and API contract.
- [X] T004 Create `useCategories` hook in `src/app/hooks/useCategories.ts` with fetch, `sortOrder` ascending sort, loading flag, error handling, and retry function.
- [X] T005 [P] Create `getSafeIcon` utility in `src/app/utils/iconMap.ts` for dynamic Lucide icon lookup with a fallback when the icon name is null or unrecognized. (Decided not needed; icon rendering handled in separate components)

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — View Dynamic AI Analysis Categories (Priority: P1) 🎯 MVP

**Goal**: The AI Analysis page fetches categories from `GET /api/v1/analysis/categories`, sorts them by `sortOrder`, and renders them as chips with localized Arabic labels (`nameAr`) and `count` badges. The `"الكل"` aggregate remains as a UI-level option.

**Independent Test**: Load `/dashboard/ai-analysis`, verify chips render from the API (not hardcoded), are ordered by `sortOrder`, show `nameAr`, display `count`, and include `"الكل"`.

### Implementation for User Story 1

- [X] T006 [US1] Integrate `useCategories` hook into `src/app/components/AIAnalysisPage.tsx`, remove the hardcoded string `categories` array, and derive the chip list from the API response.
- [X] T007 [P] [US1] Update `CategorySelector` in `src/app/components/analysis/CategorySelector.tsx` to render a `count` badge per chip and prioritize the `nameAr` label over `name`.
- [X] T008 [US1] Render the `"الكل"` aggregate chip as a synthetic category object with `key='all'` inside `AIAnalysisPage.tsx` so it appears alongside API categories.

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 — Select and Filter by Category (Priority: P1)

**Goal**: Category selection uses the backend `key` as the internal filter identifier, and the analysis card grid filters correctly by that key. `"الكل"` resets the filter.

**Independent Test**: Click a category chip and confirm the analysis card grid updates to show only cards for that category. Click `"الكل"` to reset.

### Implementation for User Story 2

- [X] T009 [US2] Add `categoryKey` field to `AnalysisCard` interface in `src/app/components/AIAnalysisPage.tsx` and map each hardcoded card to its corresponding backend category key.
- [X] T010 [US2] Update selection and card-filtering logic in `src/app/components/AIAnalysisPage.tsx` to use `categoryKey` (instead of Arabic category name) for the active filter.

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 — Handle Loading, Empty, and Error States (Priority: P2)

**Goal**: The category section provides clear feedback during loading, when no categories exist, or if the request fails.

**Independent Test**: Throttle network to slow 3G, block the endpoint, or simulate an empty response and verify each respective UI state without breaking the rest of the page.

### Implementation for User Story 3

- [X] T011 [US3] Add loading state UI for the category section in `src/app/components/AIAnalysisPage.tsx` while `useCategories` is fetching.
- [X] T012 [US3] Add empty state UI when the API returns zero categories in `src/app/components/AIAnalysisPage.tsx`.
- [X] T013 [US3] Add error state with a user-friendly message and a retry button in `src/app/components/AIAnalysisPage.tsx` using the `useCategories` error state.

**Checkpoint**: US3 independently testable alongside US1 and US2.

---

## Phase 6: User Story 4 — Resilient Rendering of Optional Fields (Priority: P3)

**Goal**: Chips render correctly even when `icon`, `description`, `descriptionAr`, or `count` are missing.

**Independent Test**: Manually override the API response (via MSW or temporary mock) to omit optional fields and confirm no layout breakage.

### Implementation for User Story 4

- [X] T014 [US4] Ensure `CategorySelector` in `src/app/components/analysis/CategorySelector.tsx` omits the icon entirely when `icon` is null or empty, without breaking layout.
- [X] T015 [US4] Ensure `CategorySelector` in `src/app/components/analysis/CategorySelector.tsx` hides the count badge when `count` is missing or null.
- [X] T016 [US4] Ensure `CategorySelector` in `src/app/components/analysis/CategorySelector.tsx` does not render tooltips or detail sections when `description`/`descriptionAr` are absent.

**Checkpoint**: All user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, refactoring, and quality verification across all stories.

- [ ] T017 [P] Remove all remaining hardcoded category arrays and unused mock data from `src/app/components/AIAnalysisPage.tsx`.
- [ ] T018 [P] Verify no single file exceeds 300 lines and naming conventions follow the constitution (PascalCase components, camelCase functions, etc.).
- [ ] T019 [P] Run lint checks (`pnpm lint`) and type checks (`pnpm typecheck`) across modified files, fixing warnings before marking complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — confirms readiness.
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories.
  - T002 and T003 can run in parallel.
  - T004 and T005 can run in parallel.
- **User Stories (Phases 3–6)**: All depend on Foundational completion.
  - US1 (Phase 3) must complete before US2 (Phase 4) if `categoryKey` mapping relies on stable API-driven categories.
  - US3 (Phase 5) and US4 (Phase 6) can proceed in parallel with US2 once Foundational is done.
- **Polish (Phase 7)**: Depends on all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No story dependencies.
- **User Story 2 (P1)**: Starts after US1 (shares `AIAnalysisPage.tsx` state).
- **User Story 3 (P2)**: Starts after Foundational. Can proceed in parallel with US2/US4.
- **User Story 4 (P3)**: Starts after Foundational. Can proceed in parallel with US2/US3.

### Within Each User Story

- US1: T006 (page integration) and T007 (component update) can run in parallel; T008 (aggregate chip) depends on T006.
- US2: T009 (interface/key mapping) → T010 (filter logic). Sequential.
- US3: T011 (loading) → T012 (empty) → T013 (error). Sequential.
- US4: T014 (icon) → T015 (count) → T016 (description). Sequential.

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel.
- T006 and T007 can run in parallel (different files).
- US3 tasks can run in parallel with US2 and US4 tasks once Foundational is complete.
- All Polish tasks can run in parallel after code freeze.

---

## Parallel Example: User Story 1

```bash
# Launch page integration and component update together:
Task: "Integrate useCategories hook into AIAnalysisPage.tsx"
Task: "Update CategorySelector to render count badge and nameAr label"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (type updates, hook, icon utility).
3. Complete Phase 3: US1 — render API-driven categories.
4. Complete Phase 4: US2 — selection and filtering by `key`.
5. **STOP and VALIDATE**: Verify MVP independently.

### Incremental Delivery

1. Setup + Foundational → Foundation ready.
2. Add US1 → Test category rendering → Demo.
3. Add US2 → Test filtering → Demo.
4. Add US3 → Test loading/empty/error states → Demo.
5. Add US4 → Test resilience to missing fields → Demo.
6. Polish → Lint/type check → Final validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: US1 + US2 (page + filter logic).
   - Developer B: US3 (loading/empty/error UI).
   - Developer C: US4 (resilience in `CategorySelector`).
3. Merge and run Polish phase together.

---

## Notes

- `[P]` tasks = different files, no dependencies.
- `[Story]` label maps the task to a specific user story for traceability.
- Each user story should be independently completable and verifiable.
- Avoid vague tasks; include exact file paths and concrete actions.
- Commit after each phase checkpoint.
