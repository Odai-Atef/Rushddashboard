# Feature Specification: Dynamic Analysis Cards in Modal

**Feature Branch**: `036-rushd-frontend-analysis`  
**Created**: 2026-06-08  
**Status**: Draft  
**Input**: User description: "[Rushd Frontend][AI Analysis] Load modal analysis cards by category API instead of hardcoded boxes"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Analysis Cards by Category (Priority: P1)

As a user viewing the AI Analysis dashboard, when I click "New Analytics" to open the modal and select a category filter, I want the modal to display analysis cards relevant to that category so that I can quickly discover and initiate the right type of analysis.

**Why this priority**: This is the core behavior of the ticket. Without it, the modal shows stale or irrelevant hardcoded content, which blocks users from discovering available analyses accurately.

**Independent Test**: Can be fully tested by opening the modal, selecting a category, and verifying that all displayed cards match the returned API data for that category.

**Acceptance Scenarios**:

1. **Given** the user is on `/dashboard/ai-analysis`, **When** the user clicks "New Analytics" and selects a specific category filter, **Then** the system calls `GET /api/v1/analysis/categories/$CATEGORY_ID/library-items` and renders the returned active items as cards sorted by `sortOrder` ascending.
2. **Given** the API returns library items with fields such as `titleAr`, `descriptionAr`, `icon`, `iconBackground`, `complexity`, `impact`, `duration`, and `badges`, **When** the modal renders, **Then** the Arabic title and description are shown in the Arabic UI, the icon is resolved from the string value, the icon background uses the API-provided gradient, and metadata (complexity, impact, duration, badges) are visible on each card.
3. **Given** the API response includes items where `isActive` is `false`, **When** the modal renders, **Then** inactive items are not displayed.

---

### User Story 2 - Browse All Analysis Cards (Priority: P2)

As a user viewing the AI Analysis dashboard, when I click "New Analytics" to open the modal and keep the "All" filter selected, I want the modal to display all active analysis cards across all categories so that I can explore the full library without switching filters.

**Why this priority**: The existing "All" filter behavior must be preserved, but it should no longer rely on hardcoded cards. Moving it to dynamic data ensures consistency and maintainability.

**Independent Test**: Can be fully tested by opening the modal with the "All" filter selected and verifying that the displayed cards are sourced dynamically (aggregated across categories via backend support) rather than from hardcoded definitions.

**Acceptance Scenarios**:

1. **Given** the modal is open and the "All" filter is selected, **When** the modal renders, **Then** it does not fall back to hardcoded boxes and instead shows all active library items across categories using a backend-supported aggregation approach.
2. **Given** the aggregated list contains items from multiple categories, **When** the cards are rendered, **Then** they remain sorted by `sortOrder` ascending and inactive items are excluded.

---

### User Story 3 - Interact with a Dynamic Analysis Card (Priority: P3)

As a user viewing dynamic analysis cards in the modal, when I click a card, I want the existing click flow and modal interaction to continue working exactly as before so that my workflow is not disrupted.

**Why this priority**: Preserving existing UX is a requirement. The card click behavior must remain intact even though the card data now comes from an API.

**Independent Test**: Can be fully tested by clicking a rendered card and verifying that the same subsequent actions (e.g., opening analysis details, starting a new analysis) occur as they did with hardcoded cards.

**Acceptance Scenarios**:

1. **Given** the modal displays a dynamic analysis card, **When** the user clicks the card, **Then** the existing modal interaction and downstream click flow are triggered without regression.

---

### Edge Cases

- What happens when the selected category has no active library items? The modal should display an empty state indicating no analyses are available.
- How does the system handle an API failure when fetching library items for a category? The system should display a user-friendly error or retry option without breaking the modal.
- What happens if the API returns an `icon` string that does not map to any known frontend icon component? The system should render a sensible fallback icon.
- How does the system handle a category filter change while a previous request is still in flight? The system should cancel or ignore the stale request and reflect the latest selection.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When the user opens the "New Analytics" modal, the system MUST display category filters already loaded from the categories API flow.
- **FR-002**: When the user selects a specific category filter, the system MUST call `GET /api/v1/analysis/categories/$CATEGORY_ID/library-items` using the real `categoryId` of the selected category.
- **FR-003**: The system MUST render analysis cards in the modal using the returned API data instead of hardcoded box definitions for any selected category.
- **FR-004**: Each card MUST render fields sourced from the API response: `id`, `categoryId`, `key`, `title`, `titleAr`, `description`, `descriptionAr`, `complexity`, `impact`, `duration`, `badges`, `sortOrder`, `isActive`, `icon`, and `iconBackground`.
- **FR-005**: In the Arabic UI, the system MUST prefer `titleAr` and `descriptionAr` for display when available.
- **FR-006**: The system MUST sort displayed cards by `sortOrder` in ascending order.
- **FR-007**: The system MUST exclude items where `isActive` is `false`.
- **FR-008**: The system MUST resolve the API `icon` string to the corresponding frontend icon component.
- **FR-009**: The system MUST apply the API-provided `iconBackground` value to the icon background style instead of using hardcoded gradient classes.
- **FR-010**: When the "All" filter is selected, the system MUST not use hardcoded card definitions and MUST instead display all active library items across categories using a backend-supported dynamic approach.
- **FR-011**: The existing modal UX and click flow MUST be preserved after switching to API-driven cards.

### Key Entities *(include if feature involves data)*

- **Analysis Library Item**: Represents a single analysis type available to the user. Key attributes include `id`, `categoryId`, `key`, `title`, `titleAr`, `description`, `descriptionAr`, `complexity`, `impact`, `duration`, `badges`, `sortOrder`, `isActive`, `icon`, and `iconBackground`.
- **Category Filter**: Represents an analysis category used to scope library items. Identified by `categoryId` and already loaded via the existing categories API flow.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see category-specific analysis cards within 2 seconds of selecting a category filter in the modal.
- **SC-002**: 100% of displayed cards in the modal are sourced from the API; zero hardcoded cards remain for category-filtered or "All" views.
- **SC-003**: Inactive library items are never shown; active item display accuracy is 100%.
- **SC-004**: Cards are consistently ordered by `sortOrder` ascending with no visible misordering.
- **SC-005**: Arabic title and description fields render correctly for users in the Arabic UI without truncation or layout breakage.
- **SC-006**: Existing modal interactions (open, filter, click card, close) continue to work with no functional regression.

## Assumptions

- The categories API flow that populates filter options is already functional and does not require changes.
- The backend supports either per-category library-item endpoints or an aggregated endpoint suitable for the "All" filter.
- The frontend has a mapping mechanism (or will create one) to resolve API icon names to icon components.
- Standard loading, empty-state, and error-handling patterns will be applied when fetching library items.
- Arabic UI locale detection is already implemented and available for choosing `titleAr` / `descriptionAr`.
