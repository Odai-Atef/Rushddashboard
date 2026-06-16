# Tasks: Charity Document Upload Integration

**Input**: Design documents from `/specs/035-charity-doc-upload/`  
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/api-contracts.md](contracts/api-contracts.md), [quickstart.md](quickstart.md)

**Tests**: Test tasks are included for manual verification only; the project has no automated test harness.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the service layer and shared constants needed by all user stories.

- [x] T001 Add `OrganizationDocument` interface and document type constants to `src/api/services/onboarding-service.ts`
- [x] T002 Add `AUTH_CONFIG` import path check and base URL accessor to `src/api/client.ts` if not already exposed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the API methods that all document operations depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Implement `getOrganizationDocuments(organizationId)` in `src/api/services/onboarding-service.ts`
- [x] T004 Implement `uploadOrganizationDocument(file, documentType, description)` using native `fetch` + `FormData` in `src/api/services/onboarding-service.ts`
- [x] T005 Implement `deleteOrganizationDocument(id)` in `src/api/services/onboarding-service.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Upload Required Charity Documents (Priority: P1) 🎯 MVP

**Goal**: Allow users to upload files for the four required document slots, show upload progress, mark slots complete, and enable the Continue button only when all required slots are complete.

**Independent Test**: Select a file for each required slot, observe progress and completion, and confirm Continue is enabled only after all four are uploaded.

### Implementation for User Story 1

- [x] T006 [US1] Define static `documentSlots` array and `mapSlotToDocumentType(slotId)` helper inside `src/app/components/CharityOnboardingFlow.tsx`
- [x] T007 [US1] Add `uploadedFiles` and `documentsLoadError` component state and `hasPendingUploads` derived flag in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T008 [US1] Implement `handleUpload(slotId, file)` with simulated progress, status transitions, and toast feedback in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T009 [US1] Derive `completedRequiredCount` and `isDocumentsComplete` from uploaded files in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T010 [US1] Wire each required document slot to `handleUpload`, show progress/completed state, and disable upload button while uploading in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T011 [US1] Disable the Continue button until `isDocumentsComplete` is true and `hasPendingUploads` is false, and show required-documents warning in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T012 [US1] Add Arabic labels and visual completion indicators for the four required slots in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Reload and Display Previously Uploaded Documents (Priority: P1)

**Goal**: Load existing documents from the backend when the documents step mounts and display each one in the correct slot based on its document type.

**Independent Test**: Upload documents, refresh the page, and verify each document appears in the correct slot with its original name and status.

### Implementation for User Story 2

- [x] T013 [US2] Implement `loadExistingDocuments(organizationId)` in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T014 [US2] Add a `useEffect` that calls `loadExistingDocuments` when `currentView === 'documents'` and `organization?.id` is available in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T015 [US2] Map returned `OrganizationDocument[]` into `uploadedFiles` state with `completed` status and slot assignment in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T016 [US2] Handle load failure with an inline error state and retry button in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T017 [US2] Update progress counters (`0/4`, uploaded count, pending review count) from loaded documents in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Delete an Uploaded Document (Priority: P2)

**Goal**: Allow users to delete an uploaded document from any slot, update the UI immediately, and re-disable Continue if a required document is deleted.

**Independent Test**: Upload a document, click delete, verify the slot becomes empty, and verify the document does not reappear after refresh.

### Implementation for User Story 3

- [x] T018 [US3] Implement `handleDelete(slotId)` that calls `deleteOrganizationDocument` and updates `uploadedFiles` state in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T019 [US3] Add a delete control to each completed slot in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T020 [US3] Show error toast and keep the document in the slot when delete fails in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T021 [US3] Ensure deleting a required document decrements `completedRequiredCount` and re-enables the required-documents warning in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve UX consistency, handle edge cases, and verify the implementation against the quickstart scenarios.

- [x] T022 [P] Add a `beforeunload` handler to warn users who attempt to leave the browser tab while uploads are in progress in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T023 [P] Implement missing/invalid `organizationId` redirect to the registration/landing step in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T024 [P] Ensure slot replacement deletes the previous backend document after a successful new upload in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T025 [P] Handle unknown backend document types gracefully (ignore or log) when loading existing documents in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T026 Run TypeScript compilation: `npm run build`
- [x] T027 Run the quickstart.md manual validation steps in the browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed).
  - Or sequentially in priority order (P1 → P2).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) — depends on the same API methods as US1 and the upload state shape defined in US1, but is independently testable.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — depends on the upload state shape defined in US1 and the slot UI; independently testable.

### Within Each User Story

- Models/state before handlers.
- Handlers before UI wiring.
- Core implementation before cross-cutting polish.
- Story complete before moving to next priority.

### Parallel Opportunities

- Setup tasks T001 and T002 can run in parallel.
- Foundational tasks T003, T004, and T005 can run in parallel once the interface is defined.
- User Stories 1, 2, and 3 can be worked on in parallel by different team members after the Foundational phase is complete, provided they coordinate on the shared `uploadedFiles` state shape.
- Polish tasks T022–T025 can run in parallel after all stories are complete.

---

## Parallel Example: User Story 1

```bash
# Launch state + helper setup for User Story 1 together:
Task: "T006 [US1] Define static documentSlots array and mapSlotToDocumentType helper"
Task: "T007 [US1] Add uploadedFiles and hasPendingUploads state"

# Launch upload handler + completion logic together:
Task: "T008 [US1] Implement handleUpload with progress and toast feedback"
Task: "T009 [US1] Derive completedRequiredCount and isDocumentsComplete"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test uploading all four required documents and enabling Continue.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently (refresh persistence).
4. Add User Story 3 → Test independently (delete and replacement).
5. Add Polish → Run full quickstart validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (upload + completion logic)
   - Developer B: User Story 2 (load existing + counters)
   - Developer C: User Story 3 (delete + replacement)
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid vague tasks, same-file conflicts, and cross-story dependencies that break independence.
