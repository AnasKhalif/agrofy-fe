import React from 'react';
import { twMerge } from 'tailwind-merge';
import customTheme from '../../utils/theme/custom-theme';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({
  children,
  className,
  ...props
}) => {
  const theme = customTheme.breadcrumb.root;

  return (
    <nav className={twMerge(theme.base, className)} {...props}>
      <ol className={theme.list}>{children}</ol>
    </nav>
  );
};

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  icon?: React.ReactNode;
  as?: any;
  to?: string;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  children,
  className,
  href,
  icon,
  as: Component = 'li',
  to,
  ...props
}) => {
  const theme = customTheme.breadcrumb.item;
  const LinkComponent = href || to ? 'a' : 'span';

  return (
    <Component className={twMerge(theme.base, className)} {...props}>
      {icon && <span className={theme.icon}>{icon}</span>}
      <LinkComponent
        href={href || to}
        className={theme.href[href || to ? 'on' : 'off']}
      >
        {children}
      </LinkComponent>
      <svg
        className={theme.chevron}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </Component>
  );
};

BreadcrumbComponent.displayName = "Breadcrumb";
BreadcrumbItem.displayName = "Breadcrumb.Item";

export const Breadcrumb = Object.assign(BreadcrumbComponent, {
  Item: BreadcrumbItem,
});
