# Quick Start: Align Registration Payload with Backend DTO

## Prerequisites

- Node.js 18+
- Access to the Rushd backend API (for `/auth/register`, `/companies`, `/roles` endpoints)
- Existing frontend project at `apps/frontend/` with React Hook Form, Zod, and Tailwind CSS configured

## Setup

1. **Checkout the feature branch:**
   ```bash
   git checkout 020-align-registration-dto
   ```

2. **Install dependencies (if needed):**
   ```bash
   cd apps/frontend
   npm install
   ```

3. **Ensure the backend API is accessible** (check environment variables for API base URL).

## Files to Modify

| File | Purpose |
|------|---------|
| `src/app/types/auth.ts` | Update `RegisterDto` and form types |
| `src/app/components/RegistrationPage.tsx` | Replace fields, update form schema |
| `src/app/services/auth.ts` | Update `register` function payload |

## Development Steps

### Step 1: Update Auth Types

Edit `src/app/types/auth.ts`:
- Remove: `fullName`, `phone`, `company` (string), `role` (string) from registration types
- Add: `firstName`, `lastName`, `companyId` (UUID), `roleId` (UUID)
- Update Zod schema to match new fields

### Step 2: Refactor Registration Page

Edit `src/app/components/RegistrationPage.tsx`:
- Replace `fullName` input with `firstName` + `lastName` inputs
- Remove `phone` input
- Replace `company` text input with `companyId` dropdown selector
- Replace `role` text input with `roleId` dropdown selector
- Keep `confirmPassword` for client-side validation only
- Update form submission to construct correct payload

### Step 3: Update Auth Service

Edit `src/app/services/auth.ts`:
- Update `register` function to accept new parameter type
- Ensure only supported fields are sent in the POST body
- Map backend errors to field-specific or general errors

### Step 4: Test

Run tests to verify:
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests (if available)
```

## Validation Checklist

- [ ] Form displays: email, password, confirmPassword, firstName, lastName, companyId (dropdown), roleId (dropdown)
- [ ] Submit payload contains ONLY: email, password, firstName, lastName, companyId, roleId
- [ ] confirmPassword is NOT in the request body
- [ ] No backend "property X should not exist" errors occur
- [ ] Company and role dropdowns populate from `/companies` and `/roles` endpoints
- [ ] Client-side validation blocks submission for mismatched passwords, invalid email, etc.
- [ ] Inline error messages display below corresponding fields
- [ ] Success redirects to dashboard

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "property X should not exist" errors | Check that the payload only includes the 6 supported fields |
| Dropdowns not populating | Verify `/companies` and `/roles` endpoints are accessible |
| Type errors | Ensure `RegisterDto` type and Zod schema are updated consistently |
| Validation not blocking submit | Check React Hook Form `resolver` is correctly configured with Zod schema |
