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
 'bg-[var(--secondary)]/[0.1] text-[var(--secondary)] border-[var(--secondary)]/[0.3]',
 'bg-[var(--primary)]/[0.1] text-[var(--primary)] border-[var(--primary)]/[0.3]',
 'bg-[var(--warning)]/[0.1] text-[var(--warning)] border-[var(--warning)]/[0.3]',
 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)] border-[var(--destructive)]/[0.3]',
 'bg-[var(--secondary)]/[0.1] text-[var(--secondary)] border-[var(--secondary)]/[0.3]',
 'bg-[var(--info)]/[0.1] text-[var(--info)] border-[var(--info)]/[0.3]',
 'bg-[var(--primary)]/[0.1] text-[var(--primary)] border-[var(--primary)]/[0.3]',
 'bg-[var(--warning)]/[0.1] text-[var(--warning)] border-[var(--warning)]/[0.3]',
 'bg-[var(--secondary)]/[0.1] text-[var(--secondary)] border-[var(--secondary)]/[0.3]',
 'bg-[var(--success)]/[0.1] text-[var(--success)] border-[var(--success)]/[0.3]',
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
