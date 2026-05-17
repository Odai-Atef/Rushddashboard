# Implementation Plan: Frontend JWT Authentication Integration

**Branch**: `001-rushd-frontend-auth` | **Date**: 2026-05-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-frontend-jwt-auth/spec.md`

## Summary

Integrate the Rushd frontend registration and sign-in pages with backend JWT authentication endpoints. Replace the current simulated authentication with real API calls, persist JWT tokens in localStorage, implement automatic token refresh, and add route guards for protected dashboard pages.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3+  
**Primary Dependencies**: React Router 7.x, React Hook Form 7.55.0, Zod (validation), Native fetch with typed service layer  
**Storage**: localStorage (JWT tokens), React Context (auth state)  
**Testing**: Vitest, React Testing Library, Playwright (E2E)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (React SPA with Vite)  
**Performance Goals**: Auth operations complete in under 2 seconds, seamless session restoration on page load  
**Constraints**: Bundle size monitoring, no secrets in client-side code, RTL layout support  
**Scale/Scope**: Single-tenant dashboard application for business executives and investors

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Component-First Architecture
- **Status**: PASS
- **Rationale**: Auth logic will be extracted into a dedicated `AuthContext` provider, API calls centralized in `services/auth.ts`, and form logic extracted into reusable hooks. No single module will exceed 300 lines.

### Principle II: Clean Code & Quality Standards
- **Status**: PASS
- **Rationale**: All new code will follow existing naming conventions (PascalCase components, camelCase functions). Form validation will use Zod schemas. No magic strings (token keys, API endpoints will be constants).

### Principle III: API Integration & Resilience
- **Status**: PASS
- **Rationale**: All API calls centralized through typed service layer with consistent error handling. Loading states shown during auth operations. TypeScript interfaces for all API request/response types.

### Principle IV: Performance & Responsive Design
- **Status**: PASS
- **Rationale**: Auth pages are already responsive using Tailwind CSS. No additional heavy libraries needed. Token storage/retrieval is synchronous and fast.

### Principle V: Containerization & Environment Consistency
- **Status**: PASS (N/A for this feature)
- **Rationale**: No Docker changes required. API base URL will be externalized to environment variables as per existing patterns.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-jwt-auth/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   ├── LoginPage.tsx           # Updated: integrate real auth API
│   │   └── RegistrationPage.tsx    # Updated: integrate real auth API
│   ├── layouts/
│   │   └── RootLayout.tsx          # Updated: enhanced auth context with JWT
│   ├── services/
│   │   └── auth.ts                 # NEW: centralized auth API service
│   ├── hooks/
│   │   └── useAuth.ts              # NEW: extracted auth hook (from RootLayout)
│   ├── types/
│   │   └── auth.ts                 # NEW: TypeScript interfaces for auth DTOs
│   └── utils/
│       └── auth.ts                 # NEW: token storage/retrieval utilities
```

**Structure Decision**: Single project structure (React SPA). Auth feature touches existing components (LoginPage, RegistrationPage, RootLayout) and adds new service/hook/type modules following the established `src/app/` organization pattern.

## Constitution Check (Post-Design)

*Re-evaluated after Phase 1 design decisions.*

### Principle I: Component-First Architecture
- **Status**: PASS
- **Verification**: Auth logic extracted to `services/auth.ts`, `hooks/useAuth.ts`, and `utils/auth.ts`. Components updated to use hooks. All modules under 300 lines.

### Principle II: Clean Code & Quality Standards
- **Status**: PASS
- **Verification**: Zod schemas for form validation. Named constants for storage keys. PascalCase components, camelCase functions.

### Principle III: API Integration & Resilience
- **Status**: PASS
- **Verification**: Centralized auth service with typed responses. Loading states on auth buttons. Error handling with user-friendly messages.

### Principle IV: Performance & Responsive Design
- **Status**: PASS
- **Verification**: No new heavy dependencies. Auth state restoration is synchronous from localStorage.

### Principle V: Containerization & Environment Consistency
- **Status**: PASS (N/A)
- **Verification**: API base URL externalized to env var. No Docker changes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are satisfied by the planned architecture.
