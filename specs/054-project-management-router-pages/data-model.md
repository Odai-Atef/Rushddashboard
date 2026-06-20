# Data Model: Project Management Router Pages

**Feature**: Project Management Router Pages  
**Date**: 2026-06-20

## Overview

This feature does not introduce new backend entities or data persistence. It reuses the existing `Project` entity and related view concepts already defined in `src/app/components/ProjectManagementModule.tsx`. The only new conceptual entity is the set of routable **Project Management Views**.

## Entities

### Project

A charitable or development initiative managed within the platform.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | Unique project identifier, used in URL parameters. |
| name | string | Display name of the project. |
| organization | string | Name of the owning organization. |
| type | string | Project type (e.g., تنموي, خيري, تدريبي, إغاثي, صحي). |
| category | string | High-level category (e.g., التمكين الاقتصادي). |
| status | ProjectStatus | Current lifecycle status of the project. |
| budget | number | Estimated budget in Saudi Riyals. |
| duration | string | Human-readable duration (e.g., "12 شهر"). |
| startDate | string (ISO date) | Project start date. |
| endDate | string (ISO date) | Project end date. |
| progress | number (0-100) | Completion percentage. |
| manager | string | Name of the project manager. |
| description | string | Detailed project description. |
| beneficiaries | string | Target beneficiaries description. |
| geographicScope | string | Geographic coverage of the project. |
| lastUpdated | string (ISO date) | Last update timestamp. |
| version | number | Current version number. |
| health | 'excellent' \| 'good' \| 'at-risk' \| 'critical' | Project health indicator. |

### ProjectStatus

A lifecycle state machine with the following allowed values:

`draft`, `charity-review`, `incubator-modifications`, `charity-approval`, `pm-approval`, `financial-approval`, `approved`, `design-team`, `ready-donor`, `submitted-donor`, `funded`, `execution`, `completed`, `closed`.

No state-transition rules are enforced by this routing feature; transitions remain handled by the existing UI logic and future backend workflows.

### Project Management View

A routable screen within the project management module.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | View identifier: `dashboard`, `list`, `create`, `details`, `lifecycle`, `versions`, `activity`, `reporting`. |
| label | string | Arabic label shown in the UI. |
| path | string | URL path fragment under `/dashboard/project-management/`. |
| requiresProjectId | boolean | Whether the view needs a `projectId` URL parameter. |

## Relationships

- A **Project Management View** may display **zero or one Project** (dashboard, list, create, reporting show no specific project; details/lifecycle/versions/activity require one).
- **Project** entities are looked up by `id` from the route parameter. No relationships between projects are introduced by this feature.

## Validation Rules

- `projectId` in the URL is treated as an opaque string.
- If `projectId` is missing or no project with that id exists, the application displays an error message or redirects to the project list, per the spec clarification.
