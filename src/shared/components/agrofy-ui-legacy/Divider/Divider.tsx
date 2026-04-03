import MuiDivider, { DividerProps as MuiDividerProps } from '@mui/material/Divider';
import React from 'react';

export type DividerProps = MuiDividerProps;

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (props, ref) => {
    return <MuiDivider ref={ref} {...props} />;
  }
);

Divider.displayName = 'Divider';
