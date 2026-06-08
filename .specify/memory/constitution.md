<!--
  SYNC IMPACT REPORT
  Version change: N/A (Initial creation) → 1.0.0
  Modified principles: N/A (Initial creation)
  Added sections: Core Principles (5), Architecture Standards, Development Workflow, Reusable Components, API Design, Docker & Environment, Governance
  Removed sections: N/A
  Templates requiring updates:
    - ✅ .specify/templates/constitution-template.md (aligned)
    - ⚠️ .specify/templates/plan-template.md (add Docker and environment check gates)
    - ⚠️ .specify/templates/spec-template.md (add component reusability requirements)
    - ⚠️ .specify/templates/tasks-template.md (add OOP and clean code task categories)
  Follow-up TODOs: None
-->

# Rushd Platform Constitution

## Core Principles

### I. Component Reusability (NON-NEGOTIABLE)
Every UI element MUST be built as a reusable, composable component.
- Components MUST accept props for customization and configuration.
- Shared logic MUST be extracted into custom hooks or utility functions.
- Hardcoded data MUST be externalized to props, context, or configuration files.
- Rationale: Reduces duplication, improves maintainability, enables rapid feature development.

### II. Clean Code & Object-Oriented Design
All code MUST follow clean code principles and leverage OOP patterns where beneficial.
- Each class MUST have a single responsibility (SRP).
- Services MUST encapsulate API logic behind clear, typed interfaces.
- State management MUST be explicit, predictable, and centralized where possible.
- Rationale: Scales team collaboration, simplifies testing, and reduces bug surface area.

### III. Environment-Driven Configuration (NON-NEGOTIABLE)
Environment-specific values MUST NOT be hardcoded.
- `.env` files MUST be used for all secrets, API endpoints, and feature flags.
- Docker build process MUST read from `.env` at image build time and runtime.
- `.env` files MUST be committed as templates (`.env.example`), never with real secrets.
- Rationale: Enables secure, multi-environment deployments without code changes.

### IV. API Abstraction Layer
All API communication MUST pass through a dedicated, object-oriented client layer.
- `ApiClient` class MUST encapsulate HTTP client setup (base URL, headers, interceptors).
- Service classes MUST extend or compose `ApiClient` for domain-specific endpoints.
- Error handling MUST be centralized and return typed errors.
- Rationale: Decouples components from transport details, simplifies mocking, and standardizes request/response handling.

### V. Comprehensive Documentation
The project MUST maintain an up-to-date README and inline code documentation.
- README MUST explain setup, required environment variables, build commands, and architecture overview.
- Complex components and services MUST include JSDoc comments.
- Rationale: Reduces onboarding friction and preserves institutional knowledge.

## Architecture Standards

### Frontend
- **Framework**: React 18.x with TypeScript.
- **Styling**: Tailwind CSS with shadcn/ui component primitives.
- **Routing**: React Router v7 declarative routing.
- **State**: React hooks + Context for global state; external libraries only when justified.

### Backend / API
- **Pattern**: Clean Architecture / Layered Architecture.
- **Client**: Object-oriented API client with typed request/response models.
- **Error Handling**: Centralized interceptor logging user-friendly messages.

## Development Workflow

1. **Branching**: Feature branches off `main`; PRs require review.
2. **Code Quality**: All code MUST pass linting and formatting (e.g., ESLint, Prettier).
3. **Testing**: Unit tests for reusable components and service methods; integration tests for critical user journeys.
4. **Commit Messages**: Follow conventional commits (e.g., `feat:`, `fix:`, `docs:`).
5. **Docker**: Every PR MUST result in a valid, buildable Docker image reading from `.env`.

## Governance

This constitution supersedes all other coding practices.
- **Amendments**: Require a PR, team review, and explicit version bump.
- **Compliance**: All PRs must pass a "Constitution Check" verifying:
  - No hardcoded secrets or API URLs.
  - Components are reusable (not copy-pasted with minor changes).
  - API calls use the abstracted client layer.
  - README is updated if setup or architecture changes.
- **Versioning**: SemVer applied to this document (MAJOR for breaking principle changes, MINOR for additions, PATCH for clarifications).

**Version**: 1.0.0 | **Ratified**: 2026-06-08 | **Last Amended**: 2026-06-08
