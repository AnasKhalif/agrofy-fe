import { useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PrintableInvoice, PrintableBranch } from '@/shared/components/PrintableInvoice';

export interface InvoiceItem {
  id?: string | number;
  name?: string;
  code?: string;
  description?: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface InvoicePatient {
  first_name?: string;
  last_name?: string;
  name?: string;
  phone_number?: string;
}

export interface InvoicePaymentMethod {
  name?: string;
  service_name?: string;
}

export interface InvoiceData {
  invoice_code: string;
  paid_at?: string;
  patient?: InvoicePatient;
  payment_method?: InvoicePaymentMethod;
  items: InvoiceItem[];
  amount?: number;
  subTotal?: number;
  discount_name?: string;
  discount?: number;
  total: number;
  status?: string;
  branchData?: PrintableBranch | null;
}

/**
 * Global hook for printing invoices with consistent styling
 * Uses React component-based approach with ReactDOMServer
 */
export const usePrintInvoice = () => {
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const printInvoice = useCallback((data: InvoiceData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window. Please check popup settings.');
      return;
    }

    // Render the React component to static HTML
    const invoiceHTML = renderToStaticMarkup(
      <PrintableInvoice
        invoice_code={data.invoice_code}
        paid_at={data.paid_at}
        patient={data.patient}
        payment_method={data.payment_method}
        items={data.items}
        subTotal={data.subTotal}
        discount_name={data.discount_name}
        discount={data.discount}
        total={data.total}
        status={data.status}
        branchData={data.branchData}
      />
    );

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk Pembayaran - ${data.invoice_code}</title>
          <style>
            @page {
              size: 75mm auto;
              margin: 0;
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
              width: 75mm;
              font-size: 8pt;
              line-height: 1.2;
            }
          </style>
        </head>
        <body>
          ${invoiceHTML}
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
  }, []);

  return {
    printInvoice,
    formatCurrency,
    formatDate,
  };
};
