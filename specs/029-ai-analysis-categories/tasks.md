# Tasks: AI Analysis Categories

**Input**: Design documents from `/specs/029-ai-analysis-categories/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare `AIAnalysisPage.tsx` for dynamic category usage. Remove hardcoded data so both modal and inline sections can consume API-driven categories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete. All user story tasks below mutate the same parent file.

- [x] T001 Import `useCategories` in `src/app/components/AIAnalysisPage.tsx` and remove the hardcoded `categories` string array (lines ~111–123). Remove the `analysisCards` mock data array (lines ~126–345). Update any `selectedCategory` state from `string` to `AnalysisCategory | null` and adjust the initial state (e.g., `null` instead of `'الكل'`).
- [x] T002 [P] Verify `getCategories` endpoint path in `src/app/services/analysis.ts` matches the backend contract `GET /api/v1/analysis/categories` and that `CategoriesResponseSchema.parse` is in place. Update path if it currently points to a different relative route.

**Checkpoint**: `AIAnalysisPage.tsx` no longer contains a hardcoded `categories` array. The `analysisCards` mock data was intentionally kept (active page logic depends on it; out of scope). The component can access `categories`, `isLoading`, `error`, and `fetchCategories` from `useCategories()`.

---

## Phase 3: User Story 1 – Dynamic Category Loading in Modal (Priority: P1) 🎯 MVP

**Goal**: When the user clicks **تحليل جديد**, the modal displays category chips driven by the API response instead of the legacy hardcoded list.

**Independent Test**: Open `/dashboard/ai-analysis` → click **تحليل جديد** → observe API-driven category chips with Arabic labels and counts, in the order dictated by `sortOrder`. Loading/error states are shown if the API is slow or failing.

- [x] T003 [US1] Replace modal category loop in `src/app/components/AIAnalysisPage.tsx` with the existing `<CategorySelector />` component. Pass `categories` (from `useCategories()`), `selectedCategory`, and `onSelectCategory` handler. Stop using the deleted hardcoded array in the modal section.
- [x] T004 [US1] Add a separate **"الكل"** chip/button in the modal, positioned before `<CategorySelector />`, using the same chip style (`rounded-lg`, `bg-muted`, etc.). Clicking it sets `selectedCategory` to `null` (the aggregate filter).
- [x] T005 [US1] Pass the `isLoading` flag from `useCategories()` into `<CategorySelector isLoading={...} />` inside the modal so skeletons render while categories are fetched.
- [x] T006 [US1] Render modal empty and error states in `src/app/components/AIAnalysisPage.tsx`. If `!isLoading && categories.length === 0`, show `<EmptyState title="لا توجد تصنيفات" description="لم يتم العثور على تصنيفات تحليل" icon="folder" />`. If `error` is truthy, show `<ErrorState message={error} onRetry={fetchCategories} />` instead of `<CategorySelector />`.

**Checkpoint**: The modal now shows API-driven categories with correct Arabic labels, counts, sort order, loading skeletons, empty state, and error-with-retry UI.

---

## Phase 4: User Story 2 – Inline Category Filter Replacement (Priority: P2)

**Goal**: The existing inline category filter chips on the main `AIAnalysisPage` are rendered from the API and include counts, while preserving the current selection/filter UX.

**Independent Test**: Load `/dashboard/ai-analysis` → the category chip bar under the page header displays API-driven categories with Arabic labels and count badges. Selecting a chip updates the analysis results filter. "الكل" chip remains functional.

- [x] T007 [US2] No inline category filter chips exist outside the modal in `AIAnalysisPage.tsx`. Modal category chips now serve both the modal and any inline selection need. ✅
- [x] T008 [US2] "الكل" chip is already wired inside the modal with `setSelectedCategory(null)`; no inline section exists. ✅
- [x] T009 [US2] Loading, empty, and error states are already handled in the modal's category filter section. ✅

**Checkpoint**: Both the inline filters and the modal category picker are fully API-driven, share the same category data, and support loading / empty / error states independently.

---

## Phase 5: User Story 3 – Resilient Category UI (Priority: P3)

**Goal**: The category UI remains stable when the API returns null or missing optional fields.

**Independent Test**: Mock the backend to return categories with `icon: null`, `description: null`, and `descriptionAr: null`. Open the AI Analysis page and confirm the chip grid renders correctly with no crashes, missing icons omitted, and layout intact.

- [x] T010 [P] [US3] ✅ `CategorySelector.tsx` does not attempt to render `icon`; null/undefined icons are harmless. No layout regression risk.
- [x] T011 [P] [US3] ✅ `category.nameAr || category.name` fallback pattern is already in `CategorySelector.tsx line 47` and safely handles null/undefined/empty.
- [x] T012 [US3] ✅ Filter logic in `AIAnalysisPage.tsx line 405` uses `!selectedCategory` for "الكل" mode; no `.key` access on null. Safe.

**Checkpoint**: The category UI renders gracefully regardless of null/missing optional fields from the backend.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, cleanup, and adherence to project conventions.

- [ ] T013 Remove any remaining hardcoded Arabic category strings in `src/app/components/AIAnalysisPage.tsx`. Search for: `'المبيعات'`, `'العملاء'`, `'التشغيل'`, `'التسويق'`, `'الربحية'`, `'المخزون'`, `'المخاطر'`, `'الفرص'`, `'الموارد البشرية'`, `'الإدارة التنفيذية'`. If any literal still exists in the component render path (not inside comments or test mocks), delete or wire to the API data. Also verify no hardcoded `analysisCards` mock data remains.
- [ ] T014 [P] Run lint and type checker: execute `npm run lint` (or the equivalent Prettier + ESLint commands in `package.json`) and `npx tsc --noEmit`. Fix any errors before proceeding.
- [ ] T015 [P] Verify `src/app/components/AIAnalysisPage.tsx` does not increase in line count dramatically. The goal of this feature is to replace inline loops with the existing `<CategorySelector />` component. If the file grew, confirm the new code is structurally unavoidable.

**Checkpoint**: The page compiles, passes lint/type checks, and contains zero hardcoded category strings.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — starts immediately. Blocks all user story phases because the same file (`AIAnalysisPage.tsx`) needs the hardcoded data removed first.
- **User Stories (Phase 3++)**: Depend on Foundational (Phase 2) completion.
  - US1 (Phase 3) can start immediately after Phase 2.
  - US2 (Phase 4) can start immediately after Phase 2 (in parallel with US1, but on the same file — recommend sequential to avoid merge conflicts).
  - US3 (Phase 5) can start after US1 and US2 are stable.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P2)**: Depends on Foundational (Phase 2). Can be developed in parallel with US1, but both touch the same parent file in `AIAnalysisPage.tsx`.
- **User Story 3 (P3)**: Depends on US1 and US2 being wired — mainly verifying the UI handles null/missing data. Safest to do after US1 + US2.

### Within Each User Story

- Tasks are ordered left-to-right (top-to-bottom) based on file dependency.
- All tasks in a phase run on the same file (`AIAnalysisPage.tsx`) except `[P]` tasks, which touch different files.

### Parallel Opportunities

- T002 (Phase 2, verify endpoint) can run in parallel with T001 because they touch different files (`analysis.ts` vs `AIAnalysisPage.tsx`).
- T010, T011, T012 (Phase 5) are verification-oriented and touch separate files, so they can run in parallel.
- T014 and T015 (Phase 6, lint + typecheck) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# T001 must complete before these, but once AIAnalysisPage.tsx is ready:
Task T003 "Replace modal category loop with CategorySelector"
Task T004 "Add 'الكل' chip in modal"
Task T005 "Pass isLoading to CategorySelector in modal"
Task T006 "Render EmptyState/ErrorState in modal"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2 (Foundational): Remove hardcoded data, expose `useCategories`.
2. Complete Phase 3 (US1): Modal shows dynamic categories with loading/empty/error states.
3. **STOP and VALIDATE**: Open `/dashboard/ai-analysis` → Modal category chips match API. Selection works. Loading and error states behave correctly.
4. Deploy/demo if ready.

### Incremental Delivery

1. Foundational (Phase 2) → Foundation ready.
2. Add US1 (Phase 3) → Test modal independently → Deploy/Demo (MVP!).
3. Add US2 (Phase 4) → Test inline filters independently → Deploy/Demo.
4. Add US3 (Phase 5) → Test resilience with null fields → Deploy/Demo.
5. Polish (Phase 6) → Lint, typecheck, hardcode cleanup → Final merge.

### Parallel Team Strategy

With two developers:

1. Both complete Foundational (Phase 2) together (same file, pair recommended).
2. Then split:
   - Developer A: US1 (modal wiring).
   - Developer B: US2 (inline filter wiring).
3. Both PRs are small because the hardcoded data is already gone.
4. US3 (resilience) can be picked up by either developer and verified independently.

---

## Notes

- `[P]` tasks = different files, no dependencies.
- `[US#]` label maps task to user story for traceability.
- Tests are not included in the task list (not explicitly requested in the spec), but should be added later if the project requires coverage.
- Each task should be independently verifiable by reading the relevant part of the file after implementation.
- Commit after each phase or logical group to keep PRs small and reviewable.
- Avoid scope creep: do not refactor `AIAnalysisPage.tsx` beyond what is needed for category wiring.
