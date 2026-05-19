import { z } from 'zod';

export interface UserProfile {
  id: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyId: string;
  roleId: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface FieldErrorMapEntry {
  backendField: string;
  frontendField: string;
  label?: string;
}

export interface ParsedFieldError {
  backendField: string;
  frontendField: string;
  message: string;
}

export interface BackendValidationErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

// Base fields shared between form and DTO. Compose the base object first so
// refinements can be applied safely on derived schemas without calling .omit()
// on an already-refined schema. Zod does not allow .omit() on refined objects.
const registerBaseSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب').max(100, 'الاسم الأول يجب أن يكون 100 حرف أو أقل'),
  lastName: z.string().min(1, 'اسم العائلة مطلوب').max(100, 'اسم العائلة يجب أن يكون 100 حرف أو أقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  companyId: z.string().min(1, 'الشركة مطلوبة').uuid('يجب اختيار شركة صالحة'),
  roleId: z.string().min(1, 'الدور مطلوب').uuid('يجب اختيار دور صالح'),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .regex(/[a-zA-Z]/, 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'),
});

export const registerDtoSchema = registerBaseSchema;

const registerExtraFieldsSchema = z.object({
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
});

export const registerFormSchema = registerBaseSchema
  .merge(registerExtraFieldsSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type RegisterDto = z.infer<typeof registerDtoSchema>;
