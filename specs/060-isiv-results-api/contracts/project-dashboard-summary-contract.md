# API Contract: ISIV Assessment Results

**Endpoint**: `GET /api/v1/onboarding/assessments/{organizationId}/isiv-results`

**Authentication**: `Authorization: Bearer <jwt_token>`

**Purpose**: Return the ISIV readiness evaluation result for a specific organization, replacing hardcoded sample data on the charity assessment results page.

## Request

- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Path Parameters**:
  - `organizationId` (string, required): UUID or opaque identifier of the organization whose results are requested.
- **Query Parameters**: None
- **Body**: None

## Success Response

**Status**: `200 OK`

**Body**:

```json
{
  "organizationId": "org_123",
  "overallScore": 73,
  "qualificationStatus": "QUALIFIED",
  "qualificationMessage": "منظمتك مؤهلة للتقدم إلى المرحلة التالية بناءً على تقييم الجاهزية.",
  "radarData": [
    { "category": "الحوكمة", "score": 85, "fullMark": 100 },
    { "category": "المالية", "score": 72, "fullMark": 100 },
    { "category": "الموارد البشرية", "score": 68, "fullMark": 100 },
    { "category": "المتطوعين", "score": 78, "fullMark": 100 },
    { "category": "التكنولوجيا", "score": 58, "fullMark": 100 },
    { "category": "المشاريع", "score": 75, "fullMark": 100 },
    { "category": "جمع التبرعات", "score": 65, "fullMark": 100 },
    { "category": "قياس الأثر", "score": 70, "fullMark": 100 },
    { "category": "الاستراتيجية", "score": 80, "fullMark": 100 },
    { "category": "المخاطر", "score": 62, "fullMark": 100 }
  ],
  "strengths": [
    {
      "area": "الحوكمة والامتثال",
      "score": 85,
      "insight": "لديكم هيكل حوكمة قوي ومجلس إدارة نشط مع امتثال ممتاز للأنظمة"
    }
  ],
  "weaknesses": [
    {
      "area": "التكنولوجيا والنضج الرقمي",
      "score": 58,
      "severity": "critical",
      "issue": "مستوى منخفض من التحول الرقمي وضعف في الأمن السيبراني",
      "recommendation": "الاستثمار في البنية التحتية التقنية وتدريب الفريق على الأدوات الرقمية"
    },
    {
      "area": "إدارة المخاطر",
      "score": 62,
      "severity": "high",
      "issue": "عدم وجود إطار شامل لإدارة المخاطر",
      "recommendation": "إنشاء سجل مخاطر وتطوير خطط طوارئ للمخاطر الحرجة"
    }
  ],
  "benchmarks": {
    "yourScore": 73,
    "sectorAverage": 68,
    "topPerformer": 85
  },
  "assessedAt": "2026-05-11T12:00:00Z"
}
```

## Response Schema

### `IsivAssessmentResult`

| Field | Type | Description |
|-------|------|-------------|
| `organizationId` | `string` | Organization identifier |
| `overallScore` | `number` | Aggregate readiness score (0–100) |
| `qualificationStatus` | `string` | Machine-readable qualification status |
| `qualificationMessage` | `string` | Arabic qualification message shown to the user |
| `radarData` | `RadarDatum[]` | Radar chart data points |
| `strengths` | `Strength[]` | Strengths list |
| `weaknesses` | `Weakness[]` | Weaknesses/gaps list |
| `benchmarks` | `Benchmarks` | Benchmark comparison values |
| `assessedAt` | `string` (ISO 8601) | Evaluation timestamp |

### `RadarDatum`

| Field | Type | Description |
|-------|------|-------------|
| `category` | `string` | Category name |
| `score` | `number` | Category score |
| `fullMark` | `number` | Maximum reference score |

### `Strength`

| Field | Type | Description |
|-------|------|-------------|
| `area` | `string` | Category name |
| `score` | `number` | Strength score |
| `insight` | `string` | Human-readable insight |

### `Weakness`

| Field | Type | Description |
|-------|------|-------------|
| `area` | `string` | Category name |
| `score` | `number` | Weakness score |
| `severity` | `"critical" \| "high" \| "medium" \| "low"` | Severity level |
| `issue` | `string` | Problem description |
| `recommendation` | `string` | Improvement recommendation |

### `Benchmarks`

| Field | Type | Description |
|-------|------|-------------|
| `yourScore` | `number` | Organization score |
| `sectorAverage` | `number` | Sector average score |
| `topPerformer` | `number` | Top performer score |

## Error Responses

- **400 Bad Request**: Missing or invalid `organizationId`.
- **401 Unauthorized**: Missing or invalid JWT token.
- **403 Forbidden**: User lacks permission to view this organization's results.
- **404 Not Found**: No ISIV results exist for the given organization.
- **500 Internal Server Error**: Server-side failure.

**Frontend handling**: On any non-2xx response, display an Arabic error message such as "تعذر تحميل نتائج التقييم" and optionally offer a retry action.

## Optional Companion Endpoint

**Endpoint**: `GET /api/v1/onboarding/assessments/{organizationId}/status`

**Purpose**: Lightweight status check to determine whether results are available before requesting the full ISIV payload.

**Response body**:

```json
{
  "status": "COMPLETED",
  "overallScore": 73,
  "completedAt": "2026-05-11T12:00:00Z"
}
```

**Usage**: The results page may call this endpoint first to avoid a 404 on the main endpoint, or it may call the main endpoint directly and handle 404 as an empty/error state.
