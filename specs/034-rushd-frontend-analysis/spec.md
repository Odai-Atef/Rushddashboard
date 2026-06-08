# Feature Specification: AI Analysis API-Driven Category Filters

**Feature Branch**: `034-rushd-frontend-analysis`  
**Created**: 2026-06-08  
**Status**: Draft  
**Input**: User description: "[Rushd Frontend][AI Analysis] Replace modal filter buttons with API-driven category filters and keep All behavior"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open Modal and See Dynamic Categories (Priority: P1)

A user navigates to the AI Analysis dashboard and clicks the "New Analytics" button to open the analysis library modal. The modal should load category filter buttons dynamically from the backend API instead of using a hardcoded list. The user expects to see up-to-date categories reflecting what's configured on the server.

**Why this priority**: This is the core deliverable. Replacing hardcoded categories with live API data ensures the UI adapts to organizational configuration changes without code deployments.

**Independent Test**: Can be fully tested by opening the modal and observing that category buttons match a configurable backend dataset rather than a static constant.

**Acceptance Scenarios**:

1. **Given** the user is on the AI Analysis dashboard, **When** they click the "New Analytics" button, **Then** the modal opens and initiates a request to fetch analysis categories from the backend.
2. **Given** the backend returns a list of categories, **When** the modal renders the filter bar, **Then** buttons appear for each returned category in ascending order by sort order, alongside the existing "All" button.

---

### User Story 2 - Filter by Category and Show All (Priority: P1)

A user in the analysis library modal wants to narrow down available analyses by category (e.g., Sales, Customers, Operations). Clicking a category filters the displayed analysis cards to those matching the selected category. The user can also click the "All" button to remove filtering and view every available analysis card.

**Why this priority**: Filtering is the primary interaction inside the modal. The "All" reset is an expected baseline affordance that must remain intact.

**Independent Test**: Can be fully tested by clicking individual category buttons and verifying the card list updates; clicking "All" restores the unfiltered view.

**Acceptance Scenarios**:

1. **Given** the modal is open and categories are loaded, **When** the user clicks a specific category button, **Then** the analysis cards list updates to show only cards belonging to that category.
2. **Given** a category filter is active, **When** the user clicks the "All" button, **Then** the analysis cards list shows all cards regardless of category.
3. **Given** a search query is entered, **When** the user applies a category filter, **Then** both search and category filters apply together (intersection).

---

### User Story 3 - Handle Backend Unavailability Gracefully (Priority: P2)

If the backend is temporarily unreachable when the modal opens, the user should still be able to interact with the modal without the UI crashing or leaving the filter section blank.

**Why this priority**: Resilience is important for a smooth user experience, especially when network conditions are unstable.

**Independent Test**: Can be tested by blocking the category endpoint and verifying the modal still opens and behaves sensibly.

**Acceptance Scenarios**:

1. **Given** fetching categories fails or times out, **When** the modal opens, **Then** the category filter area shows a fallback state (e.g., an error message or retries) while preserving the "All" button and the rest of the modal content.
2. **Given** the backend eventually recovers, **When** a retry is triggered automatically or manually, **Then** the category buttons load successfully.

---

### Edge Cases

- What happens when the backend returns an empty list of categories?  
  → The "All" button should still be shown, and the card list displays all items unfiltered.
- What happens when there are analysis cards with a category that no longer exists in the backend response?  
  → Such cards are still valid; they are shown when "All" is selected, but they will not be reachable via a dedicated category button unless the backend re-adds that category.
- What happens if a category name or key contains special characters?  
  → The UI should render the name field safely as a label without breaking layout.
- How does the system handle very long category names?  
  → Buttons should either truncate gracefully or wrap without breaking the filter bar layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On opening the analysis library modal, the system MUST fetch current category data from the backend.
- **FR-002**: The system MUST render a category filter button for each category returned by the backend, using fields appropriate for display (e.g., name or localized name).
- **FR-003**: The existing "All" button MUST remain visible and functional, allowing users to view all analysis cards without category filtering.
- **FR-004**: Categories MUST be displayed in ascending order based on the `sortOrder` value provided by the backend.
- **FR-005**: Clicking a category button MUST filter the displayed analysis cards to those matching the selected category.
- **FR-006**: Clicking the "All" button MUST remove any active category filter and display all analysis cards.
- **FR-007**: If fetching categories from the backend fails, the system MUST handle the error gracefully so that the modal remains usable, with at minimum the "All" button still available.
- **FR-008**: The system MUST support concurrent application of search filtering and category filtering, such that both constraints narrow the displayed results together.

### Key Entities *(include if feature involves data)*

- **Category**: Represents an analysis category returned by the backend.
  - `id`: Unique identifier for the category.
  - `key`: Stable machine-friendly identifier used for matching against analysis cards.
  - `name`: Human-readable display name for the category.
  - `sortOrder`: Numeric value determining display order (ascending).
  - `count`: Number of analyses available in this category (optional; may be used for badges).
- **Analysis Card**: Existing entity representing an available analysis.
  - `id`, `title`, `description`, `category`, `estimatedTime`, `complexity`, `impact`, `icon`, `color`, etc.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see category filter buttons that reflect the latest backend configuration within 2 seconds of opening the modal under normal network conditions.
- **SC-002**: 100% of modal open events that successfully reach the backend render category buttons from the backend response instead of a hardcoded list.
- **SC-003**: Clicking the "All" button displays all available analysis cards regardless of how categories are configured in the backend.
- **SC-004**: If the backend is unreachable, the modal remains open and usable in 100% of observed cases, with the "All" button and search functionality still working.

## Assumptions

- The backend endpoint exposed at `GET /api/v1/analysis/categories` is already implemented and returns data in the expected shape.
- The current analysis cards already include a category field that aligns with the `key` or `id` returned by the category endpoint.
- Existing modal open/close behavior (backdrop, keyboard dismiss, animations) is not modified by this change.
- Internationalization of category names is handled by the backend returning the appropriate locale-specific name field.
- Icon display per category is not required; only the name and count from the backend are used for button rendering.
