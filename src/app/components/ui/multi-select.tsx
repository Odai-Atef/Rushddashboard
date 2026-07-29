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
            "flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            disabled && "cursor-not-allowed opacity-50 bg-gray-50",
            error && "border-red-500 bg-red-50",
            !error && "border-gray-300 hover:border-gray-400",
            className
          )}
        >
          <span className="flex flex-wrap items-center gap-1.5 overflow-hidden">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) removeValue(option.value);
                  }}
                >
                  {option.label}
                  <X className="h-3 w-3 cursor-pointer hover:text-blue-900" />
                </span>
              ))
            )}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command className="rounded-md border shadow-md bg-white">
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className={cn("h-9", inputClassName)}
          />
          <CommandList className="max-h-60 overflow-auto">
            <CommandEmpty className="py-4 text-center text-sm text-gray-500">
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
                      // Keep the popover open so multiple items can be picked
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      "flex cursor-pointer items-center justify-between px-3 py-2 text-sm",
                      isSelected && "bg-blue-50 text-blue-700"
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="text-blue-600 text-xs font-medium">
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
