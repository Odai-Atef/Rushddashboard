# Data Model: User Identity Display

## Overview

This feature does **not** introduce new entities or backend changes. It reuses the existing `UserProfile` type from the Rushd auth system and adds a single display utility for composing the user's visible identity from available fields.

## Existing Entity: UserProfile

```typescript
// src/app/types/auth.ts

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;     // May be omitted or empty
  lastName?: string;      // May be omitted or empty
  companyName?: string;
}
```

### Field Descriptions

| Field | Type | Required | Source | Used By This Feature |
|-------|------|----------|--------|--------------------|
| `id` | `string` | Yes | Backend login response / localStorage | No |
| `email` | `string` | Yes | Backend login response / localStorage | Yes — always shown; fallback when name is absent |
| `firstName` | `string` | No | Backend login response / localStorage | Yes — primary name component |
| `lastName` | `string` | No | Backend login response / localStorage | Yes — secondary name component |
| `companyName` | `string` | No | Backend login response / localStorage | No |

### Notes
- `firstName` and `lastName` are optional (`?`) and may be empty strings in practice.
- `email` is guaranteed to be present for any authenticated user.
- The `UserProfile` object is serialized to `localStorage` under key `rushd_user` by the existing `AuthProvider` and restored on app mount.

## Display Name Derivation

A **pure utility function** (no new entity) derives the displayed name and avatar initials.

### `getDisplayName(user: UserProfile | null)`

**Returns**: `DisplayNameResult` with `name` and `initials`

**Algorithm**:

1. If `user` is `null`:
   - `name = "User"` (fallback)
   - `initials = "U"`
2. If `firstName` and `lastName` are both present and non-empty:
   - `name = firstName + " " + lastName`
   - `initials = firstName[0] + lastName[0]`
3. If only `firstName` is present and non-empty:
   - `name = firstName`
   - `initials = firstName[0]`
4. If only `lastName` is present and non-empty:
   - `name = lastName`
   - `initials = lastName[0]`
5. Otherwise:
   - `name = email`
   - `initials = email[0]`

**Result Type**:

```typescript
interface DisplayNameResult {
  name: string;
  initials: string;
}
```

## State Implications

- **No new state** is introduced. The feature reads from existing `AuthContext`.
- **Loading state**: `AuthContext` already exposes `isLoading: boolean`. During load, the identity area may show a skeleton or omit the name block until `isLoading` becomes `false`.
- **Missing data**: The utility always returns a `name` string — never `null` — preventing UI breakage.

## Validation Rules

- Name fields are **user-provided** (from registration/login) and are not validated again by this feature.
- The utility must tolerate empty strings (`""`) as "missing" and fall back accordingly.
- Email is guaranteed non-null/non-empty by the time `UserProfile` is persisted.
