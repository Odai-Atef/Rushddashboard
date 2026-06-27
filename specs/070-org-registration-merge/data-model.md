# Data Model: Merge User and Organization Registration

## Entities

### User Account (frontend view)

Represents the new user created during combined registration.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `fullName` | string | Yes | `/auth/register` | New field to add to combined form |
| `email` | string | Yes | Both pages | Merged; sent to user and organization |
| `phone` | string | Yes | Both pages | Merged; maps to user `phone` and org `mobile` |
| `password` | string | Yes | `/auth/register` | Plain value during submission, never stored |
| `confirmPassword` | string | Yes | `/auth/register` | Used for client-side match validation only |
| `companyName` | string | Yes | `/auth/register` | Merged from unified org/company name |
| `roleSlug` | string | No (backend default) | `/auth/register` | Existing page sends `"executive"`; combined page may omit or keep |

### Organization (frontend view)

Represents the organization created atomically with the user.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `name` | string | Yes | Both pages | Merged from unified org/company name |
| `email` | string | Yes | Both pages | Merged from user email |
| `mobile` | string | Yes | Both pages | Merged from user phone |
| `licenseNumber` | string | Yes | Onboarding registration | Keep |
| `registrationDate` | string (ISO date) | Yes | Onboarding registration | New field to add |
| `type` | `"CHARITY" \| "PRIVATE_COMPANY"` | Yes | Onboarding registration | Keep |
| `city` | string | Yes | Onboarding registration | New field to add |
| `overview` | string | Conditional | Onboarding registration | Populated from activity for private companies |
| `areasOfWork` | string[] | Conditional | Onboarding registration | Populated from funding areas for charities |

### Combined Registration Form

Local form state shape for `OrgRegistrationPage.tsx`.

```ts
interface FormData {
  fullName: string;
  orgName: string;          // unified company / organization name
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
  registrationDate: string; // ISO date string, e.g. "2024-01-15"
  orgType: 'charity' | 'private_company' | '';
  city: string;
  activity: string;         // used when orgType === 'private_company'
  fundingAreas: string[]; // used when orgType === 'charity'
  agreeToTerms: boolean;
}
```

## Validation Rules

- `fullName`: required, trimmed non-empty.
- `orgName`: required, trimmed non-empty.
- `email`: required, valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- `phone`: required, trimmed non-empty.
- `password`: required, trimmed non-empty.
- `confirmPassword`: must match `password`.
- `licenseNumber`: required, trimmed non-empty.
- `registrationDate`: required, valid date.
- `orgType`: required, one of `charity` or `private_company`.
- `city`: required, trimmed non-empty.
- `activity`: required when `orgType === 'private_company'`.
- `fundingAreas`: required, non-empty when `orgType === 'charity'`.
- `agreeToTerms`: must be `true`.

## Payload Mapping

```ts
const payload: OrgRegistrationData = {
  fullName: formData.fullName.trim(),      // maps to user.fullName
  name: formData.orgName.trim(),           // maps to organization.name
  email: formData.email.trim(),            // maps to user.email and organization.email
  phone: formData.phone.trim(),            // maps to user.phone and organization.mobile
  password: formData.password,
  confirmPassword: formData.confirmPassword,
  licenseNumber: formData.licenseNumber.trim(),
  registrationDate: formData.registrationDate,
  type: formData.orgType === 'private_company' ? 'PRIVATE_COMPANY' : 'CHARITY',
  city: formData.city.trim(),
  overview: formData.orgType === 'private_company' ? formData.activity.trim() : '',
  areasOfWork: formData.orgType === 'charity' ? formData.fundingAreas : [],
};
```

## API Response

On success the backend returns an `OrgRegistrationResponse` containing access/refresh tokens, the created user, and the created organization. Per the clarified spec, the frontend must **not** use the tokens to log the user in; instead it redirects to `/auth/login?registered=true`.

## State Transitions

1. Empty form → user fills fields.
2. Submit → client-side validation.
3. Validation failure → field errors displayed, no API call.
4. Validation success → `POST /api/v1/auth/register-organization`.
5. API error → single inline error message + `toast.error`.
6. API success → `toast.success(...)` + redirect to `/auth/login?registered=true`.

## Uniqueness / Identity

- Email and phone are expected to be unique at the backend. The frontend does not pre-check uniqueness; it surfaces backend-provided field-level errors.
- Organization name and license number uniqueness are enforced by the backend.
