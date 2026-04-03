import { createContext } from "react";

// Define the shape of the context state
interface DashboardContextState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

// Create the context with an initial value
export const DashboardContext = createContext<
  DashboardContextState | undefined
>(undefined);
