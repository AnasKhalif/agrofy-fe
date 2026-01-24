import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  value?: string;
}

const LabelComponent = forwardRef<HTMLLabelElement, LabelProps>(
  ({
    children,
    className,
    disabled,
    value,
    ...props
  }, ref) => {
    const theme = customTheme.label.root;

    return (
      <label
        ref={ref}
        className={twMerge(
          theme.base,
          disabled && theme.disabled,
          className
        )}
        {...props}
      >
        {value || children}
      </label>
    );
  }
);

LabelComponent.displayName = 'Label';

export const Label = LabelComponent;
