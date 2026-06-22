# Feature Specification: ISIV Charity Assessment Results API

**Feature Branch**: `060-isiv-results-api`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "Page: src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx API: GET /api/v1/onboarding/assessments/{organizationId}/isiv-results Priority: High"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Live ISIV Assessment Results (Priority: P1)

As a charity representative, I want the assessment results page to display my organization's live ISIV evaluation data so that I can trust the readiness score, qualification status, and dimension breakdowns are current rather than sample values.

**Why this priority**: The results page is the primary deliverable after completing an assessment; showing live data instead of hardcoded sample data is essential for credibility and decision-making.

**Independent Test**: Open the charity assessment results page for an organization that has completed an ISIV assessment and verify that the overall score, readiness badge, qualification message, radar chart, strengths, and gaps are all sourced from the backend API.

**Acceptance Scenarios**:

1. **Given** the user navigates to `/dashboard/charity-assessment/results/:organizationId` and the ISIV results API returns successfully, **When** the page renders, **Then** the overall score and readiness badge reflect `overallScore`, and the qualification section shows `qualificationStatus` with `qualificationMessage`.
2. **Given** the ISIV results API returns `radarData`, `strengths`, and `weaknesses`, **When** the page renders, **Then** the radar chart, strengths list, and gaps list display API data instead of the hardcoded sample data.
3. **Given** the ISIV results API returns `benchmarks`, **When** the benchmark bar chart renders, **Then** it shows "منظمتك", "متوسط القطاع", and "أفضل ممارسة" values from the API.
4. **Given** the ISIV results API fails or is unreachable, **When** the page renders, **Then** an Arabic error message is shown instead of the hardcoded score and charts.

---

### User Story 2 - Track Progress Over Time (Priority: P2)

As a charity representative, I want the results page to show a monthly progress line chart when historical trend data exists, so that I can see how my organization's readiness has evolved.

**Why this priority**: Progress tracking adds useful context but depends on backend support for historical data, which may not be available in the initial API contract.

**Independent Test**: Load the results page for an organization whose API response includes `progressData`; verify the line chart renders with the provided monthly scores. If the response omits progress data, verify the section is hidden.

**Acceptance Scenarios**:

1. **Given** the API returns `progressData` with monthly entries, **When** the page renders, **Then** a line chart plots the readiness score over the returned months.
2. **Given** the API response does not include `progressData`, **When** the page renders, **Then** the progress tracking section is hidden and no hardcoded five-month sample chart is shown.

---

### User Story 3 - Understand Strengths and Improvement Areas (Priority: P1)

As a charity representative, I want the strengths and gaps sections to accurately reflect my organization's assessment so that I know where we excel and what to improve.

**Why this priority**: Strengths and gaps drive the action-oriented next steps; they must match the API evaluation rather than the generic sample list.

**Independent Test**: Compare the rendered strengths and gaps cards with the API response; confirm each card's title, score, severity color, and recommendation match the corresponding API item.

**Acceptance Scenarios**:

1. **Given** the API returns a `strengths` array, **When** the strengths section renders, **Then** each item shows the category, insight, and score with a green visual theme.
2. **Given** the API returns a `weaknesses` array with `severity` values, **When** the gaps section renders, **Then** each weakness is color-coded as critical (red), high (orange), or medium/low (yellow), and includes the issue and recommendation.

---

### Edge Cases

- What happens when the `organizationId` parameter is missing from the URL? The page must display an Arabic error message and must not call the API with an invalid identifier.
- What happens when the API returns a 200 with an empty body or missing fields? The page must gracefully render empty states or zero/fallback values without crashing.
- How does the system handle a network error, 5xx, or 4xx response? It must display an Arabic error message and optionally provide a retry mechanism.
- What happens while data is loading? A centered loading spinner must be shown until the API response is received.
- What happens if `progressData` is missing from the API response? The progress tracking section must be hidden rather than rendering hardcoded months.
- What happens to the existing `charity-assessment-data.ts` sample file? It must remain available for the wizard page that still uses it, and only the results page must stop importing its hardcoded values.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The charity assessment results page MUST fetch ISIV evaluation data from `GET /api/v1/onboarding/assessments/{organizationId}/isiv-results` when it mounts, where `{organizationId}` comes from the route parameter.
- **FR-002**: The page MUST display the `overallScore` returned by the API in the overall score card and compute the readiness badge label and color based on the score thresholds (≥85 متميز, ≥70 جاهز, ≥55 متوسط, otherwise يحتاج تحسين).
- **FR-003**: The page MUST display `qualificationStatus` and `qualificationMessage` (when present) in the qualification section.
- **FR-004**: The radar chart MUST render using the `radarData` array from the API, showing the organization's dimension scores against a 0–100 reference ring.
- **FR-005**: The benchmark bar chart MUST render using the `benchmarks` object from the API with three bars representing "منظمتك", "متوسط القطاع", and "أفضل ممارسة".
- **FR-006**: The strengths section MUST render using the `strengths` array returned by the API, with each item showing category, insight, and score.
- **FR-007**: The gaps section MUST render using the `weaknesses` array returned by the API, mapping each item's `severity` to the predefined color scheme.
- **FR-008**: The progress tracking line chart MUST render only when the API returns `progressData`; otherwise the section MUST be hidden.
- **FR-009**: The page MUST show a centered loading spinner while ISIV results are loading.
- **FR-010**: The page MUST show an Arabic error message when the API request fails or when `organizationId` is missing or invalid.
- **FR-011**: The page MUST show an empty-state message such as "لا توجد نتائج" when the API returns no evaluation data.
- **FR-012**: All hardcoded sample data imports in `CharityAssessmentResultsPage.tsx` MUST be replaced with the live hook data.
- **FR-013**: The existing `charity-assessment-data.ts` file MUST be preserved for use by the assessment wizard page.

### Key Entities *(include if feature involves data)*

- **IsivAssessmentResult**: The top-level evaluation snapshot containing `overallScore`, `qualificationStatus`, `qualificationMessage`, `radarData`, `strengths`, `weaknesses`, and `benchmarks`.
- **RadarDatum**: A single dimension score used by the radar chart, containing a category name, an organization score, and a full-mark reference value.
- **Strength**: A positively scored assessment area containing category, insight, and score.
- **Weakness**: An underperforming assessment area containing category, severity, issue, and recommendation.
- **Benchmarks**: A three-value comparison containing the organization's score, the sector average, and the top-performer score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see an assessment results page where the overall score, readiness badge, qualification message, radar chart, strengths, and gaps are all sourced from the live ISIV results API, with no hardcoded values visible in those sections.
- **SC-002**: The results page loads and renders the primary evaluation sections within 3 seconds under normal network conditions.
- **SC-003**: All readiness score ranges correctly map to the Arabic readiness labels and badge colors.
- **SC-004**: Weakness severity levels correctly map to the predefined color scheme in at least 95% of rendered cases.
- **SC-005**: The page continues to display a meaningful state (spinner, empty state, or Arabic error message) when the API fails, returns incomplete data, or the route parameter is missing.
- **SC-006**: The assessment wizard page continues to function correctly because the shared sample data file remains available.

## Assumptions

- The ISIV results endpoint is already implemented and returns the response shape described by the backend service contract.
- The existing JWT-based authorization mechanism attaches the required `Authorization` header automatically.
- The assessment results route is `/dashboard/charity-assessment/results/:organizationId` and `organizationId` is extracted from the URL.
- Historical progress trend data is not part of the primary ISIV results contract and will be hidden until the backend provides it.
- Sector comparison percentage and progress since last evaluation are not available from the API and will be removed or hidden rather than shown as hardcoded values.
- The results page currently uses Recharts for charts, and the same library will continue to render API-driven chart data.
