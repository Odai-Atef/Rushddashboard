# Quick Start: Remove Role Selection from Registration Flow

## Overview
This feature removes the `roleId` field from the frontend registration form and stops sending it in the registration payload. The backend now assigns a default role automatically during self-registration.

## Updated Registration Flow

1. User visits `/register`
2. User fills in: email, password, confirm password, first name, last name, selects company
3. User clicks "Create Account"
4. Frontend submits payload: `{ email, password, firstName, lastName, companyId }`
5. Backend creates user and assigns default role automatically
6. Frontend receives success response with user data (including assigned `roleId`)
7. User is redirected to dashboard/welcome screen

## Frontend Changes Summary

- **Removed**: Role selector from registration form UI
- **Removed**: `roleId` from registration payload
- **Preserved**: Company selector, all other fields, and validations
- **Preserved**: Client-side password confirmation validation
- **Updated**: Zod schema / form types to exclude `roleId`
- **Updated**: Auth service registration request type

## Backend Changes Summary (for reference)

- **Updated**: RegisterDto to not require `roleId`
- **Updated**: Registration service to assign default role automatically
- **Behavior**: If `roleId` is present in request, silently ignore it and use default

## Testing Checklist

- [ ] Registration form renders without role selector
- [ ] Registration succeeds without sending `roleId`
- [ ] Backend assigns default role automatically
- [ ] Existing field validations still work (email, password, confirm password, first name, last name, company)
- [ ] No regression in error rendering (field-level + summary)
- [ ] No "property roleId should not exist" error occurs
- [ ] Arabic-friendly RTL layout preserved

## Rollback Notes

If role selection must be reintroduced later:
1. Re-add role selector to registration form
2. Re-add `roleId` to payload and Zod schema
3. Update backend DTO to accept `roleId` as optional or required
4. Update this contract and related documentation

## Related Specs

- specs/020-align-registration-dto — Original DTO alignment
- specs/022-fix-registration-validation-errors — Error rendering improvements
