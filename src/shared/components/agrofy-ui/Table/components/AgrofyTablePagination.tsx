import React from 'react';
import { Button } from '@/shared/components/agrofy-ui/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/agrofy-ui/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AgrofyTablePagination as PaginationMeta } from '../AgrofyTable.types';

interface AgrofyTablePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  rowsPerPageOptions?: number[];
}

export const AgrofyTablePagination: React.FC<AgrofyTablePaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const { total, page, limit, total_pages } = pagination;

  const startEntry = total === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < total_pages) {
      onPageChange(page + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;

    if (total_pages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(total_pages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (page < total_pages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(total_pages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 no-print">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Menampilkan {startEntry} sampai</span>
        <Select
          value={endEntry.toString()}
          onValueChange={(value) => {
            const selectedEnd = Number(value);
            const newLimit = selectedEnd - startEntry + 1;
            onLimitChange(newLimit);
          }}
        >
          <SelectTrigger id='pagination-select-total-row' className="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions
              .map((option) => {
                const calculatedEnd = Math.min(startEntry + option - 1, total);
                return calculatedEnd;
              })
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((endValue) => (
                <SelectItem key={endValue} value={endValue.toString()}>
                  {endValue}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <span> dari {total} entri</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          id='previous-page-button'
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((pageNum, index) => (
          <Button
            key={index}
            variant={page === pageNum ? 'default' : 'ghost'}
            size="sm"
            id={`current-page-button-${index}`}
            onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
            disabled={pageNum === '...'}
            className={`h-8 w-8 p-0 ${
              page === pageNum ? 'rounded-full bg-[#0152EA] hover:bg-[#0141c8]' : ''
            }`}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          id='next-page-button'
          onClick={handleNextPage}
          disabled={page === total_pages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
