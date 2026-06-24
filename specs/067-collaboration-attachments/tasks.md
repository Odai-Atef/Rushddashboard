# Tasks: Collaboration Attachments View

**Input**: Design documents from `/specs/067-collaboration-attachments/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm shared infrastructure is in place; no new project setup required.

- [x] T001 [P] Verify `src/api/services/collaboration-service.ts` exists and exports the existing `collaborationService` singleton
- [x] T002 [P] Verify `src/api/hooks/useProjectAttachments.ts` exists and follows the established custom-hook pattern
- [x] T003 [P] Verify `src/app/components/ProjectCollaborationModule.tsx` renders the `attachments` view branch
- [x] T004 [P] Verify `src/app/lib/error-messages.ts` exports `getCollaborationErrorMessage` for Arabic error mapping
- [x] T005 [P] Verify `src/app/lib/formatters.ts` exists and contains date/time formatters

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the API client with upload support and add the mutations hook skeleton so all user stories can build on them.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 [P] Add `UploadConfig` and `UploadProgressCallback` types to `src/api/types.ts`
- [x] T007 [P] Add an `upload` method to `src/api/client.ts` that accepts `FormData`, supports `onProgress`, and returns `ApiResponse<T>`
- [x] T008 Add attachment upload, download, and delete methods to `src/api/services/collaboration-service.ts`: `uploadAttachment`, `downloadAttachment`, `deleteAttachment`
- [x] T009 Create `src/api/hooks/useAttachmentMutations.ts` with skeleton state for upload progress, mutation loading flags, and error
- [x] T010 Add `formatFileSize(bytes: number): string` helper to `src/app/lib/formatters.ts`

**Checkpoint**: Foundation ready - upload client, service methods, mutations hook skeleton, and formatter exist and compile.

---

## Phase 3: User Story 1 - View and Filter Project Attachments (Priority: P1) 🎯 MVP

**Goal**: Display a paginated list of project attachments with type filtering.

**Independent Test**: Navigate to `/dashboard/collaboration/:projectId/attachments`, apply a type filter, and see only attachments matching that type.

### Implementation for User Story 1

- [x] T011 [US1] Refactor `useProjectAttachments` in `src/api/hooks/useProjectAttachments.ts` to align with the clarified pagination model (replace page rather than append on page change)
- [x] T012 [US1] Add attachment type filter controls to the Attachments view in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T013 [US1] Add pagination controls (page size, previous/next) to the Attachments view in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T014 [US1] Add loading, error, and empty states for the attachments list in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T015 [US1] Replace the mock `attachments` array with data from `useProjectAttachments` in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T016 [US1] Render file type icons for each attachment in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T017 [US1] Format file sizes using `formatFileSize` in the attachments list in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Upload a File (Priority: P1)

**Goal**: Allow project members to upload a file with a progress indicator.

**Independent Test**: Choose a file, start the upload, see progress feedback, and then find the uploaded file in the list.

### Implementation for User Story 2

- [x] T018 [P] [US2] Add an upload area UI with a file picker to the Attachments view in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T019 [P] [US2] Add drag-and-drop support to the upload area in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T020 [P] [US2] Add an optional project-stage selector to the upload form in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T021 [US2] Implement `uploadAttachment` mutation with `FormData` construction in `src/api/hooks/useAttachmentMutations.ts`
- [x] T022 [US2] Wire the upload area to the mutation and display a progress bar in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T023 [US2] Refresh the attachments list on successful upload in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T024 [US2] Handle upload errors (including 413 and 415) with user-friendly Arabic messages in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Download a File (Priority: P2)

**Goal**: Allow project members to download an existing attachment.

**Independent Test**: Click a download action on any file and receive the file in the browser with the original filename preserved.

### Implementation for User Story 3

- [x] T025 [P] [US3] Implement `downloadAttachment` in `src/api/hooks/useAttachmentMutations.ts` using Blob and a temporary anchor
- [x] T026 [US3] Add a download action to each attachment card/row in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T027 [US3] Clean up `URL.createObjectURL` after download in `src/api/hooks/useAttachmentMutations.ts`
- [x] T028 [US3] Show download error state with retry option in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional.

---

## Phase 6: User Story 4 - Delete a File (Priority: P2)

**Goal**: Allow authorized project members to delete an attachment with confirmation.

**Independent Test**: Initiate deletion of a file, confirm the action, and see the file removed from the list.

### Implementation for User Story 4

- [x] T029 [P] [US4] Implement `deleteAttachment` mutation in `src/api/hooks/useAttachmentMutations.ts`
- [x] T030 [P] [US4] Add a delete button to each attachment card/row in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T031 [US4] Add a delete confirmation modal in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T032 [US4] Wire delete confirmation to the mutation and refresh the list on success in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T033 [US4] Show delete error state and keep the file in the list on failure in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T034 [P] Run TypeScript type-check and fix any issues across `src/api/client.ts`, `src/api/services/collaboration-service.ts`, `src/api/hooks/useAttachmentMutations.ts`, and `src/app/components/ProjectCollaborationModule.tsx`
- [x] T035 [P] Verify Arabic error messages from `src/app/lib/error-messages.ts` are shown for all mutation failures
- [x] T036 [P] Remove any remaining mock data and unused imports from `src/app/components/ProjectCollaborationModule.tsx`
- [x] T037 [P] Verify the quickstart runbook in `specs/067-collaboration-attachments/quickstart.md` works end-to-end with the dev server
- [x] T038 [P] Add or update route fallbacks so `/dashboard/collaboration/:projectId/attachments` remains accessible in `src/app/routes.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2 → P2)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational/US1 - Adds upload flow; depends on list view from US1 for verification
- **User Story 3 (P2)**: Can start after Foundational/US1 - Adds download action to list items
- **User Story 4 (P2)**: Can start after Foundational/US1 - Adds delete action to list items

### Within Each User Story

- Types before service methods
- Service methods before hook methods
- Hook methods before UI wiring
- UI wiring before polish/cleanup

### Parallel Opportunities

- All Setup tasks (T001-T005) can run in parallel
- All Foundational tasks (T006-T010) can run in parallel
- T012-T017 (filter, pagination, states, icons, size formatting) can run in parallel once T011 is done
- T018-T020 (upload area UI tasks) can run in parallel
- T025-T026 (download mutation + UI action) can run in parallel
- T029-T030 (delete mutation + UI button) can run in parallel
- All Polish tasks (T034-T038) can run in parallel after user stories are complete

---

## Parallel Example: User Story 1

```bash
# Launch independent UI tasks for User Story 1 together:
Task: "T012 [US1] Add attachment type filter controls to the Attachments view in src/app/components/ProjectCollaborationModule.tsx"
Task: "T013 [US1] Add pagination controls (page size, previous/next) to the Attachments view in src/app/components/ProjectCollaborationModule.tsx"
Task: "T014 [US1] Add loading, error, and empty states for the attachments list in src/app/components/ProjectCollaborationModule.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Complete Phase 4: User Story 2
5. **STOP and VALIDATE**: Test list filtering and file upload independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Add User Story 4 → Test independently
6. Polish → Final validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (list + filters + pagination + icons)
   - Developer B: User Story 2 (upload area + progress)
3. Integrate US1/US2 before proceeding to US3/US4
4. Developer A: User Story 3 (download)
5. Developer B: User Story 4 (delete + confirmation)
6. Final polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
