# Feature Specification: Scale Score Descriptions

**Feature Branch**: `061-scale-score-comments`  
**Created**: 2026-06-22  
**Status**: Draft  
**Input**: User description: "at this page /dashboard/onboarding/assessment?organizationId I want to update the description of scale score which changed on hover or click by calling this api which return list of question comments the list of key object the key is the question id and have 5 objects which map the score from 0 to 5 as CRITICAL EMERGING MEDIUM ADVANCED PIONEER /api/v1/onboarding/evaluation-comments"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Contextual Score Descriptions (Priority: P1)

As a user completing the onboarding assessment, when I hover over or click/select a score on a question's scale, I see a short description that explains what that score means for the question.

**Why this priority**: This is the core value of the feature — it helps users understand the meaning of each score before committing to an answer, improving answer quality and user confidence.

**Independent Test**: A user can open the assessment page, interact with a score for any question, and immediately see a relevant contextual description.

**Acceptance Scenarios**:

1. **Given** an assessment question is visible with a score scale, **When** the user hovers over or selects a score, **Then** a description for that score is displayed next to or near the scale.
2. **Given** multiple questions are shown on the page, **When** the user interacts with a score on a different question, **Then** the description shown belongs to that specific question and score.

---

### User Story 2 - Display Localized Comment Text (Priority: P2)

As a user completing the onboarding assessment, the score description I see is in the same language I have selected for the application.

**Why this priority**: Supporting the user's chosen language ensures clarity and accessibility, which directly affects comprehension during assessment.

**Independent Test**: A user can change the application language and see score descriptions rendered in the corresponding language (Arabic or English) without restarting the assessment.

**Acceptance Scenarios**:

1. **Given** the application language is set to Arabic, **When** the user hovers over or selects a score, **Then** the Arabic comment text is displayed.
2. **Given** the application language is set to English, **When** the user hovers over or selects a score, **Then** the English comment text is displayed.

---

### User Story 3 - Graceful Fallback When Comments Are Missing (Priority: P3)

As a user completing the onboarding assessment, if evaluation comments are not available for a question or score, my experience is not disrupted by errors or blank UI areas.

**Why this priority**: Resilience protects the assessment flow; users should still be able to answer questions even if descriptions are temporarily unavailable.

**Independent Test**: A user can interact with a score that has no matching comment and still continue the assessment without seeing an error or broken layout.

**Acceptance Scenarios**:

1. **Given** the evaluation comments for a question are missing or incomplete, **When** the user hovers over or selects a score, **Then** no description is shown or a safe fallback state is shown, and the rest of the page remains usable.
2. **Given** the evaluation-comments service fails, **When** the assessment page loads, **Then** the questions still render and the user can continue answering without blocking error messages.

### Edge Cases

- The API returns no comments for a specific question.
- The API returns comments for a question but the selected score does not map to an available tier.
- The user switches application language while the assessment page is open.
- The user rapidly hovers across multiple scores on the same question.
- The evaluation-comments service responds slowly or returns an error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST retrieve evaluation comments for the current assessment session so that each question can be matched with its corresponding comment set.
- **FR-002**: System MUST associate each displayed score description with the correct assessment question using the question identifier.
- **FR-003**: System MUST map the user's selected score to the corresponding maturity tier (CRITICAL, EMERGING, MEDIUM, ADVANCED, PIONEER) using the mapping provided by the evaluation-comments response.
- **FR-004**: System MUST display the localized comment text that matches the user's selected application language (Arabic or English).
- **FR-005**: System MUST update the displayed score description when the user hovers over or clicks/selects a score value.
- **FR-006**: System MUST NOT block the assessment flow or display disruptive errors if evaluation comments are missing, incomplete, or the service is unavailable.

### Key Entities *(include if feature involves data)*

- **Assessment Question**: Represents a single item in the onboarding assessment. It has a unique identifier, dimension, and sub-dimension.
- **Evaluation Comment**: Represents the descriptive text for a specific question at a specific maturity tier. It contains the question identifier, tier label, Arabic text, English text, and creation metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see a relevant score description within 1 second of hovering over or selecting a score.
- **SC-002**: 100% of displayed score descriptions match the correct question and the correct maturity tier for the selected score.
- **SC-003**: Score descriptions are always shown in the user's currently selected application language when both Arabic and English comments are available.
- **SC-004**: Users can complete the assessment without disruption when evaluation comments are missing or the service is unavailable.

## Assumptions

- The application already supports Arabic and English, and the user's selected language is available at the time the description is displayed.
- Evaluation comments are fetched per assessment session or organization context and can be reused while the user remains on the assessment page.
- Each assessment question's score scale maps to the five maturity tiers (CRITICAL, EMERGING, MEDIUM, ADVANCED, PIONEER) according to the mapping returned by the evaluation-comments API.
- The current page path includes an `organizationId` query parameter that identifies the assessment context.
