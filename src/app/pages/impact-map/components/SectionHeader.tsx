import { cn } from '@/app/utils/cn';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('space-y-1 mb-[var(--spacing-section-gap)]', className)}>
      <h2 className="text-[32px] md:text-[40px] font-bold text-[var(--text-primary)] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
