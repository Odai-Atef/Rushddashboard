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
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-sm",
        "bg-gray-300 dark:bg-gray-600",
        "transition-all duration-200 ease-in-out",
        "focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:outline-none",
        "dark:focus-visible:ring-emerald-400/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          "dark:bg-gray-100",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
