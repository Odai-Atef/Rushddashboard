<!--
SYNC IMPACT REPORT
Version Change: N/A → 1.0.0
Modified Principles: All principles newly defined (initial constitution)
  - PRINCIPLE_1: Component-First Architecture (new)
  - PRINCIPLE_2: Clean Code & Quality Standards (new)
  - PRINCIPLE_3: API Integration & Resilience (new)
  - PRINCIPLE_4: Performance & Responsive Design (new)
  - PRINCIPLE_5: Containerization & Environment Consistency (new)
Added Sections:
  - Technology Stack & Architecture
  - Development Workflow & Quality Gates
  - Governance
Removed Sections: None
Templates Requiring Updates:
  - .specify/templates/plan-template.md (Constitution Check gates) - pending
  - .specify/templates/spec-template.md - no updates required
  - .specify/templates/tasks-template.md - no updates required
Follow-up TODOs: None
-->

# Rushd-Dashboard Constitution

## Core Principles

### I. Component-First Architecture

Every feature MUST be built as a reusable, self-contained component within a modular project structure. The codebase MUST be organized into clearly separated modules: components, pages, services, hooks, utilities, and state management. Components MUST be independently testable and documented. No single file or module MAY exceed 300 lines without explicit architectural justification. Shared logic MUST be extracted into hooks or utilities rather than duplicated across components.

**Rationale**: Modular architecture enables parallel development, simplifies maintenance, and ensures scalability as the application grows. Clear separation of concerns prevents tight coupling and makes the codebase approachable for new contributors.

### II. Clean Code & Quality Standards

All code MUST pass ESLint and Prettier checks without warnings before merging. Dead code, unused imports, and commented-out blocks MUST be removed proactively. Naming conventions MUST follow consistent patterns: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE_CASE for constants. Files MUST not exceed 300 lines; functions MUST not exceed 50 lines. Magic numbers and strings MUST be extracted into named constants or configuration files.

**Rationale**: Automated linting and formatting eliminate style debates and reduce cognitive load during code reviews. Enforcing size limits prevents unmaintainable monoliths and encourages decomposition into testable units.

### III. API Integration & Resilience

All API calls MUST be centralized through a dedicated service layer with consistent error handling. Network errors MUST be caught and surfaced to users with actionable messages, never silently swallowed. Form inputs MUST be validated on both client and server sides with clear, accessible error messaging. Loading states MUST be shown during asynchronous operations. API responses MUST be typed with TypeScript interfaces or Zod schemas.

**Rationale**: Centralized API services prevent duplication, ensure consistent error handling patterns, and make the application resilient to network failures. Strong typing catches integration mismatches at build time rather than runtime.

### IV. Performance & Responsive Design

The application MUST be responsive across mobile, tablet, and desktop viewports using Tailwind CSS breakpoints. Code splitting and lazy loading MUST be applied to all route-level components and heavy libraries. Images and assets MUST be optimized. Re-renders MUST be minimized using React.memo, useMemo, and useCallback where profiling justifies it. Bundle size MUST be monitored; no single route chunk MAY exceed 250KB gzipped without justification.

**Rationale**: Performance directly impacts user retention and conversion. Lazy loading and code splitting ensure users download only what they need, while responsive design guarantees accessibility across all devices.

### V. Containerization & Environment Consistency

The application MUST run identically in development, staging, and production via Docker. Multi-stage Docker builds MUST be used to minimize production image size. Docker Compose MUST orchestrate local development dependencies when required. All environment-specific configuration MUST be externalized into environment variables; no secrets MAY be committed to the repository. Health check endpoints MUST be exposed for container orchestration platforms.

**Rationale**: Docker eliminates "works on my machine" issues and ensures reproducible deployments. Externalized configuration allows the same image to run in any environment without rebuilds, improving security and deployment velocity.

## Technology Stack & Architecture

**Frontend Framework**: React 18.3+ with TypeScript
**Build Tool**: Vite 6.x
**Styling**: Tailwind CSS 4.x with shadcn/ui component primitives
**Routing**: React Router 7.x
**State Management**: React Context + hooks (or Zustand if global state complexity grows)
**Form Handling**: React Hook Form with Zod validation schemas
**HTTP Client**: Native fetch with a typed service abstraction layer
**Charts**: Recharts for data visualization
**Animations**: Framer Motion (via "motion" package) for UI transitions
**Testing**: Vitest for unit tests, React Testing Library for component tests, Playwright for E2E

**Project Structure**:
```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui primitives
├── pages/              # Route-level page components
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── utils/              # Helper functions and utilities
├── types/              # Shared TypeScript types and Zod schemas
├── stores/             # State management (if needed)
└── lib/                # Third-party integrations and configs
```

## Development Workflow & Quality Gates

1. **Branch Strategy**: Feature branches named `feature/###-short-description` branched from `main`
2. **Pre-commit Checks**: Husky + lint-staged MUST run ESLint and Prettier before every commit
3. **Pull Request Requirements**:
   - All CI checks (lint, typecheck, test) MUST pass
   - Code review approval from at least one maintainer
   - No console.log or debugger statements in production code
   - Accessibility (a11y) considerations verified for new UI components
4. **Testing Discipline**: Unit tests REQUIRED for all utilities and hooks; component tests REQUIRED for all reusable components; integration tests REQUIRED for critical user flows
5. **Documentation**: README MUST be updated for any new environment variables, Docker usage changes, or setup procedure modifications
6. **Dead Code Policy**: Unused files, components, and dependencies MUST be removed within the same sprint they become obsolete

## Governance

This constitution supersedes all other coding guidelines and practices. Amendments require:

1. A documented proposal explaining the change and its rationale
2. Approval from the project lead or a majority of active maintainers
3. A migration plan for existing code if the amendment affects current patterns
4. Version bump according to semantic versioning rules:
   - MAJOR: Backward-incompatible governance or principle redefinitions
   - MINOR: New principles or materially expanded guidance
   - PATCH: Clarifications, wording improvements, typo fixes

All pull requests MUST verify compliance with these principles. Complexity that violates size limits or architectural constraints MUST be justified in the PR description with a simpler alternative considered and rejected. The `.specify/templates/plan-template.md` Constitution Check gates MUST be updated whenever principles are added or removed.

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17