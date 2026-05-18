import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { DashboardForm, type DashboardFormData } from '../../components/dashboard/DashboardForm';
import { updateDashboard, getDashboard } from '../../services/dashboard';
import { useDashboard } from '../../hooks/useDashboard';
import { toast } from 'sonner';

export function EditDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { dashboard, isLoading: isDashboardLoading } = useDashboard(id);

  const handleSubmit = async (data: DashboardFormData) => {
    if (!id) return;

    setIsLoading(true);
    try {
      await updateDashboard(id, data);
      toast.success('تم تحديث لوحة المعلومات بنجاح');
      navigate(`/dashboard/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في تحديث لوحة المعلومات';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDashboardLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  if (!dashboard) {
    return <div className="p-6">لوحة المعلومات غير موجودة</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <DashboardForm
        dashboard={dashboard}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
