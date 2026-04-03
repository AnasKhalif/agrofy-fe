import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface HRProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
}

const HRComponent = forwardRef<HTMLHRElement, HRProps>(({ className, ...props }, ref) => {
  const theme = customTheme.hr;
  return (
    <hr
      ref={ref}
      className={twMerge(theme.root.base, className)}
      data-testid="flowbite-hr"
      role="separator"
      {...props}
    />
  );
});

interface HRTextProps extends React.HTMLAttributes<HTMLHRElement> {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

const HRText = forwardRef<HTMLHRElement, HRTextProps>(({ children, text, className, ...props }, ref) => {
  const theme = customTheme.hr;
  return (
    <div className={theme.text.base}>
      <hr
        ref={ref}
        className={twMerge(theme.text.hrLine, className)}
        data-testid="flowbite-hr-text"
        role="separator"
        {...props}
      />
      <span className={theme.text.text}>{text || children}</span>
    </div>
  );
});

HRComponent.displayName = 'HR';
HRText.displayName = 'HR.Text';

export const HR = Object.assign(HRComponent, {
  Text: HRText
});
