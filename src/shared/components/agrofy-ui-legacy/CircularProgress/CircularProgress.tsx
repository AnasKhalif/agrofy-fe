import MuiCircularProgress, { CircularProgressProps as MuiCircularProgressProps } from '@mui/material/CircularProgress';
import React from 'react';

export type CircularProgressProps = MuiCircularProgressProps;

export const CircularProgress = React.forwardRef<HTMLSpanElement, CircularProgressProps>(
  (props, ref) => {
    return <MuiCircularProgress ref={ref} {...props} />;
  }
);

CircularProgress.displayName = 'CircularProgress';
