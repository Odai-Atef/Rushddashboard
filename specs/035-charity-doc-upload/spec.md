# Feature Specification: Charity Document Upload Integration

**Feature Branch**: `[049-charity-doc-upload]`  
**Created**: 2026-06-16  
**Status**: Draft  
**Input**: User description: "Integrate document upload into CharityOnboardingFlow documents step, with reload of existing uploaded docs."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Required Charity Documents (Priority: P1)

As a charity onboarding user, I want to upload required documents (association license, bank certificate, national address proof, and organizational profile) so that I can complete the onboarding documents step and proceed.

**Why this priority**: This is the core of the feature. Without uploading required documents, users cannot complete the onboarding documents step, and the existing placeholder UI provides no real value.

**Independent Test**: Can be fully tested by selecting a file for each required document slot, observing upload progress and completion, and confirming the continue button becomes enabled.

**Acceptance Scenarios**:

1. **Given** the user is on the documents step, **When** they select a valid file for a required document slot, **Then** the system uploads the file, shows progress, and marks the slot as completed when the upload finishes.
2. **Given** all four required document slots are completed, **When** the user views the documents step, **Then** the continue button is enabled and the required-documents warning is removed.
3. **Given** an upload fails due to a network or server error, **When** the user selects a file, **Then** the system shows a clear error message, keeps the slot in an error state, and allows the user to retry.
4. **Given** an optional document slot already contains a file, **When** the user uploads a new file to the same optional slot, **Then** the new file replaces the previous one in the slot.

---

### User Story 2 - Reload and Display Previously Uploaded Documents (Priority: P1)

As a returning charity onboarding user, I want the documents step to reload and display documents I already uploaded so that I do not have to upload them again after refreshing or revisiting the page.

**Why this priority**: Reloading existing documents prevents repeated work, reduces drop-off, and makes the onboarding flow continuous across sessions.

**Independent Test**: Can be fully tested by uploading documents, refreshing the page, and verifying that each document appears in the correct slot with its original name and completion status.

**Acceptance Scenarios**:

1. **Given** the user has previously uploaded documents for the organization, **When** they enter the documents step, **Then** the system loads the existing documents and displays each one in the correct slot based on its document type.
2. **Given** a previously uploaded document maps to the "registration" type, **When** the documents step loads, **Then** it appears in the association license slot.
3. **Given** no documents have been uploaded yet, **When** the user enters the documents step, **Then** all slots are empty and no errors are shown.

---

### User Story 3 - Delete an Uploaded Document (Priority: P2)

As a charity onboarding user, I want to delete a document I uploaded so that I can replace it with a corrected or updated file before proceeding.

**Why this priority**: Users make mistakes or receive updated documents; deletion supports correction without blocking the entire onboarding flow.

**Independent Test**: Can be fully tested by uploading a document, clicking delete, and verifying the slot returns to empty and the document is no longer present after a refresh.

**Acceptance Scenarios**:

1. **Given** a document has been uploaded and appears in a slot, **When** the user clicks the delete control, **Then** the system removes the document from the backend and the slot becomes empty.
2. **Given** a delete request fails, **When** the user clicks delete, **Then** the system shows an error message and keeps the document in the slot.
3. **Given** the user deletes a required document so that fewer than four required documents remain, **When** the deletion completes, **Then** the continue button is disabled and the required-documents warning reappears.

---

### Edge Cases

- What happens when the existing-documents load request fails or times out?
- How does the system behave if the backend returns a document with an unrecognized document type?
- What happens if the user selects a file larger than the allowed size or an unsupported file type?
- How does the system handle multiple simultaneous uploads in different slots?
- What happens if the user leaves the documents step while an upload is in progress?
- What happens if the user tries to upload the same file to two different slots?
- How does the system behave when the organization identifier is missing or invalid?
- What happens if the backend reports a document status other than "UPLOADED" (for example, "PENDING_REVIEW")?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST fetch and display previously uploaded documents for the organization whenever the user enters the documents step.
- **FR-002**: The system MUST map each frontend document slot to the correct backend document type so that loaded documents appear in the expected slot.
- **FR-003**: The system MUST allow the user to select and upload a file for each document slot individually, with a maximum of one file per slot.
- **FR-004**: The system MUST show upload progress while a file is being uploaded and update the slot to a completed state when the upload succeeds.
- **FR-005**: The system MUST allow the user to delete an uploaded document from any slot and immediately reflect the removal in the interface.
- **FR-005a**: When a user uploads a new file into a slot that already contains a document of the same mapped type, the system MUST treat the new upload as a replacement, replacing the previously displayed document in that slot.
- **FR-006**: The system MUST keep the continue button disabled and show a warning until all four required document slots are completed; optional slots do not affect completion.
- **FR-007**: The system MUST update the step progress counters as documents are uploaded or deleted.
- **FR-008**: The system MUST display user-friendly success and error toast messages for upload, delete, and load operations.
- **FR-009**: The system MUST mark the documents step as complete once all four required slots contain a document whose backend status is either "UPLOADED" or "PENDING_REVIEW", and then allow progression.
- **FR-010**: The system MUST prevent the user from navigating away from the documents step while any upload is still in progress.
- **FR-011**: The system MUST detect a missing or invalid organization identifier on the documents step, redirect the user back to the organization creation/selection step, and prevent document uploads until a valid organization context is available.

### Key Entities *(include if feature involves data)*

- **Organization Document**: Represents a file uploaded during charity onboarding. Attributes include a unique identifier, the mapped document type, the original file name, a preview or download URL, and a lifecycle status (for example, uploaded or pending review).
- **Document Slot**: Represents a placeholder in the documents step for a specific required or optional document. Attributes include a slot identifier, a localized label, whether it is required, and a mapping to a backend document type.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of required documents uploaded by a user are persisted and remain available after a page refresh or revisit.
- **SC-002**: Previously uploaded documents are reloaded and displayed in the correct slot within 2 seconds of entering the documents step for at least 95% of sessions.
- **SC-003**: Users can upload a single document and see completion feedback in under 5 seconds under normal network conditions.
- **SC-004**: Users cannot proceed past the documents step until all four required document slots are completed.
- **SC-005**: At least 90% of users complete the documents step on their first attempt without support intervention.

## Clarifications

### Session 2026-06-16

- Q: How should the system behave when multiple uploaded documents map to the same required slot? → A: The new upload replaces the previous document in the slot; only the most recently uploaded document is displayed per slot.
- Q: Should the user be blocked from leaving the documents step while an upload is in progress? → A: Yes, navigation away from the documents step is blocked while any upload is in progress.
- Q: Which optional document slots are required for step completion, and what is the maximum number of documents allowed per optional slot? → A: Optional slots are not required for step completion, and each optional slot accepts a maximum of one file.
- Q: How should the system treat a backend document status of "PENDING_REVIEW" for the purpose of enabling the Continue button? → A: A required slot is considered completed when its document status is either "UPLOADED" or "PENDING_REVIEW", so the Continue button is enabled.
- Q: How should the system behave when the organization identifier is missing or invalid on the documents step? → A: Redirect the user back to the organization creation/selection step and prevent document uploads until a valid organization identifier is available.

## Assumptions

- Users have a stable enough connection for document uploads to complete during normal onboarding flows.
- Authentication is handled before the user reaches the documents step, so all document requests include valid credentials.
- File size limits and accepted file types are enforced by the backend, and the frontend relies on backend validation errors.
- The backend document upload service is available and returns documents in a status that the frontend can interpret as completed.
- Document type mapping rules are stable and defined by the backend contract.
