import React, { createContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Icon } from "@iconify/react";

type Severity = "success" | "error" | "warning" | "info";

interface ToastContextType {
  showToast: (message: string, severity?: Severity) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastState {
  open: boolean;
  message: string;
  severity: Severity;
  id: number;
}

const ICONS: Record<Severity, string> = {
  success: "solar:check-circle-bold",
  error:   "solar:close-circle-bold",
  warning: "solar:danger-triangle-bold",
  info:    "solar:info-circle-bold",
};

const COLORS: Record<Severity, string> = {
  success: "bg-green-600 text-white",
  error:   "bg-red-600 text-white",
  warning: "bg-yellow-500 text-white",
  info:    "bg-blue-600 text-white",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
    id: 0,
  });

  const showToast = useCallback((message: string, severity: Severity = "info") => {
    setToast({ open: true, message, severity, id: Date.now() });
  }, []);

  const success = useCallback((message: string) => showToast(message, "success"), [showToast]);
  const error   = useCallback((message: string) => showToast(message, "error"),   [showToast]);
  const warning = useCallback((message: string) => showToast(message, "warning"), [showToast]);
  const info    = useCallback((message: string) => showToast(message, "info"),    [showToast]);

  // Auto hide after 4s
  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 4000);
    return () => clearTimeout(t);
  }, [toast.id]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Toast UI */}
      <div
        className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl min-w-[280px] max-w-[380px] transition-all duration-300 ${
          COLORS[toast.severity]
        } ${
          toast.open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <Icon icon={ICONS[toast.severity]} width={22} className="flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button
          onClick={() => setToast((prev) => ({ ...prev, open: false }))}
          className="opacity-80 hover:opacity-100 flex-shrink-0"
        >
          <Icon icon="solar:close-square-outline" width={18} />
        </button>
      </div>
    </ToastContext.Provider>
  );
}
