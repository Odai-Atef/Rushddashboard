"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "./utils";

function InputOTP({
 className,
 containerClassName,
 ...props
}: React.ComponentProps<typeof OTPInput> & {
 containerClassName?: string;
}) {
 return (
 <OTPInput
 data-slot="input-otp"
 containerClassName={cn(
 "flex items-center gap-[var(--spacing-small-gap)] has-disabled:opacity-50",
 containerClassName,
 )}
 className={cn("disabled:cursor-not-allowed", className)}
 {...props}
 />
 );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="input-otp-group"
 className={cn("flex items-center gap-[var(--spacing-small-gap)]", className)}
 {...props}
 />
 );
}

function InputOTPSlot({
 index,
 className,
 ...props
}: React.ComponentProps<"div"> & {
 index: number;
}) {
 const inputOTPContext = React.useContext(OTPInputContext);
 const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

 return (
 <div
 data-slot="input-otp-slot"
 data-active={isActive}
 className={cn(
 "relative flex h-10 w-10 items-center justify-center text-sm transition-all duration-200 ease-in-out",
 "bg-[var(--card)]",
 "text-[var(--text-primary)]",
 "border-y border-r border-[var(--border)]",
 "first:rounded-l-md first:border-l last:rounded-r-md",
 "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none",
 "dark:focus:border-emerald-400 dark:focus:ring-emerald-400/30",
 "data-[active=true]:border-emerald-500 data-[active=true]:ring-2 data-[active=true]:ring-emerald-500/30 data-[active=true]:z-10",
 "dark:data-[active=true]:border-emerald-400 dark:data-[active=true]:ring-emerald-400/30",
 "aria-invalid:border-red-500 dark:aria-invalid:border-red-400",
 "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
 className,
 )}
 {...props}
 >
 {char}
 {hasFakeCaret && (
 <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
 <div className="animate-caret-blink bg-[var(--card)] h-4 w-px duration-1000" />
 </div>
 )}
 </div>
 );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
 return (
 <div data-slot="input-otp-separator" role="separator" {...props}>
 <MinusIcon className="text-[var(--text-muted)]" />
 </div>
 );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
