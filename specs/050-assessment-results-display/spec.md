# Feature Specification: Assessment Results Display

**Feature Branch**: `050-charity-onboarding-assessment-results`  
**Created**: 2026-06-16  
**Status**: Draft  
**Input**: User description: "After a charity user submits their onboarding assessment and documents, automatically evaluate the assessment and display an ISIV-based results view with overall score, qualification status, dimension breakdown, tier badges, diagnosis, strengths, and weaknesses."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit and View Evaluation Results (Priority: P1)

A charity representative has completed the onboarding assessment and uploaded the required documents. They click the submit button to finalize their assessment. The system evaluates the responses and immediately presents a results view that summarizes the organization's maturity across the four ISIV dimensions, the overall score out of 120, and the qualification status.

**Why this priority**: This is the core value of the feature. Without it, users cannot see the outcome of their assessment or understand how their organization was qualified.

**Independent Test**: A user can complete the documents step, submit the assessment, and see the results view populated with real evaluation data.

**Acceptance Scenarios**:

1. **Given** the user is on the documents step of the onboarding flow, **When** they submit the assessment, **Then** the system shows a loading state while the evaluation runs and then navigates to the results view.
2. **Given** the evaluation completes successfully, **When** the results view is displayed, **Then** it shows the overall score out of 120, the qualification status, a four-dimension ISIV radar chart, tier badges, Arabic diagnosis, strengths, and weaknesses.
3. **Given** the evaluation fails after a successful assessment submission, **When** the user triggers retry, **Then** the system retries only the evaluation results fetch while keeping the assessment submitted.

---

### User Story 2 - Understand Dimension-Level Performance (Priority: P2)

The charity representative wants to understand not just the final qualification, but where the organization stands within each ISIV dimension. They review the per-dimension score, percentage, tier, and Arabic tier label to identify strengths and growth areas.

**Why this priority**: Dimension-level detail helps users take action and improves trust in the evaluation outcome.

**Independent Test**: A user can view each ISIV dimension with its own score, tier badge, and Arabic label, independent of other result details.

**Acceptance Scenarios**:

1. **Given** the results view is displayed, **When** the user reviews the ISIV breakdown, **Then** each dimension shows its symbol, Arabic label, score, percentage, tier, and Arabic tier label.
2. **Given** dimensions fall into different tiers, **When** the user views the results, **Then** each tier badge is visually distinct and accurately reflects its tier classification.

---

### User Story 3 - Read Arabic Diagnostic Feedback (Priority: P3)

The charity representative reads the Arabic diagnostic summary, strengths, and weaknesses to understand the qualitative reasoning behind the score and what the organization should improve.

**Why this priority**: Qualitative feedback turns the score into actionable guidance and supports follow-up improvement plans.

**Independent Test**: A user can read the diagnosis, strengths list, and weaknesses list returned by the evaluation engine.

**Acceptance Scenarios**:

1. **Given** the results view is displayed, **When** the evaluation includes diagnosis text, **Then** the Arabic diagnosis is shown in full.
2. **Given** the evaluation includes strengths and weaknesses, **When** the user reviews the feedback, **Then** both lists are displayed.
3. **Given** the evaluation returns empty strengths or weaknesses, **When** the results view is displayed, **Then** the section is handled gracefully without breaking the layout.

---

### Edge Cases

- The evaluation engine is unavailable or returns a timeout; the user must see an error and a manual retry option that retries only the evaluation results fetch while keeping the assessment submitted.
- The evaluation returns a perfect score (120/120) or a zero score; the results view must still render correctly.
- All four dimensions share the same tier or span multiple tiers; each badge must display accurately.
- Strengths or weaknesses arrays are empty or missing; the view must not fail and should show an appropriate empty state.
- The user clicks the submit button multiple times while evaluation is in progress; the system must prevent duplicate submissions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST trigger the evaluation process automatically after the user submits the assessment and documents.
- **FR-002**: System MUST display a loading indicator while evaluation results are being prepared.
- **FR-003**: System MUST prevent additional submission attempts while evaluation is in progress.
- **FR-004**: System MUST display the overall organizational score on a fixed 0-120 scale.
- **FR-005**: System MUST display the qualification status returned by the evaluation engine using the user-facing Arabic label supplied by the external mapping table.
- **FR-006**: System MUST render a static radar chart that visualizes the four ISIV dimensions using the symbols and Arabic labels supplied by the external mapping table; the chart MUST NOT require hover tooltips or clickable interactions.
- **FR-007**: System MUST show each ISIV dimension's symbol, Arabic label, score, percentage, tier, and Arabic tier label using values supplied by the external mapping table.
- **FR-008**: System MUST display tier badges for each dimension based on the tier value returned by the evaluation engine, rendered with the Arabic tier label supplied by the external mapping table.
- **FR-009**: System MUST display the Arabic diagnostic summary, strengths list, and weaknesses list returned by the evaluation engine.
- **FR-010**: System MUST handle evaluation failures gracefully by showing an error message and providing a manual retry path that retries only the evaluation results fetch while keeping the assessment submitted; the UI MUST NOT silently auto-retry on slowness.
- **FR-011**: System MUST persist assessment results so that returning users can reopen and view previously generated results without resubmitting.

### Key Entities *(include if feature involves data)*

- **Assessment Result**: The outcome of evaluating a submitted assessment, containing the overall score, qualification status, dimension breakdown, diagnosis, strengths, and weaknesses.
- **ISIV Dimension**: One of four institutional maturity dimensions represented by a symbol, Arabic label, score, percentage, tier, color, and Arabic tier label. The exact symbol set and Arabic labels are owned by an external evaluation-engine mapping table; the results view consumes the supplied values.
- **Qualification Status**: The final decision derived from the evaluation, presented to the user with the Arabic label supplied by the external mapping table.
- **Diagnostic Feedback**: The Arabic narrative, strengths list, and weaknesses list that explain the evaluation outcome.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see the evaluation results view within 5 seconds of a successful assessment submission under normal network conditions.
- **SC-002**: 100% of successfully submitted assessments display the results view with real evaluation data rather than placeholders.
- **SC-003**: Users can identify the qualification status and the tier of each ISIV dimension at a glance on the results view.
- **SC-004**: Users can view the overall score out of 120 and the four ISIV dimension breakdowns without navigating away from the results view.
- **SC-005**: When evaluation fails, users receive a clear, Arabic-friendly error message and a visible manual retry action; the UI does not silently auto-retry on slowness.
- **SC-006**: Returning users can reopen and view their previously generated assessment results without resubmitting.

## Clarifications

### Session 2026-06-16

- **Q**: Should the specification explicitly define the four ISIV dimension names/symbols and the tier/status enum values, or should they remain external constants/mappings owned by the evaluation engine?  
  **A**: Treat dimension labels/symbols, tiers, and status values as externally provided constants/mapping tables; the UI only renders what the engine returns.
- **Q**: When the evaluation API fails after a successful assessment submission, what should the retry action do?  
  **A**: Retry only the evaluation results fetch; the assessment remains submitted.
- **Q**: If the evaluation fetch is slow but not yet failed, should the UI attempt automatic retries, and if so, how many?  
  **A**: Do not auto-retry on slowness; show a retry action only after the request actually fails.
- **Q**: After leaving the onboarding flow and returning later, should the user be able to reopen and view their previously generated assessment results?  
  **A**: Results must be persisted and re-accessible whenever the user returns to the onboarding flow, even in a new session.
- **Q**: Should the ISIV radar chart on the results view be interactive (hover tooltips, clickable dimension details) or static?  
  **A**: Static radar chart; no hover tooltips or clickable details.

## Assumptions

- The evaluation engine returns a complete result for every submitted assessment, including overall score, qualification status, four ISIV dimensions, diagnosis, strengths, and weaknesses.
- The overall score scale is fixed at 0-120, with each of the four ISIV dimensions contributing up to 30 points.
- ISIV dimension symbols, Arabic dimension labels, tier classifications, Arabic tier labels, and qualification status user-facing Arabic labels are provided by an external mapping table owned by the evaluation engine; the results view renders the supplied values without hard-coding taxonomy details.
- The user views results within the onboarding flow immediately after submission and can return to view the same persisted results in later onboarding sessions.
