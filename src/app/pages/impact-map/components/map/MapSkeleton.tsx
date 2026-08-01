'use client';

import { cn } from '@/app/utils/cn';

export interface MapSkeletonProps {
  className?: string;
}

export function MapSkeleton({ className }: MapSkeletonProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-[20px]',
        'border border-[var(--impact-border)]',
        className
      )}
      role="status"
      aria-label="جاري تحميل الخارطة..."
    >
      {/* Skeleton shimmer background */}
      <div className="absolute inset-0 skeleton-shimmer" />

      {/* Mock map outline */}
      <div className="relative w-full h-full p-6 md:p-10"
        className="min-h-full"
      >
        {/* Saudi-like abstract shape */}
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full opacity-30"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect x="0" y="0" width="1000" height="1000" rx="16" fill="var(--impact-surface-secondary)" />
          {/* Simplified blobs to mimic region shapes */}
          <rect x="120" y="140" width="160" height="140" rx="60" fill="var(--impact-border)" />
          <rect x="280" y="180" width="140" height="120" rx="50" fill="var(--impact-border)" />
          <rect x="220" y="340" width="130" height="110" rx="45" fill="var(--impact-border)" />
          <rect x="370" y="260" width="110" height="120" rx="40" fill="var(--impact-border)" />
          <rect x="380" y="120" width="130" height="100" rx="40" fill="var(--impact-border)" />
          <rect x="470" y="60"  width="150" height="100" rx="40" fill="var(--impact-border)" />
          <rect x="400" y="380" width="180" height="170" rx="60" fill="var(--impact-border)" />
          <rect x="300" y="460" width="130" height="140" rx="50" fill="var(--impact-border)" />
          <rect x="580" y="260" width="220" height="310" rx="70" fill="var(--impact-border)" />
          <rect x="360" y="610" width="110" height="100" rx="40" fill="var(--impact-border)" />
          <rect x="280" y="580" width="90"  height="90"  rx="35" fill="var(--impact-border)" />
          <rect x="460" y="710" width="110" height="90"  rx="35" fill="var(--impact-border)" />
          <rect x="300" y="710" width="90"  height="80"  rx="30" fill="var(--impact-border)" />
        </svg>

        {/* Floating marker skeletons */}
        <div className="absolute top-[25%] left-[30%] w-3 h-3 rounded-full skeleton-pulse bg-[var(--impact-border)]" />
        <div className="absolute top-[40%] left-[55%] w-3 h-3 rounded-full skeleton-pulse bg-[var(--impact-border)]" />
        <div className="absolute top-[60%] left-[40%] w-3 h-3 rounded-full skeleton-pulse bg-[var(--impact-border)]" />
        <div className="absolute top-[50%] left-[70%] w-3 h-3 rounded-full skeleton-pulse bg-[var(--impact-border)]" />
        <div className="absolute top-[75%] left-[35%] w-3 h-3 rounded-full skeleton-pulse bg-[var(--impact-border)]" />
      </div>
    </div>
  );
}
