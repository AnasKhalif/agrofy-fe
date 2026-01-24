import React, { forwardRef, createElement } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spinner } from './Spinner';
import customTheme from '../../utils/theme/custom-theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  color?: keyof typeof customTheme.button.color;
  disabled?: boolean;
  fullSized?: boolean;
  isProcessing?: boolean;
  processingLabel?: string;
  processingSpinner?: React.ReactNode;
  gradientDuoTone?: string;
  gradientMonochrome?: string;
  label?: string;
  outline?: boolean;
  pill?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  as?: any;
  to?: string;
  href?: string;
}

const ButtonComponent = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({
    children,
    className,
    color = "info",
    disabled,
    fullSized,
    isProcessing = false,
    processingLabel = "Loading...",
    processingSpinner,
    gradientDuoTone,
    gradientMonochrome,
    label,
    outline = false,
    pill = false,
    size = 'md',
    as,
    href,
    type = 'button',
    ...props
  }, ref) => {
    const theme = customTheme.button;

    const Component = as || (href ? 'a' : 'button');

    const baseClasses = twMerge(
      theme.base,
      disabled && theme.disabled,
      !gradientDuoTone && !gradientMonochrome && theme.color[color],
      gradientDuoTone && !gradientMonochrome && (theme as any).gradientDuoTone?.[gradientDuoTone],
      !gradientDuoTone && gradientMonochrome && (theme as any).gradient?.[gradientMonochrome],
      outline && ((theme.outline.color as any)[color] ?? theme.outline.color.default),
      theme.pill[pill ? "on" : "off"],
      fullSized && theme.fullSized,
      className
    );

    const innerClasses = twMerge(
      theme.inner.base,
      theme.outline[outline ? "on" : "off"],
      theme.outline.pill && theme.outline.pill[outline && pill ? "on" : "off"],
      theme.size[size],
      outline && !(theme.outline.color as any)[color] && theme.inner.outline,
      isProcessing && theme.isProcessing,
      isProcessing && theme.inner.isProcessingPadding && theme.inner.isProcessingPadding[size],
    );

    const content = (
      <span className={innerClasses}>
        {isProcessing && (
          <span className={twMerge(
            theme.spinnerSlot,
            theme.spinnerLeftPosition && theme.spinnerLeftPosition[size]
          )}>
            {processingSpinner || <Spinner size={size} />}
          </span>
        )}
        {typeof children !== "undefined" ? (
          children
        ) : (
          <span data-testid="flowbite-button-label" className={theme.label}>
            {isProcessing ? processingLabel : label}
          </span>
        )}
      </span>
    );

    return createElement(
      Component,
      {
        ref,
        disabled,
        href,
        type: Component === 'button' ? type : undefined,
        className: baseClasses,
        ...props,
      },
      content
    );
  }
);

ButtonComponent.displayName = "Button";

export const Button = ButtonComponent;
