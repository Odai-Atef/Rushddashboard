# Feature Specification: Dynamic Assessment Categories

**Feature Branch**: `[###-feature-name]`
**Created**: Mon Jun 15 2026
**Status**: Draft
**Input**: User description: "The assessment screen (step 4) uses hardcoded categories and questions in CharityOnboardingFlow.tsx. The 9 categories and their questions are hardcoded as JavaScript objects. When the backend assessment seed changes (e.g., from 9 categories to 4 categories, or questions updated), the frontend becomes out of sync. The frontend must fetch categories and questions dynamically from the API."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Load assessment categories dynamically from API (Priority: P1)

As a charity administrator taking the readiness assessment, when I reach the assessment step, the system should load the current list of assessment categories and their questions from the backend so that the assessment always reflects the latest evaluation criteria rather than a hardcoded, potentially outdated set.

**Why this priority**: Hardcoded categories and questions cause the frontend to break or display stale content whenever the backend assessment seed changes. Dynamically loading from the API ensures the assessment stays synchronized with backend changes without requiring code deployments.

**Independent Test**: Can be fully tested by loading the assessment screen and verifying that the category tabs and questions match those returned by the API, rather than a hardcoded list.

**Acceptance Scenarios**:

1. **Given** a user on the assessment step, **When** the screen loads, **Then** the system fetches categories and questions from the backend and displays them instead of hardcoded content.
2. **Given** a system where the backend assessment seed has changed (e.g., categories reduced from 9 to 4), **When** a user loads the assessment step, **Then** the user sees the updated categories and questions without any frontend code changes.
3. **Given** a user waiting for assessment data to load, **When** the fetch is in progress, **Then** a loading indicator is shown and the assessment form is not displayed prematurely.

---

### User Story 2 - Render questions based on dynamic type (Priority: P2)

As a charity administrator answering assessment questions, I want each question to be presented with the appropriate input control (rating scale, yes/no toggle, checkbox options, or file upload) based on its type, so that I can respond accurately regardless of how questions are configured in the backend.

**Why this priority**: The assessment may include different question types beyond simple text. Supporting SCALE, YES_NO, MULTIPLE_CHOICE, and FILE_UPLOAD enables the backend to configure richer assessments without frontend changes.

**Independent Test**: Can be tested by configuring backend questions with different `questionType` values and verifying that each type renders the correct input control and stores answers in the expected format.

**Acceptance Scenarios**:

1. **Given** an assessment category containing a SCALE question, **When** it is rendered, **Then** the user sees a 1-5 rating input and can select a single numeric value.
2. **Given** an assessment category containing a YES_NO question, **When** it is rendered, **Then** the user sees a yes/no toggle and can select a single boolean or string value.
3. **Given** an assessment category containing a MULTIPLE_CHOICE question, **When** it is rendered, **Then** the user sees checkbox options from the API and can select multiple values.
4. **Given** an assessment category containing a FILE_UPLOAD question, **When** it is rendered, **Then** the user sees a file upload input and can attach a file.

---

### User Story 3 - Store answers by question ID (Priority: P2)

As a charity administrator, when I answer assessment questions, I want my responses to be reliably tracked using the question's unique identifier so that answers are not lost or misattributed when the assessment structure changes.

**Why this priority**: Using question IDs as keys decouples answer storage from question order or text. If the backend reorders or rewords questions, answers remain correctly mapped.

**Independent Test**: Can be tested by answering questions, then inspecting the answer state to confirm each response is keyed by the corresponding question ID.

**Acceptance Scenarios**:

1. **Given** a user who selects answers for multiple questions, **When** the system stores the responses, **Then** each answer is indexed by the question's unique identifier.
2. **Given** a backend that reorders or renames questions, **When** a user reloads the assessment, **Then** their previously stored answers are still matched to the correct questions by ID.

---

### Edge Cases

- What happens if the categories API returns an empty array? The system should show a friendly message indicating there are no assessment categories available.
- What happens if a question type returned by the API is not recognized by the frontend? The system should render a placeholder or skip that question gracefully without crashing.
- What happens if the API returns a category with no questions? The system should display the category tab but indicate that there are no questions to answer.
- What happens if the user navigates away while categories are loading? The system should cancel or ignore stale fetch results to prevent memory leaks or state inconsistencies.
- What happens if `options` is null for a SCALE or YES_NO question? The system should still render the appropriate default controls.
- What happens if `options.choices` is empty for a MULTIPLE_CHOICE question? The system should show an empty options message rather than broken checkboxes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST fetch assessment categories and their questions from the backend API when the assessment screen mounts.
- **FR-002**: The system MUST render category tabs dynamically from the API response rather than using a hardcoded array.
- **FR-003**: The system MUST render each question using the input control appropriate for its `questionType` (SCALE, YES_NO, MULTIPLE_CHOICE, FILE_UPLOAD).
- **FR-004**: The system MUST store user answers keyed by question ID.
- **FR-005**: The system MUST display a loading indicator while fetching categories and MUST not show the assessment form during this time.
- **FR-006**: The system MUST handle an empty categories list gracefully by showing an informative message.
- **FR-007**: The system MUST preserve tab navigation between categories and progress indicators regardless of the number of categories.
- **FR-008**: The system MUST handle unrecognized question types gracefully without crashing.

### Key Entities *(include if feature involves data)*

- **Assessment Category**: Represents a thematic grouping of questions in the assessment. Attributes include identifier, name, display order, icon reference, color, and an embedded array of questions.
- **Assessment Question**: An individual evaluative item within a category. Attributes include identifier, display text, question type, options, required flag, and sort order.
- **Question Options**: Configuration for MULTIPLE_CHOICE questions containing an array of selectable labels. Null or absent for SCALE and YES_NO questions.
- **Answer State**: A collection mapping question identifiers to user-provided responses. The value format depends on question type (numeric for SCALE, boolean/string for YES_NO, array for MULTIPLE_CHOICE, file reference for FILE_UPLOAD).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of assessment screens load categories and questions from the API within 2 seconds of entering the assessment step.
- **SC-002**: Zero frontend deployments required when backend assessment categories or questions change.
- **SC-003**: 100% of supported question types (SCALE, YES_NO, MULTIPLE_CHOICE, FILE_UPLOAD) render the correct input control.
- **SC-004**: Users can complete assessments with up to 50 questions without performance degradation or UI freezing.
- **SC-005**: Zero hardcoded categories or questions remain in the assessment screen after this feature is implemented.

## Assumptions

- The backend API for assessment categories (`GET /api/v1/onboarding/assessment/categories`) is already implemented and returns a stable schema.
- The `questionType` field uses the exact values `SCALE`, `YES_NO`, `MULTIPLE_CHOICE`, and `FILE_UPLOAD`.
- Icons referenced by category records are available in the frontend icon set (e.g., Lucide) and can be resolved by name.
- Users are authenticated via JWT before reaching the assessment step.
