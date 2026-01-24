import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, Collapse } from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { AgrofyTableColumn, AgrofyTableAction } from '../AgrofyTable.types';
import { AgrofyTableActions } from './AgrofyTableActions';

interface AgrofyTableRowProps<TData> {
  row: TData;
  columns: AgrofyTableColumn<TData>[];
  hasActions: boolean;
  rowActions: AgrofyTableAction<TData>[];
  renderSubComponent?: (row: TData) => React.ReactNode;
  totalColumns: number;
  expandableColumnIndex?: number;
  getRowStyle?: (row: TData) => React.CSSProperties;
}

export function AgrofyTableRow<TData>({
  row,
  columns,
  hasActions,
  rowActions,
  renderSubComponent,
  totalColumns,
  expandableColumnIndex,
  getRowStyle,
}: AgrofyTableRowProps<TData>) {
  const [open, setOpen] = useState(false);
  const customStyle = getRowStyle ? getRowStyle(row) : {};

  const renderCollapsedRow = () => {
    if (!renderSubComponent) {
      return null;
    }

    if (expandableColumnIndex !== undefined && expandableColumnIndex >= 0) {
      const cells = [];
      for (let i = 0; i < totalColumns; i++) {
        if (i === expandableColumnIndex) {
          cells.push(
            <TableCell key={`collapse-cell-${i}`} style={{ padding: 0 }}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                {renderSubComponent(row)}
              </Collapse>
            </TableCell>
          );
        } else {
          cells.push(<TableCell key={`empty-cell-${i}`} style={{ padding: 0 }} />);
        }
      }
      // account for the expand button cell
      cells.unshift(<TableCell key="empty-expand-cell" style={{ padding: 0 }} />);
      return (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          {cells}
        </TableRow>
      );
    }

    // Default behavior: span all columns
    return (
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell style={{ padding: 0 }} colSpan={totalColumns + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {renderSubComponent(row)}
          </Collapse>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <React.Fragment>
      <TableRow hover onClick={() => setOpen(!open)} style={customStyle}>
        {renderSubComponent && (
          <TableCell padding="checkbox">
            <IconButton aria-label="expand row" size="small">
              {open ? <IconChevronUp /> : <IconChevronDown />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align || 'left'}>
            {column.render(row, 0)}
          </TableCell>
        ))}
        {hasActions && (
          <TableCell align="center">
            <AgrofyTableActions row={row} actions={rowActions} />
          </TableCell>
        )}
      </TableRow>
      {renderCollapsedRow()}
    </React.Fragment>
  );
}
