import { useState, ReactNode, useEffect } from "react";
import React from "react";
import { storageService } from "@/app/services/storageService";
import { CustomizerContext } from "@/app/contexts/CustomizerContext";

/**
 * Customizer Provider
 * Manages theme customization state with localStorage persistence
 */

const STORAGE_KEY = "customizer-settings";

interface CustomizerConfig {
  activeDir: string;
  activeMode: string;
  activeTheme: string;
  activeLayout: string;
  isCardShadow: boolean;
  isLayout: string;
  isBorderRadius: number;
  isCollapse: string;
  isLanguage: string;
}

const defaultConfig: CustomizerConfig = {
  activeDir: "ltr",
  activeMode: "light",
  activeTheme: "BLUE_THEME",
  activeLayout: "vertical",
  isCardShadow: true,
  isLayout: "full",
  isBorderRadius: 4,
  isCollapse: "full-sidebar",
  isLanguage: "en",
};

// Load saved settings from localStorage or use defaults
const getInitialConfig = (): CustomizerConfig => {
  const savedConfig = storageService.get<CustomizerConfig>(STORAGE_KEY);
  return savedConfig ? { ...defaultConfig, ...savedConfig } : defaultConfig;
};

// Define the type for the children prop
interface CustomizerContextProps {
  children: ReactNode;
}

// Create the provider component
export const CustomizerProvider: React.FC<CustomizerContextProps> = ({
  children,
}) => {
  const initialConfig = getInitialConfig();

  const [selectedIconId, setSelectedIconId] = useState<number>(1);
  const [activeDir, setActiveDir] = useState<string>(initialConfig.activeDir);
  const [activeMode, setActiveMode] = useState<string>(
    initialConfig.activeMode,
  );
  const [activeTheme, setActiveTheme] = useState<string>(
    initialConfig.activeTheme,
  );
  const [activeLayout, setActiveLayout] = useState<string>(
    initialConfig.activeLayout,
  );
  const [isCardShadow, setIsCardShadow] = useState<boolean>(
    initialConfig.isCardShadow,
  );
  const [isLayout, setIsLayout] = useState<string>(initialConfig.isLayout);
  const [isBorderRadius, setIsBorderRadius] = useState<number>(
    initialConfig.isBorderRadius,
  );
  const [isCollapse, setIsCollapse] = useState<string>(
    initialConfig.isCollapse,
  );
  const [isLanguage, setIsLanguage] = useState<string>(
    initialConfig.isLanguage,
  );

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const config: CustomizerConfig = {
      activeDir,
      activeMode,
      activeTheme,
      activeLayout,
      isCardShadow,
      isLayout,
      isBorderRadius,
      isCollapse,
      isLanguage,
    };
    storageService.set(STORAGE_KEY, config);
  }, [
    activeDir,
    activeMode,
    activeTheme,
    activeLayout,
    isCardShadow,
    isLayout,
    isBorderRadius,
    isCollapse,
    isLanguage,
  ]);

  return (
    <CustomizerContext.Provider
      value={{
        selectedIconId,
        setSelectedIconId,
        activeDir,
        setActiveDir,
        activeMode,
        setActiveMode,
        activeTheme,
        setActiveTheme,
        activeLayout,
        setActiveLayout,
        isCardShadow,
        setIsCardShadow,
        isLayout,
        setIsLayout,
        isBorderRadius,
        setIsBorderRadius,
        isCollapse,
        setIsCollapse,
        isLanguage,
        setIsLanguage,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};
