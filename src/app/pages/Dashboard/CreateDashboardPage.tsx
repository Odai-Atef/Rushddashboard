import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardForm, type DashboardFormData } from '../../components/dashboard/DashboardForm';
import { createDashboard } from '../../services/dashboard';
import { toast } from 'sonner';

export function CreateDashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: DashboardFormData) => {
    setIsLoading(true);
    try {
      const response = await createDashboard({
        ...data,
        layout: {
          type: 'grid',
          columns: 12,
          gap: 16,
          padding: 24,
        },
        isDefault: false,
        sortOrder: 0,
      });
      toast.success('تم إنشاء لوحة المعلومات بنجاح');
      navigate(`/dashboard/${response.dashboard.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في إنشاء لوحة المعلومات';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <DashboardForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
