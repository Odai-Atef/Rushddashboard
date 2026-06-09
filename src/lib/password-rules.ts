/**
 * Password validation rules extracted for reuse across auth forms.
 * These rules align with the backend `ResetPasswordDto` constraints.
 */

export interface PasswordRule {
  label: string;
  validator: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    label: '٨+ أحرف',
    validator: (p) => p.length >= 8,
  },
  {
    label: 'حرف كبير واحد على الأقل',
    validator: (p) => /[A-Z]/.test(p),
  },
  {
    label: 'حرف صغير واحد على الأقل',
    validator: (p) => /[a-z]/.test(p),
  },
  {
    label: 'رقم واحد على الأقل',
    validator: (p) => /[0-9]/.test(p),
  },
  {
    label: 'رمز خاص واحد على الأقل',
    validator: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

/**
 * Check if a password satisfies all strength rules.
 */
export function isPasswordStrong(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.validator(password));
}

/**
 * Evaluate each rule against a password and return their satisfaction states.
 */
export function evaluatePasswordStrength(password: string): {
  rule: PasswordRule;
  satisfied: boolean;
}[] {
  return PASSWORD_RULES.map((rule) => ({
    rule,
    satisfied: rule.validator(password),
  }));
}
