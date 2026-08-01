import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-[var(--spacing-small-gap)] whitespace-nowrap text-sm font-semibold transition-all duration-[var(--transition-duration)] ease-in-out disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
 {
 variants: {
 variant: {
 default:
 "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 hover:scale-[1.02] shadow-[var(--shadow-[var(--shadow-sm)])] hover:shadow-[var(--shadow-[var(--shadow-md)])]",
 secondary:
 "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/90 hover:scale-[1.02] shadow-[var(--shadow-[var(--shadow-sm)])]",
 destructive:
 "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90 hover:scale-[1.02] shadow-[var(--shadow-[var(--shadow-sm)])]",
 outline:
 "border border-[#D9E2EC] bg-white text-[var(--text-primary)] hover:bg-[#F5F7FB] hover:border-[#CBD5E1] active:bg-[var(--muted)]",
 ghost:
 "bg-transparent text-[var(--text-primary)] hover:bg-[var(--hover)] active:bg-[var(--muted)]",
 link: "text-[var(--primary)] underline-offset-4 hover:underline bg-transparent",
 },
 size: {
 default: "h-11 px-4 py-2 rounded-[var(--radius-button)] has-[>svg]:px-3",
 sm: "h-9 rounded-[var(--radius-button)] gap-[var(--spacing-small-gap)].5 px-3 py-1.5 text-sm has-[>svg]:px-2.5",
 lg: "h-12 rounded-[var(--radius-button)] px-6 py-3 text-base has-[>svg]:px-4",
 icon: "h-11 w-11 rounded-[var(--radius-button)]",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 },
);

function Button({
 className,
 variant,
 size,
 asChild = false,
 ...props
}: React.ComponentProps<"button"> &
 VariantProps<typeof buttonVariants> & {
 asChild?: boolean;
 }) {
 const Comp = asChild ? Slot : "button";

 return (
 <Comp
 data-slot="button"
 className={cn(buttonVariants({ variant, size, className }))}
 {...props}
 />
 );
}

export { Button, buttonVariants };
