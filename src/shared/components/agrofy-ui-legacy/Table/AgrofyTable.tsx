import React from 'react';
import { Paper } from '../Paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table';
import { TablePagination } from '../TablePagination';
import { AgrofyTableLoading } from './components/AgrofyTableLoading';
import { AgrofyTableEmpty } from './components/AgrofyTableEmpty';
import type { AgrofyTableProps } from './AgrofyTable.types';
import { AgrofyTableRow } from './components/AgrofyTableRow';

export function AgrofyTable<TData = any>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onLimitChange,
  actions,
  emptyState = { title: 'No data found' },
  loadingText = 'Loading...',
  rowsPerPageOptions = [5, 10, 25, 50],
  getRowKey = (_row, index) => String(index),
  renderSubComponent,
  expandableColumnIndex,
  getRowStyle,
}: AgrofyTableProps<TData>) {

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage + 1); // Convert from 0-based to 1-based
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onLimitChange) {
      onLimitChange(parseInt(event.target.value, 10));
    }
  };

  // Show loading state
  if (loading && data.length === 0) {
    return (
      <Paper>
        <AgrofyTableLoading text={loadingText} />
      </Paper>
    );
  }

  // Determine if actions column should be shown
  const hasActions = Boolean(actions);
  const actionsColumnCount = hasActions ? 1 : 0;
  const totalColumns = columns.length + actionsColumnCount;

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {renderSubComponent && <TableCell padding="checkbox" />}
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {column.header}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={totalColumns + (renderSubComponent ? 1 : 0)} align="center">
                  <AgrofyTableEmpty {...emptyState} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowKey = getRowKey(row, index);
                const rowActions = actions ? actions(row) : [];

                return (
                  <AgrofyTableRow
                    key={rowKey}
                    row={row}
                    columns={columns}
                    hasActions={hasActions}
                    rowActions={rowActions}
                    renderSubComponent={renderSubComponent}
                    totalColumns={totalColumns}
                    expandableColumnIndex={expandableColumnIndex}
                    getRowStyle={getRowStyle}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && onPageChange && onLimitChange && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={(pagination.page || 1) - 1} // Convert from 1-based to 0-based
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </Paper>
  );
}