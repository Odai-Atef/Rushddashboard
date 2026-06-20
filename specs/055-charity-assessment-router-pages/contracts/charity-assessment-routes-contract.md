# Contract: Charity Assessment Routes

**Feature**: Charity Assessment Router Pages  
**Date**: 2026-06-21

## Overview

This contract defines the public URL interface between the user, the browser, and the charity assessment frontend module. The goal is to make every charity assessment screen reachable via a stable, bookmarkable URL.

## Participants

- **User**: Navigates the charity assessment module using links, browser controls, or direct URLs.
- **Browser**: Maintains history and address bar state.
- **React Router**: Matches URLs to page components.
- **Charity assessment page components**: Render the requested view.

## Route Contract

### Public URL paths

| Path | View |
|------|------|
| `/dashboard/charity-assessment` | Start / intro screen |
| `/dashboard/charity-assessment/assessment` | Assessment wizard |
| `/dashboard/charity-assessment/results` | Results dashboard |
| `/dashboard/charity-assessment/roadmap` | Improvement roadmap |

### Wildcard / unknown paths

Any path under `/dashboard/charity-assessment/*` that does not match the routes above MUST redirect to `/dashboard/charity-assessment` (start view).

## Navigation Contract

### In-app navigation

- Clicking "بدء التقييم" on the start view navigates to `/dashboard/charity-assessment/assessment`.
- Clicking "عرض نتائج سابقة" on the start view navigates to `/dashboard/charity-assessment/results`.
- Clicking "إنهاء التقييم" on the last assessment step navigates to `/dashboard/charity-assessment/results`.
- Clicking "عرض خارطة الطريق" on the results view navigates to `/dashboard/charity-assessment/roadmap`.
- Clicking "إعادة التقييم" on the results view navigates to `/dashboard/charity-assessment/assessment`.
- Clicking "العودة للنتائج" on the roadmap view navigates to `/dashboard/charity-assessment/results`.

### Browser behavior

- Back/forward buttons move through the user's history of visited charity assessment routes.
- Refreshing any valid route re-renders the same view.

## Rendering Rules

- Start view shows the module intro, readiness categories, expected outcomes, and primary actions.
- Assessment wizard shows one category of questions at a time with previous/next navigation and progress bar.
- Results dashboard shows the overall score, readiness level, radar chart, strengths, gaps, benchmark comparison, progress tracking, and roadmap CTA.
- Roadmap view shows prioritized improvement initiatives with status, effort, impact, due dates, and AI recommendations.

## Error Handling

- Unknown nested route: redirect to start view.
