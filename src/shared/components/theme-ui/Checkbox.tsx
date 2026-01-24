import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  color?: keyof typeof customTheme.checkbox.root.color;
}

const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    color = 'default',
    ...props
  }, ref) => {
    const theme = customTheme.checkbox.root;

    return (
      <input
        ref={ref}
        type="checkbox"
        className={twMerge(
          theme.base,
          theme.color[color],
          className
        )}
        {...props}
      />
    );
  }
);

CheckboxComponent.displayName = 'Checkbox';

export const Checkbox = CheckboxComponent;
