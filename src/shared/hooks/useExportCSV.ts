import { useCallback } from 'react';
import { useToast } from './useToast';

export interface ExportCSVColumn {
  header: string;
  key: string;
  format?: (value: any) => any;
}

export interface ExportCSVOptions {
  columns: ExportCSVColumn[];
  filename: string;
}

/**
 * Generic hook for exporting data to CSV
 * Supports custom column mapping and formatting
 */
export const useExportCSV = () => {
  const toast = useToast();

  const exportToCSV = useCallback(
    <T extends Record<string, any>>(data: T[], options: ExportCSVOptions) => {
      try {
        // Validate data
        if (!data || data.length === 0) {
          toast.error('Tidak ada data untuk di-export.');
          return;
        }

        // Helper function to get nested value
        const getNestedValue = (obj: any, path: string) => {
          return path.split('.').reduce((acc, part) => acc?.[part], obj);
        };

        // Helper function to escape CSV values
        const escapeCSVValue = (value: any): string => {
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // Escape double quotes and wrap in quotes if contains comma, newline, or quotes
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        };

        // Create CSV header
        const headers = options.columns.map(col => escapeCSVValue(col.header)).join(',');

        // Create CSV rows
        const rows = data.map((item) => {
          return options.columns
            .map((col) => {
              const value = getNestedValue(item, col.key);
              const formattedValue = col.format ? col.format(value) : value;
              return escapeCSVValue(formattedValue);
            })
            .join(',');
        });

        // Combine header and rows
        const csvContent = [headers, ...rows].join('\n');

        // Create blob with UTF-8 BOM for proper Excel compatibility
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', options.filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(`Berhasil export ${data.length} data`);
      } catch (error) {
        console.error('Error exporting CSV:', error);
        toast.error('Gagal export data');
      }
    },
    [toast]
  );

  return {
    exportToCSV,
  };
};
