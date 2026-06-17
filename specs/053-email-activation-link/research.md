# Research: Email Activation Link Handling

**Feature**: Email Activation Link Handling
**Date**: 2026-06-17

## Unknowns resolved

1. **Backend activation endpoint shape**
   - Decision: Use the existing `GET /api/v1/auth/activate?token=<token>` endpoint.
   - Rationale: The user explicitly provided this contract and the `auth-service.ts` already implements it.
   - Alternatives: POST with token in body was considered but rejected because the backend expects a GET query parameter.

2. **Message localization**
   - Decision: Pass the backend-supplied message through to the login page as-is.
   - Rationale: The spec requests "message of success or failure" and the backend already returns a user-facing message. The existing login page can render any message string.
   - Alternatives: Map every backend message to Arabic translations. Rejected to avoid brittle translation maintenance for a small, stable API surface.

3. **Navigation/redirect mechanism**
   - Decision: Continue using `react-router` `navigate` with query parameters for `activated` and `message`.
   - Rationale: The existing `ActivateAccountPage` and `LoginPage` already implement this contract.
   - Alternatives: Use global toast/sonner notifications or application state. Rejected to keep the change minimal and preserve deep-linkable login page URLs.

## No additional research needed

All implementation details can be derived from the current codebase. No new libraries, patterns, or external APIs are required.
