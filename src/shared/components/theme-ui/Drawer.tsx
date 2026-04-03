import React, { useId, useEffect, createContext, useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

interface DrawerContextProps {
  theme: any;
  onClose?: () => void;
  isOpen: boolean;
  id: string;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawerContext must be used within a Drawer component');
  }
  return context;
};

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  backdrop?: boolean;
  children?: React.ReactNode;
  className?: string;
  edge?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  onClose?: () => void;
  open?: boolean;
}

const drawerTheme = {
  root: {
    base: "fixed z-40 overflow-y-auto bg-white dark:bg-darkgray p-0 transition-transform",
    backdrop: "fixed inset-0 z-30 bg-gray-900/50 dark:bg-gray-900/80",
    edge: "bottom-16",
    position: {
      top: {
        on: "left-0 right-0 top-0 w-full transform-none",
        off: "left-0 right-0 top-0 w-full -translate-y-full"
      },
      right: {
        on: "right-0 top-0 h-screen w-80 transform-none",
        off: "right-0 top-0 h-screen w-80 translate-x-full"
      },
      bottom: {
        on: "bottom-0 left-0 right-0 w-full transform-none",
        off: "bottom-0 left-0 right-0 w-full translate-y-full"
      },
      left: {
        on: "left-0 top-0 h-screen w-80 transform-none",
        off: "left-0 top-0 h-screen w-80 -translate-x-full"
      }
    }
  },
  header: {
    inner: {
      closeButton: customTheme.drawer.header.inner.closeButton,
      closeIcon: customTheme.drawer.header.inner.closeIcon,
      titleText: customTheme.drawer.header.inner.titleText
    }
  },
  items: {
    base: ""
  }
};

const DrawerComponent: React.FC<DrawerProps> = ({
  backdrop = true,
  children,
  className,
  edge = false,
  position = "left",
  onClose,
  open: isOpen = false,
  ...props
}) => {
  const id = useId();
  const theme = drawerTheme;

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose, isOpen]);

  return (
    <DrawerContext.Provider value={{ theme, onClose, isOpen, id }}>
      <div
        aria-modal={true}
        aria-describedby={`drawer-dialog-${id}`}
        role="dialog"
        tabIndex={-1}
        className={twMerge(
          theme.root.base,
          theme.root.position[position][isOpen ? "on" : "off"],
          edge && !isOpen && theme.root.edge,
          className
        )}
        {...props}
      >
        {children}
      </div>
      {isOpen && backdrop && (
        <div onClick={() => onClose?.()} className={theme.root.backdrop} />
      )}
    </DrawerContext.Provider>
  );
};

const DrawerItems: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const { theme } = useDrawerContext();
  return (
    <div className={twMerge(theme.items.base, className)} {...props}>
      {children}
    </div>
  );
};

const DrawerHeader: React.FC<{
  children?: React.ReactNode;
  className?: string;
  closeIcon?: React.ReactNode;
  title?: string;
  titleIcon?: React.ReactNode;
}> = ({ children, className, closeIcon, title, titleIcon }) => {
  const { theme, onClose } = useDrawerContext();

  return (
    <div className={twMerge("mb-4 flex items-center justify-between", className)}>
      {title && (
        <h5 className={theme.header.inner.titleText}>
          {titleIcon && <span className="me-2.5">{titleIcon}</span>}
          {title}
        </h5>
      )}
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={theme.header.inner.closeButton}
        >
          {closeIcon || (
            <svg className={theme.header.inner.closeIcon} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

DrawerComponent.displayName = "Drawer";
DrawerItems.displayName = "Drawer.Items";
DrawerHeader.displayName = "Drawer.Header";

export const Drawer = Object.assign(DrawerComponent, {
  Header: DrawerHeader,
  Items: DrawerItems
});
