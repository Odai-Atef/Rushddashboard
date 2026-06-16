# API Contracts: Save Assessment Answers

**Feature**: Save Assessment Answers  
**Date**: 2026-06-15

## Endpoints

### GET /api/v1/onboarding/assessment/state

Retrieve the full assessment state for the authenticated organization, including categories, questions, saved answers, and progress.

**Authentication**: Bearer JWT + OrganizationScopeGuard (requires organization in context)

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | `string (UUID)` | Required | Organization identifier to scope the request. |

**Example**: `GET /api/v1/onboarding/assessment/state?organizationId=uuid`

**Response**: `200 OK`

```json
{
  "organizationId": "uuid",
  "categories": [
    {
      "categoryId": "institutional_building",
      "categoryName": "البناء المؤسسي",
      "totalQuestions": 6,
      "answeredQuestions": 4,
      "isComplete": false,
      "questions": [
        {
          "id": "uuid-1",
          "questionText": "...",
          "questionType": "SCALE",
          "options": null,
          "isRequired": true,
          "sortOrder": 1
        }
      ],
      "answers": [
        {
          "questionId": "uuid-1",
          "questionType": "SCALE",
          "answerValue": null,
          "answerNumeric": 5,
          "selectedOptions": null,
          "fileUrl": null
        }
      ]
    },
    {
      "categoryId": "governance",
      "categoryName": "الحوكمة",
      "totalQuestions": 6,
      "answeredQuestions": 6,
      "isComplete": true,
      "answers": []
    }
  ],
  "overallProgress": 67
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

- `404 Not Found` (no organization)

```json
{
  "statusCode": 404,
  "message": "Organization not found"
}
```

### PUT /api/v1/onboarding/assessment/answers

Batch upsert assessment answers for the authenticated organization.

**Authentication**: Bearer JWT + OrganizationScopeGuard

**URL**: `PUT /api/v1/onboarding/assessment/answers?organizationId=YOUR_ORG_UUID`

**Request Body**:

```json
{
  "answers": [
    {
      "questionId": "0fec93cf-6060-4da0-9b6d-08537b518799",
      "answerNumeric": 4,
      "answerValue": null,
      "selectedOptions": null
    },
    {
      "questionId": "uuid-2",
      "answerNumeric": null,
      "answerValue": "yes",
      "selectedOptions": null
    },
    {
      "questionId": "uuid-3",
      "answerNumeric": null,
      "answerValue": null,
      "selectedOptions": ["choice1", "choice2"]
    }
  ]
}
```

**Success Response**: `200 OK`

```json
[
  {
    "questionId": "0fec93cf-6060-4da0-9b6d-08537b518799",
    "questionType": "SCALE",
    "answerValue": null,
    "answerNumeric": 4,
    "selectedOptions": null,
    "fileUrl": null
  },
  {
    "questionId": "uuid-2",
    "questionType": "YES_NO",
    "answerValue": "yes",
    "answerNumeric": null,
    "selectedOptions": null,
    "fileUrl": null
  },
  {
    "questionId": "uuid-3",
    "questionType": "MULTIPLE_CHOICE",
    "answerValue": null,
    "answerNumeric": null,
    "selectedOptions": ["choice1", "choice2"],
    "fileUrl": null
  }
]
```

**Error Responses**:

- `400 Bad Request` (validation error)

```json
{
  "statusCode": 400,
  "message": "Validation failed"
}
```

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

## Answer Value Mapping

| QuestionType | Field to use | Value type | Example |
|--------------|--------------|------------|---------|
| SCALE | `answerNumeric` | number 1–5 | `5` |
| YES_NO | `answerValue` | string `"yes"` or `"no"` | `"yes"` |
| MULTIPLE_CHOICE | `selectedOptions` | string[] | `["choice1", "choice2"]` |
| FILE_UPLOAD | `answerValue` | string (file URL) | `"https://.../file.pdf"` |

## Frontend Service Methods

```typescript
interface SaveAnswerPayload {
  questionId: string;
  answerNumeric: number | null;
  answerValue: string | null;
  selectedOptions: string[] | null;
}

// GET /api/v1/onboarding/assessment/state?organizationId=...
async getAssessmentState(organizationId?: string): Promise<ApiResponse<AssessmentState>>

// PUT /api/v1/onboarding/assessment/answers
async saveAssessmentAnswers(
  answers: SaveAnswerPayload[],
  organizationId?: string
): Promise<ApiResponse<SavedAnswer[]>>
```

## Integration Notes

- The frontend MUST send only the answers being saved in the current submission scope (single category or entire assessment).
- The frontend SHOULD map each answer to exactly one populated field based on `questionType` and set the remaining fields to `null`.
- On a `400` response, the frontend MUST keep the user on the assessment screen, preserve all answers in local state, and display a user-friendly error.
- On a `401` response, the frontend SHOULD redirect to login or surface a session-expired message, depending on existing auth handling.
