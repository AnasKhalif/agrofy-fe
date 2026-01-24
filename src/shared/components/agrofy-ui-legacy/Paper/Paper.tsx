import MuiPaper, { PaperProps as MuiPaperProps } from '@mui/material/Paper';
import React from 'react';

export type PaperProps = MuiPaperProps;

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  (props, ref) => {
    return <MuiPaper ref={ref} {...props} />;
  }
);

Paper.displayName = 'Paper';
