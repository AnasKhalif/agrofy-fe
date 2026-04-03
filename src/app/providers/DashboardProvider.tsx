import { useState, ReactNode } from "react";
import React from "react";
import { DashboardContext } from "@/app/contexts/DashboardContext";

/**
 * Dashboard Provider
 * Manages dashboard UI state (sidebar, mobile navigation, etc.)
 */

// Define the type for the children prop
interface DashboardContextProps {
  children: ReactNode;
}

// Create the provider component
export const DashboardProvider: React.FC<DashboardContextProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);

  return (
    <DashboardContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
