# API Contracts: Assessment Results Display

**Feature**: Assessment Results Display  
**Date**: 2026-06-16

## Endpoints

### POST /api/v1/onboarding/assessment/submit

Finalizes the assessment and documents step and triggers backend evaluation.

**Authentication**: Bearer JWT

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | `string (UUID)` | Required | Organization identifier to scope the request. |

**Request Body**: None

**Success Response**: `200 OK`

```json
{
  "organizationId": "org-uuid",
  "status": "COMPLETED",
  "submittedAt": "2026-06-16T10:00:00Z"
}
```

**Error Responses**:

- `401 Unauthorized`

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

- `404 Not Found` (organization not found)

```json
{
  "statusCode": 404,
  "message": "Organization not found"
}
```

- `409 Conflict` (assessment already submitted)

```json
{
  "statusCode": 409,
  "message": "Assessment already submitted"
}
```

---

### GET /api/v1/onboarding/assessments/{organizationId}/results

Retrieves the ISIV evaluation result for an organization. May be called immediately after submission and on returning to the results view.

**Authentication**: Bearer JWT

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | `string (UUID)` | Required | Organization identifier. |

**Success Response**: `200 OK`

```json
{
  "overallScore": 72,
  "qualificationStatus": "WITH_IMPROVEMENT",
  "dimensions": [
    {
      "dimension": "institutional_building",
      "dimensionLabelAr": "البناء المؤسسي",
      "symbol": "I",
      "score": 18,
      "percentage": 60,
      "tier": "EMERGING",
      "tierLabelAr": "نامي",
      "color": "#F59E0B"
    },
    {
      "dimension": "social_impact",
      "dimensionLabelAr": "التأثير الاجتماعي",
      "symbol": "S",
      "score": 24,
      "percentage": 80,
      "tier": "DEVELOPED",
      "tierLabelAr": "متطور",
      "color": "#10B981"
    },
    {
      "dimension": "investment_readiness",
      "dimensionLabelAr": "الاستعداد للاستثمار",
      "symbol": "I",
      "score": 15,
      "percentage": 50,
      "tier": "EMERGING",
      "tierLabelAr": "نامي",
      "color": "#F59E0B"
    },
    {
      "dimension": "value_creation",
      "dimensionLabelAr": "خلق القيمة",
      "symbol": "V",
      "score": 15,
      "percentage": 50,
      "tier": "EMERGING",
      "tierLabelAr": "نامي",
      "color": "#F59E0B"
    }
  ],
  "diagnosis": "المؤسسة تتمتع بتأثير اجتماعي قوي لكنها ما زالت في مرحلة البناء المؤسسي وتحتاج إلى تحسين الاستعداد للاستثمار وآليات خلق القيمة.",
  "strengths": [
    "تأثير اجتماعي مرتفع ومتواصل",
    "وجود فريق عمل ملتزم"
  ],
  "weaknesses": [
    "البنية المؤسسية تحتاج إلى مزيد من التوثيق",
    "الاستعداد للاستثمار لا يزال محدوداً"
  ]
}
```

**Error Responses**:

- `401 Unauthorized`

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

- `404 Not Found` (organization or assessment result not found)

```json
{
  "statusCode": 404,
  "message": "Assessment results not found"
}
```

- `422 Unprocessable Entity` (assessment not yet submitted or still processing)

```json
{
  "statusCode": 422,
  "message": "Assessment results not available yet"
}
```

---

### GET /api/v1/onboarding/assessments/{organizationId}/status

Returns the lightweight status of the assessment.

**Authentication**: Bearer JWT

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | `string (UUID)` | Required | Organization identifier. |

**Success Response**: `200 OK`

```json
{
  "status": "COMPLETED",
  "overallScore": 72,
  "completedAt": "2026-06-16T10:00:00Z"
}
```

**Error Responses**:

- `401 Unauthorized`

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

- `404 Not Found` (organization not found)

```json
{
  "statusCode": 404,
  "message": "Organization not found"
}
```

## Frontend Service Methods

```typescript
interface IsivDimension {
  dimension: string;
  dimensionLabelAr: string;
  symbol: string;
  score: number;
  percentage: number;
  tier: string;
  tierLabelAr: string;
  color: string;
}

interface IsivAssessmentResult {
  overallScore: number;
  qualificationStatus: string;
  dimensions: IsivDimension[];
  diagnosis: string;
  strengths: string[];
  weaknesses: string[];
}

interface AssessmentStatus {
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  overallScore: number | null;
  completedAt: string | null;
}

interface AssessmentSubmissionResponse {
  organizationId: string;
  status: string;
  submittedAt: string;
}

// POST /api/v1/onboarding/assessment/submit?organizationId=...
async submitAssessment(organizationId: string): Promise<ApiResponse<AssessmentSubmissionResponse>>

// GET /api/v1/onboarding/assessments/:organizationId/results
async getAssessmentResults(organizationId: string): Promise<ApiResponse<IsivAssessmentResult>>

// GET /api/v1/onboarding/assessments/:organizationId/status
async getAssessmentStatus(organizationId: string): Promise<ApiResponse<AssessmentStatus>>
```

## Integration Notes

- The frontend MUST call `submitAssessment` immediately when the user clicks "إرسال التقييم".
- After a successful submit response, the frontend MUST call `getAssessmentResults` and display the returned `IsivAssessmentResult`.
- The frontend MUST show a loading indicator between submit and successful results fetch.
- If `getAssessmentResults` fails, the frontend MUST show an Arabic-friendly error and a manual retry action that retries only the results fetch.
- The frontend MUST NOT silently auto-retry on slow responses.
- On a `401` response, the frontend SHOULD redirect to login or surface a session-expired message using existing auth handling.
- The frontend MUST render the exact `qualificationStatus`, `dimensionLabelAr`, `tierLabelAr`, and `color` values supplied by the backend without hard-coding ISIV taxonomy details.
- The frontend MUST render the radar chart using the four `dimensions` entries, mapping `symbol` to the chart axis and `percentage` to the chart value.
