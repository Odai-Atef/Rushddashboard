# UI Contract: Forgot Password Page

**Component**: `ForgetPasswordPage`
**Location**: `src/app/components/ForgetPasswordPage.tsx`

## Props

This is a routed page component; it accepts no props.

## Internal State

Managed via `react-hook-form` and local `useState`:

| State | Type | Description |
|-------|------|-------------|
| `email` | `string` | Controlled form field bound to the email input. |
| `isSubmitting` | `boolean` | Derived from `formState.isSubmitting`. |
| `status` | `'idle' \| 'success' \| 'error'` | UI mode for conditional rendering. |
| `errorMessage` | `string` | Top-level error message (network or generic backend errors). |

## UI Structure

```
ForgetPasswordPage
├── AuthLayout (split-screen: form left, info right)
│   ├── Form Section (left)
│   │   ├── Logo Header
│   │   ├── Title: "نسيت كلمة المرور؟"
│   │   ├── Subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور"
│   │   ├── Error Banner (conditional, top-level)
│   │   ├── Form
│   │   │   ├── FormField (email)
│   │   │   │   ├── Label: "البريد الإلكتروني"
│   │   │   │   ├── Input (type="email", icon=Mail)
│   │   │   │   └── FormMessage (validation error)
│   │   │   └── Submit Button
│   │   │       ├── Loading: "جاري الإرسال..." + Loader2 spinner
│   │   │       └── Default: "إرسال رابط إعادة التعيين" + ArrowRight
│   │   └── Back to Login Link
│   └── Success State (replaces form)
│       ├── Success Icon (CheckCircle)
│       ├── Title: "تم إرسال الرابط!"
│       ├── Email Display: "{email}"
│       ├── Info Box: "يرجى التحقق من صندوق الوارد... الرابط صالح لمدة 24 ساعة."
│       ├── "العودة إلى تسجيل الدخول" Button
│       └── "إعادة إرسال الرابط" Button
```

## Accessibility Requirements

- Email input must have an associated `<label>`.
- Submit button must be disabled while submitting to prevent duplicate requests.
- Error messages must be associated with the input via `aria-describedby`.
- Focus must move to the error banner on submission failure (optional but recommended).

## Validation Behavior

| Trigger | Action |
|---------|--------|
| Blur (optional) | Show email format error if invalid. |
| Submit | Validate required + format; block submission if invalid. |
| Backend 400 | Show per-field `FormMessage` with backend validation text. |

## Responsive Behavior

- Mobile (< lg): Full-width form, security info panel hidden.
- Desktop (≥ lg): Two-column split (form left, security info right).
