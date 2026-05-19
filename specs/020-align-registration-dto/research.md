# Research: Align Registration Payload with Backend DTO

## Date
2026-05-19

## Decision
Direct type-system and component refactor. No new architectural patterns or dependencies required.

## Rationale
The backend `/auth/register` endpoint's RegisterDto is well-documented and stable. The frontend already uses React Hook Form with Zod validation and a typed service layer with native fetch. The work is a bounded payload mapping exercise: rename/remove fields in the form, update TypeScript interfaces to match the backend contract, and ensure only supported keys are sent.

## Alternatives Considered
None. The scope is narrow and the path is deterministic.

## Key Findings

### Backend DTO (RegisterDto) – Supported Fields
| Field       | Type   | Constraints                                |
|-------------|--------|--------------------------------------------|
| email       | string | Valid email format                         |
| password    | string | Minimum 6 characters                       |
| firstName   | string | Non-empty, <= 100 characters               |
| lastName    | string | Non-empty, <= 100 characters               |
| companyId   | UUID   | Valid UUID, references existing company      |
| roleId      | UUID   | Valid UUID, references existing role         |

### Frontend Fields to Remove / Not Send
| Current Field | Reason                  |
|---------------|-------------------------|
| fullName      | Not in RegisterDto      |
| phone         | Not in RegisterDto      |
| company       | Replaced by companyId   |
| role          | Replaced by roleId      |

### Frontend Fields to Keep (UI only)
| Field           | Usage                                      |
|-----------------|--------------------------------------------|
| confirmPassword | Client-side password-match validation only |

### Existing Stack & Patterns
- **Form handling**: React Hook Form + Zod (`react-hook-form`, `zod`, `@hookform/resolvers`)
- **HTTP**: Native `fetch` wrapped in typed service functions (`src/app/services/auth.ts`)
- **Types**: Centralized in `src/app/types/auth.ts`
- **Component**: `src/app/components/RegistrationPage.tsx`
- **Validation**: Zod schemas co-located with types or inline in components

### Open Questions Resolved
1. **Name strategy**: Use separate `firstName` + `lastName` fields in UI; do not auto-generate `fullName`.
2. **Company/Role UX**: If backend list endpoints are unavailable, display free-text inputs but map them to hardcoded UUIDs temporarily ( Assumption-002 from spec). Prefer selectors if endpoints exist.
3. **Error display**: Inline field errors + top-level summary banner (clarified in `/speckit.clarify`).
