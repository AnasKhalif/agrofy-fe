import MuiAlert, { AlertProps as MuiAlertProps, AlertColor as MuiAlertColor } from '@mui/material/Alert';
import React from 'react';

export type AlertProps = MuiAlertProps;
export type AlertColor = MuiAlertColor;

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (props, ref) => {
    return <MuiAlert ref={ref} {...props} />;
  }
);

Alert.displayName = 'Alert';
