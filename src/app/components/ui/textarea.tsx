import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[5rem] w-full rounded-lg border px-4 py-2.5 text-base shadow-sm resize-none field-sizing-content",
        "bg-white dark:bg-gray-900/50",
        "text-gray-900 dark:text-white",
        "border-gray-200 dark:border-gray-700",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "selection:bg-emerald-500 selection:text-white",
        "transition-colors duration-200 ease-in-out",
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

export { Textarea };
