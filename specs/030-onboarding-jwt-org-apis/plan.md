# Implementation Plan: Onboarding JWT Organization APIs

**Branch**: `045-fix-history-chat-ui` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/030-onboarding-jwt-org-apis/spec.md`

## Summary

Migrate the onboarding organization-info screen (Screen 2) from local-only state to JWT-based `GET /organizations/me` and `PUT /organizations/me` APIs. Remove any client-side `orgId` persistence in `sessionStorage`/`localStorage`. The API service already exposes `getMyOrganization()` and `saveMyOrganization()`; the remaining work is wiring the `CharityOnboardingFlow` registration view to the existing `useOnboardingRegistration` hook, handling load/save/error states, and surfacing field-level validation errors.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3.1
**Primary Dependencies**: Vite 6.3.5, Tailwind CSS 4.1.12, shadcn/ui (Radix primitives), `react-hook-form` 7.55.0, `sonner` 2.0.3 (toasts)
**Storage**: No client-side orgId storage (JWT-only). Auth token lives in `localStorage` under `AUTH_CONFIG.TOKEN_KEY`.
**Testing**: Manual acceptance testing via browser dev-tools; no automated test suite configured in this repo.
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: React SPA (Single Page Application) with Vite
**Performance Goals**: Form load < 2s, save < 1s perceptual feedback
**Constraints**: No `orgId` in `sessionStorage`/`localStorage`; form data must survive network errors; bilingual UI (Arabic primary, English fallback)
**Scale/Scope**: Single user onboarding flow, ~10 form fields, ~1K concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| No orgId in client storage | ✅ PASS | Confirmed via grep: zero `sessionStorage`/`localStorage` refs to `orgId` |
| JWT auth interceptor active | ✅ PASS | `apiClient` already attaches `Authorization: Bearer <token>` from `localStorage` |
| Existing hook/service available | ✅ PASS | `useOnboardingRegistration.ts` and `onboarding-service.ts` already contain `getMyOrganization()` / `saveMyOrganization()` |
| UI framework consistent | ✅ PASS | Project uses Tailwind + Radix/shadcn; spec aligns |

## Project Structure

### Documentation (this feature)

```text
specs/030-onboarding-jwt-org-apis/
├── plan.md              # This file
├── spec.md              # Feature specification
├── data-model.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts                 # ApiClient (JWT interceptor, retry, 401 redirect)
│   ├── types.ts                  # ApiResponse, ApiError, RequestConfig
│   ├── config.ts                 # AUTH_CONFIG constants
│   └── services/
│       ├── onboarding-service.ts # Already has getMyOrganization / saveMyOrganization
│       └── index.ts              # Service exports
├── app/
│   ├── hooks/
│   │   └── useOnboardingRegistration.ts  # Already has loadOrganization / saveOrganization
│   └── components/
│       └── CharityOnboardingFlow.tsx     # Main onboarding component (needs wiring)
└── lib/
    └── env.ts                    # ENV config (API_BASE_URL, etc.)
```

**Structure Decision**: Single-project SPA. All changes confined to `src/app/components/CharityOnboardingFlow.tsx` and minor adjustments in `src/app/hooks/useOnboardingRegistration.ts` if edge-case handling needs tightening.

## Complexity Tracking

> No constitution violations. All patterns are existing, well-established project conventions.

---

## Phase 0: Research

**Research Topic 1 — Confirm no hidden orgId storage**
- **Task**: Full-text search across `src/` for `orgId`, `sessionStorage`, `localStorage` combinations.
- **Finding**: No `orgId` read/write from `sessionStorage` or `localStorage` exists. The only `orgId` references are derived from React state (`state.organization?.id`) and passed as parameters to legacy profile/funding-areas endpoints. This satisfies FR-001.

**Research Topic 2 — Validate existing hook behavior against spec edge cases**
- **Task**: Review `useOnboardingRegistration.ts` for 401 redirect, 404 handling, retry, network-error preservation.
- **Finding**:
  - 401: `setErrorWithArabic` already triggers `window.location.href = '/auth/login'` ✅
  - 404 on `loadOrganization`: correctly catches and sets `isLoading: false` without error ✅
  - Network error: caught and surfaced with Arabic message; form state is external (React state), so survives ✅
  - 400 field errors: parsed from `data.errors` array or object and merged into `fieldErrors` ✅
  - 500: falls through to generic connection error message ✅

**Research Topic 3 — UI Toast / Error Display Pattern**
- **Task**: Determine how the app displays user-facing error toasts.
- **Finding**: `sonner` 2.0.3 is installed. The spec requires Arabic error toasts. Since the hook already returns `error` and `fieldErrors` strings in Arabic, we can pipe `error` into `toast.error()` from `sonner` inside the component, or display inline. No additional toast infrastructure needed.

### Phase 0 Output: research.md

*(Written below as inline research consolidation — file created at `specs/030-onboarding-jwt-org-apis/research.md`)*

**Decision**: Re-use existing `useOnboardingRegistration` hook and `onboarding-service.ts` methods with minimal modifications. No new libraries required.

**Rationale**: The previous feature (`029-onboarding-api-integration`) already built the exact service and hook methods required by this spec. The only gap is the UI component (`CharityOnboardingFlow.tsx`) is not yet consuming the hook.

**Alternatives considered**:
- Introduce React Query / TanStack Query for server state → Rejected: overkill for two endpoints; existing hook pattern is sufficient and avoids adding a new dependency.
- Add Zustand or Redux for onboarding state → Rejected: React local state + the existing hook already covers load/save/cache; global store unnecessary for this scope.

---

## Phase 1: Design & Contracts

### 1.1 Data Model

**Entity: Organization (Frontend View Model)**

Derived from `OrganizationResponse` in `onboarding-service.ts`.

| Attribute | Type | Source | Notes |
|-----------|------|--------|-------|
| id | string | Backend | Returned but NEVER stored client-side |
| name | string | User input + Backend | Pre-filled on load |
| licenseNumber | string | User input + Backend | Pre-filled on load |
| registrationDate | string (ISO date) | User input + Backend | HTML `input[type="date"]` binds YYYY-MM-DD |
| type | OrganizationType | User input + Backend | Enum: CHARITY, FOUNDATION, NGO, COOP |
| city | string | User input + Backend | Pre-filled on load |
| website | string \| null | User input + Backend | Optional |
| contactPerson | string | User input + Backend | Pre-filled on load |
| email | string | User input + Backend | Pre-filled on load |
| mobile | string | User input + Backend | Pre-filled on load |
| status | OrganizationStatus | Backend | Read-only for UI (DRAFT …) |
| currentStep | OnboardingStep | Backend | Read-only for UI |
| createdAt | string (ISO) | Backend | Read-only |
| updatedAt | string (ISO) | Backend | Read-only |

**Entity: CreateOrganizationDto (Write Payload)**

Same as above minus `id`, `status`, `currentStep`, `createdAt`, `updatedAt`.

| Attribute | Type | Validation | Required |
|-----------|------|------------|----------|
| name | string | Min 2 chars | Yes |
| licenseNumber | string | Pattern per backend | Yes |
| registrationDate | string (YYYY-MM-DD) | Valid date, not future | Yes |
| type | OrganizationType | One of enum | Yes |
| city | string | Min 2 chars | Yes |
| website | string \| undefined | Valid URL or empty | No |
| contactPerson | string | Min 2 chars | Yes |
| email | string | Valid email format | Yes |
| mobile | string | Intl phone format | Yes |

### 1.2 API Contracts

**Contract 1: GET /api/v1/onboarding/organizations/me**

- **Method**: GET
- **Auth**: `Authorization: Bearer <JWT>` (automatic via `apiClient`)
- **Success 200** → `OrganizationResponse` object (see spec)
- **Not Found 404** → Empty form; no error toast
- **Unauthorized 401** → `apiClient` auto-redirects to `/auth/login`
- **Network Error** → Retry button visible; keep user on form

**Contract 2: PUT /api/v1/onboarding/organizations/me**

- **Method**: PUT
- **Auth**: `Authorization: Bearer <JWT>` (automatic via `apiClient`)
- **Body**: `CreateOrganizationDto` JSON
- **Success 200/201** → `{ org: OrganizationResponse, statusCode: number }`; advance to profile screen
- **Validation 400** → `ApiError.errors[]` or `ApiError.details` mapped to field-level messages
- **Unauthorized 401** → Auto-redirect to login
- **Server Error 500** → Arabic error toast; preserve form state
- **Idempotency**: Safe to retry; backend upserts by JWT subject (no duplicate creation)

### 1.3 UI State Machine (Registration Screen)

```
[MOUNT] -> loadOrganization()
  ├─ 200 -> POPULATE_FORM (pre-fill all fields)
  ├─ 404 -> EMPTY_FORM
  ├─ 401 -> REDIRECT_LOGIN (handled by apiClient)
  └─ NETWORK_ERR -> SHOW_RETRY (form editable, no navigation)

[USER_EDITS] -> update local React state (no auto-save for registration per spec;
                previous hook had 30s debounce but spec says save on Next/Save only)

[SAVE_CLICK] -> saveOrganization(CreateOrganizationDto)
  ├─ 200/201 -> ADVANCE_TO_PROFILE
  ├─ 400 -> SHOW_FIELD_ERRORS (inline under inputs)
  ├─ 401 -> REDIRECT_LOGIN
  └─ 500/NETWORK -> SHOW_TOAST_ERROR (preserve form)
```

**Design Decision**: Disable the 30-second auto-save timer for the registration step in this iteration. The spec explicitly says "On Next or Save, collect all form fields into a CreateOrganizationDto payload and call PUT". Auto-save may be re-enabled later for drafts, but it risks partial PUTs with incomplete data. The hook's `scheduleAutoSave` can remain for future use but should not be invoked from the registration view.

### 1.4 Component Changes

**`CharityOnboardingFlow.tsx`**
- Import `useOnboardingRegistration` from `@/app/hooks/useOnboardingRegistration`
- Inside `CharityOnboardingFlow`, instantiate the hook
- Pass hook state/actions into `RegistrationView` as props (or consume inside `RegistrationView` if refactored)
- On `currentView === 'registration'` mount (useEffect), call `loadOrganization()`
- Map `registrationData` state to/from `organization` hook state when 200
- On Save/Next: construct `CreateOrganizationDto` from current form state, call `saveOrganization(dto)`
- On success (`saveOrganization` resolves): `setCurrentView('profile')`
- On error: display `error` in `sonner` toast and render `fieldErrors` under corresponding inputs
- Add a retry button (re-call `loadOrganization` or re-submit `saveOrganization`)

**`useOnboardingRegistration.ts`** — Minor adjustments
- The hook already does exactly what the spec demands for load/save. No structural changes needed.
- Verify `saveOrganization` accepts `CreateOrganizationDto` (it does via `OrganizationRegistration` alias). The type is compatible.

**`onboarding-service.ts`** — Already complete
- `getMyOrganization()` and `saveMyOrganization(data)` are present and correct.

---

## Phase 1 Outputs

### data-model.md

See inline section 1.1 above. Persisted to `specs/030-onboarding-jwt-org-apis/data-model.md`.

### contracts/api-contracts.md

See inline section 1.2 above. Persisted to `specs/030-onboarding-jwt-org-apis/contracts/api-contracts.md`.

### quickstart.md

Developer quick-start for testing the feature locally:

1. **Start the dev server**: `pnpm dev` (or `npm run dev`)
2. **Log in** to obtain a valid JWT (the auth interceptor reads from `localStorage`)
3. **Navigate** to the onboarding flow (`/onboarding` or the route mapped to `CharityOnboardingFlow`)
4. **Registration screen (Step 2)** should auto-call `GET /organizations/me`. Watch Network tab.
   - If 404: empty form (first-time user)
   - If 200: fields pre-filled
5. **Fill/modify fields**, click "التالي" (Next) or "حفظ المسودة" (Save Draft)
6. **Observe PUT /organizations/me** in Network tab. Expect 200 (update) or 201 (create).
7. **On success**: UI advances to Profile screen.
8. **Test error cases**:
   - 400: Submit invalid email → field-level error under email input
   - 401: Clear `localStorage` token → should redirect to `/auth/login`
   - 500: Mock server error → toast appears, form intact
   - Offline: Disconnect network → retry button visible

Persisted to `specs/030-onboarding-jwt-org-apis/quickstart.md`.

---

## Agent Context Update

Update `AGENTS.md` between `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` markers to reference this feature's artifacts.
