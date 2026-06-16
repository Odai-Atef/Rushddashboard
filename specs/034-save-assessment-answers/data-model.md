# Data Model: Save Assessment Answers

**Feature**: Save Assessment Answers  
**Date**: 2026-06-15

## Entities

### Answer
Represents a single persisted response to an assessment question.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string (UUID)` | Yes | Unique identifier of the saved answer record. |
| `organizationId` | `string (UUID)` | Yes | Identifier of the organization the answer belongs to. |
| `questionId` | `string (UUID)` | Yes | Identifier of the assessment question being answered. |
| `answerNumeric` | `number \| null` | Yes | Numeric value for SCALE questions (1–5). Null for other types. |
| `answerValue` | `string \| null` | Yes | Text value for YES_NO ("yes"/"no") or FILE_UPLOAD (URL) questions. Null for other types. |
| `selectedOptions` | `string[] \| null` | Yes | Array of selected option labels for MULTIPLE_CHOICE questions. Null for other types. |
| `createdAt` | `ISO 8601 string` | Yes | Timestamp when the answer was created. |

### AssessmentQuestion
Represents a question presented in the assessment flow. Already defined in `src/api/services/onboarding-service.ts`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string (UUID)` | Yes | Unique identifier of the question. |
| `questionText` | `string` | Yes | Display text of the question. |
| `questionType` | `"SCALE" \| "YES_NO" \| "MULTIPLE_CHOICE" \| "FILE_UPLOAD"` | Yes | Determines how the answer value is stored and sent. |
| `options` | `{ choices: string[] } \| null` | Yes | Available options for MULTIPLE_CHOICE questions. |
| `isRequired` | `boolean` | Yes | Whether the question must be answered before progression. |
| `sortOrder` | `number` | Yes | Position of the question within its category. |

### AssessmentCategory
Represents a group of related questions. Already defined in `src/api/services/onboarding-service.ts`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string (UUID)` | Yes | Unique identifier of the category. |
| `name` | `string` | Yes | Localized category name. |
| `nameEn` | `string` | Yes | English category name. |
| `icon` | `string` | Yes | Icon identifier for UI display. |
| `color` | `string` | Yes | Color identifier for UI display. |
| `sortOrder` | `number` | Yes | Position of the category in the assessment. |
| `questions` | `AssessmentQuestion[]` | Yes | Ordered list of questions in this category. |

## Relationships

- An **Organization** has zero or many **Answer** records.
- An **Answer** references exactly one **AssessmentQuestion** by `questionId`.
- An **AssessmentCategory** contains one or many **AssessmentQuestion** records.

## Validation Rules

- `questionId` is required and must be a valid UUID.
- Exactly one of `answerNumeric`, `answerValue`, or `selectedOptions` must be populated depending on `questionType`:
  - `SCALE`: `answerNumeric` is required, must be an integer between 1 and 5.
  - `YES_NO`: `answerValue` is required, must be `"yes"` or `"no"`.
  - `MULTIPLE_CHOICE`: `selectedOptions` is required, must be a non-empty array of strings matching available option labels.
  - `FILE_UPLOAD`: `answerValue` is required, must be a non-empty string URL.
- For questions where `isRequired` is true, the corresponding answer field must be populated before submission.
- Optional questions may have all answer fields null and still allow progression.

## State Transitions

- **Empty / Loading**: On mount, the assessment screen loads full assessment state via `GET /api/v1/onboarding/assessment/state?organizationId={id}` and flattens saved answers from `categories[].answers[]`.
- **Editing**: User answers update local component state keyed by `questionId`.
- **Validation**: On Next/Submit, required questions in scope are checked. If invalid, stay in Editing and scroll to the first error.
- **Saving**: Valid answers are sent to the backend via `PUT /api/v1/onboarding/assessment/answers` wrapped as `{ answers: [...] }`.
- **Success**: On 200 response, answers are persisted and the user advances to the next step.
- **Failure**: On error, answers remain in local state, an error message is shown, and the user stays on the assessment screen.

## Frontend State Shape

```typescript
// Component state for answers keyed by questionId
type AnswersState = Record<string, AnswerValue>;

type AnswerValue =
  | { type: 'SCALE'; value: number }
  | { type: 'YES_NO'; value: 'yes' | 'no' }
  | { type: 'MULTIPLE_CHOICE'; value: string[] }
  | { type: 'FILE_UPLOAD'; value: string }
  | null;
```

The frontend maps `AnswersState` into `{ answers: AnswerPayload[] }` on save and merges loaded state answers back into `AnswersState` on mount.
