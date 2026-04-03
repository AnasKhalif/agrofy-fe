import React from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  fluid?: boolean;
  menuOpen?: boolean;
  rounded?: boolean;
}

const NavbarComponent: React.FC<NavbarProps> = ({
  children,
  className,
  fluid = false,
  rounded,
  ...props
}) => {
  return (
    <nav
      className={twMerge(
        'bg-white border-gray-200 dark:bg-gray-900',
        !fluid && 'container mx-auto',
        rounded && 'rounded-lg',
        className
      )}
      {...props}
    >
      <div className={twMerge('flex flex-wrap items-center justify-between', fluid ? 'w-full' : 'mx-auto')}>
        {children}
      </div>
    </nav>
  );
};

const NavbarBrand: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  className,
  href,
  ...props
}) => {
  return (
    <a href={href} className={twMerge('flex items-center', className)} {...props}>
      {children}
    </a>
  );
};

const NavbarToggle: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        'inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

const NavbarCollapse: React.FC<React.HTMLAttributes<HTMLDivElement> & { className?: string }> = ({
  children,
  className,
  ...props
}) => {
  const theme = customTheme.navbar.collapse;
  return (
    <div className={twMerge(theme.base, className)} {...props}>
      <ul className={theme.list}>{children}</ul>
    </div>
  );
};

const NavbarLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  disabled?: boolean;
  as?: any;
  to?: string;
}> = ({
  children,
  className,
  active,
  disabled,
  as: Component = 'a',
  ...props
}) => {
  const theme = customTheme.navbar.link;
  return (
    <Component
      className={twMerge(
        theme.base,
        active ? theme.active.on : theme.active.off,
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

NavbarComponent.displayName = "Navbar";
NavbarBrand.displayName = "Navbar.Brand";
NavbarToggle.displayName = "Navbar.Toggle";
NavbarCollapse.displayName = "Navbar.Collapse";
NavbarLink.displayName = "Navbar.Link";

export const Navbar = Object.assign(NavbarComponent, {
  Brand: NavbarBrand,
  Toggle: NavbarToggle,
  Collapse: NavbarCollapse,
  Link: NavbarLink,
});
