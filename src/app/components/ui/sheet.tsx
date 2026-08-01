"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
 return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
 return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
 return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
 return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
 className,
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
 return (
 <SheetPrimitive.Overlay
 data-slot="sheet-overlay"
 className={cn(
 "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
 "bg-[var(--text-primary)]/[0.5] backdrop-blur-sm transition-all duration-[var(--transition-duration)]",
 className,
 )}
 {...props}
 />
 );
}

function SheetContent({
 className,
 children,
 side = "right",
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
 side?: "top" | "right" | "bottom" | "left";
}) {
 return (
 <SheetPortal>
 <SheetOverlay />
 <SheetPrimitive.Content
 data-slot="sheet-content"
 className={cn(
 "data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-[var(--spacing-grid-gap)] shadow-[var(--shadow-xl)] transition-all duration-[var(--transition-duration)]",
 "bg-[var(--card)] text-[var(--card-foreground)]",
 side === "right" &&
 "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-[min(85vw,100%)] border-l border-[var(--border)] sm:max-w-sm rounded-l-[var(--radius-dialog)]",
 side === "left" &&
 "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-[min(85vw,100%)] border-r border-[var(--border)] sm:max-w-sm rounded-r-[var(--radius-dialog)]",
 side === "top" &&
 "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b border-[var(--border)] rounded-b-[var(--radius-dialog)]",
 side === "bottom" &&
 "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t border-[var(--border)] rounded-t-[var(--radius-dialog)]",
 className,
 )}
 {...props}
 >
 {children}
 <SheetPrimitive.Close
 className={cn(
 "absolute top-4 right-4 rounded-[var(--radius-button)] p-[var(--spacing-small-gap)].5 opacity-70 transition-all duration-[var(--transition-duration)]",
 "hover:opacity-100 hover:bg-[var(--hover)]",
 "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/30 focus:ring-offset-2 focus:ring-offset-background",
 "disabled:pointer-events-none",
 )}
 aria-label="Close sheet"
 >
 <XIcon className="size-4 text-[var(--text-muted)]" />
 <span className="sr-only">Close</span>
 </SheetPrimitive.Close>
 </SheetPrimitive.Content>
 </SheetPortal>
 );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="sheet-header"
 className={cn("flex flex-col gap-[var(--spacing-small-gap)].5 p-[var(--spacing-card-padding)]", className)}
 {...props}
 />
 );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="sheet-footer"
 className={cn(
 "mt-auto flex flex-col gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] border-t border-[var(--border)]",
 className,
 )}
 {...props}
 />
 );
}

function SheetTitle({
 className,
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
 return (
 <SheetPrimitive.Title
 data-slot="sheet-title"
 className={cn(
 "text-lg font-bold text-[var(--card-foreground)]",
 className,
 )}
 {...props}
 />
 );
}

function SheetDescription({
 className,
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
 return (
 <SheetPrimitive.Description
 data-slot="sheet-description"
 className={cn("text-sm text-[var(--text-muted)]", className)}
 {...props}
 />
 );
}

export {
 Sheet,
 SheetTrigger,
 SheetClose,
 SheetContent,
 SheetHeader,
 SheetFooter,
 SheetTitle,
 SheetDescription,
};
