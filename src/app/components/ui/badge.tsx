import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-badge)] border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1 [&>svg]:pointer-events-none transition-all duration-[var(--transition-duration)] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--primary)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--primary)]/90 hover:scale-[1.02]",
        secondary:
          "border-transparent bg-[var(--secondary)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--secondary)]/90",
        destructive:
          "border-transparent bg-[var(--destructive)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--destructive)]/90",
        outline:
          "border-[var(--border)] text-[var(--text-primary)] bg-transparent hover:bg-[var(--hover)]",
        success:
          "border-transparent bg-[var(--primary)]/15 text-[var(--primary)] dark:bg-[var(--primary)]/25 dark:text-[var(--primary)] hover:bg-[var(--primary)]/25",
        warning:
          "border-transparent bg-[var(--warning)]/15 text-[var(--warning)] dark:bg-[var(--warning)]/25 dark:text-[var(--warning)] hover:bg-[var(--warning)]/25",
        info:
          "border-transparent bg-[var(--secondary)]/15 text-[var(--secondary)] dark:bg-[var(--secondary)]/25 dark:text-[var(--secondary)] hover:bg-[var(--secondary)]/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
