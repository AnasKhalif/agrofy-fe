import React, { ReactNode } from 'react';

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
  /** Custom render function for cell content */
  render: (row: TData, index: number) => ReactNode;
}

/**
 * Action button configuration
 */
export interface AgrofyTableAction<TData = any> {
  /** ID for accessibility */
  id?: string;
  /** Icon to display in button */
  icon: ReactNode;
  /** Click handler */
  onClick: (row: TData) => void;
  /** Button color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'inherit';
  /** Disabled state (static or dynamic) */
  disabled?: boolean | ((row: TData) => boolean);
  /** Tooltip text to display on hover */
  tooltip?: string;
  /** Show confirmation dialog before executing */
  needsConfirmation?: boolean;
  /** Confirmation dialog title */
  confirmationTitle?: string;
  /** Confirmation message (can use row data) */
  confirmationMessage?: (row: TData) => string;
  /** Confirmation button type: 'danger' for red/error, 'primary' for blue/primary */
  confirmationType?: 'danger' | 'primary';
  /** Optional contextual menu items displayed from a More menu (three-dots)
   * Each item may provide a label and an onClick handler which receives the row.
   * If `destructive` is true the item will be styled to indicate danger.
   */
  menuItems?: Array<{
    id?: string;
    label: string;
    onClick: (row: TData) => void;
    destructive?: boolean;
    divider?: boolean;
  }>;
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
  /**
   * Optional: Render a sub-component when a row is expanded
   * The function receives the row data and should return a ReactNode.
   */
  renderSubComponent?: (row: TData) => ReactNode;
  /**
   * Optional: The index of the column where the sub-component will be rendered.
   */
  expandableColumnIndex?: number;
  /**
   * Optional: Function to get custom styles for each row based on row data
   */
  getRowStyle?: (row: TData) => React.CSSProperties;
}
