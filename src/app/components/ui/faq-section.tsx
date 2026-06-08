/**
 * Reusable FAQ/Help Section
 *
 * A reusable, collapsible FAQ section with Arabic/English support.
 * 
 * @example
 * ```tsx
 * <FAQSection
 *   items={[
 *     {
 *       question: "How to use this dashboard?",
 *       answer: "Navigate using the sidebar..."
 *     }
 *   ]}
 * />
 * ```
 */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/app/utils/cn';

interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQSection({ items, title = 'الأسئلة الشائعة', className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn('bg-card border border-border rounded-xl p-6', className)}>
      <h3 className="text-xl mb-4">{title}</h3>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-right">{item.question}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 transition-transform',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-muted-foreground">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}