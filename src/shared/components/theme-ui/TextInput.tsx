import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  color?: 'gray' | 'info' | 'failure' | 'warning' | 'success';
  helperText?: React.ReactNode;
  addon?: string;
  icon?: React.ReactNode;
  shadow?: boolean;
  sizing?: 'sm' | 'md' | 'lg';
}

const TextInputComponent = forwardRef<HTMLInputElement, TextInputProps>(
  ({
    className,
    color: _color = 'gray',
    helperText,
    addon,
    icon,
    shadow,
    sizing = 'md',
    ...props
  }, ref) => {
    const baseClasses = "block w-full rounded-md border text-sm disabled:cursor-not-allowed disabled:opacity-50 bg-transparent border border-ld text-dark focus:border-primary focus:ring-0 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-0";

    const sizeClasses = {
      sm: 'p-2 sm:text-xs',
      md: 'p-2.5 text-sm',
      lg: 'p-4 sm:text-base'
    };

    return (
      <div className="flex flex-col">
        {addon || icon ? (
          <div className="flex">
            {addon && (
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                {addon}
              </span>
            )}
            {icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
              </div>
            )}
            <input
              ref={ref}
              className={twMerge(
                baseClasses,
                sizeClasses[sizing],
                icon && 'pl-10',
                addon && 'rounded-l-none',
                shadow && 'shadow-sm',
                className
              )}
              {...props}
            />
          </div>
        ) : (
          <input
            ref={ref}
            className={twMerge(
              baseClasses,
              sizeClasses[sizing],
              shadow && 'shadow-sm',
              className
            )}
            {...props}
          />
        )}
        {helperText && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

TextInputComponent.displayName = 'TextInput';

export const TextInput = TextInputComponent;
