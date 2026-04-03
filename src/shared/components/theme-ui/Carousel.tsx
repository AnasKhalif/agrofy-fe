import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  indicators?: boolean;
  leftControl?: React.ReactNode;
  rightControl?: React.ReactNode;
  slideInterval?: number;
  slide?: boolean;
  onSlideChange?: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  indicators = true,
  leftControl,
  rightControl,
  slideInterval,
  slide = true,
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = customTheme.carousel;

  useEffect(() => {
    if (slideInterval && slide) {
      const interval = setInterval(() => {
        handleNext();
      }, slideInterval);

      return () => clearInterval(interval);
    }
  }, [currentIndex, slideInterval, slide]);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? children.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === children.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  return (
    <div className={twMerge(theme.root.base, className)}>
      <div className="relative h-full overflow-hidden">
        {React.Children.map(children, (child, index) => (
          <div
            className={twMerge(
              'absolute w-full h-full transition-opacity duration-700',
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Left Control */}
      <button
        type="button"
        className={theme.root.leftControl}
        onClick={handlePrevious}
      >
        {leftControl || (
          <span className={theme.control.base}>
            <svg className={theme.control.icon} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </button>

      {/* Right Control */}
      <button
        type="button"
        className={theme.root.rightControl}
        onClick={handleNext}
      >
        {rightControl || (
          <span className={theme.control.base}>
            <svg className={theme.control.icon} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </button>

      {/* Indicators */}
      {indicators && (
        <div className={theme.indicators.wrapper}>
          {React.Children.map(children, (_, index) => (
            <button
              key={index}
              type="button"
              className={twMerge(
                theme.indicators.base,
                index === currentIndex
                  ? theme.indicators.active.on
                  : theme.indicators.active.off
              )}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
