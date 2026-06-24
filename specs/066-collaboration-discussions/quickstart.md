# Quickstart: Collaboration Discussions View

## What this feature does

Replaces hardcoded mock discussion data in the Project Collaboration Module's Discussions view with live backend data for:

- Discussions list with status and section filters
- Single discussion detail with replies
- Create new discussion
- Add reply
- Change discussion status
- Mark reply as accepted solution
- Delete discussion

## Files you will touch

### New files

| File | Purpose |
|------|---------|
| `src/api/hooks/useDiscussionDetail.ts` | Hook for single discussion, replies, and all mutations |

### Modified files

| File | Change |
|------|--------|
| `src/api/services/collaboration-service.ts` | Add discussion/reply CRUD endpoints |
| `src/app/components/ProjectCollaborationModule.tsx` | Refactor `DiscussionsView` to use hooks and remove mock data |
| `src/app/routes.tsx` | Ensure discussion route includes `projectId` parameter (already present) |

## Runbook

### 1. Extend the service

Add the following methods to `src/api/services/collaboration-service.ts`:

- `getDiscussionById(projectId, discussionId, config?)`
- `createDiscussion(projectId, dto, config?)`
- `updateDiscussion(projectId, discussionId, dto, config?)`
- `changeDiscussionStatus(projectId, discussionId, dto, config?)`
- `deleteDiscussion(projectId, discussionId, config?)`
- `createReply(projectId, discussionId, dto, config?)`
- `acceptReply(projectId, discussionId, replyId, config?)`

Add or extend types: `Discussion`, `DiscussionWithReplies`, `Reply`, `CreateDiscussionDto`, `UpdateDiscussionDto`, `ChangeDiscussionStatusDto`, `CreateReplyDto`.

### 2. Create the detail hook

Implement `src/api/hooks/useDiscussionDetail.ts` with:

- Local state for discussion, replies, loading, error, and optimistic mutations.
- `load(projectId, discussionId)` for the detail fetch.
- `createReply(content)` with optimistic append and retry.
- `acceptReply(replyId)` with optimistic accepted-solution flag.
- `changeStatus(status)` with optimistic status update.
- `deleteDiscussion()` to call the endpoint and signal success to the caller.
- Optimistic items use a transient local ID and a `pending` flag.

### 3. Refactor the Discussions view

In `ProjectCollaborationModule.tsx`:

- Use `useProjectDiscussions` for the discussions list.
- Use `useDiscussionDetail` when a discussion is selected.
- Remove the local `discussions` mock array and the local `Discussion` type.
- Add filter UI for status and section.
- Add pagination controls.
- Add a create-discussion form with section, title, and content (reuse existing markdown editor).
- Add a reply composer.
- Add status change, accept-solution, and delete actions with confirmation.
- Add loading, error, and empty states for list and detail.

### 4. Verify

1. Start the dev server: `npm run dev`
2. Navigate to `/dashboard/collaboration/:projectId/discussions`
3. Confirm the discussions list loads and filters work.
4. Open a discussion and confirm replies load.
5. Create a new discussion and confirm it appears in the list.
6. Add a reply and confirm it appears.
7. Change a discussion status and confirm the badge updates.
8. Mark a reply as accepted solution and confirm the highlight.
9. Delete a discussion and confirm the list shows a placeholder.

## Testing hints

- Mock service responses and verify that the hook updates state correctly.
- Test optimistic reply creation: the reply should appear immediately with a pending state.
- Test optimistic failure: the reply should remain visible with a retry control and preserved input.
- Test status change and accepted-solution mutation success paths.
- Test delete success path and list placeholder behavior.

## Common pitfalls

- Leaving old mock arrays in the component after integration.
- Forgetting to replace the optimistic local ID with the server ID on mutation success.
- Losing optimistic state on re-render.
- Not handling the 204 No Content response from delete correctly.
- Mixing the local `Discussion` type with the service `Discussion` type.
