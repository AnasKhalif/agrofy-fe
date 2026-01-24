import React, { forwardRef, useState, createContext, useContext, type MutableRefObject } from 'react';
import {
  useFloating,
  useMergeRefs,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager
} from '@floating-ui/react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

interface ModalContextProps {
  theme: any;
  onClose?: () => void;
  popup?: boolean;
  setHeaderId?: (id: string | undefined) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a Modal component');
  }
  return context;
};

export interface ModalProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onClose?: () => void;
  position?: 'center' | 'top-center' | 'top-left' | 'top-right' | 'center-left' | 'center-right' | 'bottom-center' | 'bottom-left' | 'bottom-right';
  show?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  popup?: boolean;
  root?: HTMLElement;
  initialFocus?: number | MutableRefObject<HTMLElement | null>;
}

const ModalComponent = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      className,
      dismissible = false,
      onClose,
      popup,
      position = 'center',
      root,
      show = false,
      size = '2xl',
      initialFocus,
      ...props
    },
    theirRef
  ) => {
    const [headerId, setHeaderId] = useState<string | undefined>(undefined);
    const theme = customTheme.modal;

    const { context } = useFloating({
      open: show,
      onOpenChange: () => onClose && onClose(),
    });

    const ref = useMergeRefs([context.refs.setFloating, theirRef]);

    const click = useClick(context);
    const dismiss = useDismiss(context, {
      outsidePressEvent: 'mousedown',
      enabled: dismissible,
    });
    const role = useRole(context);

    const { getFloatingProps } = useInteractions([click, dismiss, role]);

    if (!show) {
      return null;
    }

    const positionClasses = {
      'center': 'items-center justify-center',
      'top-center': 'items-start justify-center pt-16',
      'top-left': 'items-start justify-start pt-16 pl-16',
      'top-right': 'items-start justify-end pt-16 pr-16',
      'center-left': 'items-center justify-start pl-16',
      'center-right': 'items-center justify-end pr-16',
      'bottom-center': 'items-end justify-center pb-16',
      'bottom-left': 'items-end justify-start pb-16 pl-16',
      'bottom-right': 'items-end justify-end pb-16 pr-16',
    };

    const sizeClasses = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
    };

    return (
      <ModalContext.Provider value={{ theme, popup, onClose, setHeaderId }}>
        <FloatingPortal root={root}>
          <FloatingOverlay
            lockScroll
            data-testid="modal-overlay"
            className={twMerge(
              theme.base,
              'flex',
              positionClasses[position],
              show ? 'opacity-100' : 'opacity-0',
              className
            )}
            {...props}
          >
            <FloatingFocusManager context={context} initialFocus={initialFocus}>
              <div
                ref={ref}
                {...getFloatingProps(props)}
                aria-labelledby={headerId}
                className={twMerge(theme.content.base, sizeClasses[size])}
              >
                <div className={theme.content.inner}>{children}</div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      </ModalContext.Provider>
    );
  }
);

const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const { theme, onClose } = useModalContext();

  return (
    <div className={twMerge(theme.header.base, className)} {...props}>
      <h3 className={theme.header.title}>{children}</h3>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={theme.header.close.base}
        >
          <svg className={theme.header.close.icon} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const { theme } = useModalContext();
  return (
    <div className={twMerge(theme.body.base, className)} {...props}>
      {children}
    </div>
  );
};

const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const { theme } = useModalContext();
  return (
    <div className={twMerge(theme.footer.base, className)} {...props}>
      {children}
    </div>
  );
};

ModalComponent.displayName = "Modal";
ModalHeader.displayName = "Modal.Header";
ModalBody.displayName = "Modal.Body";
ModalFooter.displayName = "Modal.Footer";

export const Modal = Object.assign(ModalComponent, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter
});
