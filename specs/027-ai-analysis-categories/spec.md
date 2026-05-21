# Feature Specification: AI Analysis Dynamic Categories

**Feature Branch**: `[027-ai-analysis-categories]`
**Created**: 2026-05-21
**Status**: Draft
**Input**: User description: "[Rushd][Frontend][AI Analysis] Fill /dashboard/ai-analysis categories from GET /api/v1/analysis/categories"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Dynamic AI Analysis Categories (Priority: P1)

As a dashboard user navigating to the AI Analysis page, I want to see an up-to-date list of analysis categories fetched from the system so that I always filter by the latest categories relevant to my organization.

**Why this priority**: This is the core value of the feature. Without dynamic categories, users could be shown stale or mismatched filter options that do not reflect the current analysis taxonomy configured in the backend.

**Independent Test**: Can be fully tested by loading /dashboard/ai-analysis and verifying that the category filters list is rendered from the API and not hardcoded.

**Acceptance Scenarios**:

1. **Given** the user navigates to /dashboard/ai-analysis, **When** the page loads, **Then** the category filter chips/buttons are fetched from the backend API and displayed in the order provided by `sortOrder`.
2. **Given** the backend returns categories, **When** the UI renders the chips, **Then** each category chip shows the correct localized label (using `nameAr` when appropriate) and the associated `count`.
3. **Given** the backend returns categories, **When** the UI renders the chips, **Then** an aggregate "الكل" chip is still offered alongside the API categories as a UI-level option.

---

### User Story 2 - Select and Filter by Category (Priority: P1)

As a dashboard user, I want to tap/click a category chip to filter the analysis results to that category so that I focus only on the analysis area I care about.

**Why this priority**: Selecting a category should continue to work seamlessly after moving from hardcoded data to API-driven data.

**Independent Test**: Can be tested by selecting any category chip and confirming the analysis view applies the selected filter.

**Acceptance Scenarios**:

1. **Given** the category chips have loaded from the API, **When** the user selects a specific category chip, **Then** the corresponding `key` is used as the filter value for the analysis view.
2. **Given** the user selects the "الكل" chip, **When** the filter is applied, **Then** the analysis view shows results for all categories.
3. **Given** the user switches between categories, **When** the selection changes, **Then** the selected chip is visibly highlighted and the analysis view updates accordingly.

---

### User Story 3 - Handle Loading, Empty, and Error States (Priority: P2)

As a dashboard user, I want clear feedback when categories are loading, unavailable, or failed to load so that I understand the UI state and can retry if needed.

**Why this priority**: This protects UX when network conditions are slow or backend data changes.

**Independent Test**: Can be tested by simulating slow network, empty API response, and API failure scenarios.

**Acceptance Scenarios**:

1. **Given** the categories are being fetched, **When** the user views the category section, **Then** a loading state indicator is shown without blocking the rest of the AI Analysis page.
2. **Given** the API returns an empty category list, **When** the category section renders, **Then** an empty state is displayed to communicate that no categories are available.
3. **Given** the API request fails, **When** the error occurs, **Then** an error state is displayed with a user-friendly message and a way to retry fetching categories.

---

### User Story 4 - Resilient Rendering of Optional Fields (Priority: P3)

As a dashboard user, I want the category chips to render correctly even when some API fields are missing or empty so that the UI is robust to partial data.

**Why this priority**: Backend data quality may evolve, and the frontend should degrade gracefully rather than break.

**Independent Test**: Can be tested by providing API responses where `icon`, `description`, and `descriptionAr` are null or omitted.

**Acceptance Scenarios**:

1. **Given** a category object with a null or empty `icon`, **When** the chip renders, **Then** the chip displays without an icon without breaking layout.
2. **Given** a category object with null or empty `description`, **When** the chip renders, **Then** no tooltip or detail is shown; the label and count remain visible.
3. **Given** a category object with a missing `count`, **When** the chip renders, **Then** the chip is shown without a count badge or with a fallback to zero, without layout errors.

---

### Edge Cases

- What happens if the `sortOrder` values are duplicate, missing, or out of a predictable range?
- How should the page behave if the category `nameAr` is missing while the UI language requires Arabic?
- What happens if the API returns categories after the user has already selected an aggregate view?
- How should the UI behave if the total number of categories is very large (e.g., more than 20)?
- What should happen if the "الكل" count needs to reflect a summation or a separate backend value?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The AI Analysis page MUST fetch the list of categories from `GET /api/v1/analysis/categories` on page load.
- **FR-002**: The fetched categories MUST be rendered as filter chips/buttons, ordered by the API-provided `sortOrder` in ascending order.
- **FR-003**: Each category chip MUST display a localized label using `nameAr` when the UI is in Arabic, and `name` otherwise.
- **FR-004**: Each category chip MUST display the corresponding `count` value from the API, if available.
- **FR-005**: The existing "الكل" aggregate filter option MUST remain available as a UI-level chip when applicable, even though it is not returned by the API.
- **FR-006**: The selected category filter MUST use the category `key` as the internal filter identifier.
- **FR-007**: While categories are loading, the category section MUST show a loading state without blocking the rest of the page.
- **FR-008**: If the API returns an empty list of categories, the category section MUST show an empty state.
- **FR-009**: If the API request fails, the category section MUST show an error state with a user-friendly message and an option to retry.
- **FR-010**: If `icon`, `description`, or `descriptionAr` are null or empty, the UI MUST render gracefully without broken layout or missing elements.
- **FR-011**: All hardcoded/mock category data currently embedded in the AI Analysis page MUST be removed.
- **FR-012**: The category selection/filter interaction MUST continue to work exactly as before (highlighting, clearing, switching).

### Key Entities *(include if feature involves data)*

- **Analysis Category**: Represents a single analysis filter domain. Key attributes are `id`, `key`, `name`, `nameAr`, `description`, `descriptionAr`, `icon`, `sortOrder`, and `count`.
- **AI Analysis Page**: The `/dashboard/ai-analysis` view that hosts the category filters and analysis results.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of category chips displayed on /dashboard/ai-analysis are sourced from the API; zero hardcoded category data remains in production.
- **SC-002**: Categories render within 1 second after the API response is received under normal network conditions.
- **SC-003**: After loading, categories are ordered by `sortOrder`; users can verify the first and last items match the API order.
- **SC-004**: The page correctly handles loading, empty, and error states in 100% of simulated test scenarios.
- **SC-005**: Category selection and filter interaction retain the same UX as before the migration, confirmed by manual QA.

## Assumptions

- The backend API returns categories as an array in a single request; pagination is not required for the initial implementation.
- The UI language strategy already exists and can be relied upon to choose between `name` and `nameAr`.
- The "الكل" option is a frontend-only aggregate and does not exist in the backend response.
- `sortOrder` values are integers that define ascending display order; ties do not need custom tie-breaking.
- The existing frontend API service or hook patterns will be reused for consistency.
