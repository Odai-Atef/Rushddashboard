import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100",
        success:
          "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
        warning:
          "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
        danger:
          "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
        info:
          "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
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
          variant === "default" && "text-gray-500 dark:text-gray-400",
          variant === "success" && "text-emerald-600 dark:text-emerald-300",
          variant === "warning" && "text-amber-600 dark:text-amber-300",
          variant === "danger" && "text-red-600 dark:text-red-300",
          variant === "info" && "text-blue-600 dark:text-blue-300",
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
            "absolute top-3 right-3 rounded-md p-1 opacity-60 transition-opacity duration-200 hover:opacity-100 hover:bg-current/10",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
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
        "col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight",
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
        "col-start-2 grid justify-items-start gap-1 text-sm leading-relaxed opacity-90",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
