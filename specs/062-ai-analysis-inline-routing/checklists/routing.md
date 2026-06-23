# Routing Requirements Quality Checklist: AI Analysis Router Pages

**Purpose**: Validate the quality, clarity, completeness, and consistency of requirements for converting `/dashboard/ai-analysis` from inline routing to nested routable pages. This checklist focuses on the nested module and includes migration of the standalone history page / legacy component retirement.
**Created**: 2026-06-23
**Feature**: [spec.md](spec.md)
**Depth**: Reviewer PR gate
**Scope boundaries included**: Yes (migration of `/dashboard/analysis-history` and retirement of `AIAnalysisPage.tsx`)
**Risk gating focus**: URL/routing behavior, navigation state preservation, active nav highlighting

## Requirement Completeness

- [ ] CHK001 Are all required nested routes (`/dashboard/ai-analysis`, `/dashboard/ai-analysis/start`, `/dashboard/ai-analysis/chat`, `/dashboard/ai-analysis/history`) explicitly documented as requirements? [Completeness, Spec §FR-001–FR-006]
- [ ] CHK002 Are requirements defined for redirect behavior on unknown nested paths under `/dashboard/ai-analysis/*`? [Completeness, Spec §FR-007]
- [ ] CHK003 Are requirements defined for active sidebar and mobile navigation highlighting on all nested AI analysis routes? [Completeness, Spec §FR-010]
- [ ] CHK004 Are migration requirements for the existing `/dashboard/analysis-history` standalone route and `AIAnalysisPage.tsx` component explicitly stated? [Completeness, Spec §Assumptions, Plan §Project Structure]
- [ ] CHK005 Are all navigation actions that previously targeted `/dashboard/ai-analysis` with location state explicitly re-targeted to nested sub-pages? [Completeness, Spec §FR-011]

## Requirement Clarity

- [ ] CHK006 Is "direct access" clearly defined as visiting a URL without first loading the start page? [Clarity, Spec §FR-008]
- [ ] CHK007 Is the expected screen for each route unambiguous (start vs. chat workspace vs. history view)? [Clarity, Spec §User Story 1]
- [ ] CHK008 Is the term "without losing progress on refresh" clarified for the AI analysis module (URL preserved, not session state)? [Clarity, Spec §User Story 2]
- [ ] CHK009 Is the meaning of "unknown sub-path" precise and consistent with how other nested modules handle catch-all routes? [Clarity, Spec §FR-007, Plan §Technical Context]
- [ ] CHK010 Is the `continueAnalysisId`/`rerunAnalysisId` location-state contract clearly documented for both source and destination routes? [Clarity, Spec §FR-011, contracts/routing-contract.md]

## Requirement Consistency

- [ ] CHK011 Are URL path conventions consistent with existing nested modules such as `/dashboard/charity-assessment` and `/dashboard/project-management`? [Consistency, Spec §FR-001–FR-006, Plan §Research]
- [ ] CHK012 Is the navigation behavior consistent across sidebar, mobile nav, start page, chat page, and history page? [Consistency, Spec §FR-010, §FR-011, §User Story 3]
- [ ] CHK013 Is the fallback behavior for direct chat access consistent with the catch-all redirect behavior? [Consistency, Spec §FR-007 vs. §Edge Cases]
- [ ] CHK014 Are the requirements for preserving the original `/dashboard/ai-analysis` path as the start view consistent with the index route requirement? [Consistency, Spec §FR-004]

## Acceptance Criteria Quality

- [ ] CHK015 Are the success criteria measurable and technology-agnostic? [Measurability, Spec §SC-001–SC-005]
- [ ] CHK016 Is the "within 2 seconds" timing metric justified or linked to performance requirements? [Acceptance Criteria, Spec §SC-001]
- [ ] CHK017 Is the "100% of tested cases" refresh/back/forward success criterion defined in terms of specific routes and scenarios? [Acceptance Criteria, Spec §SC-002]
- [ ] CHK018 Is the manual regression check for existing functionality defined with explicit flows (start, chat, history)? [Acceptance Criteria, Spec §SC-004]

## Scenario Coverage

- [ ] CHK019 Are primary navigation scenarios (start → chat, chat → start, history → chat, new analysis) explicitly covered? [Coverage, Spec §User Story 3]
- [ ] CHK020 Are alternate navigation scenarios (direct URL entry, back/forward, refresh) explicitly covered? [Coverage, Spec §User Story 1–2]
- [ ] CHK021 Are requirements defined for the zero-state scenario when a user lands directly on `/dashboard/ai-analysis/chat` without an active analysis? [Coverage, Spec §Edge Cases]
- [ ] CHK022 Are requirements defined for the scenario where a user navigates away from an active streaming analysis? [Coverage, Spec §Edge Cases]

## Edge Case Coverage

- [ ] CHK023 Are edge-case requirements defined for invalid or unknown nested paths? [Edge Case, Spec §FR-007]
- [ ] CHK024 Are edge-case requirements defined for malformed or missing `continueAnalysisId`/`rerunAnalysisId` location state? [Edge Case, Spec §FR-011, §Edge Cases]
- [ ] CHK025 Are edge-case requirements defined for navigation from sidebar/mobile nav when already inside a nested AI analysis route? [Edge Case, Spec §Edge Cases]

## Non-Functional Requirements

- [ ] CHK026 Are performance requirements quantified beyond the high-level "within 2 seconds" success criterion? [NFR, Spec §SC-001]
- [ ] CHK027 Are accessibility requirements for keyboard navigation and screen readers on the new routes specified? [NFR, Gap]
- [ ] CHK028 Are requirements defined for how deep links/bookmarks behave after the route refactor? [NFR, Spec §User Story 1]

## Dependencies & Assumptions

- [ ] CHK029 Are all assumptions documented and validated, including React Router 7, no backend changes, and reuse of existing hooks? [Dependencies & Assumptions, Spec §Assumptions]
- [ ] CHK030 Is the assumption that unknown nested routes redirect to the start page rather than showing a 404 explicitly stated and agreed upon? [Assumption, Spec §Assumptions]
- [ ] CHK031 Is the dependency on `AnalysisHistoryPage.tsx` navigation target updates clearly owned by a specific requirement or task? [Traceability, Spec §FR-011, tasks.md T021]

## Ambiguities & Conflicts

- [ ] CHK032 Is the relationship between the index route `/dashboard/ai-analysis` and `/dashboard/ai-analysis/start` unambiguous? [Ambiguity, Spec §FR-004]
- [ ] CHK033 Is the retirement plan for `AIAnalysisPage.tsx` clear (thin wrapper vs. removal) to avoid orphaned code? [Ambiguity, Plan §Implementation Approach, tasks.md T006]
- [ ] CHK034 Is there a requirement specifying whether external links/bookmarks to the old `/dashboard/ai-analysis` behavior should continue working identically? [Gap, Spec §FR-010]

## Notes

- Check items off as completed: `[x]`
- Add comments or findings inline
- Link to relevant resources or documentation
- Items are numbered sequentially for easy reference
- This checklist is intended as a PR reviewer gate; all items should be resolvable before approving implementation
