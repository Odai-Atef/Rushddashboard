"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
 className,
 ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
 return (
 <CheckboxPrimitive.Root
 data-slot="checkbox"
 className={cn(
 "peer size-5 shrink-0 rounded-[5px] border shadow-[var(--shadow-sm)]",
 "bg-[var(--card)]",
 "border-[var(--border)]",
 "text-[var(--primary-foreground)]",
 "transition-all duration-[var(--transition-duration)] ease-in-out",
 "hover:border-[var(--text-muted)]",
 "focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 focus-visible:outline-none",
 "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
 "data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)]",
 "data-[state=indeterminate]:bg-[var(--primary)] data-[state=indeterminate]:border-[var(--primary)]",
 "aria-invalid:border-[var(--destructive)] aria-invalid:ring-[var(--destructive)]/20",
 className,
 )}
 {...props}
 >
 <CheckboxPrimitive.Indicator
 data-slot="checkbox-indicator"
 className="flex items-center justify-center text-current transition-none"
 >
 <CheckIcon className="size-3.5" />
 </CheckboxPrimitive.Indicator>
 </CheckboxPrimitive.Root>
 );
}

export { Checkbox };
