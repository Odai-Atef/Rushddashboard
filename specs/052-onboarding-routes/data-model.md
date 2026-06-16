# Data Model: Onboarding Route Refactor

**Feature**: Onboarding Route Refactor  
**Date**: 2026-06-16

This feature does not introduce new backend entities. It reorganizes existing onboarding data into a URL-addressable page flow and a shared provider context.

## Context entities

### `OnboardingStep`

A named step in the charity onboarding wizard.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | One of: `landing`, `registration`, `profile`, `assessment`, `documents`, `processing`, `results`, `analysis`, `roadmap`, `decision`. |
| `label` | `string` | Display label used for progress UI and debugging. |
| `order` | `number` | Canonical order used for guard logic (registration → profile → assessment → documents → processing → results → analysis → roadmap → decision). |

### `OnboardingRouteParams`

URL-derived parameters for the route.

| Field | Type | Description |
|-------|------|-------------|
| `step` | `OnboardingStep` | Active step parsed from the path segment `:step`. |
| `organizationId` | `string \| undefined` | Optional identifier parsed from the `?organizationId=...` query parameter. |

### `OnboardingContextState`

Shared state exposed by `OnboardingProvider` to all route pages.

| Field | Type | Description |
|-------|------|-------------|
| `organization` | `Organization \| null` | Current organization loaded from `/api/v1/onboarding/organizations/me` or `getOrganization(id)`. |
| `profile` | `OrganizationProfileResponse \| null` | Organization profile, hydrated when needed. |
| `fundingAreas` | `FundingArea[]` | Available funding areas for the profile form. |
| `assessmentStatus` | `AssessmentStatus \| null` | Latest assessment status. |
| `assessmentResult` | `IsivAssessmentResult \| null` | Latest assessment results. |
| `documents` | `OrganizationDocument[]` | Uploaded documents list. |
| `isLoading` | `boolean` | Global loading flag for provider hydration. |
| `error` | `string \| null` | Global hydration or guard error message. |

### `StepGuardResult`

Result of evaluating whether a requested route is allowed.

| Field | Type | Description |
|-------|------|-------------|
| `allowed` | `boolean` | True when the step can be rendered. |
| `redirectTo` | `OnboardingStep \| undefined` | Target step to redirect to when not allowed. |
| `reason` | `string \| undefined` | Human-readable reason for the redirect (used for debugging). |

## Relationships

- `OnboardingProvider` loads `organization` first.
- If `organizationId` is present in the URL and differs from the JWT organization, `OnboardingProvider` calls `getOrganization(id)`.
- Each route page reads `organization` and other context state; it never stores its own copy of the organization identifier.
- `StepGuard` uses `organization.currentStep` and a static step order to decide `allowed`/`redirectTo`.

## Validation rules

- `step` must match one of the known `OnboardingStep` values; otherwise redirect to `landing`.
- `organizationId` query parameter, when present, must be a non-empty string. Invalid values fall back to context resolution.
- A step is considered completed if its `order` is less than or equal to the resolved `currentStep` order from the server.

## No new backend schemas

All data shapes are already defined in `src/api/services/onboarding-service.ts`. The refactor only adds the context and routing layer.
