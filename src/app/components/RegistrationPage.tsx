import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, Sparkles, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { register as registerApi, AuthError } from '../services/auth';
import { registerSchema, type RegisterFormData } from '../types/auth';

export function RegistrationPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'executive' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setApiError('');
    try {
      const { confirmPassword, agreeToTerms, ...registerData } = data;
      const response = await registerApi(registerData);
      login(response.user);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof AuthError && error.fieldErrors) {
        // Attach each mapped field error to its related input
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          const message = messages.join('; ');
          setError(field as keyof RegisterFormData, {
            type: 'server',
            message,
          });
        }
        // Show unmapped/general errors in the banner
        if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0 || error.message) {
          setApiError(error.message);
        }
      } else {
        setApiError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى');
      }
    }
  };

  const inputClass = (field: string) =>
    `w-full pr-11 pl-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
      errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-border'
    }`;

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Rushd Platform</h1>
            </div>
            <p className="text-muted-foreground">منصة القرارات الذكية</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h2>
            <p className="text-muted-foreground">انضم إلى منصة التحليل التنفيذي الذكي</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: 'fullName', label: 'الاسم الكامل', icon: User, placeholder: 'أحمد محمد', type: 'text' },
              { name: 'email', label: 'البريد الإلكتروني', icon: Mail, placeholder: 'name@company.com', type: 'email' },
              { name: 'phone', label: 'رقم الهاتف', icon: Phone, placeholder: '+966 50 123 4567', type: 'tel' },
              { name: 'company', label: 'اسم الشركة', icon: Building, placeholder: 'شركة الرشد للاستثمار', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium mb-2">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id={field.name}
                    type={field.type}
                    {...register(field.name as keyof RegisterFormData)}
                    placeholder={field.placeholder}
                    className={inputClass(field.name)}
                  />
                </div>
                {errors[field.name as keyof RegisterFormData] && (
                  <p className="text-xs text-red-600 mt-1">{errors[field.name as keyof RegisterFormData]?.message}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-2">الدور</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'investor', label: 'مستثمر' },
                  { value: 'executive', label: 'تنفيذي' },
                  { value: 'analyst', label: 'محلل' }
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setValue('role', role.value)}
                    className={`px-4 py-2.5 rounded-lg border-2 transition-all text-sm ${
                      selectedRole === role.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>}
            </div>

            {[
              { name: 'password', label: 'كلمة المرور', show: showPassword, setShow: setShowPassword },
              { name: 'confirmPassword', label: 'تأكيد كلمة المرور', show: showConfirmPassword, setShow: setShowConfirmPassword },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium mb-2">{field.label}</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id={field.name}
                    type={field.show ? 'text' : 'password'}
                    {...register(field.name as keyof RegisterFormData)}
                    placeholder="••••••••"
                    className={`w-full pr-11 pl-11 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors[field.name as keyof RegisterFormData] ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => field.setShow(!field.show)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {field.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors[field.name as keyof RegisterFormData] && (
                  <p className="text-xs text-red-600 mt-1">{errors[field.name as keyof RegisterFormData]?.message}</p>
                )}
              </div>
            ))}

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeToTerms')}
                  className={`mt-0.5 w-4 h-4 rounded border text-primary focus:ring-2 focus:ring-primary ${
                    errors.agreeToTerms ? 'border-red-500' : 'border-border'
                  }`}
                />
                <span className="text-sm">
                  أوافق على <a href="/terms" className="text-primary hover:underline">الشروط والأحكام</a> و{' '}
                  <a href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</a>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-xs text-red-600 mt-1">{errors.agreeToTerms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إنشاء الحساب...</span>
                </>
              ) : (
                <>
                  <span>إنشاء حساب</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <button onClick={() => navigate('/auth/login')} className="text-primary hover:underline font-medium">
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            انضم إلى أفضل المستثمرين
            <br />
            والتنفيذيين
          </h2>
          <p className="text-xl mb-8 text-white/90">استفد من قوة الذكاء الاصطناعي لاتخاذ قرارات أعمال أفضل وأسرع</p>

          <div className="space-y-4">
            {[
              'تحليل فوري للبيانات بدعم الذكاء الاصطناعي',
              'لوحات تحكم تفاعلية وتقارير متقدمة',
              'توصيات تنفيذية قابلة للتطبيق مباشرة',
              'دعم فني متخصص 24/7',
              'أمان وحماية بيانات على مستوى المؤسسات',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
