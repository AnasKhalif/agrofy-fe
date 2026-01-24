import MuiTable, { TableProps as MuiTableProps } from '@mui/material/Table';
import MuiTableBody, { TableBodyProps as MuiTableBodyProps } from '@mui/material/TableBody';
import MuiTableCell, { TableCellProps as MuiTableCellProps } from '@mui/material/TableCell';
import MuiTableContainer, { TableContainerProps as MuiTableContainerProps } from '@mui/material/TableContainer';
import MuiTableHead, { TableHeadProps as MuiTableHeadProps } from '@mui/material/TableHead';
import MuiTableRow, { TableRowProps as MuiTableRowProps } from '@mui/material/TableRow';
import React from 'react';

export type TableProps = MuiTableProps;
export type TableBodyProps = MuiTableBodyProps;
export type TableCellProps = MuiTableCellProps;
export type TableContainerProps = MuiTableContainerProps;
export type TableHeadProps = MuiTableHeadProps;
export type TableRowProps = MuiTableRowProps;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (props, ref) => {
    return <MuiTable ref={ref} {...props} />;
  }
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (props, ref) => {
    return <MuiTableBody ref={ref} {...props} />;
  }
);

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (props, ref) => {
    return <MuiTableCell ref={ref} {...props} />;
  }
);

export const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  (props, ref) => {
    return <MuiTableContainer ref={ref} {...props} />;
  }
);

export const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(
  (props, ref) => {
    return <MuiTableHead ref={ref} {...props} />;
  }
);

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (props, ref) => {
    return <MuiTableRow ref={ref} {...props} />;
  }
);

Table.displayName = 'Table';
TableBody.displayName = 'TableBody';
TableCell.displayName = 'TableCell';
TableContainer.displayName = 'TableContainer';
TableHead.displayName = 'TableHead';
TableRow.displayName = 'TableRow';
