import MuiBox, { BoxProps as MuiBoxProps } from '@mui/material/Box';
import React from 'react';

export type BoxProps = MuiBoxProps;

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    return <MuiBox ref={ref} {...props} />;
  }
);

Box.displayName = 'Box';
