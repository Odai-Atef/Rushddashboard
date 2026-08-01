import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
 "inline-flex items-center justify-center rounded-[var(--radius-badge)] border px-4 py-[6px] text-[13px] font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-4 gap-[var(--spacing-small-gap)] [&>svg]:pointer-events-none transition-all duration-[var(--transition-duration)] overflow-hidden min-h-[30px] tracking-wide",
 {
 variants: {
 variant: {
 default:
 "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-[var(--shadow-sm)])] hover:bg-[var(--primary)]/90 hover:scale-[1.02]",
 secondary:
 "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-[var(--shadow-[var(--shadow-sm)])] hover:bg-[var(--secondary)]/90",
 destructive:
 "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-[var(--shadow-[var(--shadow-sm)])] hover:bg-[var(--destructive)]/90",
 outline:
 "border-[var(--border)] text-[var(--text-primary)] bg-transparent hover:bg-[var(--hover)]",
 success:
 "border-transparent bg-[var(--success)]/[0.12] text-[var(--success)] hover:bg-[var(--success)]/[0.20]",
 warning:
 "border-transparent bg-[var(--warning)]/[0.12] text-[var(--warning)] hover:bg-[var(--warning)]/[0.20]",
 danger:
 "border-transparent bg-[var(--destructive)]/[0.12] text-[var(--destructive)] hover:bg-[var(--destructive)]/[0.20]",
 info:
 "border-transparent bg-[var(--info)]/[0.12] text-[var(--info)] hover:bg-[var(--info)]/[0.20]",
 pending:
 "border-transparent bg-[var(--warning)]/[0.12] text-[var(--warning)] hover:bg-[var(--warning)]/[0.20]",
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
