import { ReactNode } from 'react';

/**
 * Column configuration for AgrofyTable
 */
export interface AgrofyTableColumn<TData = any> {
  /** Unique column identifier */
  id: string;
  /** Column header text */
  header: string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Custom class for header column */
  headerClassName?: string;
  /** Custom render function for cell content */
  render: (row: TData, index: number) => ReactNode;
  /** Custom footer text */
  footer?: string;
}

/**
 * Action button configuration
 */
export interface AgrofyTableAction<TData = any> {
  /** ID for accessibility */
  id?: string;
  /** Icon to display in button */
  icon: ReactNode;
  /** Label text for the action */
  label?: string;
  /** Click handler */
  onClick: (row: TData) => void;
  /** Button color */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'gray';
  /** Disabled state (static or dynamic) */
  disabled?: boolean | ((row: TData) => boolean);
  /** Show confirmation dialog before executing */
  needsConfirmation?: boolean;
  /** Confirmation dialog title */
  confirmationTitle?: string;
  /** Confirmation message (can use row data) */
  confirmationMessage?: (row: TData) => string;
  /** Confirmation button type (danger = red, primary = blue) */
  confirmationType?: 'danger' | 'primary';
  /** Show action as direct button instead of in dropdown menu */
  showAsButton?: boolean;
}

/**
 * Pagination metadata
 */
export interface AgrofyTablePagination {
  /** Total number of items */
  total: number;
  /** Current page (1-based) */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of pages */
  total_pages: number;
}

/**
 * Empty state configuration
 */
export interface AgrofyTableEmptyState {
  /** Icon to display */
  icon?: ReactNode;
  /** Main title */
  title: string;
  /** Optional description */
  description?: string;
}

/**
 * Main AgrofyTable props
 */
export interface AgrofyTableProps<TData = any> {
  /** Column definitions */
  columns: AgrofyTableColumn<TData>[];
  /** Table data */
  data: TData[];
  /** Loading state */
  loading?: boolean;
  /** Pagination metadata */
  pagination?: AgrofyTablePagination;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Rows per page change handler */
  onLimitChange?: (limit: number) => void;
  /** Action buttons per row */
  actions?: (row: TData) => AgrofyTableAction<TData>[];
  /** Empty state configuration */
  emptyState?: AgrofyTableEmptyState;
  /** Loading text */
  loadingText?: string;
  /** Rows per page options */
  rowsPerPageOptions?: number[];
  /** Row key extractor */
  getRowKey?: (row: TData, index: number) => string;
  /** action type */
  actionType?: 'button' | 'dropdown';
  classnames?:{
    header?: string,
    wraooer?: string,
    footer?: string,
  }
  /** Render function for expandable row content */
  renderSubComponent?: (row: TData) => ReactNode;
  /** Column index where expand icon will be placed */
  expandableColumnIndex?: number;
}

