# Research: Collaboration Hub Backend Integration

## Unknowns Resolved

### 1. How should the Hub obtain the current project ID?

**Decision**: The collaboration route currently uses `path: ':view'` without a project ID. Add a required `projectId` route parameter and change the collaboration routes to `/dashboard/collaboration/:projectId/:view?`, defaulting `view` to `hub`.

**Rationale**: Every collaboration endpoint requires `projectId`. Reusing the existing `useParams` pattern from other project-management pages keeps routing consistent and makes project context explicit.

**Alternatives considered**:
- Pass `projectId` via query string: rejected because it breaks consistency with `/dashboard/project-management/details/:projectId` and other nested routes.
- Derive project ID from a global context: no global project context exists in the codebase.

### 2. Which client state pattern should be used for the three panels?

**Decision**: Create one custom hook per panel (`useProjectConversations`, `useProjectDiscussions`, `useProjectAttachments`) modeled on `useProjects` and `useProjectDetails`, with local React state, abort cleanup, Arabic error messages, pagination controls, and filters.

**Rationale**: This mirrors existing project hooks, keeps panels independent (one failure does not block others), and satisfies FR-004 through FR-006 and SC-006.

**Alternatives considered**:
- A single combined hook: rejected because it would couple panel lifecycles and complicate per-panel loading/error/pagination states.
- React Query/TanStack Query: not in `package.json`; adding a new dependency conflicts with minimal-change goal.

### 3. How should pagination be triggered in the UI?

**Decision**: Use an explicit "Load more" button at the bottom of each panel list. Disable the button while loading or when `page >= totalPages`.

**Rationale**: The existing Hub UI is compact and already uses buttons for filters. Infinite scroll would add scroll-position complexity and is not requested. A button gives clear, testable behavior (one interaction per page) and aligns with SC-005.

**Alternatives considered**:
- Infinite scroll: rejected due to added complexity and lack of existing scroll-trigger utilities.
- Traditional numbered pagination: rejected because the Hub panels are side widgets, not full list pages.

### 4. How should the existing mock data arrays be removed?

**Decision**: Delete the `conversations`, `discussions`, `attachments`, `messages`, `revisions`, and `notifications` arrays from `ProjectCollaborationModule.tsx` once their consumers are wired to hooks. Keep the component-level TypeScript interfaces only if still useful; otherwise replace them with service-level types.

**Rationale**: FR-012 requires removal of hardcoded mock data. Centralizing types in the service reduces drift between backend shape and UI shape.

**Alternatives considered**:
- Rename mock arrays to `MOCK_*` and leave them for testing: rejected because it leaves dead code and may accidentally ship in production.

### 5. How should date formatting and file size formatting be handled?

**Decision**: Use `date-fns` for absolute timestamps (`createdAt`, `lastMessageAt`, `lastReplyAt`) and a small helper for bytes-to-human-readable sizes. Keep relative phrases (e.g., "منذ 5 دقائق") only if already supported; otherwise render absolute short dates to avoid relying on fabricated relative strings.

**Rationale**: `date-fns` is already a dependency. Backend returns ISO datetimes, so formatting must be real. File sizes arrive as raw bytes and must be rendered as KB/MB.

**Alternatives considered**:
- Manual `Intl.DateTimeFormat`: date-fns is already available and more concise for common patterns.

## Best-Practice Notes

- Each panel should be independently loadable and abort previous in-flight requests when filters or pagination change.
- Error boundaries are not required for this feature; per-panel error states satisfy the spec.
- Keep Arabic error strings consistent with existing hooks (`useProjectDetails`, `useProjects`).
- Use a shared `CollaborationError` helper or reuse existing status-code mapping to avoid duplication.
- Avoid adding new dependencies; the stack already has everything needed.
