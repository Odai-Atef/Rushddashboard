# Feature Specification: Chat History Routing

**Feature Branch**: `064-chat-history-routing`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "dashboard/ai-analysis/chat on this page the chat history on click redirect it to /dashboard/ai-analysis/chat/:chatId and load the chat and activate it"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open a Saved Chat from History (Priority: P1)

A user who is on the AI analysis chat page sees a list of previous chats in the left sidebar. When the user clicks any chat item, the application navigates to a dedicated URL for that chat, loads the selected chat's full message history into the workspace, and marks that item as active in the history list.

**Why this priority**: This is the core user value of the feature. Users need to resume or review prior AI analysis conversations without losing context, and a dedicated URL makes the state shareable and refresh-safe.

**Independent Test**: A user can land on `/dashboard/ai-analysis/chat/123`, see the chat history panel with item `123` highlighted, and read the full conversation belonging to chat `123`.

**Acceptance Scenarios**:

1. **Given** the user is on `/dashboard/ai-analysis/chat`, **When** they click a chat history item whose id is `456`, **Then** the browser URL changes to `/dashboard/ai-analysis/chat/456`, the workspace displays the messages for chat `456`, and the item `456` is visually active in the history list.
2. **Given** a user is on the chat page with no active chat, **When** they click any history item, **Then** they are taken to the item's dedicated route and the previously empty workspace is populated.

---

### User Story 2 - Refresh and Direct Link Resilience (Priority: P2)

A user receives or bookmarks a direct link to a specific chat (`/dashboard/ai-analysis/chat/:chatId`). When the user opens that link or refreshes the page, the application loads the requested chat automatically and highlights it in the history list.

**Why this priority**: It extends the core value by making chat sessions addressable. Users can share links with teammates and not lose their place on reload.

**Independent Test**: Pasting `/dashboard/ai-analysis/chat/789` in a fresh browser tab loads chat `789` without requiring a prior navigation from the chat list.

**Acceptance Scenarios**:

1. **Given** the user opens `/dashboard/ai-analysis/chat/789` directly, **When** the page finishes loading, **Then** the workspace shows chat `789` and the history list highlights item `789`.
2. **Given** the user is viewing chat `789`, **When** they refresh the browser, **Then** the same chat remains loaded and active.

---

### User Story 3 - Start a New Analysis Without Breaking History (Priority: P3)

A user who is viewing a chat via its dedicated route can still start a brand-new analysis from the library or recommended cards. The application should keep the history list usable and let the user return to an existing chat by clicking its item again.

**Why this priority**: Preserves the existing flow for starting analyses while giving users persistent access to past chats.

**Independent Test**: From `/dashboard/ai-analysis/chat/789`, the user can click "New Analysis," start a new chat, and later click back to item `789` to reopen it.

**Acceptance Scenarios**:

1. **Given** the user is on `/dashboard/ai-analysis/chat/789`, **When** they start a new analysis, **Then** the new analysis runs and the history list remains visible and clickable.

---

### Edge Cases

- What happens when the requested chat id does not exist or the user has no access to it? The workspace shows an inline "chat not found" message and the URL remains unchanged.
- What happens when the chat history list is still loading while a direct link to a chat is opened? The specific chat loads after the history list finishes loading.
- How does the system handle the transition if the user clicks a history item while another analysis stream is running?
- What should display when the user visits `/dashboard/ai-analysis/chat` without any chat id?
- What happens if the chat history API call for a specific chat fails?
- Starting a new analysis from a chat-specific route navigates back to the base `/dashboard/ai-analysis/chat` route, so no chat item stays visually active while the new analysis runs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The chat page MUST display a list of previous AI analysis chats in a side panel.
- **FR-002**: Clicking a chat history item MUST navigate the browser to `/dashboard/ai-analysis/chat/:chatId`, where `:chatId` is the selected chat's identifier.
- **FR-003**: After navigation, the application MUST load the selected chat's full conversation into the main workspace.
- **FR-004**: The selected chat item MUST be visually distinguished in the history list as the active chat.
- **FR-005**: Visiting `/dashboard/ai-analysis/chat/:chatId` directly or refreshing it MUST load the requested chat without requiring a prior click from the history list; the chat-specific request MUST wait for the history list to finish loading before initiating.
- **FR-006**: If a chat id in the URL is invalid or inaccessible, the system MUST keep the URL and display a clear, user-friendly "chat not found" message inside the workspace instead of a blank screen or full-page redirect.
- **FR-007**: Starting a new analysis from within a chat route MUST navigate back to `/dashboard/ai-analysis/chat` and continue to work as the base route does today, while keeping the history list visible and updated.
- **FR-008**: The base `/dashboard/ai-analysis/chat` route without a chat id MUST continue to function as it does today.

### Key Entities *(include if feature involves data)*

- **Chat/Analysis Session**: A recorded AI analysis conversation. Key attributes include a unique identifier, title, timestamp, status, and the ordered set of messages exchanged.
- **History Entry**: A summary item shown in the chat history list. Key attributes include the chat identifier, title, preview text, date/time, and status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open any chat from the history list in under 2 seconds.
- **SC-002**: Direct links to a chat load correctly for 100% of valid chat identifiers.
- **SC-003**: 95% of users successfully return to a prior chat on the first attempt.
- **SC-004**: No chat history item appears active unless its corresponding chat is currently loaded in the workspace.

## Clarifications

### Session 2026-06-24

- **Q**: When the user is already on a chat-specific route and starts a new analysis, what should happen to the URL?  
  **A**: Navigate back to `/dashboard/ai-analysis/chat` (base route) as soon as a new analysis starts.
- **Q**: For an invalid or inaccessible chat id, what state should the user see?  
  **A**: Keep the URL and display an inline "chat not found" message inside the workspace.
- **Q**: When the chat history list is still loading and a direct link to a chat is opened, should the specific chat wait for the list or load independently?  
  **A**: Wait for the full history list to finish loading first, then load the specific chat.

## Assumptions

- The existing AI analysis chat page already supports fetching and displaying a list of previous chats.
- The backend can provide the full message history for a chat given its identifier.
- Users are authenticated and authorized to access the chats in their own history.
- Mobile-specific gestures are out of scope for this feature; the primary interaction is a click.
- Starting a new analysis while viewing a chat is a separate flow and should not be interrupted by the routing change.
