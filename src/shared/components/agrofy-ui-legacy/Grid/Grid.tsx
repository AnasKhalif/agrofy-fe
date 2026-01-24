import MuiGrid, { GridProps as MuiGridProps } from '@mui/material/Grid';
import MuiContainer, { ContainerProps as MuiContainerProps } from '@mui/material/Container';
import React from 'react';

export type GridProps = MuiGridProps;
export type ContainerProps = MuiContainerProps;

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (props, ref) => {
    return <MuiGrid ref={ref} {...props} />;
  }
);

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    return <MuiContainer ref={ref} {...props} />;
  }
);

Grid.displayName = 'Grid';
Container.displayName = 'Container';
