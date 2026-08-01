"use client";

import * as React from "react";
import { X, ChevronsUpDown } from "lucide-react";

import { cn } from "./utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  error?: boolean;
}

function normalizeSearch(text: string): string {
  return text.trim().toLowerCase();
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "اختر...",
  searchPlaceholder = "ابحث...",
  emptyMessage = "لا توجد نتائج",
  disabled = false,
  className,
  inputClassName,
  error = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const selectedOptions = React.useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet]
  );

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const term = normalizeSearch(search);
    return options.filter((o) => normalizeSearch(o.label).includes(term));
  }, [options, search]);

  const toggleValue = React.useCallback(
    (value: string) => {
      const next = selectedSet.has(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(next);
    },
    [onChange, selected, selectedSet]
  );

  const removeValue = React.useCallback(
    (value: string) => {
      onChange(selected.filter((v) => v !== value));
    },
    [onChange, selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && search === "" && selected.length > 0) {
        removeValue(selected[selected.length - 1]);
      }
    },
    [search, selected, removeValue]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-sm transition-colors duration-200 ease-in-out",
            "bg-white dark:bg-gray-900/50",
            "text-gray-900 dark:text-white",
            "border-gray-200 dark:border-gray-700",
            "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none",
            "dark:focus:border-emerald-400 dark:focus:ring-emerald-400/30",
            disabled && "cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-800",
            error && "border-red-500 ring-red-500/20 bg-red-50 dark:bg-red-900/10",
            !error && "hover:border-gray-300 dark:hover:border-gray-600",
            className
          )}
        >
          <span className="flex flex-wrap items-center gap-1.5 overflow-hidden">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) removeValue(option.value);
                  }}
                >
                  {option.label}
                  <X className="size-3 cursor-pointer hover:text-emerald-900 dark:hover:text-emerald-200" />
                </span>
              ))
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command className="rounded-lg border shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className={cn("h-11", inputClassName)}
          />
          <CommandList className="max-h-60 overflow-auto">
            <CommandEmpty className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selectedSet.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={() => {
                      toggleValue(option.value);
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      "flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm transition-colors duration-150",
                      "text-gray-900 dark:text-white",
                      isSelected && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        ✓
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
