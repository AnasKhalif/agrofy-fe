import { createContext } from "react";

/**
 * Dashboard Context
 * Context for dashboard UI state
 */

interface DashboardContextState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

export const DashboardContext = createContext<
  DashboardContextState | undefined
>(undefined);
