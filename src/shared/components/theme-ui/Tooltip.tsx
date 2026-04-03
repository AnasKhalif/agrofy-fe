import React, { useState, useRef, cloneElement } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  arrow,
  type Placement
} from '@floating-ui/react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  className?: string;
  placement?: Placement;
  style?: 'dark' | 'light' | 'auto';
  trigger?: 'hover' | 'click';
  animation?: string;
  arrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className,
  placement = 'top',
  style = 'dark',
  trigger = 'hover',
  animation = 'duration-300',
  arrow: showArrow = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const theme = customTheme.tooltip;

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(5),
      flip(),
      shift({ padding: 8 }),
      showArrow ? arrow({ element: arrowRef }) : undefined,
    ].filter(Boolean),
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { enabled: trigger === 'hover' });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const styleClasses = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900 border border-gray-200',
    auto: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700',
  };

  const arrowPlacement = {
    top: 'bottom-[-4px]',
    right: 'left-[-4px]',
    bottom: 'top-[-4px]',
    left: 'right-[-4px]',
  };

  const getArrowPlacement = () => {
    const [side] = (context.placement || placement).split('-');
    return arrowPlacement[side as keyof typeof arrowPlacement] || arrowPlacement.top;
  };

  return (
    <>
      {cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          data-testid="flowbite-tooltip"
          className={twMerge(
            theme.base,
            animation && `transition-opacity ${animation}`,
            styleClasses[style],
            className
          )}
        >
          {content}
          {showArrow && (
            <div
              ref={arrowRef}
              data-testid="flowbite-tooltip-arrow"
              className={twMerge(
                'absolute w-2 h-2 rotate-45',
                style === 'dark' && 'bg-gray-900',
                style === 'light' && 'bg-white border border-gray-200',
                style === 'auto' && 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
                getArrowPlacement()
              )}
              style={{
                left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
                top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
              }}
            />
          )}
        </div>
      )}
    </>
  );
};
