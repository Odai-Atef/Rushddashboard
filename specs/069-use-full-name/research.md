# Research Notes: Use Full Name Across Frontend

**Feature**: Use Full Name Across Frontend  
**Date**: 2026-06-27

## Decisions

### DEC-001: `UserProfile.fullName` should be required (`string`)

- **Decision**: Update `UserProfile.fullName` from `string | null` to `string`.
- **Rationale**: The user clarified that `full_name` is a required field on the backend. Making it required in the frontend type system removes the need for fallback display logic and aligns the contract.
- **Alternatives considered**: Keep nullable and assert at runtime; rejected because it spreads defensive code across every consumer.

### DEC-002: Frontend validation length for `full_name`

- **Decision**: Require at least 2 characters and allow up to 100 characters.
- **Rationale**: 2 characters is a practical minimum for a meaningful full name; 100 characters accommodates longer names without encouraging abuse.
- **Alternatives considered**: 1 character minimum (too permissive), 50 character maximum (may be too short for some Arabic compound names).

### DEC-003: Avatar initials behavior

- **Decision**: Keep the existing `getInitials` helper unchanged.
- **Rationale**: It already handles single-word names by returning the first two characters and multi-word names by returning the first and last initial. This works correctly for any `full_name` value.
- **Alternatives considered**: Introduce a shared utility or change the fallback to first letter only; rejected because no behavior change is requested.

### DEC-004: No fallback display for missing `full_name`

- **Decision**: Because `full_name` is required, remove fallback display logic and instead rely on the backend guarantee.
- **Rationale**: Matches the clarification that the field is required. The existing `?? 'المستخدم'` and `?? ''` fallbacks can be simplified where appropriate, but must not crash if an unexpected null slips through.
- **Alternatives considered**: Use email/username fallback; rejected per user clarification.

## Open Risks

- `TopBar.tsx` and `SettingsPage.tsx` each have a local `getInitials` helper. Consider centralizing it during implementation to avoid duplication.
- `UserProfile.fullName` being required may surface TypeScript errors in any layout or context that builds a partial user object; these should be fixed as part of the implementation.
- The onboarding `RegistrationPage.tsx` is for organization registration, not user registration, so it is out of scope for this change.
