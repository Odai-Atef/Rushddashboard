# Research: Onboarding Route Refactor

**Feature**: Onboarding Route Refactor  
**Date**: 2026-06-16  
**Goal**: Resolve technical unknowns and record design decisions before implementation planning.

## Decision Log

### 1. Router version and capabilities

- **Decision**: Use React Router v7 (already installed as `react-router@7.13.0`) with `createBrowserRouter`, nested routes, `Navigate`, `useSearchParams`, and `useNavigate`.
- **Rationale**: The project already uses React Router v7 in `src/app/routes.tsx`. No new dependency is needed, and nested routes with index routes and wildcards are supported.
- **Alternatives considered**: None. The project already standardized on React Router v7.

### 2. Route layout structure

- **Decision**: Keep the existing `DashboardLayout` and add a dedicated `OnboardingLayout` wrapper under `dashboard/onboarding` that owns route guards, state hydration, and query-parameter parsing. Each step becomes a child route.
- **Rationale**: Centralizes guard/hydration logic in one place and lets every step page mount independently while sharing an `OnboardingProvider`.
- **Alternatives considered**: Inline guards in every page. Rejected because duplication would increase maintenance risk.

### 3. State sharing between route pages

- **Decision**: Introduce an `OnboardingProvider` context that wraps `OnboardingLayout` and exposes `organization`, `profile`, `assessmentStatus`, `documents`, and loading/error states. Route pages consume the context; the provider hydrates on mount and when `organizationId` changes.
- **Rationale**: The current `CharityOnboardingFlow` keeps all state inside a single component. Moving state into a provider keeps pages decoupled while preserving a single source of truth.
- **Alternatives considered**: Lift state into a global store or URL query parameters. Rejected because a scoped context is sufficient and avoids unnecessary architectural changes.

### 4. Parameter passing (`organizationId`)

- **Decision**: Canonical source is the `organizationId` query parameter (e.g. `?organizationId=123`). Fallback is the active organization from `OnboardingProvider`/context. If neither is available, redirect to the dashboard organization selector or onboarding landing.
- **Rationale**: Matches the clarification from `/speckit.clarify`; query parameters are easy to debug and share.
- **Alternatives considered**: Path parameter. Rejected per clarification (Option C).

### 5. Lazy loading

- **Decision**: Use `React.lazy()` for each onboarding page component. Keep the provider and layout eagerly loaded.
- **Rationale**: Satisfies NFR-001 without blocking initial dashboard render and keeps the feature self-contained.
- **Alternatives considered**: No lazy loading. Rejected because onboarding is a large flow and initial bundle size matters.

### 6. Step guards

- **Decision**: Implement a `StepGuard` component/utility inside `OnboardingLayout` that compares the requested step with `organization.currentStep` (or equivalent persisted progress). Completed steps are reachable; future steps redirect to the furthest reachable valid step.
- **Rationale**: Aligns with the clarified rule that completed steps are freely navigable while future steps are blocked.
- **Alternatives considered**: No guards. Rejected because direct links to future steps could break data assumptions.

### 7. Browser history behavior

- **Decision**: Use standard React Router navigation (`useNavigate`) for next/back buttons. Browser back/forward follow exact route history.
- **Rationale**: Matches the clarification that history follows actual transitions, not the canonical wizard order.

### 8. Extraction of existing views

- **Decision**: Split the inline views (`LandingView`, `RegistrationView`, `ProfileView`, `AssessmentView`, documents, processing, results, analysis, roadmap, decision) from `CharityOnboardingFlow.tsx` into separate page components under `src/app/pages/onboarding/`. Keep view JSX largely unchanged; move state and effects into the provider or hooks.
- **Rationale**: The views are already isolated as inner components with minimal coupling. Extracting them satisfies FR-001/FR-002 with low regression risk.
- **Alternatives considered**: Keep views in one file and switch via routes. Rejected because it would not achieve the requested file/page separation for debugging.

### 9. Data model / API contract changes

- **Decision**: No new backend APIs are required. The refactor consumes existing `onboardingService` methods. If a direct `organizationId` is provided via query parameter and differs from the JWT-derived organization, call `getOrganization(id)` to load the requested organization.
- **Rationale**: The service already exposes `getOrganization(id)` and JWT `/me` endpoints. Reusing them minimizes backend work.
- **Alternatives considered**: New endpoint for batch onboarding state. Rejected because existing endpoints already cover the needed data.

### 10. Authentication redirects

- **Decision**: Reuse the existing `401` handling in `useOnboardingRegistration` and `apiClient`. All onboarding routes are under `DashboardLayout`, which already enforces authentication; the login redirect preserves the original onboarding URL in a `redirect` query parameter.
- **Rationale**: Avoids duplicating auth logic and satisfies the unauthenticated edge case already defined in the spec.

## Unknowns resolved

- Router: React Router v7 (confirmed via `package.json` and `routes.tsx`).
- State sharing: Provider pattern using React Context.
- Parameter passing: Query parameter `organizationId` with context fallback.
- Lazy loading: `React.lazy()`.
- No new backend contracts needed.
