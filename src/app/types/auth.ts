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
  fullName: string;
  email: string;
  phone: string;
  company: string;
  password: string;
  role: string;
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

export const registerSchema = z.object({
  fullName: z.string().min(1, 'الاسم الكامل مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  company: z.string().min(1, 'اسم الشركة مطلوب'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[a-zA-Z]/, 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  role: z.string().min(1, 'الدور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
