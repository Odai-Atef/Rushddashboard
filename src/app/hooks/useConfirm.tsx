"use client";

import { useCallback, useState } from "react";
import { ConfirmDialog, type ConfirmDialogProps } from "@/app/components/ui/ConfirmDialog";

export interface ConfirmOptions
  extends Omit<
    ConfirmDialogProps,
    "open" | "onOpenChange" | "onConfirm" | "onCancel"
  > {}

interface ConfirmState {
  open: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    options: null,
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setState((prev) => {
      if (!open && prev.resolve) {
        prev.resolve(false);
      }
      return { open, options: prev.options, resolve: open ? prev.resolve : null };
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((prev) => {
      if (prev.resolve) {
        prev.resolve(true);
      }
      return { open: false, options: prev.options, resolve: null };
    });
  }, []);

  const handleCancel = useCallback(() => {
    setState((prev) => {
      if (prev.resolve) {
        prev.resolve(false);
      }
      return { open: false, options: prev.options, resolve: null };
    });
  }, []);

  const dialog = state.options ? (
    <ConfirmDialog
      open={state.open}
      onOpenChange={handleOpenChange}
      title={state.options.title}
      description={state.options.description}
      confirmLabel={state.options.confirmLabel}
      cancelLabel={state.options.cancelLabel}
      variant={state.options.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, dialog };
}
