# Research: Collaboration Discussions View

## Unknowns Resolved

### 1. Where should discussion and reply API methods live?

**Decision**: Extend `src/api/services/collaboration-service.ts` with all discussion and reply methods.

**Rationale**: Conversations, messages, discussions, and replies all belong to the same collaboration domain. Keeping them together avoids scattering related endpoints and reuses the existing service/hook pattern established in features 064 and 065.

**Alternatives considered**:
- Add methods to `project-service.ts`: rejected because it would mix project-management concerns with collaboration concerns.
- Create a separate `discussion-service.ts`: rejected because it would fragment the collaboration domain unnecessarily.

### 2. What state-management pattern should be used?

**Decision**: Use existing custom React hooks (`useState`/`useCallback`) plus direct service calls, mirroring `useProjectDiscussions` and `useConversationMessages`.

**Rationale**: The project does not currently use TanStack Query/SWR/Redux. Consistency with the established custom-hook pattern reduces cognitive load and avoids adding new dependencies.

**Alternatives considered**:
- Introduce TanStack Query: rejected because it would require a new dependency and refactor existing hooks.
- Lift state into a context provider: rejected because discussion state is scoped to a single page and does not need global sharing.

### 3. How should optimistic updates be modeled for discussions and replies?

**Decision**: Append optimistic items with a transient local ID and a `pending` flag. On success, replace the transient item with the server item. On failure, keep the transient item visible with a retry control and preserve user input.

**Rationale**: The specification explicitly requires that failed optimistic updates leave a retry action and preserve input. A `pending` flag lets the UI show spinners/disable actions without removing the item.

**Alternatives considered**:
- Roll back and restore input only in the composer: rejected because the spec asks to keep the failed item visible with a retry action.
- Use React state only (no local IDs): rejected because replacing/removing the correct item on success/failure requires stable keys.

### 4. Which rich-text/WYSIWYG component should be used for discussion content?

**Decision**: Reuse the markdown editor already present in the project (`@uiw/react-md-editor` / `react-markdown`) rather than introducing a new WYSIWYG library.

**Rationale**: The project already depends on `@uiw/react-md-editor` and `react-markdown`. Reusing the existing component keeps dependencies stable and content rendering consistent.

**Alternatives considered**:
- Add a dedicated WYSIWYG library such as Tiptap or Quill: rejected because the project assumption states the editor component is already available and adding a new editor would exceed scope.

### 5. How should user identity be displayed?

**Decision**: Render `authorUserId` as the author identifier. If a user profile/name enrichment service is already available in the project, reuse it; otherwise show a stable short identifier or placeholder.

**Rationale**: The backend returns `authorUserId`, not display names. Avoiding a dependency on a new profile lookup keeps the scope focused on discussion integration. The existing `senderUserId` pattern in feature 065 uses the same approach.

**Alternatives considered**:
- Fetch user profiles for every discussion/reply: rejected because it adds complexity and may duplicate existing work.

## Best-Practice Notes

- Reuse existing `getCollaborationErrorMessage` for all server errors.
- Abort in-flight list/detail requests on unmount or when filters change to avoid race conditions.
- Debounce status changes and delete confirmations to prevent accidental duplicate operations.
- Keep discussion/reply ordering stable: sort replies by `createdAt` ascending; sort discussions by `lastReplyAt`/`updatedAt` descending.
- Preserve optimistic state per item so retry can resubmit the same content without duplicating input.
- Avoid introducing new global stores or dependencies; keep state local to the page and its hooks.
