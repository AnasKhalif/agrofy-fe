import { useCallback } from 'react';

export interface PrintColumn<T = any> {
  header: string;
  key: keyof T | string;
  format?: (value: any, item: T) => string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface PrintTableOptions<T = any> {
  title: string;
  columns: PrintColumn<T>[];
  pageSize?: 'A4' | 'A4 landscape' | '75mm auto';
  orientation?: 'portrait' | 'landscape';
}

/**
 * Generic hook for printing table data as PDF
 * Opens new window with formatted HTML table and auto-triggers print
 */
export const usePrintTable = () => {
  const printTable = useCallback(
    <T extends Record<string, any>>(data: T[], options: PrintTableOptions<T>) => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('Failed to open print window. Please check popup settings.');
        return;
      }

      // Generate table rows HTML
      const tableRows = data
        .map(
          (item, index) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
            ${options.columns
              .map((col) => {
                const value = typeof col.key === 'string' && col.key.includes('.')
                  ? col.key.split('.').reduce((obj, key) => obj?.[key], item)
                  : item[col.key as keyof T];
                const formattedValue = col.format ? col.format(value, item) : (value ?? '-');
                const align = col.align || 'left';
                return `<td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: ${align};">${formattedValue}</td>`;
              })
              .join('')}
          </tr>
        `
        )
        .join('');

      // Generate table headers
      const tableHeaders = `
        <tr>
          <th class="center" style="width: 40px;">No</th>
          ${options.columns
            .map((col) => {
              const align = col.align || 'left';
              const width = col.width ? `style="width: ${col.width};"` : '';
              return `<th class="${align}" ${width}>${col.header}</th>`;
            })
            .join('')}
        </tr>
      `;

      const pageSize = options.pageSize || 'A4 landscape';

      const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${options.title} - Agrofy</title>
          <style>
            @page {
              size: ${pageSize};
              margin: 15mm;
            }

            @media print {
              body {
                margin: 0;
                padding: 0;
              }

              .no-print {
                display: none !important;
              }
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Arial', sans-serif;
              font-size: 10pt;
              line-height: 1.4;
              color: #1f2937;
            }

            .container {
              padding: 20px;
            }

            h1 {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 8px;
              color: #111827;
            }

            .print-date {
              font-size: 9pt;
              color: #6b7280;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }

            thead {
              background-color: #f3f4f6;
            }

            th {
              padding: 10px 8px;
              text-align: left;
              font-weight: 600;
              border-bottom: 2px solid #d1d5db;
              color: #374151;
            }

            th.center {
              text-align: center;
            }

            th.right {
              text-align: right;
            }

            tbody tr:hover {
              background-color: #f9fafb;
            }

            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              font-size: 9pt;
              color: #6b7280;
              text-align: center;
            }

            .total-records {
              font-weight: 600;
              margin-bottom: 10px;
              font-size: 11pt;
              color: #111827;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${options.title}</h1>
            <div class="print-date">Dicetak pada: ${new Date().toLocaleString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</div>

            <table>
              <thead>
                ${tableHeaders}
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>

            <div class="total-records">
              Total: ${data.length} data
            </div>

            <div class="footer">
              <div>Agrofy - Sistem Manajemen Klinik</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

      printWindow.document.write(printContent);
      printWindow.document.close();
    },
    []
  );

  return {
    printTable,
  };
};
