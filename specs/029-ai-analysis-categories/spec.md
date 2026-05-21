# Feature Specification: AI Analysis Categories

  **Feature Branch**: `029-ai-analysis-categories`  

**Created**: 2026-05-21  
**Status**: Draft  
**Input**: User description: "Fill /dashboard/ai-analysis categories from GET /api/v1/analysis/categories"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Category Loading (Priority: P1)

As a dashboard user, when I visit the AI Analysis page (`/dashboard/ai-analysis`) and click on **تحليل جديد**, I want the category selection modal to display categories that are dynamically loaded from the backend, so that I always see the most up-to-date and accurate list of available analysis categories.

**Why this priority**: This is the core deliverable of the ticket. Without dynamic loading, the modal will continue to show stale or incorrect categories, leading to confusion and potential selection of unsupported analysis types.

**Independent Test**: A user can open the AI Analysis page, click **تحليل جديد**, and observe that the categories displayed match the current backend configuration. This can be verified even if analysis execution is handled separately.

**Acceptance Scenarios**:

1. **Given** the backend has categories configured with `sortOrder`, `nameAr`, and `count`, **When** the user opens the AI Analysis page and clicks **تحليل جديد**, **Then** the modal displays categories in the order specified by `sortOrder`, with Arabic labels and counts matching the API response.
2. **Given** the backend returns an empty category list, **When** the user opens the modal, **Then** an appropriate empty state is displayed instead of the category grid.
3. **Given** the backend category API is temporarily unavailable, **When** the user opens the modal, **Then** an error state is displayed informing the user that categories could not be loaded.

---

### User Story 2 - Category Filtering with Dynamic Data (Priority: P2)

As a dashboard user, when categories are loaded dynamically, I want the existing category filter buttons (chips) on the AI Analysis page to reflect the API-driven data, including counts and correct labels, so that I can filter analysis results accurately.

**Why this priority**: While less critical than the modal itself, maintaining parity between the category filters and the modal ensures a consistent user experience across the page.

**Independent Test**: A user can see category filter buttons on the AI Analysis page rendered from API data, with counts and labels matching the backend. Filtering behavior can be tested independently of analysis execution.

**Acceptance Scenarios**:

1. **Given** categories are successfully loaded from the API, **When** the AI Analysis page renders, **Then** the category filter buttons display the Arabic name and count for each category.
2. **Given** the user clicks a category filter button, **When** the selection changes, **Then** the filter state updates correctly and the UI reflects the selected category using its stable `key`.
3. **Given** the API response is still loading, **When** the page renders, **Then** a loading state is shown for the category filter section.

---

### User Story 3 - Resilient Category UI (Priority: P3)

As a dashboard user, I want the category selection UI to remain functional and visually intact even when some category fields (like `icon` or `description`) are missing or null, so that partial data does not break the page.

**Why this priority**: This ensures robustness against incomplete backend data and maintains a high-quality user experience in edge cases.

**Independent Test**: A backend response with categories missing `icon` or `description` fields can be mocked, and the frontend should still render gracefully without crashes.

**Acceptance Scenarios**:

1. **Given** a category in the API response has a null `icon`, **When** the category is rendered, **Then** a default or fallback visual is used, or the icon is omitted without layout issues.
2. **Given** a category has null `description` and `descriptionAr`, **When** any tooltip or detail view is triggered, **Then** it handles the absence gracefully (e.g., no tooltip shown).

---

### Edge Cases

- What happens when the `GET /api/v1/analysis/categories` request times out?
- How does the system handle a category with `count: 0`? Should it still be displayed?
- How does the system behave if the backend returns categories with duplicate `sortOrder` values?
- What happens if the user switches language after categories are loaded? (Assumption: handled by existing i18n framework)
- How does the frontend handle the "الكل" (All) option if the API response changes? Is it always pinned first?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST fetch the list of analysis categories from the backend when the `/dashboard/ai-analysis` page loads.
- **FR-002**: The system MUST replace all hardcoded category filter buttons with dynamically rendered buttons driven by the API response.
- **FR-003**: The system MUST render categories in the order specified by the `sortOrder` field returned by the API.
- **FR-004**: The system MUST display the Arabic category label (`nameAr` or `name` as a fallback) in the UI where Arabic is the current language.
- **FR-005**: The system MUST display the category item count (`count`) on each category filter button when available.
- **FR-006**: The system MUST preserve the existing "الكل" (All) aggregate option in the frontend category filters, as it is a UI-level construct not returned by the API.
- **FR-007**: The system MUST show a loading state while categories are being fetched from the API.
- **FR-008**: The system MUST show an empty state if the API returns zero categories.
- **FR-009**: The system MUST show an error state if the request to fetch analysis categories from the backend fails.
- **FR-010**: The system MUST remain resilient if optional fields (`icon`, `description`, `descriptionAr`) are null or omitted in the API response.
- **FR-011**: The system MUST use the `id` field as a stable frontend key when needed.
- **FR-012**: The system MUST use the `key` field as the internal category identifier for selection and filtering logic.

### Key Entities *(include if feature involves data)*

- **AnalysisCategory**: Represents an available category for AI analysis. Attributes: `id` (stable frontend key), `key` (internal identifier), `name` (default label), `nameAr` (Arabic label), `description` (default description), `descriptionAr` (Arabic description), `icon` (optional icon reference), `sortOrder` (display order), `count` (item count for display).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users opening the `/dashboard/ai-analysis` page and clicking **تحليل جديد** see categories that 100% match the current backend configuration.
- **SC-002**: Zero hardcoded category names exist in the frontend code for the `/dashboard/ai-analysis` page category rendering logic.
- **SC-003**: Categories are displayed in the exact order provided by the API (`sortOrder`), verified by automated or manual UI inspection.
- **SC-004**: Category counts shown in the UI match the `count` field from the API response with 100% accuracy.
- **SC-005**: Loading, empty, and error states are displayed within 1 second of the respective API state occurring.
- **SC-006**: The existing styling, layout, and selection behavior of category chips/buttons is preserved; visual regression testing passes if available.

## Assumptions

- The existing frontend has an established API service/hook pattern (e.g., React Query, SWR, or custom hooks) that should be reused for fetching categories.
- The "الكل" (All) option is purely a UI-level aggregate and is not expected to be returned by the backend API.
- The project's i18n strategy already handles Arabic label display; this feature aligns with that existing pattern.
- The backend API endpoint `GET /api/v1/analysis/categories` is already implemented and available in the target environment.
- Analysis cards, results, and history integration are explicitly out of scope and handled in separate tickets.
- Category `icon` rendering is tied to the existing UI implementation; if no icon system exists, the field is gracefully ignored.
