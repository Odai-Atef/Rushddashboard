"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

function RadioGroup({
 className,
 ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
 return (
 <RadioGroupPrimitive.Root
 data-slot="radio-group"
 className={cn("grid gap-[var(--spacing-small-gap)]", className)}
 {...props}
 />
 );
}

function RadioGroupItem({
 className,
 ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
 return (
 <RadioGroupPrimitive.Item
 data-slot="radio-group-item"
 className={cn(
 "aspect-square size-5 shrink-0 rounded-full border shadow-[var(--shadow-sm)]",
 "bg-[var(--card)]",
 "border-[var(--border)]",
 "text-[var(--primary)]",
 "transition-all duration-200 ease-in-out",
 "hover:border-gray-400 dark:hover:border-gray-500",
 "focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:outline-none",
 "dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/30",
 "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
 "data-[state=checked]:border-emerald-600 dark:data-[state=checked]:border-emerald-500",
 "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-400/20",
 className,
 )}
 {...props}
 >
 <RadioGroupPrimitive.Indicator
 data-slot="radio-group-indicator"
 className="relative flex items-center justify-center"
 >
 <CircleIcon className="fill-current absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
 </RadioGroupPrimitive.Indicator>
 </RadioGroupPrimitive.Item>
 );
}

export { RadioGroup, RadioGroupItem };
