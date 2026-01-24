import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import React from 'react';

export type DrawerProps = MuiDrawerProps;

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (props, ref) => {
    return <MuiDrawer ref={ref} {...props} />;
  }
);

Drawer.displayName = 'Drawer';
