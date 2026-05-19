# Data Model: Align Registration Payload with Backend DTO

## Date
2026-05-19

## Entities

### RegisterDto (Backend Contract)
Represents the exact payload expected by the backend `/auth/register` endpoint.

| Field | Type | Validation Rules |
|-------|------|------------------|
| email | string | Valid email format, required |
| password | string | Minimum 6 characters, required |
| firstName | string | Non-empty, max 100 characters, required |
| lastName | string | Non-empty, max 100 characters, required |
| companyId | UUID | Valid UUID string, references existing company, required |
| roleId | UUID | Valid UUID string, references existing role, required |

### RegistrationFormData (Frontend Form Schema)
Represents the complete set of fields collected in the registration UI before submission.

| Field | Type | Source | Sent to Backend |
|-------|------|--------|-----------------|
| email | string | User input | Yes |
| password | string | User input | Yes |
| confirmPassword | string | User input | **No** (client-side only) |
| firstName | string | User input | Yes |
| lastName | string | User input | Yes |
| companyId | UUID | Dropdown selector | Yes |
| roleId | UUID | Dropdown selector | Yes |

### Supporting Entities (for dropdown population)

#### Company
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string | Display name for selector |

#### Role
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string | Display name for selector |

## Field Mapping

### Transformation: UI → Backend Payload
```
email          → email
password       → password
firstName      → firstName
lastName       → lastName
companyId      → companyId
roleId         → roleId
confirmPassword → (omitted)
```

### Removed Fields (no longer sent)
- fullName → replaced by firstName + lastName
- phone → removed from registration
- company (string) → replaced by companyId (UUID)
- role (string) → replaced by roleId (UUID)

## Validation Rules Summary

### Client-Side (Zod Schema)
- email: email format validator
- password: min 6 characters
- confirmPassword: must match password
- firstName: non-empty, max 100
- lastName: non-empty, max 100
- companyId: valid UUID format
- roleId: valid UUID format

### Backend Validation (for reference)
- All RegisterDto fields are required
- email: must be unique (backend constraint)
- companyId, roleId: must reference existing entities
- firstName, lastName: max 100 characters each
