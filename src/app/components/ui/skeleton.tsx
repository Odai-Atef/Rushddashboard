"use client";

import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
