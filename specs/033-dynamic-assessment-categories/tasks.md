# Tasks: Dynamic Assessment Categories

**Input**: Design documents from `/specs/033-dynamic-assessment-categories/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in feature specification; manual/integration testing via browser devtools.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Primary files affected: `src/api/services/onboarding-service.ts` and `src/app/components/CharityOnboardingFlow.tsx`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add new API endpoint and types to onboarding service

- [X] T001 [P] Add `AssessmentCategory`, `AssessmentQuestion`, `QuestionOptions` types and `getAssessmentCategories()` endpoint to `src/api/services/onboarding-service.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare component-level dynamic rendering foundation

- [X] T002 Add icon name-to-Lucide-component mapping utility (with `Circle` fallback) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T003 Remove hardcoded `assessmentCategories` array (lines 290-300) and associated static imports from `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: Foundation ready — service endpoint exists and icon mapping is in place

---

## Phase 3: User Story 1 - Load assessment categories dynamically from API (Priority: P1) 🎯 MVP

**Goal**: On entering the assessment step, fetch categories and questions from the API, show a loading indicator, and render tabs dynamically.

**Independent Test**: Enter the assessment step, open Network tab, verify `GET /api/v1/onboarding/assessment/categories` is called. Verify tabs match API categories and questions update when switching tabs. Verify loading spinner shows during fetch.

### Implementation for User Story 1

- [X] T004 [US1] Add local state (`assessmentCategories`, `isLoadingAssessment`) and mount-time `useEffect` to call `getAssessmentCategories()` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T005 [US1] Render dynamic category tabs using fetched `assessmentCategories` (map `name`, `icon`, `color`) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T006 [US1] Show loading indicator / spinner while `isLoadingAssessment` and hide assessment form during load in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T007 [US1] Show friendly "no assessment categories available" message when API returns an empty array in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T008 [US1] Use `AbortController` to cancel/ignore stale fetch results if user navigates away during loading in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Render questions based on dynamic type (Priority: P2)

**Goal**: Render each question using the correct input control based on `questionType` (SCALE, YES_NO, MULTIPLE_CHOICE, FILE_UPLOAD).

**Independent Test**: Configure backend with one question of each type. Enter assessment step, verify each type renders the correct control and accepts input.

### Implementation for User Story 2

- [X] T009 [US2] Render SCALE questions as 1-5 clickable rating buttons (adapted from current 1-10) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T010 [US2] Render YES_NO questions as two toggle buttons (نعم / لا) storing `"yes"` or `"no"` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T011 [US2] Render MULTIPLE_CHOICE questions as checkboxes from `options.choices` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T012 [US2] Render FILE_UPLOAD questions with a hidden `<input type="file">` and styled trigger/drag zone in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T013 [US2] Add graceful placeholder for unrecognized question types (do not crash) in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Store answers by question ID (Priority: P2)

**Goal**: Ensure answer state is keyed by the API-provided question ID so answers survive reordering or rewording.

**Independent Test**: Answer several questions, inspect component state to confirm `assessmentAnswers` entries use API `questionId` values. Simulate backend reordering questions and confirm answers still map correctly.

### Implementation for User Story 3

- [X] T014 [US3] Update `assessmentAnswers` state shape and update handlers to use `question.id` (from API) as keys in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T015 [US3] Update answer submission payload (if applicable) to reference API question IDs in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T016 [US3] Preserve existing `categoryId` association in answer entries so answers are grouped correctly in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T017 [P] Run Vite build (`npm run build`) to catch type errors across `src/api/services/onboarding-service.ts` and `src/app/components/CharityOnboardingFlow.tsx`
- [X] T018 [P] Manual testing per `quickstart.md` checklist (dynamic categories, loading spinner, all question types, empty categories, unrecognized type fallback, no console errors)
- [X] T019 Update `AGENTS.md` context block if any plan/spec paths changed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — add service types and endpoint
- **Foundational (Phase 2)**: Depends on Setup — icon mapping and removal of hardcoded data
- **User Stories (Phase 3-5)**: All depend on Foundational
  - User Story 1 (P1) should be implemented first (MVP)
  - User Stories 2 and 3 (P2) can follow; US3 is simpler if US2 is done first
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — fetches and renders categories
- **User Story 2 (P2)**: Depends on US1 — needs categories loaded before questions can be rendered
- **User Story 3 (P2)**: Depends on US2 — answer updates are most naturally wired alongside question rendering

### Within Each User Story

- Tasks within a user story can be implemented sequentially within the same file
- All three stories touch the same component file, so they cannot be parallelized without merge conflicts

### Parallel Opportunities

- T001 (service file) and T002/T003 (component prep) can run in parallel because they affect different files
- Polish-phase build and manual testing (T017, T018) can run in parallel after code changes are complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — add API endpoint and types
2. Complete Phase 2: Foundational — icon mapping, remove hardcoded data
3. Complete Phase 3: User Story 1 — fetch categories, dynamic tabs, loading spinner, empty state
4. **STOP and VALIDATE**: Test that assessment tabs load from API and switching tabs works
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundational → User Story 1 → Test independently → Deploy/Demo (MVP!)
2. Add User Story 2 → Test independently → Verify SCALE, YES_NO, MULTIPLE_CHOICE, FILE_UPLOAD
3. Add User Story 3 → Test independently → Verify answers keyed by question ID
4. Each story adds value without breaking previous stories

### Rollback

If issues arise, revert to the previous hardcoded `assessmentCategories` array and static question rendering. The service endpoint addition is safe to keep (it's additive and unused if component doesn't call it).

---

## Notes

- Primary files:
  - `src/api/services/onboarding-service.ts` — new endpoint + types
  - `src/app/components/CharityOnboardingFlow.tsx` — dynamic rendering, answer state, loading UI
- No changes needed to `useOnboardingRegistration` hook
- Arabic UX and error messages: reuse existing `setErrorWithArabic` / toast patterns
- **Constraint reminder**: SCALE range is 1-5 (per API spec), not the current hardcoded 1-10
- **Icon mapping**: API returns icon name strings; use a lookup object with `Circle` fallback to map to `lucide-react` components
- **AbortController**: wrap fetch in component to prevent stale state updates if user navigates away
