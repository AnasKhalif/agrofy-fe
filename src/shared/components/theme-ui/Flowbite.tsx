import React from 'react';

export interface FlowbiteProps {
  children: React.ReactNode;
  theme?: {
    theme?: any;
  };
}

// This is a simple wrapper component that replaces Flowbite theme provider
// Since our components use the custom theme directly, this just passes through children
export const Flowbite: React.FC<FlowbiteProps> = ({ children }) => {
  return <>{children}</>;
};

// This replaces ThemeModeScript - it's a no-op since we handle dark mode through Tailwind
export const ThemeModeScript: React.FC = () => {
  return null;
};
