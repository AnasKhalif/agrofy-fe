import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';
import React from 'react';

export type ChipProps = MuiChipProps;

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (props, ref) => {
    return <MuiChip ref={ref} {...props} />;
  }
);

Chip.displayName = 'Chip';
