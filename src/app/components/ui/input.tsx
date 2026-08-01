import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
 return (
 <input
 type={type}
 data-slot="input"
 className={cn(
 "flex h-11 w-full min-w-0 rounded-[var(--radius-input)] border px-4 py-2.5 text-base shadow-sm",
 "bg-[var(--input-background)]",
 "text-[var(--text-primary)]",
 "border-[var(--border)]",
 "placeholder:text-[var(--text-muted)]",
 "selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]",
 "transition-all duration-[var(--transition-duration)] ease-in-out",
 "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text-primary)]",
 "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/30 focus:outline-none",
 "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--muted)]",
 "aria-invalid:border-[var(--destructive)] aria-invalid:ring-[var(--destructive)]/20",
 "aria-invalid:text-[var(--destructive)]",
 "md:text-sm",
 className,
 )}
 {...props}
 />
 );
}

export { Input };
