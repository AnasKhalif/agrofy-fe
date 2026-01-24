import MuiSnackbar, { SnackbarProps as MuiSnackbarProps } from '@mui/material/Snackbar';
import React from 'react';

export type SnackbarProps = MuiSnackbarProps;

export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
  (props, ref) => {
    return <MuiSnackbar ref={ref} {...props} />;
  }
);

Snackbar.displayName = 'Snackbar';
