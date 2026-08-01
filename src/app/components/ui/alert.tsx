import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-card)] border px-[var(--spacing-card-padding)] py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start transition-all duration-[var(--transition-duration)] ease-in-out",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--card)] dark:bg-[var(--muted)] border-[var(--border)] text-[var(--text-primary)] dark:text-white",
        success:
          "bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 border-[var(--primary)]/20 dark:border-[var(--primary)]/30 text-[var(--primary)] dark:text-[var(--primary)]",
        warning:
          "bg-[var(--warning)]/10 dark:bg-[var(--warning)]/20 border-[var(--warning)]/20 dark:border-[var(--warning)]/30 text-[var(--warning)] dark:text-[var(--warning)]",
        danger:
          "bg-[var(--destructive)]/10 dark:bg-[var(--destructive)]/20 border-[var(--destructive)]/20 dark:border-[var(--destructive)]/30 text-[var(--destructive)] dark:text-[var(--destructive)]",
        info:
          "bg-[var(--secondary)]/10 dark:bg-[var(--secondary)]/20 border-[var(--secondary)]/20 dark:border-[var(--secondary)]/30 text-[var(--secondary)] dark:text-[var(--secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const alertIcons = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

function Alert({
  className,
  variant = "default",
  dismissible = false,
  icon: CustomIcon,
  onDismiss,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    dismissible?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    onDismiss?: () => void;
  }) {
  const Icon = CustomIcon || alertIcons[variant || "default"] || Info;
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) {
    return null;
  }

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant }),
        "animate-in fade-in slide-in-from-top-2",
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          "size-5 translate-y-0.5",
          variant === "default" && "text-[var(--text-muted)] dark:text-white/60",
          variant === "success" && "text-[var(--primary)]",
          variant === "warning" && "text-[var(--warning)]",
          variant === "danger" && "text-[var(--destructive)]",
          variant === "info" && "text-[var(--secondary)]",
        )}
      />
      <div className="flex flex-col gap-1">
        {props.children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            "absolute top-3 right-3 rounded-[var(--radius-button)] p-1 opacity-60 transition-opacity duration-[var(--transition-duration)] hover:opacity-100 hover:bg-current/10",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30",
          )}
          aria-label="Dismiss alert"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-bold tracking-tight text-[var(--text-primary)]",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm leading-relaxed text-[var(--text-muted)]",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
