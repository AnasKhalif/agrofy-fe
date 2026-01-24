import React from 'react';
import MuiTabs, { TabsProps as MuiTabsProps } from '@mui/material/Tabs';
import MuiTab, { TabProps as MuiTabProps } from '@mui/material/Tab';
import Box from '@mui/material/Box';

export type TabsProps = MuiTabsProps;

export type TabProps = MuiTabProps;

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (props, ref) => {
    return <MuiTabs ref={ref} {...props} />;
  }
);

Tabs.displayName = 'Tabs';

export const Tab = React.forwardRef<any, TabProps>(
  (props, ref) => {
    return <MuiTab ref={ref} {...props} />;
  }
);

Tab.displayName = 'Tab';

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';
