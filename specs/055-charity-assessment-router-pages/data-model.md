# Data Model: Charity Assessment Router Pages

**Feature**: Charity Assessment Router Pages  
**Date**: 2026-06-21

## Overview

This feature does not introduce new backend entities or data persistence. It reuses the existing charity readiness assessment concepts already defined in `src/app/components/CharityAssessmentPage.tsx`. The only new conceptual entity is the set of routable **Charity Assessment Views**.

## Entities

### Charity Assessment View

A routable screen within the charity assessment module.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | View identifier: `start`, `assessment`, `results`, `roadmap`. |
| label | string | Arabic label shown in the UI. |
| path | string | URL path fragment under `/dashboard/charity-assessment/`. |

### Assessment Category

A readiness dimension evaluated by the charity assessment wizard.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | Unique category identifier, e.g., `governance`, `financial`, `hr`. |
| name | string | Arabic display name, e.g., `الحوكمة والامتثال`. |
| icon | Lucide icon component | Visual icon used in the UI. |
| questions | Question[] | Ordered list of questions in this category. |
| score | number (0-100) | Predefined score used by the mock results view. |

### Question

A single readiness question inside a category.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | Unique question identifier. |
| question | string | Arabic question text. |
| type | 'scale' \| 'yesno' \| 'multiple' | Question interaction type. |
| options | string[] | Optional choices for `multiple` questions. |
| answer | any | User-provided answer (not persisted in this refactor). |

### Strength

A positive readiness insight displayed in the results dashboard.

| Attribute | Type | Description |
|-----------|------|-------------|
| category | string | Arabic category name. |
| score | number (0-100) | Readiness score for this strength. |
| insight | string | Arabic explanation of the strength. |

### Gap

An improvement area displayed in the results dashboard.

| Attribute | Type | Description |
|-----------|------|-------------|
| category | string | Arabic category name. |
| severity | 'critical' \| 'high' \| 'medium' | Severity level. |
| issue | string | Arabic description of the gap. |
| recommendation | string | Arabic recommendation for improvement. |

### Roadmap Item

A prioritized improvement initiative in the roadmap view.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | Unique roadmap item identifier. |
| title | string | Arabic initiative title. |
| priority | 'high' \| 'medium' \| 'low' | Priority level. |
| effort | string | Arabic effort estimate. |
| impact | string | Arabic impact estimate. |
| category | string | Arabic category label. |
| status | 'pending' \| 'in-progress' \| 'completed' | Current status. |
| dueDate | string (ISO date) | Target completion date. |

## Relationships

- A **Charity Assessment View** displays zero or more **Assessment Categories**, **Strengths**, **Gaps**, or **Roadmap Items** depending on the active view.
- **Assessment Categories** contain **Questions**.
- No relationships between assessments are introduced by this feature.

## Validation Rules

- All four view identifiers (`start`, `assessment`, `results`, `roadmap`) have unique, stable URL paths.
- Unknown nested paths under `/dashboard/charity-assessment/*` redirect to the start view.
