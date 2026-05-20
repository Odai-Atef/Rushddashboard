import type { FieldErrorMapEntry, ParsedFieldError, BackendValidationErrorResponse } from '../types/auth';

/**
 * Maps backend field names (as they appear in NestJS ValidationPipe error messages)
 * to frontend React Hook Form field names used in the registration form.
 * Supports multiple backend fields mapping to the same frontend field (e.g. firstName + lastName → fullName).
 */
export const FIELD_ERROR_MAP: FieldErrorMapEntry[] = [
  { backendField: 'firstName', frontendField: 'firstName', label: 'الاسم الأول' },
  { backendField: 'lastName', frontendField: 'lastName', label: 'اسم العائلة' },
  { backendField: 'password', frontendField: 'password', label: 'كلمة المرور' },
  { backendField: 'companyName', frontendField: 'companyName', label: 'الشركة' },
  { backendField: 'roleId', frontendField: 'roleId', label: 'الدور' },
  { backendField: 'email', frontendField: 'email', label: 'البريد الإلكتروني' },
];

/**
 * Given a backend error response, parse each message string into a structured ParsedFieldError.
 * Each NestJS validation message follows the pattern: "{fieldName} {validationMessage}".
 * If a backend field is not found in FIELD_ERROR_MAP, it returns itself as the frontendField.
 */
export function parseFieldErrors(
  response: BackendValidationErrorResponse
): { parsed: ParsedFieldError[]; unmapped: string[] } {
  const messageArray = Array.isArray(response.message) ? response.message : [response.message];
  const parsed: ParsedFieldError[] = [];
  const unmapped: string[] = [];

  for (const raw of messageArray) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Handle "property {fieldName} should not exist" pattern
    // e.g. "property roleId should not exist"
    let working = trimmed;
    if (working.startsWith('property ')) {
      working = working.slice(9); // remove "property " prefix
    }

    // Extract leading identifier: everything up to the first space.
    // Handles dotted paths like "user.email must be valid".
    const firstSpace = working.indexOf(' ');
    if (firstSpace === -1) {
      // Cannot extract a field name — treat as unmapped
      unmapped.push(trimmed);
      continue;
    }

    const backendField = working.slice(0, firstSpace);
    const message = working.slice(firstSpace + 1).trim();

    const entry = FIELD_ERROR_MAP.find((m) => m.backendField === backendField);
    if (entry) {
      parsed.push({ backendField, frontendField: entry.frontendField, message });
    } else {
      unmapped.push(trimmed);
    }
  }

  return { parsed, unmapped };
}

/**
 * Groups parsed field errors by their frontend field names.
 * Returns a Record where each key is a frontend field and the value is an array of messages.
 */
export function groupFieldErrors(parsed: ParsedFieldError[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const { frontendField, message } of parsed) {
    if (!result[frontendField]) result[frontendField] = [];
    result[frontendField].push(message);
  }
  return result;
}
