# Research: Remove Role Selection from Registration Flow

**Feature**: Remove Role Selection from Registration Flow  
**Date**: 2026-05-20  
**Questions Resolved**: 1

## Decisions

### DEC-001: Path B — roleId is NOT required during self-registration

**Decision**: Remove the role selector from the frontend registration form and stop sending `roleId` in the payload. Let the backend assign a default role automatically.

**Rationale**:
- Registration currently fails with "property roleId should not exist", which blocks all new user signups.
- The existing backend DTO (inferred from error messages) does not accept `roleId`.
- Self-registration is typically a lightweight onboarding step; role assignment by an administrator or system default is a common SaaS pattern.
- Removes unnecessary friction from the signup process.

**Alternatives Considered**:
- **Path A (Keep roleId)**: Update backend DTO to accept `roleId` and keep the frontend selector. Rejected because the backend currently actively rejects the field, implying a contract change away from it. Additionally, allowing users to self-select roles can lead to privilege escalation or misconfiguration.

### DEC-002: Backend silently ignores stray `roleId`

**Decision**: If a raw request containing `roleId` reaches the backend, it should be silently ignored and registration should proceed with the default role assignment.

**Rationale**:
- Prevents any edge-case user-facing errors from API clients that may still send it.
- Aligns with lenient, backward-compatible API design for non-critical fields.

**Alternatives Considered**:
- Return a 400 validation error for unsupported `roleId`. Rejected because it contradicts the goal of eliminating registration failures due to `roleId`.

## Dependencies

- Coordinate with existing registration DTO alignment work (specs/020-align-registration-dto).
- Coordinate with registration field errors work (specs/022-fix-registration-validation-errors).
- Backend must have a default role configured in its role/seed data.
- Existing `/roles` endpoint may still be used elsewhere in the app (e.g., admin panel) and should not be removed.

## Known Unknowns (Deferred to Implementation)

- The exact backend default role ID and name (assumed configured by backend team).
- The specific file paths of the registration form components and Zod schema in the frontend codebase.
- Whether any other frontend pages or tests reference the role selector during registration.

## Notes

- The frontend registration form already uses React Hook Form + Zod validation.
- The `companyId` selector remains in the registration form and is unaffected.
- Existing API contract documentation (e.g., specs/020-align-registration-dto/contracts/auth-api.md) must be updated to reflect the removal of `roleId` from the request payload.
