# Data Model: Session Username Sync

**Date**: 2026-06-08
**Branch**: `035-session-username-sync`

## Entity Overview

No new entities are created. The feature consumes the existing `UserProfile` entity defined in `src/api/services/auth-service.ts`.

## UserProfile (Existing)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | `string` | No | Unique user identifier |
| `email` | `string` | No | Primary email address |
| `fullName` | `string` | No | Display name (single string) |
| `company` | `string` | Yes | Organization name |
| `role` | `'admin' \| 'manager' \| 'analyst' \| 'viewer'` | No | Platform role |
| `avatar` | `string` | Yes | Optional profile image URL |
| `createdAt` | `string` | No | ISO 8601 registration date |
| `lastLoginAt` | `string` | Yes | ISO 8601 last login date |

## Context Shape

### AuthContextType (Updated)

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: () => void;
  logout: () => void;
}
```

## Data Flow

1. **Mount** (if token exists): `RootLayout` → `authService.getProfile()` → `setUser(response.data)`
2. **Login**: `LoginPage` → `authService.login()` → `login()` → `authService.getProfile()` → `setUser(response.data)`
3. **Logout**: `TopBar` → `logout()` → `setUser(null)`
4. **Consume**: `TopBar` / `SettingsPage` → `useAuth()` → read `user`

## Validation Rules

- `fullName` split on whitespace for the settings form: first segment = first name, remainder = last name.
- If `fullName` is missing or empty, display fallbacks (`؟` for avatar, `المستخدم` for name).
- If `email` is missing, display empty string.
