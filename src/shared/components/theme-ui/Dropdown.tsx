import React, { useState, createContext, useContext, cloneElement } from 'react';
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
  type Placement
} from '@floating-ui/react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

interface DropdownContextProps {
  theme: any;
  onClose?: () => void;
}

const DropdownContext = createContext<DropdownContextProps | undefined>(undefined);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a Dropdown component');
  }
  return context;
};

export interface DropdownProps {
  children?: React.ReactNode;
  className?: string;
  dismissOnClick?: boolean;
  inline?: boolean;
  label?: React.ReactNode;
  renderTrigger?: () => React.ReactNode;
  placement?: Placement;
  arrowIcon?: boolean;
  trigger?: 'click' | 'hover';
}

const DropdownComponent: React.FC<DropdownProps> = ({
  children,
  className,
  dismissOnClick = true,
  inline = false,
  label,
  renderTrigger,
  placement,
  arrowIcon = true,
  trigger = 'click',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = customTheme.dropdown;

  // Use inline ? "bottom-start" : "bottom" as default like original Flowbite
  const defaultPlacement = inline ? "bottom-start" : "bottom";

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement || defaultPlacement,
    middleware: [
      offset(5),
      flip(),
      shift({ padding: 8 })
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, { enabled: trigger === 'click' });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleClose = () => {
    if (dismissOnClick) {
      setIsOpen(false);
    }
  };

  const triggerElement = renderTrigger ? (
    cloneElement(renderTrigger() as React.ReactElement, {
      ref: refs.setReference,
      ...getReferenceProps(),
    })
  ) : (
    <button
      type="button"
      ref={refs.setReference}
      {...getReferenceProps()}
      className={inline ? theme.inlineWrapper : 'flex items-center cursor-pointer'}
    >
      {label}
      {arrowIcon && (
        <svg className={theme.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </button>
  );

  return (
    <DropdownContext.Provider value={{ theme, onClose: handleClose }}>
      {triggerElement}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className={twMerge(
                theme.floating.base,
                theme.floating.style.auto,
                className
              )}
            >
              <div className={theme.floating.content}>{children}</div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </DropdownContext.Provider>
  );
};

interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  as?: any;
  to?: string;
  href?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  className,
  icon,
  as: Component = 'div',
  onClick,
  ...props
}) => {
  const { theme, onClose } = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    onClose?.();
  };

  return (
    <Component className={twMerge(theme.floating.item.base, className)} onClick={handleClick} {...props}>
      {icon && <span className={theme.floating.item.icon}>{icon}</span>}
      {children}
    </Component>
  );
};

const DropdownHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const { theme } = useDropdownContext();
  return (
    <div className={twMerge(theme.floating.header, className)} {...props}>
      {children}
    </div>
  );
};

const DropdownDivider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={twMerge('h-px bg-gray-200 dark:bg-gray-600', className)} {...props} />;
};

DropdownComponent.displayName = "Dropdown";
DropdownItem.displayName = "Dropdown.Item";
DropdownHeader.displayName = "Dropdown.Header";
DropdownDivider.displayName = "Dropdown.Divider";

export const Dropdown = Object.assign(DropdownComponent, {
  Item: DropdownItem,
  Header: DropdownHeader,
  Divider: DropdownDivider,
});
