import MuiTablePagination, { TablePaginationProps as MuiTablePaginationProps } from '@mui/material/TablePagination';
import React from 'react';

export type TablePaginationProps = MuiTablePaginationProps;

export const TablePagination = React.forwardRef<HTMLTableCellElement, TablePaginationProps>(
  (props, ref) => {
    return <MuiTablePagination ref={ref} {...props} />;
  }
);

TablePagination.displayName = 'TablePagination';
