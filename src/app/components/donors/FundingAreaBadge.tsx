/**
 * Funding Area Badge
 *
 * Displays a funding area as a colored tag/badge.
 * Colors are assigned deterministically based on the funding area name
 * to ensure consistency across the application.
 */

import { cn } from '@/app/utils/cn';

interface FundingAreaBadgeProps {
  name: string;
  className?: string;
}

const COLOR_PALETTE = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-teal-100 text-teal-700 border-teal-200',
];

/**
 * Deterministically assigns a color index based on the funding area name.
 * This ensures the same funding area always gets the same color.
 */
function getColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLOR_PALETTE.length;
}

export function FundingAreaBadge({ name, className }: FundingAreaBadgeProps) {
  const colorClass = COLOR_PALETTE[getColorIndex(name)];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClass,
        className
      )}
    >
      {name}
    </span>
  );
}
