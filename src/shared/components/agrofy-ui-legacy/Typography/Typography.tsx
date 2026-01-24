import MuiTypography, { TypographyProps as MuiTypographyProps } from '@mui/material/Typography';
import React from 'react';

export type TypographyProps = MuiTypographyProps;

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (props, ref) => {
    return <MuiTypography ref={ref} {...props} />;
  }
);

Typography.displayName = 'Typography';
