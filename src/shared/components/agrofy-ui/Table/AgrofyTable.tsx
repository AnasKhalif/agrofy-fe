import { useState } from 'react';
import { AgrofyTableLoading } from './components/AgrofyTableLoading';
import { AgrofyTableEmpty } from './components/AgrofyTableEmpty';
import { AgrofyTableActions } from './components/AgrofyTableActions';
import { AgrofyTablePagination } from './components/AgrofyTablePagination';
import type { AgrofyTableProps } from './AgrofyTable.types';
import { cn } from '@/shared/utils/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AgrofyTable<TData = any>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onLimitChange,
  actions,
  actionType = 'button',
  emptyState = { title: 'No data found' },
  loadingText = 'Loading...',
  rowsPerPageOptions = [5, 10, 25, 50],
  getRowKey = (_row, index) => String(index),
  classnames,
  renderSubComponent,
  expandableColumnIndex = 0,
}: AgrofyTableProps<TData>) {
  // Track expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpanded = (rowKey: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey);
      } else {
        newSet.add(rowKey);
      }
      return newSet;
    });
  };
  // Show loading state
  if (loading && data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <AgrofyTableLoading text={loadingText} />
      </div>
    );
  }

  // Determine if actions column should be shown
  const hasActions = Boolean(actions);

  // Determine if footer should be shown
  const hasFooter = columns.some((col) => col.footer);

  const getCellAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <>
      <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {renderSubComponent && <th className="w-12"></th>}
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-gray-200 border-r-0 ${getCellAlignment(
                      column.align,
                    )} ${column.headerClassName}`}
                  >
                    {column.header}
                  </th>
                ))}
                {hasActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {actionType === 'button' ? '' : 'Action'}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (hasActions ? 1 : 0) + (renderSubComponent ? 1 : 0)} className="h-64">
                    <AgrofyTableEmpty {...emptyState} />
                  </td>
                </tr>
              ) : (
                data.map((row, index) => {
                  const rowKey = getRowKey(row, index);
                  const rowActions = actions ? actions(row) : [];
                  const isExpanded = expandedRows.has(rowKey);
                  const hasExpandable = Boolean(renderSubComponent);

                  const renderCollapsedRow = () => {
                    if (!renderSubComponent || !isExpanded) {
                      return null;
                    }

                    if (expandableColumnIndex !== undefined && expandableColumnIndex >= 0) {
                      const cells = [];
                      const totalColumns = columns.length + (hasActions ? 1 : 0);

                      for (let i = 0; i < totalColumns; i++) {
                        if (i === expandableColumnIndex) {
                          cells.push(
                            <td key={`collapse-cell-${i}`} className="p-0">
                              <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                {renderSubComponent(row)}
                              </div>
                            </td>
                          );
                        } else {
                          cells.push(<td key={`empty-cell-${i}`} className="p-0" />);
                        }
                      }
                      // account for the expand button cell
                      cells.unshift(<td key="empty-expand-cell" className="p-0" />);

                      return (
                        <tr key={`${rowKey}-expanded`} className="border-0">
                          {cells}
                        </tr>
                      );
                    }

                    // Default behavior: span all columns
                    return (
                      <tr key={`${rowKey}-expanded`} className="border-0">
                        <td className="p-0" colSpan={columns.length + (hasActions ? 1 : 0) + 1}>
                          <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            {renderSubComponent(row)}
                          </div>
                        </td>
                      </tr>
                    );
                  };

                  return (
                    <>
                      <tr
                        key={rowKey}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => hasExpandable && toggleRowExpanded(rowKey)}
                      >
                        {renderSubComponent && (
                          <td className="px-3 py-4 w-12 text-center">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        )}
                        {columns.map((column) => (
                          <td
                            key={column.id}
                            className={`px-6 py-4 whitespace-nowrap border-gray-200 border-r-0 ${getCellAlignment(column.align)}`}
                          >
                            {column.render(row, index)}
                          </td>
                        ))}
                        {hasActions && (
                          <td className="px-6 py-4 whitespace-nowrap no-print">
                            <AgrofyTableActions row={row} actions={rowActions} actionType={actionType} />
                          </td>
                        )}
                      </tr>
                      {renderCollapsedRow()}
                    </>
                  );
                })
              )}
            </tbody>
            
            {/* FOOTER SECTION */}
            <tfoot>
              {hasFooter && (
                <tr className={cn("border-t border-gray-200", classnames?.footer)}>
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`px-6 py-3 font-bold text-white ${getCellAlignment(
                        column.align,
                      )}`}
                    >
                      {column.footer || ''}
                    </td>
                  ))}

                  {hasActions && <td className="px-6 py-3 text-sm font-medium text-gray-700"></td>}
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination - Outside table wrapper */}
      {pagination && onPageChange && onLimitChange && (
        <AgrofyTablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </>
  );
}