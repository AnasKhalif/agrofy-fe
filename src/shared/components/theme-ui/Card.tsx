import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  horizontal?: boolean;
  href?: string;
  imgAlt?: string;
  imgSrc?: string;
  renderImage?: () => React.ReactNode;
}

const CardComponent = forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    className,
    horizontal,
    href,
    imgAlt,
    imgSrc,
    renderImage,
    ...props
  }, ref) => {
    const theme = customTheme.card.root;

    if (href) {
      return (
        <a
          ref={ref as any}
          href={href}
          className={twMerge(
            theme.base,
            horizontal && 'flex-row',
            className
          )}
        >
        {renderImage && renderImage()}
        {imgSrc && (
          <img
            src={imgSrc}
            alt={imgAlt || ''}
            className={twMerge(
              'rounded-t-lg',
              horizontal && 'h-96 w-full rounded-t-none rounded-l-lg object-cover md:h-auto md:w-48'
            )}
          />
        )}
          <div className={theme.children}>
            {children}
          </div>
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={twMerge(
          theme.base,
          horizontal && 'flex-row',
          className
        )}
        {...props}
      >
        {renderImage && renderImage()}
        {imgSrc && (
          <img
            src={imgSrc}
            alt={imgAlt || ''}
            className={twMerge(
              'rounded-t-lg',
              horizontal && 'h-96 w-full rounded-t-none rounded-l-lg object-cover md:h-auto md:w-48'
            )}
          />
        )}
        <div className={theme.children}>
          {children}
        </div>
      </div>
    );
  }
);

CardComponent.displayName = 'Card';

export const Card = CardComponent;
