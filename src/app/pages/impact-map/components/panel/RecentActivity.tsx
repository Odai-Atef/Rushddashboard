/**
 * RecentActivity — Right Panel Section 5
 *
 * Timeline display with sequential appearance animation.
 */

import { WidgetCard } from '../widgets/WidgetCard';
import { TimelineItem } from '../widgets/TimelineItem';
import type { TimelineItem as TimelineItemType } from '../../types/analytics';

export interface RecentActivityProps {
  activities?: TimelineItemType[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_ACTIVITIES: TimelineItemType[] = [
  {
    id: 'act-001',
    type: 'project_added',
    description: 'Project added: Digital Education Initiative',
    descriptionAr: 'تمت إضافة مشروع: مبادرة التعليم الرقمي',
    timestamp: '2026-07-31T14:30:00Z',
    status: 'completed',
  },
  {
    id: 'act-002',
    type: 'funding_approved',
    description: 'Funding approved: 45M SAR for Education sector',
    descriptionAr: 'تم اعتماد تمويل: ٤٥ مليون ر.س. لقطاع التعليم',
    timestamp: '2026-07-31T12:15:00Z',
    status: 'completed',
  },
  {
    id: 'act-003',
    type: 'beneficiary_updated',
    description: 'Beneficiaries updated: +1,200 for Vocational Training',
    descriptionAr: 'تم تحديث المستفيدين: +١٬٢٠٠ لبرنامج التدريب المهني',
    timestamp: '2026-07-30T16:45:00Z',
    status: 'completed',
  },
  {
    id: 'act-004',
    type: 'evaluation_completed',
    description: 'Evaluation completed: Community Health Program',
    descriptionAr: 'تم إنجاز التقييم: برنامج الصحة المجتمعية',
    timestamp: '2026-07-29T09:00:00Z',
    status: 'completed',
  },
  {
    id: 'act-005',
    type: 'organization_joined',
    description: 'New organization joined: Future Skills Foundation',
    descriptionAr: 'منظمة جديدة انضمت: مؤسسة مهارات المستقبل',
    timestamp: '2026-07-28T11:20:00Z',
    status: 'completed',
  },
  {
    id: 'act-006',
    type: 'project_added',
    description: 'Project added: Women Empowerment Hub',
    descriptionAr: 'تمت إضافة مشروع: مركز تمكين المرأة',
    timestamp: '2026-07-27T08:30:00Z',
    status: 'pending',
  },
  {
    id: 'act-007',
    type: 'funding_approved',
    description: 'Funding approved: 22M SAR for Empowerment sector',
    descriptionAr: 'تم اعتماد تمويل: ٢٢ مليون ر.س. لقطاع التمكين',
    timestamp: '2026-07-26T13:00:00Z',
    status: 'completed',
  },
  {
    id: 'act-008',
    type: 'beneficiary_updated',
    description: 'Beneficiaries updated: +3,500 new registrations',
    descriptionAr: 'تم تحديث المستفيدين: +٣٬٥٠٠ تسجيل جديد',
    timestamp: '2026-07-25T15:45:00Z',
    status: 'completed',
  },
];

export function RecentActivity({
  activities = DEFAULT_ACTIVITIES,
  isLoading,
  isError,
  onRetry,
  className,
}: RecentActivityProps) {
  return (
    <WidgetCard
      title="النشاطات الأخيرة"
      description="آخر التحديثات والإجراءات"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد نشاطات"
      className={className}
    >
      <div className="space-y-0" role="list" aria-label="النشاطات الأخيرة">
        {activities.map((activity, index) => (
          <TimelineItem
            key={activity.id}
            item={activity}
            index={index}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </WidgetCard>
  );
}
