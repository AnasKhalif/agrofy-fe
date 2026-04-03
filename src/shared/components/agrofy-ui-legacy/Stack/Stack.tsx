import MuiStack, { StackProps as MuiStackProps } from '@mui/material/Stack';
import React from 'react';

export type StackProps = MuiStackProps;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    return <MuiStack ref={ref} {...props} />;
  }
);

Stack.displayName = 'Stack';
