# Data Model

## SessionExpiryState

Represents the runtime state maintained by the centralized session expiry mechanism within the authentication layer.

| Field | Type | Description |
|-------|------|-------------|
| isPolling | boolean | Whether the periodic token check interval is currently active. |
| lastCheckAt | Date | Timestamp of the last completed check attempt (success or skip). |
| logoutSignal | `{ type: 'SESSION_EXPIRED', timestamp: number, tabId: string } \| null` | Signal written to `localStorage` when expiry is detected, to coordinate cross-tab behavior. |
| hasNotifiedExpiry | boolean | Guard to prevent duplicate toast triggers during a single session-expiry event. |

## LanguagePreference

Represents the user's currently selected UI language, used to localize the expiry toast.

| Field | Type | Description |
|-------|------|-------------|
| locale | `'en' \| 'ar'` | The active language code. |

## SessionCheckResult

Represents the outcome of a single periodic validity verification.

| Field | Type | Description |
|-------|------|-------------|
| status | `'valid' \| 'expired' \| 'invalid' \| 'network_error'` | Result of the latest check. |
| checkedAt | Date | Timestamp when this check was performed. |

---

## Validation Rules

- `isPolling` MUST be `false` when the user is on a public page or not authenticated.
- `logoutSignal.timestamp` MUST be within a short grace window (e.g., < 3 seconds) for other tabs to treat it as handled by a prior tab.
- `hasNotifiedExpiry` MUST be reset to `false` only upon successful authentication (login), NOT on page navigation or re-render.

