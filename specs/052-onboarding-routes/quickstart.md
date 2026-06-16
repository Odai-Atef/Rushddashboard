# Quickstart: Onboarding Route Refactor

**Feature**: Onboarding Route Refactor  
**Date**: 2026-06-16  
**Branch**: `052-onboarding-routes`

## What this feature does

Converts the single-component charity onboarding wizard (`CharityOnboardingFlow.tsx`) into separate route-addressable pages under `/dashboard/onboarding/:step`. Each step is reachable via URL, refresh-safe, and shares state through an `OnboardingProvider` context. Required identifiers such as `organizationId` are passed via query parameters.

## Running the project

```bash
cd /Users/odai/.openclaw/workspace/Rushd/apps/frontend
npm install   # or pnpm install
npm run dev   # starts Vite dev server
npm run build # verifies production build
```

## Navigating the new routes

| URL | Description |
|-----|-------------|
| `/dashboard/onboarding` | Redirects to `/dashboard/onboarding/landing`. |
| `/dashboard/onboarding/registration` | Organization registration form. |
| `/dashboard/onboarding/profile` | Organization profile form. |
| `/dashboard/onboarding/assessment` | Readiness assessment wizard. |
| `/dashboard/onboarding/documents` | Document upload page. |
| `/dashboard/onboarding/processing` | Evaluation processing screen. |
| `/dashboard/onboarding/results` | Assessment results. |
| `/dashboard/onboarding/analysis` | Analysis view. |
| `/dashboard/onboarding/roadmap` | Development roadmap. |
| `/dashboard/onboarding/decision` | Final decision view. |

To pass a specific organization:

```text
/dashboard/onboarding/profile?organizationId=123
```

## Key files to inspect

- `src/app/routes.tsx` — route definitions.
- `src/app/pages/onboarding/` — one page component per step.
- `src/app/components/OnboardingLayout.tsx` — layout, provider, guards, hydration.
- `src/app/context/OnboardingContext.tsx` — shared state provider.
- `src/app/hooks/useOnboardingContext.ts` — context consumer hook.

## Verifying the refactor

1. Open any onboarding URL directly and confirm the correct step renders.
2. Refresh the page and confirm the same step and data reappear.
3. Use browser back/forward and confirm history moves through actual transitions.
4. Try a future step URL before completing prerequisites and confirm redirection.
5. Run `npm run build` and confirm no warnings or errors.
