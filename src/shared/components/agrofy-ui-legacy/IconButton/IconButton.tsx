import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import React from 'react';

export type IconButtonProps = MuiIconButtonProps;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    return <MuiIconButton ref={ref} {...props} />;
  }
);

IconButton.displayName = 'IconButton';
