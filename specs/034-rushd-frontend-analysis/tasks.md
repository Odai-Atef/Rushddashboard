# Tasks: AI Analysis API-Driven Category Filters

**Input**: Design documents from `/specs/034-rushd-frontend-analysis/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure and minimal environment preparation

- [ ] T001 Verify Node.js dependencies installed (`npm install` or `pnpm install`) and dev server starts (`npm run dev` / `pnpm dev`)

**Checkpoint**: Development server runs without issues

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and service layer needed before any user story can be implemented

- [x] T002 [P] Define `Category` TypeScript interface in `src/api/services/analysis-service.ts` (or `src/api/types.ts` if preferred by project conventions)
- [x] T003 Implement `AnalysisService` class with `getCategories()` method in `src/api/services/analysis-service.ts`
- [x] T004 Export `analysisService` singleton from `src/api/services/index.ts`

**Checkpoint**: Service compiles and can be imported; foundation ready for user story work

---

## Phase 3: User Story 1 - Open Modal and See Dynamic Categories (Priority: P1) 🎯 MVP

**Goal**: When the user opens the analysis library modal, category filter buttons are fetched from the backend and rendered in ascending `sortOrder`.

**Independent Test**: Open the modal and observe that category buttons appear based on the backend response, sorted by `sortOrder` ascending, alongside the "All" button.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create `useAnalysisCategories` custom hook in `src/app/hooks/useAnalysisCategories.ts` with `categories`, `isLoading`, `error`, and `retry` state
- [x] T006 [US1] Update `AIAnalysisPage.tsx` to call `useAnalysisCategories` when `showAnalysisLibrary` becomes `true`
- [x] T007 [US1] Update `AIAnalysisPage.tsx` to render category buttons from `useAnalysisCategories.categories` (sorted by `sortOrder` ascending) instead of the hardcoded `categories` constant
- [x] T008 [US1] Ensure the "All" button (`الكل`) is always rendered, independent of the category fetch result
- [x] T009 [US1] Add `isLoading` visual feedback in the category filter bar of `AIAnalysisPage.tsx` while categories are loading

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Filter by Category and Show All (Priority: P1)

**Goal**: Clicking a category button filters the analysis cards to that category; clicking "All" removes the filter and shows all cards. Search and category filters operate together.

**Independent Test**: Click a category button and verify cards are filtered; click "All" and verify all cards appear; type in search box and verify both filters intersect.

### Implementation for User Story 2

- [x] T010 [US2] Wire category selection state in `AIAnalysisPage.tsx`: when a category button is clicked, `selectedCategory` updates to the category `key`
- [x] T011 [US2] Update `filteredCards` logic in `AIAnalysisPage.tsx` to match cards by `card.category === selectedCategory` when a category is selected (not "All")
- [x] T012 [US2] Verify that clicking "All" (`الكل`) sets `selectedCategory` back to `'الكل'` and displays all cards unfiltered
- [x] T013 [US2] Verify search query (`searchQuery`) and `selectedCategory` work together as an intersection in `filteredCards`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Handle Backend Unavailability Gracefully (Priority: P2)

**Goal**: If the category request fails, the modal stays usable with the "All" button present and the card list unfiltered.

**Independent Test**: Simulate a backend failure (e.g., block the endpoint in DevTools). Open the modal and verify the UI does not crash; the "All" button is present and functional; cards are still visible.

### Implementation for User Story 3

- [x] T014 [US2] Update `useAnalysisCategories` to expose a stable fallback state so `categories` is an empty array on error
- [x] T015 [US2] Update `AIAnalysisPage.tsx` category filter bar to show an inline error message or retry affordance when `useAnalysisCategories.error` is truthy
- [x] T016 [US2] Ensure `filteredCards` still works correctly (as if "All" is selected) when categories are empty due to an error

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, documentation, and quickstart validation

- [x] T017 [P] Handle empty backend response: verify only "All" button is shown when `categories.length === 0`
- [x] T018 [P] Handle very long category names: ensure button CSS in `AIAnalysisPage.tsx` truncates gracefully or wraps without breaking layout
- [x] T019 Validate quickstart steps in `quickstart.md` end-to-end against the current implementation

**Checkpoint**: Feature fully polished, edges covered, and validated against quickstart

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Builds on US1 state/sorting logic in the same component, but the filtering behavior is independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on the hook and service being in place from US1

### Within Each User Story

- Hook state before UI wiring
- UI wiring before behavior integration
- Core implementation before integration

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)

---

## Parallel Example: User Story 1

```bash
# Phase 2 Foundational (parallel):
Task: "Define Category TypeScript interface in src/api/services/analysis-service.ts"
Task: "Implement AnalysisService class with getCategories() in src/api/services/analysis-service.ts"
Task: "Export analysisService singleton from src/api/services/index.ts"

# Phase 3 User Story 1 (parallel):
Task: "Create useAnalysisCategories custom hook in src/app/hooks/useAnalysisCategories.ts"
Task: "Update AIAnalysisPage.tsx to call useAnalysisCategories when showAnalysisLibrary is true"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Run Polish phase → Final validation
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
