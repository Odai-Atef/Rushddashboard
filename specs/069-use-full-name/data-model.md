# Data Model: Use Full Name Across Frontend

## Entities

### UserProfile

Represents the authenticated user's identity returned by the backend.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | Yes | User identifier |
| `email` | `string` | Yes | Primary contact email |
| `fullName` | `string` | Yes | Display name; replaces `first_name` + `last_name` |
| `phone` | `string \| null` | No | Contact phone number |
| `jobTitle` | `string \| null` | No | User's job title |
| `avatarUrl` | `string \| null` | No | Optional profile image URL |
| `preferredLanguage` | `string \| null` | No | e.g., `ar`, `en` |
| `timezone` | `string \| null` | No | User timezone |
| `status` | `string` | No | Account status |
| `role` | `string \| null` | No | Role label |
| `company` | `string \| null` | No | Company name |
| `lastLoginAt` | `string \| null` | No | ISO timestamp |
| `createdAt` | `string` | Yes | ISO timestamp |
| `updatedAt` | `string` | No | ISO timestamp |

### RegisterData

Represents the user registration request payload.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | `string` | Yes | Must be valid email format |
| `password` | `string` | Yes | Must meet password rules |
| `fullName` | `string` | Yes | Min 2, max 100 characters |
| `companyName` | `string` | Yes | Organization name |
| `roleSlug` | `string` | Yes | Default `executive` |
| `phone` | `string` | Yes | Contact phone number |

### RegistrationFormState (UI only)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fullName` | `string` | Yes | Maps to `RegisterData.fullName` |
| `email` | `string` | Yes | Maps to `RegisterData.email` |
| `phone` | `string` | Yes | Maps to `RegisterData.phone` |
| `companyName` | `string` | Yes | Maps to `RegisterData.companyName` |
| `password` | `string` | Yes | Maps to `RegisterData.password` |
| `confirmPassword` | `string` | Yes | Must match `password` |
| `agreeToTerms` | `boolean` | Yes | Must be true |

## Validation Rules

- `fullName` is required and must be 2–100 characters.
- `fullName` must not contain only whitespace.
- The frontend no longer sends `firstName`, `lastName`, `first_name`, or `last_name`.

## Relationships

- `UserProfile` is returned by `GET /api/v1/auth/me` and `PATCH /api/v1/auth/profile`.
- `RegisterData` is sent to `POST /api/v1/auth/register`.
- `RegistrationFormState` is a local React state object in `RegistrationPage.tsx`.

## Removed Fields

- `first_name` / `firstName`
- `last_name` / `lastName`
