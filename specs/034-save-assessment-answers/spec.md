# Feature Specification: Save Assessment Answers

**Feature Branch**: `[034-save-assessment-answers]`  
**Created**: 2026-06-15  
**Status**: Draft  
**Input**: User description: "When the user completes assessment questions and clicks Next, the answers are not saved to the backend. On reload or revisit, all answers are lost. The backend provides GET /api/v1/onboarding/assessment/state?organizationId={id} to retrieve categories, questions, saved answers, and progress, and PUT /api/v1/onboarding/assessment/answers to batch upsert answers. Required Features: 1) Save answers on Next/Submit, 2) Load saved answers on mount, 3) Validation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persist Assessment Answers on Progression (Priority: P1)

As a user completing the organizational assessment, I want my answers to be saved to the backend when I click Next or Submit, so that my progress is not lost when I move to the next step.

**Why this priority**: This is the core of the feature. Without persisted answers, users cannot reliably complete the onboarding assessment, and revisits result in repeated work.

**Independent Test**: Can be fully tested by entering answers, clicking Next, and verifying that the same answers reappear after a page reload or revisit.

**Acceptance Scenarios**:

1. **Given** the user has answered questions in the current assessment category, **When** they click the Next button, **Then** the system sends all answers for the category to the backend and, on success, navigates to the next step.
2. **Given** the user has answered all remaining categories and clicks Submit, **When** the save succeeds, **Then** the system navigates to the documents or results step.
3. **Given** the save request fails due to a network or server error, **When** the user clicks Next, **Then** the system shows a clear error message, keeps the user on the assessment screen, and preserves the answers in the form.

---

### User Story 2 - Restore Saved Answers on Return (Priority: P1)

As a returning user, I want the assessment screen to load my previously saved answers when I revisit it, so that I do not have to re-enter information I already provided.

**Why this priority**: Restoring answers is essential for a continuous onboarding experience and prevents user frustration caused by lost progress.

**Independent Test**: Can be fully tested by saving answers, navigating away, returning to the assessment, and verifying that inputs are pre-filled and answered questions appear as completed.

**Acceptance Scenarios**:

1. **Given** the user has previously saved assessment answers, **When** the assessment screen mounts, **Then** the system retrieves the saved answers and pre-fills every corresponding input.
2. **Given** the saved answers include scale, yes/no, multiple-choice, and file-upload questions, **When** the screen loads, **Then** each input displays the correct value according to the question type.
3. **Given** the user has no saved answers, **When** the assessment screen mounts, **Then** the form loads blank and no errors are shown.

---

### User Story 3 - Validate Required Questions Before Saving (Priority: P2)

As a user, I want the system to ensure I answer all required questions before it saves or moves me forward, so that incomplete submissions are not accepted.

**Why this priority**: Validation protects data quality and guides users to provide mandatory information without silently skipping required questions.

**Independent Test**: Can be fully tested by leaving a required question blank, clicking Next, and observing an error and scroll to the unanswered question.

**Acceptance Scenarios**:

1. **Given** the current category contains unanswered required questions, **When** the user clicks Next, **Then** the system displays an error, scrolls to the first unanswered required question, and does not call the save endpoint.
2. **Given** all required questions in the category are answered, **When** the user clicks Next, **Then** the system proceeds to save and navigate as normal.
3. **Given** an optional question is left unanswered, **When** the user clicks Next, **Then** the system allows the save to proceed.

---

### Edge Cases

- What happens when the save request succeeds for some answers but the user loses connection before the remaining answers are sent?
- How does the system handle answers saved by an older app version that may use different question types or fields?
- What happens if a saved answer references a question that no longer exists in the current assessment configuration?
- How does the system behave when the backend returns a validation error for a specific question ID?
- What happens if the user modifies an answer after it has been saved but before clicking Next?
- If the user has entered a new answer locally and previously saved answers load for the same question, the local answer must take precedence until the next explicit save (Clarification 2026-06-15).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST collect all answers currently held in assessment state, keyed by question ID, when the user clicks Next or Submit.
- **FR-002**: The system MUST send the collected answers to the backend using `PUT /api/v1/onboarding/assessment/answers?organizationId={id}` with the request body `{ answers: [...] }`.
- **FR-003**: The system MUST map each answer to the correct payload field based on the question type: scale to a numeric value, yes/no to a text value, multiple choice to a list of selected option labels, and file upload to a file URL value.
- **FR-004**: On a successful save, the system MUST navigate the user to the next onboarding step (next category, documents, or results).
- **FR-005**: On a failed save, the system MUST display a user-friendly error message, keep the user on the assessment screen, and preserve all answers in state.
- **FR-006**: The system MUST support partial saves, allowing users to save answers after completing a single category or only after completing all categories.
- **FR-007**: When the assessment screen mounts, the system MUST retrieve previously saved answers via `GET /api/v1/onboarding/assessment/state?organizationId={id}`, flatten answers from `categories[].answers[]` into a map keyed by `questionId`, and pre-fill the corresponding inputs.
- **FR-008**: The system MUST visually indicate questions that already have saved answers as completed.
- **FR-009**: The system MUST prevent progression when any required question in the current submission scope is unanswered and MUST scroll the first unanswered required question into view.
- **FR-010**: Optional questions MAY be left unanswered, and the system MUST still allow saving and progression.
- **FR-011**: The system MUST present persisted answers reliably even if the load request fails, using a clear error state while preserving any locally entered answers.

### Key Entities *(include if feature involves data)*

- **Answer**: Represents a single user's response to an assessment question. Attributes include the related question identifier, a numeric answer where applicable, a text answer value, and a list of selected option labels.
- **Question**: Represents an assessment question shown to the user. Attributes include identifier, question type, whether the question is required, and available options for choice-based questions.
- **Assessment Category**: Represents a group of related questions. Attributes include an identifier and an ordered list of questions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of user answers entered during an assessment session are persisted to the backend when the user clicks Next or Submit under normal conditions.
- **SC-002**: Previously saved answers are restored and displayed correctly within 2 seconds of the assessment screen mounting for at least 95% of sessions.
- **SC-003**: Users with unanswered required questions receive immediate on-screen guidance and are prevented from progressing until all required questions are answered.
- **SC-004**: No saved answers are lost when a save request fails; users can retry without re-entering information.
- **SC-005**: At least 90% of returning users are able to continue their assessment from where they left off without re-entering data.

## Clarifications

### Session 2026-06-15

- Q: What should happen when the user has unsaved local answers and the load request returns older saved answers for the same question? → A: The locally entered answer takes precedence over the loaded saved answer until the user explicitly saves again.
- Q: Which backend endpoint and HTTP method should the frontend use to load and save assessment answers? → A: Load via `GET /api/v1/onboarding/assessment/state?organizationId={id}` and save via `PUT /api/v1/onboarding/assessment/answers` with `{ answers: [...] }`.

## Assumptions

- Users have a stable enough connection for the save request to complete during normal onboarding flows.
- Authentication is handled before the user reaches the assessment screen, so all save and load requests include valid credentials.
- The assessment question definitions available to the frontend match the question IDs referenced in saved answers.
