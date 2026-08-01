import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
 return (
 <textarea
 data-slot="textarea"
 className={cn(
 "flex min-h-[5rem] w-full rounded-[var(--radius-input)] border px-4 py-2.5 text-base shadow-sm resize-none field-sizing-content",
 "bg-[var(--input-background)]",
 "text-[var(--text-primary)]",
 "border-[var(--border)]",
 "placeholder:text-[var(--text-muted)]",
 "selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]",
 "transition-all duration-[var(--transition-duration)] ease-in-out",
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

export { Textarea };
