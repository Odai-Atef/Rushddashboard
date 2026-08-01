import { MapPin } from 'lucide-react';
import { cn } from '@/app/utils/cn';
import { SectionHeader } from './SectionHeader';

export interface ImpactHeaderProps {
  className?: string;
}

export function ImpactHeader({ className }: ImpactHeaderProps) {
  return (
    <header className={cn('animate-fade-in', className)}>
      <div className="flex items-start gap-3 mb-2">
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1',
            'bg-[var(--primary)]/[0.08]'
          )}
        >
          <MapPin className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div className="flex-1">
          <SectionHeader
            title="خارطة الأثر"
            subtitle="منصة تنفيذية تفاعلية تعرض انتشار المشاريع، المستفيدين، الدعم، والعائد الاجتماعي على الاستثمار في جميع مناطق المملكة."
          />
        </div>
      </div>
    </header>
  );
}
