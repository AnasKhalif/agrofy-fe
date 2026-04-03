import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  sizing?: 'sm' | 'md' | 'lg';
}

const RangeSliderComponent = forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ className, sizing = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <input
        ref={ref}
        type="range"
        className={twMerge(
          'w-full bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700',
          sizeClasses[sizing],
          className
        )}
        {...props}
      />
    );
  }
);

RangeSliderComponent.displayName = 'RangeSlider';

export const RangeSlider = RangeSliderComponent;
