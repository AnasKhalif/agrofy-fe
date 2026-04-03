import { createContext } from "react";

// Define the shape of the context state
interface CustomizerContextState {
  selectedIconId: number;
  setSelectedIconId: (id: number) => void;
  activeDir: string;
  setActiveDir: (dir: string) => void;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  activeLayout: string;
  setActiveLayout: (layout: string) => void;
  isCardShadow: boolean;
  setIsCardShadow: (shadow: boolean) => void;
  isLayout: string;
  setIsLayout: (layout: string) => void;
  isBorderRadius: number;
  setIsBorderRadius: (radius: number) => void;
  isCollapse: string;
  setIsCollapse: (collapse: string) => void;
  isLanguage: string;
  setIsLanguage: (language: string) => void;
}

// Create the context with an initial value
export const CustomizerContext = createContext<
  CustomizerContextState | undefined
>(undefined);
