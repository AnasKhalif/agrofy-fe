/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type StandbyState = "idle" | "standby" | "pin-entry";

interface StandbyContextType {
  standbyState: StandbyState;
  isStandby: boolean; // For backward compatibility
  setStandby: (value: boolean) => void;
  enterStandby: () => void;
  showPinEntry: () => void;
  exitStandby: () => void;
}

const StandbyContext = createContext<StandbyContextType | undefined>(undefined);

const STORAGE_KEY = "standby-state";

// Helper function to get initial state from localStorage
const getInitialState = (): StandbyState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === "idle" || stored === "standby")) {
      return stored as StandbyState;
    }
  } catch (error) {
    console.error("Error reading standby state from localStorage:", error);
  }
  return "idle"; // Default to idle
};

export function StandbyProvider({ children }: { children: ReactNode }) {
  const [standbyState, setStandbyState] =
    useState<StandbyState>(getInitialState);

  const enterStandby = useCallback(() => {
    const newState = "standby";
    setStandbyState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, newState);
    } catch (error) {
      console.error("Error saving standby state to localStorage:", error);
    }
  }, []);

  const showPinEntry = useCallback(() => {
    const newState = "pin-entry";
    setStandbyState(newState);
  }, []);

  const exitStandby = useCallback(() => {
    const newState = "idle";
    setStandbyState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, newState);
    } catch (error) {
      console.error("Error saving standby state to localStorage:", error);
    }
  }, []);

  const setStandby = useCallback((value: boolean) => {
    const newState = value ? "standby" : "idle";
    setStandbyState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, newState);
    } catch (error) {
      console.error("Error saving standby state to localStorage:", error);
    }
  }, []);

  return (
    <StandbyContext.Provider
      value={{
        standbyState,
        isStandby: standbyState !== "idle",
        setStandby,
        enterStandby,
        showPinEntry,
        exitStandby,
      }}
    >
      {children}
    </StandbyContext.Provider>
  );
}

export function useStandby() {
  const context = useContext(StandbyContext);
  if (context === undefined) {
    throw new Error("useStandby must be used within a StandbyProvider");
  }
  return context;
}
