import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border px-4 py-2.5 text-base shadow-sm",
        "bg-white dark:bg-gray-900/50",
        "text-gray-900 dark:text-white",
        "border-gray-200 dark:border-gray-700",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "selection:bg-emerald-500 selection:text-white",
        "transition-colors duration-200 ease-in-out",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900",
        "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none",
        "dark:focus:border-emerald-400 dark:focus:ring-emerald-400/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-400/20",
        "aria-invalid:text-red-600 dark:aria-invalid:text-red-400",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
