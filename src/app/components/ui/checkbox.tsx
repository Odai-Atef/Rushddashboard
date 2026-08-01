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
        "peer size-5 shrink-0 rounded-[5px] border shadow-sm",
        "bg-white dark:bg-gray-900/50",
        "border-gray-300 dark:border-gray-600",
        "text-white",
        "transition-all duration-200 ease-in-out",
        "hover:border-gray-400 dark:hover:border-gray-500",
        "focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:outline-none",
        "dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 dark:data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:border-emerald-500",
        "data-[state=indeterminate]:bg-emerald-600 data-[state=indeterminate]:border-emerald-600 dark:data-[state=indeterminate]:bg-emerald-500 dark:data-[state=indeterminate]:border-emerald-500",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-400/20",
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
