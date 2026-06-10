# Research: Forgot Password API Integration

**Feature**: Forgot Password API Integration
**Date**: 2026-06-10
**Researcher**: Agent (via `/speckit.plan`)

## Research Questions & Findings

### RQ-1: What is the exact backend DTO contract for forgot-password?

**Finding**: The backend auth endpoint is `POST /api/v1/auth/forgot-password` (as defined in `AuthService`). It accepts a single-field payload:

```json
{
  "email": "string"
}
```

The response follows the standard `ApiResponse<T>` envelope:

```json
{
  "success": true,
  "data": null,
  "message": "Password reset instructions sent"
}
```

**Assumption**: The backend returns the same response structure regardless of whether the email exists, to prevent account enumeration attacks.

**Source**: `src/api/services/auth-service.ts` (lines 175-177)

---

### RQ-2: What validation strategy should be used for a single-field email form?

**Finding**: The project already has `react-hook-form` installed (`7.55.0`) but does **not** have `zod` or any other schema validation library. Since this is a single-field form, using `react-hook-form`'s built-in HTML validation rules (`register` options: `required`, `pattern`) is the simplest and most consistent approach without adding a new dependency.

**Decision**: Use `react-hook-form` built-in validation. No new dependency needed.

**Source**: `package.json`, `src/app/components/ui/form.tsx`

---

### RQ-3: How does the existing `ApiClient` handle errors, and what is the best way to map them in the forgot-password component?

**Finding**:
- `ApiClient.parseError` extracts `{ code, message, details?, statusCode }` from backend JSON responses.
- Network failures (`fetch` throws) are caught in `executeRequest` and mapped to a `TIMEOUT` error if it's an `AbortError`.
- `AuthService` unwraps the backend envelope, so the component sees the final `ApiResponse`.
- The retry logic in `ApiClient` does **not** retry client errors (4xx), only server errors (5xx) and network issues.

**Decision**: In the component, catch errors and map them to generic Arabic messages:
- Network error (`Failed to fetch`): "تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت"
- Any other error: "حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور"

This aligns with the existing `ResetPasswordPage` error handling pattern.

**Source**: `src/api/client.ts` (lines 189-205), `src/app/components/ResetPasswordPage.tsx` (lines 72-80)

---

### RQ-4: What UI primitives are available for building the form?

**Finding**: The project uses shadcn/ui primitives:
- `Input` (`src/app/components/ui/input.tsx`) — styled text input
- `Button` (`src/app/components/ui/button.tsx`) — styled button with variants
- `Label` (`src/app/components/ui/label.tsx`) — accessible label
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` (`src/app/components/ui/form.tsx`) — `react-hook-form` wrapper components

**Decision**: Use the existing `Form*` primitives for a consistent, accessible form implementation.

**Source**: `src/app/components/ui/` directory

---

## Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Use `react-hook-form` built-in validation | Single field; avoids adding `zod` dependency |
| Reuse existing `AuthService.forgotPassword` | Already implemented and follows API abstraction layer |
| Map errors to generic Arabic messages | Prevents account enumeration; consistent with adjacent pages |
| Use `Form*` UI primitives | Maintains design system consistency and accessibility |
| No new routes or layout changes | Route already exists in `src/app/routes.tsx` |
