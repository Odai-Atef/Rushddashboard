# Data Model: Dynamic Assessment Categories

## Entities

### AssessmentCategory

A thematic grouping returned by the API.

| Attribute | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | Unique identifier (e.g., `institutional_building`) |
| name | string | Yes | Arabic display name |
| nameEn | string | Yes | English display name |
| icon | string | Yes | Icon name string (e.g., `building`, `shield`) |
| color | string | Yes | Hex color (e.g., `#3b82f6`) |
| sortOrder | number | Yes | Display order |
| questions | AssessmentQuestion[] | Yes | Embedded questions |

### AssessmentQuestion

An individual evaluative item.

| Attribute | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | Unique question UUID |
| questionText | string | Yes | Arabic question text |
| questionType | string | Yes | `SCALE`, `YES_NO`, `MULTIPLE_CHOICE`, `FILE_UPLOAD` |
| options | QuestionOptions \| null | No | Options for MULTIPLE_CHOICE |
| isRequired | boolean | Yes | Whether an answer is required |
| sortOrder | number | Yes | Display order within category |

### QuestionOptions

Configuration for MULTIPLE_CHOICE questions.

| Attribute | Type | Description |
|---|---|---|
| choices | string[] | Array of selectable Arabic labels |

### AnswerState

Stored locally in the component.

| Attribute | Type | Description |
|---|---|---|
| questionId | string | References AssessmentQuestion.id |
| categoryId | string | References AssessmentCategory.id |
| answer | number \| string \| string[] \| File \| null | Value depends on questionType |

## Value Formats by Question Type

| Type | Stored Value | Example |
|---|---|---|
| SCALE | number (1-5) | `3` |
| YES_NO | string (`"yes"` / `"no"`) | `"yes"` |
| MULTIPLE_CHOICE | string[] of selected choices | `["تقارير دورية", "تدقيق خارجي"]` |
| FILE_UPLOAD | File \| null | `File` object or `null` |

## State Transitions

1. **Enter assessment view** → Trigger fetch categories
2. **Loading** → Show spinner, hide form
3. **Success (non-empty)** → Render tabs + questions dynamically
4. **Success (empty)** → Show "no categories" message
5. **User interacts** → Update answer state keyed by question ID
6. **Navigate tabs** → Switch `currentAssessmentStep` index; preserve answers
7. **Complete** → Submit answers payload (future feature)
