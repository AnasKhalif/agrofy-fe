import React, { createContext, useState, useCallback, ReactNode } from "react";
import { Snackbar, Alert } from "@/shared/components/agrofy-ui-legacy";
import type { AlertColor } from "@/shared/components/agrofy-ui-legacy";

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = useCallback(
    (message: string, severity: AlertColor = "info") => {
      setToast({
        open: true,
        message,
        severity,
      });
    },
    [],
  );

  const success = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast],
  );

  const error = useCallback(
    (message: string) => {
      showToast(message, "error");
    },
    [showToast],
  );

  const warning = useCallback(
    (message: string) => {
      showToast(message, "warning");
    },
    [showToast],
  );

  const info = useCallback(
    (message: string) => {
      showToast(message, "info");
    },
    [showToast],
  );

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
