import React, { createContext, useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

interface SidebarContextProps {
  theme: any;
  collapsed?: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a Sidebar component');
  }
  return context;
};

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  collapsed?: boolean;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  children,
  className,
  collapsed = false,
  ...props
}) => {
  const theme = customTheme.sidebar.root;

  return (
    <SidebarContext.Provider value={{ theme: customTheme.sidebar, collapsed }}>
      <div className={twMerge(theme.inner, className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const SidebarItems: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

const SidebarItemGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const { theme } = useSidebarContext();
  return (
    <div className={twMerge(theme.itemGroup.base, className)} {...props}>
      {children}
    </div>
  );
};

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  as?: any;
  to?: string;
  href?: string;
  icon?: React.ReactNode;
  label?: string;
  labelColor?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  active,
  children,
  className,
  as: Component = 'div',
  icon,
  label,
  labelColor = 'primary',
  ...props
}) => {
  const { theme } = useSidebarContext();

  return (
    <Component
      className={twMerge(
        theme.item.base,
        active && theme.item.active,
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span className={theme.item.content.base}>{children}</span>
      {label && (
        <span className={`ml-auto inline-flex items-center justify-center px-2 text-sm font-medium text-${labelColor}`}>
          {label}
        </span>
      )}
    </Component>
  );
};

interface SidebarCollapseProps {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  label: string;
  open?: boolean;
}

const SidebarCollapse: React.FC<SidebarCollapseProps> = ({
  children,
  className,
  icon,
  label,
  open: defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const { theme } = useSidebarContext();

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(theme.collapse.button, className)}
      >
        {icon && <span className={theme.collapse.icon.base}>{icon}</span>}
        <span className={theme.collapse.label.base}>{label}</span>
        <svg
          className={twMerge('h-6 w-6 transition-transform', isOpen && 'rotate-180')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && <div className="ml-6 mt-2 space-y-2">{children}</div>}
    </div>
  );
};

SidebarComponent.displayName = "Sidebar";
SidebarItems.displayName = "Sidebar.Items";
SidebarItemGroup.displayName = "Sidebar.ItemGroup";
SidebarItem.displayName = "Sidebar.Item";
SidebarCollapse.displayName = "Sidebar.Collapse";

export const Sidebar = Object.assign(SidebarComponent, {
  Items: SidebarItems,
  ItemGroup: SidebarItemGroup,
  Item: SidebarItem,
  Collapse: SidebarCollapse,
});
