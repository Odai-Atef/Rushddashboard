"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium text-[var(--text-primary)] dark:text-white",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-[var(--hover)]",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-[var(--text-muted)] dark:text-[var(--text-muted)] rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[var(--primary)]/[0.08] dark:[&:has([aria-selected])]:bg-[var(--primary)]/[0.15] [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&[role='button']]:rounded-[var(--radius-button)]",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal text-[var(--text-primary)] dark:text-white aria-selected:opacity-100 hover:bg-[var(--hover)]",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[var(--primary)] aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-[var(--primary)] aria-selected:text-white",
        day_selected:
          "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 focus:bg-[var(--primary)] focus:text-white dark:bg-[var(--primary)] dark:hover:bg-[var(--primary)]/90",
        day_today: "bg-[var(--hover)] text-[var(--text-primary)] dark:bg-[var(--muted)] dark:text-white",
        day_outside:
          "day-outside text-[var(--text-muted)] aria-selected:text-[var(--text-muted)]",
        day_disabled: "text-[var(--text-muted)] opacity-50",
        day_range_middle:
          "aria-selected:bg-[var(--primary)]/[0.12] aria-selected:text-[var(--primary)] dark:aria-selected:bg-[var(--primary)]/[0.25] dark:aria-selected:text-[var(--primary)]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
