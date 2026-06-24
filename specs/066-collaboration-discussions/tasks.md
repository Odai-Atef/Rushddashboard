# Tasks: Collaboration Discussions View

**Input**: Design documents from `/specs/066-collaboration-discussions/`
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
- [x] T002 [P] Verify `src/api/hooks/useProjectDiscussions.ts` exists and follows the established custom-hook pattern
- [x] T003 [P] Verify `src/app/components/ProjectCollaborationModule.tsx` renders the `discussions` view branch
- [x] T004 [P] Verify `src/app/lib/error-messages.ts` exports `getCollaborationErrorMessage` for Arabic error mapping

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend collaboration domain types and add the new detail hook skeleton so all user stories can build on them.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 [P] Add `DiscussionWithReplies`, `Reply`, `CreateDiscussionDto`, `UpdateDiscussionDto`, `ChangeDiscussionStatusDto`, and `CreateReplyDto` types to `src/api/services/collaboration-service.ts`
- [x] T006 Implement discussion/reply API methods in `src/api/services/collaboration-service.ts`: `getDiscussionById`, `createDiscussion`, `updateDiscussion`, `changeDiscussionStatus`, `deleteDiscussion`, `createReply`, `acceptReply`
- [x] T007 Create `src/api/hooks/useDiscussionDetail.ts` with skeleton state for discussion, replies, loading, error, and mutation helpers
- [x] T008 Add shared optimistic-update utilities (`generateTempId`, `replaceOptimisticItem`, `markItemFailed`) in `src/api/hooks/useDiscussionDetail.ts` or a new `src/app/lib/optimistic-utils.ts`

**Checkpoint**: Foundation ready - service methods, types, and hook skeleton exist and compile.

---

## Phase 3: User Story 1 - View and Filter Project Discussions (Priority: P1) 🎯 MVP

**Goal**: Display a paginated list of project discussions with status and section filters.

**Independent Test**: Navigate to `/dashboard/collaboration/:projectId/discussions`, apply a status filter, and see only discussions matching that status.

### Implementation for User Story 1

- [x] T009 [US1] Refactor `useProjectDiscussions` in `src/api/hooks/useProjectDiscussions.ts` to align with the clarified pagination model (replace page rather than append on page change)
- [x] T010 [US1] Add section and status filter controls to the Discussions view in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T011 [US1] Add pagination controls (page size, previous/next) to the Discussions view in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T012 [US1] Add loading, error, and empty states for the discussions list in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T013 [US1] Replace the mock `discussions` array with data from `useProjectDiscussions` in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Read a Single Discussion and Its Replies (Priority: P1)

**Goal**: Display a single discussion's full content and all replies; highlight accepted solutions.

**Independent Test**: Select a discussion, view its content and replies, and identify the accepted reply if one exists.

### Implementation for User Story 2

- [x] T014 [P] [US2] Implement `load` in `src/api/hooks/useDiscussionDetail.ts` to fetch a discussion with replies
- [x] T015 [P] [US2] Add `DiscussionDetailPanel` rendering in `src/app/components/ProjectCollaborationModule.tsx` showing title, content, status, author, and timestamps
- [x] T016 [P] [US2] Add `ReplyList` rendering in `src/app/components/ProjectCollaborationModule.tsx` with accepted-solution highlight
- [x] T017 [US2] Add loading, error, and retry states for the discussion detail in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T018 [US2] Wire discussion selection from the list to the detail hook in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Create a New Discussion (Priority: P1)

**Goal**: Allow project members to create a new discussion with section, title, and content.

**Independent Test**: Open the new-discussion form, fill in required fields, submit, and see the created discussion in the list and detail view.

### Implementation for User Story 3

- [x] T019 [P] [US3] Add the create-discussion form UI (section select, title input, content editor) in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T020 [P] [US3] Implement client-side validation for create-discussion fields in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T021 [US3] Implement `createDiscussion` mutation in `src/api/hooks/useDiscussionDetail.ts`
- [x] T022 [US3] Wire the create form submission to the mutation and navigate to the new discussion in `src/app/components/ProjectCollaborationModule.tsx`
- [ ] T023 [US3] Add optional attachment selection using `useProjectAttachments` in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all work independently.

---

## Phase 6: User Story 4 - Reply to a Discussion (Priority: P2)

**Goal**: Allow project members to add a reply to a discussion with optimistic updates and retry.

**Independent Test**: View a discussion, type a reply, submit it, and see the reply appear; simulate failure and confirm retry control works.

### Implementation for User Story 4

- [x] T024 [P] [US4] Add reply composer UI in the discussion detail panel in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T025 [P] [US4] Implement client-side validation for reply content in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T026 [US4] Implement `createReply` mutation with optimistic append and retry in `src/api/hooks/useDiscussionDetail.ts`
- [x] T027 [US4] Render optimistic replies with pending state and a retry action in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T028 [US4] Preserve user input next to the retry control until the server confirms success in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: At this point, User Stories 1-4 should all work independently.

---

## Phase 7: User Story 5 - Manage Discussion Status and Accepted Solution (Priority: P2)

**Goal**: Allow authorized project members to change status, mark a reply as accepted, and delete discussions.

**Independent Test**: Resolve a discussion, mark a reply as accepted, and delete a discussion; confirm the UI reflects each state change.

### Implementation for User Story 5

- [x] T029 [P] [US5] Implement `changeStatus` mutation with optimistic status update in `src/api/hooks/useDiscussionDetail.ts`
- [x] T030 [P] [US5] Implement `acceptReply` mutation with optimistic accepted-solution flag in `src/api/hooks/useDiscussionDetail.ts`
- [x] T031 [P] [US5] Implement `deleteDiscussion` mutation in `src/api/hooks/useDiscussionDetail.ts`
- [x] T032 [US5] Add status-change controls to the discussion detail panel in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T033 [US5] Add "Mark as accepted solution" action to each reply in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T034 [US5] Add delete-discussion button with confirmation flow in `src/app/components/ProjectCollaborationModule.tsx`
- [ ] T035 [US5] Render deleted discussions as placeholders in the discussions list in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T036 [P] Run TypeScript type-check and fix any issues across `src/api/services/collaboration-service.ts`, `src/api/hooks/useDiscussionDetail.ts`, and `src/app/components/ProjectCollaborationModule.tsx`
- [x] T037 [P] Verify Arabic error messages from `src/app/lib/error-messages.ts` are shown for all mutation failures
- [x] T038 [P] Remove any remaining mock data and unused imports from `src/app/components/ProjectCollaborationModule.tsx`
- [x] T039 [P] Verify the quickstart runbook in `specs/066-collaboration-discussions/quickstart.md` works end-to-end with the dev server
- [x] T040 [P] Add or update route fallbacks so `/dashboard/collaboration/:projectId/discussions` remains accessible in `src/app/routes.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P1 → P2 → P2)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories (detail selection is self-contained)
- **User Story 3 (P1)**: Can start after Foundational - Adds creation flow; depends on list view from US1 for verification
- **User Story 4 (P2)**: Can start after Foundational/US2 - Adds reply flow to detail view
- **User Story 5 (P2)**: Can start after Foundational/US2/US4 - Adds moderation actions on detail view and replies

### Within Each User Story

- Types before service methods
- Service methods before hook methods
- Hook methods before UI wiring
- UI wiring before polish/cleanup

### Parallel Opportunities

- All Setup tasks (T001-T004) can run in parallel
- All Foundational tasks (T005-T008) can run in parallel
- T009 (list refactor) and T014-T016 (detail skeleton) can start in parallel once foundation is done
- T019-T020 (create form) and T024-T025 (reply composer) can run in parallel once US2 is available
- T029-T031 (status/accept/delete mutations) can run in parallel
- All Polish tasks (T036-T040) can run in parallel after user stories are complete

---

## Parallel Example: User Story 1

```bash
# Launch independent UI tasks for User Story 1 together:
Task: "T010 [US1] Add section and status filter controls to the Discussions view in src/app/components/ProjectCollaborationModule.tsx"
Task: "T011 [US1] Add pagination controls (page size, previous/next) to the Discussions view in src/app/components/ProjectCollaborationModule.tsx"
Task: "T012 [US1] Add loading, error, and empty states for the discussions list in src/app/components/ProjectCollaborationModule.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Complete Phase 4: User Story 2
5. **STOP and VALIDATE**: Test list filtering and detail reading independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Add User Story 4 → Test independently
6. Add User Story 5 → Test independently
7. Polish → Final validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (list + filters + pagination)
   - Developer B: User Story 2 (detail + replies)
   - Developer C: User Story 3 (create form)
3. Integrate US1/US2/US3 before proceeding to US4/US5
4. Developer A: User Story 4 (reply composer)
5. Developer B: User Story 5 (status/accept/delete)
6. Final polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
