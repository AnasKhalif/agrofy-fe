import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from './useToast';

export interface ExportColumn {
  header: string;
  key: string;
  format?: (value: any) => any;
}

export interface ExportExcelOptions {
  columns: ExportColumn[];
  filename: string;
  sheetName?: string;
}

/**
 * Generic hook for exporting data to Excel
 * Supports custom column mapping and formatting
 */
export const useExportExcel = () => {
  const toast = useToast();

  const exportToExcel = useCallback(
    <T extends Record<string, any>>(data: T[], options: ExportExcelOptions) => {
      try {
        // Validate data
        if (!data || data.length === 0) {
          toast.error('Tidak ada data untuk di-export.');
          return;
        }

        // Map data to export format
        const dataToExport = data.map((item) => {
          const row: Record<string, any> = {};
          options.columns.forEach((col) => {
            const value = item[col.key];
            row[col.header] = col.format ? col.format(value) : value;
          });
          return row;
        });

        // Create worksheet and workbook
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Data');
        XLSX.writeFile(wb, options.filename);

        toast.success(`Berhasil export ${data.length} data`);
      } catch (error) {
        console.error('Error exporting excel:', error);
        toast.error('Gagal export data');
      }
    },
    [toast]
  );

  return {
    exportToExcel,
  };
};
