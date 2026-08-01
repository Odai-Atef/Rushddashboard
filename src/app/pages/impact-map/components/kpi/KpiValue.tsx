/**
 * KPI Value Component
 *
 * Animated KPI value with counter animation on first render.
 * Typography: 40px, 700 weight, semantic color token.
 * Supports Arabic numerals via formattedValue prop.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/app/utils/cn';
import type { KpiValueProps } from '../../types/kpi';

export function KpiValue({ value, formattedValue, className }: KpiValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 600; // ms
    const startTime = performance.now();
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      className={cn(
        // Typography: 40px, 700 weight
        'text-[40px] font-bold leading-[1.1]',
        // Color: semantic text token
        'text-[var(--impact-text-primary)]',
        // RTL support
        'tabular-nums',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      role="text"
      aria-label={`القيمة: ${formattedValue}`}
    >
      {formattedValue}
    </motion.span>
  );
}
