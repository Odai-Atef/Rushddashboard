import * as React from "react";

import { cn } from "./utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card"
 className={cn(
 "rounded-[var(--radius-card)] border bg-[var(--card)] text-[var(--card-foreground)] shadow-[var(--shadow-card)] transition-all duration-[var(--transition-duration)]",
 "border-[var(--border)]",
 "hover:shadow-[var(--shadow-lg)] hover:translate-y-[-2px]",
 className,
 )}
 {...props}
 />
 );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-header"
 className={cn(
 "flex flex-col gap-1.5 px-[var(--spacing-card-padding)] py-5",
 className,
 )}
 {...props}
 />
 );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-title"
 className={cn(
 "text-lg font-bold leading-none tracking-tight text-[var(--card-foreground)]",
 className,
 )}
 {...props}
 />
 );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-description"
 className={cn(
 "text-sm text-[var(--text-muted)] leading-relaxed",
 className,
 )}
 {...props}
 />
 );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-content"
 className={cn("px-[var(--spacing-card-padding)] py-0", className)}
 {...props}
 />
 );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-footer"
 className={cn(
 "flex items-center justify-between px-[var(--spacing-card-padding)] py-4 gap-2",
 className,
 )}
 {...props}
 />
 );
}

export {
 Card,
 CardHeader,
 CardFooter,
 CardTitle,
 CardDescription,
 CardContent,
};
