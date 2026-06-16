# API Contracts

## GET /api/v1/onboarding/assessment/categories

Retrieve the list of assessment categories with embedded questions.

**Authentication**: Bearer JWT

### Response 200

**Body** (`AssessmentCategory[]`):
```json
[
  {
    "id": "institutional_building",
    "name": "البناء المؤسسي",
    "nameEn": "Institutional Building",
    "icon": "building",
    "color": "#3b82f6",
    "sortOrder": 1,
    "questions": [
      {
        "id": "uuid-1",
        "questionText": "الهوية الاستراتيجية",
        "questionType": "SCALE",
        "options": null,
        "isRequired": true,
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "governance",
    "name": "الحوكمة",
    "nameEn": "Governance",
    "icon": "shield",
    "color": "#4F46E5",
    "sortOrder": 2,
    "questions": [
      {
        "id": "uuid-7",
        "questionText": "السياسات",
        "questionType": "SCALE",
        "options": null,
        "isRequired": true,
        "sortOrder": 1
      }
    ]
  }
]
```

### Response 401

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

Handled by existing API client interceptor → redirect to login.

### Response 404 / Empty Array

If the API returns `[]`, treat as "no categories available" and show a friendly message.

---

## Question Type Rendering Contracts

### SCALE

- Render: 5 clickable buttons (1–5) or radio group.
- Stored value: `number` (1–5).
- Label: "ضعيف" to "ممتاز" (or similar Arabic scale labels).

### YES_NO

- Render: Two buttons (نعم / لا) or toggle switch.
- Stored value: `"yes"` or `"no"`.

### MULTIPLE_CHOICE

- Render: Checkboxes, one per item in `options.choices`.
- Stored value: `string[]` of selected choice strings.
- Empty `choices`: Show "لا توجد خيارات متاحة" message.

### FILE_UPLOAD

- Render: Drag-and-drop zone or file picker button.
- Stored value: `File | null`.
- Accept: PDF, images, documents (configurable).

### Unrecognized Type

- Render: A placeholder message: "نوع السؤال غير مدعوم" with the question text visible.
- Do not crash; allow user to skip.
