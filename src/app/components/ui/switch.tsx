"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
 className,
 ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
 return (
 <SwitchPrimitive.Root
 data-slot="switch"
 className={cn(
 "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-[var(--shadow-sm)]",
 "bg-[var(--switch-background)]",
 "transition-all duration-[var(--transition-duration)] ease-in-out",
 "focus-visible:ring-2 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none",
 "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
 "data-[state=checked]:bg-[var(--primary)]",
 className,
 )}
 {...props}
 >
 <SwitchPrimitive.Thumb
 data-slot="switch-thumb"
 className={cn(
 "pointer-events-none block size-5 rounded-full shadow-[var(--shadow-md)] ring-0 transition-transform duration-[var(--transition-duration)] ease-in-out",
 "bg-[var(--primary-foreground)]",
 "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
 )}
 />
 </SwitchPrimitive.Root>
 );
}

export { Switch };
