import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  getCellAlignment: (align?: 'left' | 'center' | 'right') => string;
  actionType?: 'button' | 'dropdown';
  index: number;
}

export function AgrofyTableRow<TData>({
  row,
  columns,
  hasActions,
  rowActions,
  renderSubComponent,
  totalColumns,
  expandableColumnIndex,
  getCellAlignment,
  actionType = 'button',
  index,
}: AgrofyTableRowProps<TData>) {
  const [open, setOpen] = useState(false);

  const renderCollapsedRow = () => {
    if (!renderSubComponent) {
      return null;
    }

    if (expandableColumnIndex !== undefined && expandableColumnIndex >= 0) {
      const cells = [];
      for (let i = 0; i < totalColumns; i++) {
        if (i === expandableColumnIndex) {
          cells.push(
            <td key={`collapse-cell-${i}`} className="p-0">
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
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
        <tr className="border-b border-gray-200">
          {cells}
        </tr>
      );
    }

    // Default behavior: span all columns
    return (
      <tr className="border-b border-gray-200">
        <td colSpan={totalColumns + 1} className="p-0">
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {renderSubComponent(row)}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <tr
        className={`hover:bg-gray-50 ${renderSubComponent ? 'cursor-pointer' : ''}`}
        onClick={() => renderSubComponent && setOpen(!open)}
      >
        {renderSubComponent && (
          <td className="px-4 py-4 whitespace-nowrap border-gray-200 w-12">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="expand row"
            >
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
}
