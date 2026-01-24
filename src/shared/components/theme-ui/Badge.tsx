import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
  color?: keyof typeof customTheme.badge.root.color;
  href?: string;
  icon?: React.ReactNode;
  size?: 'xs' | 'sm';
}

const BadgeComponent = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    children,
    className,
    color = "primary",
    href,
    icon,
    size = 'xs',
    ...props
  }, ref) => {
    const theme = customTheme.badge;

    const Component = href ? 'a' : 'span';

    return (
      <Component
        ref={ref as any}
        href={href}
        className={twMerge(
          theme.root.base,
          theme.root.color[color],
          icon ? theme.icon.on : theme.icon.off,
          className
        )}
        {...props}
      >
        {icon && <span className={theme.icon.size[size]}>{icon}</span>}
        {children}
      </Component>
    );
  }
);

BadgeComponent.displayName = 'Badge';

export const Badge = BadgeComponent;
