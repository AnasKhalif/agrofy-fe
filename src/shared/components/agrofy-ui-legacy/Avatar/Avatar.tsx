import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import React from 'react';

export type AvatarProps = MuiAvatarProps;

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (props, ref) => {
    return <MuiAvatar ref={ref} {...props} />;
  }
);

Avatar.displayName = 'Avatar';
