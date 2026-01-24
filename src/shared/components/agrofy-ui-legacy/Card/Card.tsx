import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import MuiCardActions, { CardActionsProps as MuiCardActionsProps } from '@mui/material/CardActions';
import MuiCardContent, { CardContentProps as MuiCardContentProps } from '@mui/material/CardContent';
import MuiCardHeader, { CardHeaderProps as MuiCardHeaderProps } from '@mui/material/CardHeader';
import MuiCardMedia, { CardMediaProps as MuiCardMediaProps } from '@mui/material/CardMedia';
import React from 'react';

export type CardProps = MuiCardProps;
export type CardContentProps = MuiCardContentProps;
export type CardActionsProps = MuiCardActionsProps;
export type CardHeaderProps = MuiCardHeaderProps;
export type CardMediaProps = MuiCardMediaProps;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    return <MuiCard ref={ref} {...props} />;
  }
);

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (props, ref) => {
    return <MuiCardContent ref={ref} {...props} />;
  }
);

export const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  (props, ref) => {
    return <MuiCardActions ref={ref} {...props} />;
  }
);

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    return <MuiCardHeader ref={ref} {...props} />;
  }
);

export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  (props, ref) => {
    return <MuiCardMedia ref={ref} {...props} />;
  }
);

Card.displayName = 'Card';
CardContent.displayName = 'CardContent';
CardActions.displayName = 'CardActions';
CardHeader.displayName = 'CardHeader';
CardMedia.displayName = 'CardMedia';
