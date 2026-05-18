import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Dashboard } from '../../types/dashboard';

const dashboardFormSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').max(100),
  nameAr: z.string().min(1, 'الاسم العربي مطلوب').max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
});

type DashboardFormData = z.infer<typeof dashboardFormSchema>;

interface DashboardFormProps {
  dashboard?: Dashboard;
  onSubmit: (data: DashboardFormData) => void;
  isLoading?: boolean;
}

export function DashboardForm({ dashboard, onSubmit, isLoading }: DashboardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DashboardFormData>({
    resolver: zodResolver(dashboardFormSchema),
    defaultValues: dashboard
      ? {
          name: dashboard.name,
          nameAr: dashboard.nameAr,
          description: dashboard.description || '',
          icon: dashboard.icon || '',
        }
      : undefined,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dashboard ? 'تعديل لوحة المعلومات' : 'إنشاء لوحة معلومات'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم (إنجليزي)</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="اسم لوحة المعلومات"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameAr">الاسم (عربي)</Label>
            <Input
              id="nameAr"
              {...register('nameAr')}
              placeholder="اسم لوحة المعلومات بالعربي"
            />
            {errors.nameAr && (
              <p className="text-sm text-red-500">{errors.nameAr.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="وصف مختصر"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">الأيقونة</Label>
            <Input
              id="icon"
              {...register('icon')}
              placeholder="اسم أيقونة (مثال: layout-dashboard)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'جاري الحفظ...'
                : dashboard
                ? 'حفظ التغييرات'
                : 'إنشاء'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export type { DashboardFormData };
