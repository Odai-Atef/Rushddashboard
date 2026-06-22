# Data Model: ISIV Charity Assessment Results

## Entities

### IsivAssessmentResult

Top-level snapshot returned by `GET /api/v1/onboarding/assessments/{organizationId}/isiv-results` and consumed by the charity assessment results page.

| Field | Type | Description |
|-------|------|-------------|
| `organizationId` | `string` | Identifier of the assessed organization |
| `overallScore` | `number` | Aggregate readiness score (0–100) |
| `qualificationStatus` | `string` | Machine-friendly qualification status, e.g., `QUALIFIED`, `NOT_QUALIFIED` |
| `qualificationMessage` | `string` (optional) | Human-readable Arabic qualification message |
| `dimensions` | `IsivDimension[]` (optional) | Detailed dimension breakdown |
| `categoryScores` | `CategoryScore[]` (optional) | Score per assessment category |
| `radarData` | `RadarDatum[]` (optional) | Dimension scores formatted for radar chart |
| `diagnosis` | `string` (optional) | Overall diagnostic summary |
| `strengths` | `Strength[]` | Areas where the organization scored well |
| `weaknesses` | `Weakness[]` | Areas requiring improvement |
| `benchmarks` | `Benchmarks` (optional) | Comparison with sector average and top performer |
| `assessedAt` | `string` (ISO 8601, optional) | Timestamp of the evaluation |

### RadarDatum

A single dimension score used by the radar chart.

| Field | Type | Description |
|-------|------|-------------|
| `category` | `string` | Arabic or English dimension/category name |
| `score` | `number` | Organization score for the dimension |
| `fullMark` | `number` | Reference maximum, typically 100 |

### Strength

A positively scored assessment area.

| Field | Type | Description |
|-------|------|-------------|
| `area` | `string` | Dimension or category name |
| `score` | `number` | Score for the strength |
| `insight` | `string` | Descriptive insight or explanation |
| `icon` | `string` (optional) | Icon identifier for visual representation |

### Weakness

An underperforming assessment area with remediation guidance.

| Field | Type | Description |
|-------|------|-------------|
| `area` | `string` | Dimension or category name |
| `score` | `number` | Score for the weakness |
| `insight` | `string` (optional) | Descriptive insight |
| `severity` | `"critical" \| "high" \| "medium" \| "low"` | Severity level driving color coding |
| `issue` | `string` (optional) | Description of the problem |
| `recommendation` | `string` (optional) | Suggested improvement action |

### Benchmarks

Comparison values for the benchmark bar chart.

| Field | Type | Description |
|-------|------|-------------|
| `yourScore` | `number` | Organization aggregate score |
| `sectorAverage` | `number` | Average score across the sector |
| `topPerformer` | `number` | Best-in-class score |

### AssessmentStatus

Lightweight status returned by `GET /api/v1/onboarding/assessments/{organizationId}/status`.

| Field | Type | Description |
|-------|------|-------------|
| `status` | `"COMPLETED" \| "IN_PROGRESS" \| "NOT_STARTED"` | Assessment lifecycle status |
| `overallScore` | `number \| null` | Score if completed |
| `completedAt` | `string \| null` (ISO 8601) | Completion timestamp |
