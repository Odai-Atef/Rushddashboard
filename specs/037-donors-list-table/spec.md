# Feature Specification: Donors List Table

**Feature Branch**: `038-donors-list-table`  
**Created**: 2026-06-08  
**Status**: Draft  
**Input**: User description: "[Rushd Frontend][Donors] Build donors list table in dashboard/donors with pagination"

## Clarifications

### Session 2026-06-08

- **Q1**: Should the donor detail view open as a side drawer or a centered modal? → **A**: Side drawer (recommended). Side drawer was selected as it better preserves the user's context and list state compared to a centered modal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Paginated Donors (Priority: P1)

As a dashboard user, I want to view a paginated list of donors so that I can quickly scan and find relevant funding organizations.

**Why this priority**: This is the core functionality of the feature. Without the ability to view donors in a structured table, no further interaction is possible.

**Independent Test**: Can be fully tested by loading the donors page and verifying the table displays donor data with pagination controls.

**Acceptance Scenarios**:

1. **Given** the user navigates to the donors dashboard page, **When** the page loads, **Then** a table is displayed with columns for Name, Type, Geographic Scope, Funding Areas, Contact, Source URL, and Last Updated.
2. **Given** there are more donors than the selected page limit, **When** the user interacts with pagination controls, **Then** the table updates to show the correct subset of donors without reloading the page.
3. **Given** the table is loading, **When** data is being fetched, **Then** a loading indicator is shown to the user.
4. **Given** no donors exist or no results match the current filters, **When** the table is rendered, **Then** an empty state message is displayed.

---

### User Story 2 - Search and Filter Donors (Priority: P2)

As a dashboard user, I want to search and filter the donors list so that I can narrow down results to find specific organizations by name, type, or funding area.

**Why this priority**: Search and filtering dramatically improve usability when the donor list grows beyond a few entries, enabling users to find relevant donors quickly.

**Independent Test**: Can be fully tested by entering a search term or selecting a filter and verifying the table updates to show only matching donors.

**Acceptance Scenarios**:

1. **Given** the donor list is displayed, **When** the user types a name in the search box, **Then** the table updates to show only donors whose names contain the search term.
2. **Given** the donor list is displayed, **When** the user selects a donor type from the filter dropdown, **Then** the table updates to show only donors of that type.
3. **Given** the donor list is displayed, **When** the user selects a funding area from the filter dropdown, **Then** the table updates to show only donors associated with that funding area.
4. **Given** multiple filters are applied, **When** the user changes or clears a filter, **Then** the table updates accordingly and all active filters are visually indicated.

---

### User Story 3 - View Donor Details (Priority: P3)

As a dashboard user, I want to click on a donor row to view full details so that I can review complete profile information, funding areas, and contact details in one place.

**Why this priority**: Provides quick access to detailed information without navigating away from the list, improving workflow efficiency.

**Independent Test**: Can be fully tested by clicking any row in the donors table and verifying a detail view opens with the donor's full profile, funding areas, and contact information.

**Acceptance Scenarios**:

1. **Given** the donor list is displayed, **When** the user clicks on a donor row, **Then** a detail view opens showing the donor's full profile including name, type, description, geographic scope, funding areas, contact details, website, and source URL.
2. **Given** the detail view is open, **When** the user closes it, **Then** the table remains visible with no page reload and the user's pagination/filter state is preserved.

---

### Edge Cases

- What happens when the API returns an error or is unreachable?
- How does the system handle very long donor names or descriptions in the table and detail view?
- What happens when a donor has no funding areas, contact information, or source URL?
- How does the system handle donors with names in Arabic (RTL text) mixed with Latin text?
- What happens when the user applies filters that result in zero matching donors?
- How does the system handle pagination when the user is on a high page number and then applies a restrictive filter?
- What happens when the user rapidly changes pagination or filter parameters?
- How does the system handle funding areas with very long names in tag/badge form?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated table of donors on the donors dashboard page.
- **FR-002**: System MUST fetch donor data from the backend API with pagination parameters (page and limit).
- **FR-003**: The table MUST display the following columns for each donor: Name, Type, Geographic Scope, Funding Areas (as tags/badges), Contact (phone and/or email), Source URL (as an external link icon), and Last Updated date.
- **FR-004**: System MUST provide pagination controls including Previous/Next buttons, clickable page numbers, and a selector to change items per page (options: 10, 25, 50).
- **FR-005**: System MUST support client-side search by donor name.
- **FR-006**: System MUST provide a filter dropdown for donor type.
- **FR-007**: System MUST provide a filter dropdown for funding area.
- **FR-008**: System MUST display funding areas as colored tags or badges within the table.
- **FR-009**: System MUST make the Source URL clickable, opening in a new browser tab with an external link icon.
- **FR-010**: System MUST allow users to click any table row to open a detail view (drawer or modal) showing the donor's full profile, funding areas, and contact information.
- **FR-011**: System MUST handle loading states by showing a loading indicator while data is being fetched.
- **FR-012**: System MUST handle empty states by displaying an appropriate message when no donors are available or no results match the applied filters.
- **FR-013**: System MUST handle API errors gracefully by displaying a user-friendly error message and providing a retry option.
- **FR-014**: System MUST render Arabic content correctly with RTL text direction support.
- **FR-015**: System MUST adapt the table layout for mobile devices (stacked or card-based view) and tablet devices (horizontal scroll).
- **FR-016**: System MUST perform search and filtering client-side on the currently loaded page of donor data.
- **FR-017**: System MUST open the donor detail view as a side drawer overlaying the donors list.

### Key Entities *(include if feature involves data)*

- **Donor**: Represents a funding organization. Key attributes include identifier, name, type (e.g., FOUNDATION), description, website, email, phone, geographic scope, source URL, source name, creation and update timestamps, and a collection of associated funding areas.
- **Funding Area**: Represents a category or domain of funding (e.g., charitable programs). Key attributes include identifier, name, and description. A donor may be associated with multiple funding areas.
- **Paginated Donor List**: A collection of donors returned by the API with metadata including total count, current page, page limit, and total pages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view and navigate through paginated donor lists with page changes completing in under 1 second.
- **SC-002**: Users can search and filter the donor list with results updating in under 1 second.
- **SC-003**: The donor table is fully usable on mobile devices with no horizontal scrolling required (except on tablet where horizontal scroll is acceptable).
- **SC-004**: Users can access a donor's full profile details with no more than one click from the list view.
- **SC-005**: 100% of displayed source URLs are clickable and open in a new tab.
- **SC-006**: All funding areas associated with a donor are visibly displayed as tags/badges in the table.
- **SC-007**: API errors are communicated to users with a clear message and a retry action.
- **SC-008**: Arabic donor names and content render correctly without truncation or layout issues.

## Assumptions

- Users accessing the donors page are authenticated and authorized to view donor data.
- The donor API returns data in the specified format and supports pagination via page and limit query parameters.
- The maximum page size supported by the API is 100 items.
- Client-side search and filtering will operate on the currently loaded page of data if the API does not support server-side filtering parameters.
- The application already has a dashboard layout with a sidebar where the donors navigation item can be added.
- RTL (right-to-left) layout support is available at the application level for Arabic content.
- Funding area colors for tags/badges can be assigned deterministically or from a predefined palette.
- The detail view (drawer or modal) will preserve the user's current list state (page, filters, search) when closed.

