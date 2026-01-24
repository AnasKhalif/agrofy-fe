import React from 'react';

export interface PrintableBranch {
  name?: string;
  full_address?: string;
  phone_number?: string;
  metadata?: Record<string, any>;
}

export interface PrintableInvoiceItem {
  id?: string | number;
  name?: string;
  code?: string;
  description?: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface PrintableInvoicePatient {
  first_name?: string;
  last_name?: string;
  name?: string;
  phone_number?: string;
}

export interface PrintableInvoicePaymentMethod {
  name?: string;
  service_name?: string;
}

export interface PrintableInvoiceProps {
  invoice_code: string;
  paid_at?: string;
  patient?: PrintableInvoicePatient;
  payment_method?: PrintableInvoicePaymentMethod;
  items: PrintableInvoiceItem[];
  amount?: number;
  subTotal?: number;
  discount_name?: string;
  discount?: number;
  total: number;
  status?: string;
  branchData?: PrintableBranch | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  invoice_code,
  paid_at,
  patient,
  payment_method,
  items,
  // subTotal,
  // discount_name = '',
  // discount = 0,
  total,
  status,
  branchData,
}) => {
  const patientName = patient?.name ||
    `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() ||
    '-';

  const paymentMethodName = payment_method?.service_name ||
    payment_method?.name ||
    '-';

  const branch = branchData;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', width: '75mm', padding: '5mm', fontSize: '8pt', lineHeight: '1.2' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3mm', borderBottom: '1px dashed #000', paddingBottom: '2mm' }}>
        <h1 style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '1mm', margin: 0 }}>
          {branch?.name || 'Melinda Aesthetic Skin Clinic'}
        </h1>
        <p style={{ fontSize: '7pt', margin: '0.5mm 0' }}>{branch?.full_address || 'Jln. Darmawangsa No.12'}</p>
        <p style={{ fontSize: '7pt', margin: '0.5mm 0' }}>{branch?.phone_number || '0856738728377 - 0361 22284'}</p>
        <p style={{ fontSize: '7pt', margin: '0.5mm 0' }}>{
          // try to read email from metadata if available
          (branch?.metadata && typeof branch.metadata === 'object' && (branch.metadata as any).email) || 'Melindaskincare@gmail.com'
        }</p>
      </div>

      {/* Info Section */}
      <div style={{ marginBottom: '2mm', fontSize: '7pt' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5mm 0' }}>
          <span style={{ fontWeight: 'bold' }}>Invoice:</span>
          <span>{invoice_code}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5mm 0' }}>
          <span style={{ fontWeight: 'bold' }}>Tanggal:</span>
          <span>{paid_at ? formatDate(paid_at) : '-'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5mm 0' }}>
          <span style={{ fontWeight: 'bold' }}>Customer:</span>
          <span>{patientName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5mm 0' }}>
          <span style={{ fontWeight: 'bold' }}>Telepon:</span>
          <span>{patient?.phone_number || '-'}</span>
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '2mm 0', fontSize: '7pt' }}>
        <thead>
          <tr>
            <th style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '1mm 0', textAlign: 'left', fontWeight: 'bold' }}>
              Item
            </th>
            <th style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '1mm 0', textAlign: 'center', fontWeight: 'bold' }}>
              Qty
            </th>
            <th style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '1mm 0', textAlign: 'right', fontWeight: 'bold' }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item, index) => {
              const itemName = item.name || item.description || '-';
              const itemCode = item.code || '';
              const itemSubtotal = item.subtotal || (item.price * item.quantity);

              return (
                <tr key={item.id || index}>
                  <td style={{ padding: '1mm 0', borderBottom: '1px dotted #ddd' }}>
                    {itemName}
                    {itemCode && (
                      <>
                        <br />
                        <small style={{ fontSize: '6pt' }}>{itemCode}</small>
                      </>
                    )}
                  </td>
                  <td style={{ padding: '1mm 0', borderBottom: '1px dotted #ddd', textAlign: 'center' }}>
                    {item.quantity === 0 ? '' : item.quantity}
                  </td>
                  <td style={{ padding: '1mm 0', borderBottom: '1px dotted #ddd', textAlign: 'right' }}>
                    {formatCurrency(itemSubtotal || 0)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} style={{ padding: '1mm 0', textAlign: 'center' }}>
                Tidak ada item
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Section */}
      <div style={{ marginTop: '2mm', paddingTop: '2mm', borderTop: '1px dashed #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5mm 0', fontSize: '9pt', fontWeight: 'bold', paddingTop: '1mm', borderTop: '1px solid #000' }}>
          <span>TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>
        {/* Discount and final payable are shown as items in the items list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5mm 0', fontSize: '7pt', marginTop: '1mm' }}>
          <span>Metode Pembayaran:</span>
          <span>{paymentMethodName}</span>
        </div>
        {status && (
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5mm 0', fontSize: '7pt' }}>
            <span>Status:</span>
            <span>
              {status === 'completed' ? 'LUNAS' : status === 'pending' ? 'PENDING' : 'GAGAL'}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '3mm', textAlign: 'center', fontSize: '7pt', borderTop: '1px dashed #000', paddingTop: '2mm' }}>
        <p style={{ margin: 0 }}>Terima kasih atas kunjungan Anda</p>
        <p style={{ marginTop: '1mm', fontSize: '6pt', margin: '1mm 0 0 0' }}>
          Struk ini dicetak pada {new Date().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
};
