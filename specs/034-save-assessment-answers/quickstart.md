# Quickstart: Save Assessment Answers

**Feature**: Save Assessment Answers  
**Date**: 2026-06-15

## What This Feature Does

Allows users to save their organizational assessment answers to the backend when they click **Next** or **Submit**, and automatically restores previously saved answers when they return to the assessment screen.

## Implementation Overview

1. Extend the onboarding service with two new API methods.
2. Add answer mapping helpers to convert frontend state into the backend payload shape.
3. Update the assessment UI to load saved answers on mount, validate required questions, and save answers on progression.

## Files Changed

- `src/api/services/onboarding-service.ts` — added `getAssessmentState` and `saveAssessmentAnswers`.
- `src/app/components/CharityOnboardingFlow.tsx` — integrated load, save, validation, error handling, and loading states.
- `specs/034-save-assessment-answers/tasks.md` — all implementation tasks completed.

## Service API Additions

```typescript
export interface SaveAnswerPayload {
  questionId: string;
  answerNumeric: number | null;
  answerValue: string | null;
  selectedOptions: string[] | null;
}

export interface SavedAnswer extends SaveAnswerPayload {
  id: string;
  organizationId: string;
  createdAt: string;
}

async getAssessmentAnswers(): Promise<ApiResponse<SavedAnswer[]>> {
  return apiClient.get('/api/v1/onboarding/assessment/answers');
}

async saveAssessmentAnswers(
  answers: SaveAnswerPayload[]
): Promise<ApiResponse<SavedAnswer[]>> {
  return apiClient.post('/api/v1/onboarding/assessment/answers', answers);
}
```

## In-Component Helpers

`src/app/components/CharityOnboardingFlow.tsx` now contains:

- `buildSaveAnswerPayloads(questions)` — maps current category answers to `SaveAnswerPayload[]` based on `questionType`.
- `mergeSavedAnswers(savedAnswers, overwriteLocal)` — merges loaded answers into local state, preserving local edits when `overwriteLocal` is false.
- `findUnansweredRequiredQuestions(questions)` — returns required questions that are empty in the current scope.
- `scrollToQuestion(questionId)` — scrolls and highlights the first unanswered required question.
- `handleAssessmentNext()` — validates, saves, navigates on success, and shows errors on failure.

## Answer Value Mapping

| QuestionType | State value | Payload field |
|---|---|---|
| SCALE | `number` (1–5) | `answerNumeric` |
| YES_NO | `"yes" \| "no"` | `answerValue` |
| MULTIPLE_CHOICE | `string[]` | `selectedOptions` |
| FILE_UPLOAD | `string` (URL) or `File` | `answerValue` when string URL is present |

## UI Flow

1. **On mount**:
   - Call `getAssessmentState(organizationId)`.
   - Flatten answers from `categories[].answers[]` into a map keyed by `questionId` and merge into component state.
   - If the user has already edited a question this session, the local value is kept.
2. **On answer change**:
   - Update local state keyed by `questionId`.
   - Mark the question with a green checkmark once it has a value.
3. **On Next / Submit**:
   - Validate required questions in the current category scope.
   - If invalid: show toast error, scroll to first unanswered required question, stop.
   - If valid: collect answers, call `saveAssessmentAnswers(answers, organizationId)` which sends `PUT /api/v1/onboarding/assessment/answers?organizationId={id}` with `{ answers: [...] }`.
   - On success: merge returned answers, clear local-edit tracking, navigate to next category or documents step.
   - On failure: show toast and inline error banner, keep user on assessment, preserve answers.

## Validation Rules

- `SCALE`: value must be a number 1–5.
- `YES_NO`: value must be `"yes"` or `"no"`.
- `MULTIPLE_CHOICE`: value must be a non-empty array.
- `FILE_UPLOAD`: value must be a non-empty string URL or a selected `File`.
- Optional questions may be skipped.

## Error Handling

- Uses `sonner` for toast error messages.
- Inline error banner appears below the progress bar for load or save failures.
- On network/server failure, the user stays on the assessment screen and answers remain editable.
- On a `401` response, the existing `apiClient` redirects to login.

## Testing Locally

1. Start the dev server: `npm run dev`.
2. Navigate to the onboarding assessment step.
3. Answer some questions and click **Next** — a POST request should be sent to `/api/v1/onboarding/assessment/answers`.
4. Refresh the page — saved answers should reload and pre-fill inputs.
5. Leave a required question blank and click **Next** — a validation error should appear and the page should scroll to the first unanswered required question. No POST request should be sent.
6. Trigger a network failure (e.g., block the POST in browser DevTools) and click **Next** — answers should remain and an error should appear.
7. Confirm the build compiles: `npm run build`.
