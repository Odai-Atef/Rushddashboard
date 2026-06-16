# UI Routing Contract: Onboarding Route Refactor

**Feature**: Onboarding Route Refactor  
**Date**: 2026-06-16

## Route table

| Route | Step ID | Lazy loaded | Guard rule | Notes |
|-------|---------|-------------|------------|-------|
| `/dashboard/onboarding` | `landing` | no (index redirect) | none | Redirects to `/dashboard/onboarding/landing`. |
| `/dashboard/onboarding/landing` | `landing` | yes | none | Entry point to the wizard. |
| `/dashboard/onboarding/registration` | `registration` | yes | none | Organization registration form. |
| `/dashboard/onboarding/profile` | `profile` | yes | `registration` completed or `organization` exists | Redirect to `registration` if no organization. |
| `/dashboard/onboarding/assessment` | `assessment` | yes | `profile` completed | Redirect to the furthest reachable step otherwise. |
| `/dashboard/onboarding/documents` | `documents` | yes | `assessment` completed | Redirect to the furthest reachable step otherwise. |
| `/dashboard/onboarding/processing` | `processing` | yes | `documents` completed | Polls/waits for evaluation. |
| `/dashboard/onboarding/results` | `results` | yes | `processing` complete | Redirect to `documents` or `assessment` if not ready. |
| `/dashboard/onboarding/analysis` | `analysis` | yes | `results` completed | Review analysis view. |
| `/dashboard/onboarding/roadmap` | `roadmap` | yes | `results` completed | Development roadmap view. |
| `/dashboard/onboarding/decision` | `decision` | yes | `results` completed | Final decision/qualification view. |

## Query parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `organizationId` | no | Overrides the active organization. Provider falls back to the JWT-derived organization if missing. If neither is available, redirect to the dashboard organization selector or landing. |
| `redirect` | no | Preserved by auth layer when redirecting to `/auth/login`; not consumed by onboarding itself. |

## Navigation behavior

- **Next/back buttons** call `useNavigate` with the target route path. They do not mutate local view state.
- **Browser back/forward** follow the exact browser history (route transition history).
- **Direct links/refresh** hydrate state from the server on route mount and render the requested step if allowed.
- **Unknown step** redirects to `/dashboard/onboarding/landing`.

## Provider contract

`OnboardingProvider` (wrapped by `OnboardingLayout`) guarantees:

- `organization` is loaded before any guarded step renders.
- `error` is set when hydration fails, and the route page renders the existing error/loading UI.
- Route pages receive context via `useOnboardingContext()`.

## Step guard contract

`StepGuard` evaluates the requested `step` against the resolved `organization.currentStep` using the canonical step order. It returns `{ allowed, redirectTo, reason }`. Completed steps are always allowed; future steps redirect to the furthest reachable valid step.
