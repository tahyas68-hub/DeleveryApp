import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import Barcode from 'react-barcode';
import QRCode from 'react-qr-code';

export default function PrintSticker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { users } = useUsers();
  const order = orders.find(o => o.id === id || o.trackingNumber === id);
  const printedRef = useRef(false);

  // Find merchant to display their phone number
  const merchant = users.find(u => u.name === order?.merchantName || u.id === order?.merchantId);

  useEffect(() => {
    if (order && !printedRef.current) {
      printedRef.current = true;
      setTimeout(() => {
        window.print();
      }, 500);
      
      const handleAfterPrint = () => {
        window.close(); // Close if opened in a new window
      };
      window.addEventListener('afterprint', handleAfterPrint);
      return () => window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, [order]);

  if (!order) {
    return <div className="p-8 text-center" dir="rtl">الطلب غير موجود</div>;
  }

  // Common sticker dimensions for shipping labels: 10cm x 15cm (4x6 inches)
  return (
    <div 
      className="bg-white min-h-screen print:min-h-0 flex items-center justify-center print:block print:p-0 p-8 font-sans"
      dir="rtl"
    >
      {/* 
        Print container
        100mm (width) x 150mm (height) is ~ 378px x 567px depending on DPI.
        We'll use standard units so when printed on generic 4x6 labels it scales correctly.
       */}
      <div 
        className="print:w-full print:h-full relative w-full max-w-[10cm] sm:max-w-none sm:w-[10cm] h-[15cm] overflow-hidden" 
        style={{
          border: '2px solid black', 
          borderRadius: '16px',
          boxSizing: 'border-box',
          padding: '4px',
          margin: '0 auto',
          pageBreakInside: 'avoid'
        }}
      >
        <div 
          style={{ width: '100%', height: '100%', border: '1px solid black', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', borderBottom: '2px solid black', backgroundColor: 'transparent' }}>
            <div style={{ flex: '1', padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>شركة الراصد للتوصيل السريع</h1>
              <p style={{ fontSize: '14px', fontWeight: '700', margin: 0, marginTop: '4px' }}>للتوصيل السريع</p>
            </div>
            
            <div style={{ width: '35%', borderRight: '2px solid black', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>بيانات الشحنة</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                <span>رقم:</span> <span>{order.trackingNumber}</span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>تاريخ:</span> <span style={{ direction: 'ltr' }}>{order.date}</span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Rows */}
            {[
              { label: 'محافظة:', value: order.province },
              { label: 'منطقة:', value: order.address }, // mapping address to Area
              { label: 'نقطة دالة:', value: order.address }, // We might need a separate field for Landmark, using address for now
              { label: 'رقم الهاتف:', value: order.customerPhone, dir: 'ltr' },
              { label: 'عدد القطع:', value: order.pieces },
            ].map((row, idx) => (
              <div key={idx} style={{ display: 'flex', borderBottom: '1px solid black', padding: '6px 16px', alignItems: 'center' }}>
                <div style={{ width: '100px', fontWeight: 'bold', fontSize: '16px' }}>{row.label}</div>
                <div style={{ flex: 1, fontWeight: 'bold', fontSize: '16px', textAlign: 'right', direction: row.dir as any || 'rtl' }}>
                  {row.value}
                </div>
              </div>
            ))}

            {/* Price section - Black background */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: 'black', 
              color: 'white', 
              padding: '12px 16px',
              borderBottom: '1px solid black',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1, fontWeight: '900', fontSize: '20px' }}>
                {parseFloat(order.price).toLocaleString()} د.ع
              </div>
              <div style={{ fontWeight: '900', fontSize: '18px' }}>
                :المبلغ المطلوب
              </div>
            </div>

            {/* Notes */}
            <div style={{ display: 'flex', padding: '8px 16px', borderBottom: '1px solid black' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', width: '70px' }}>ملاحظات:</div>
              <div style={{ flex: 1, fontSize: '14px', fontWeight: 'bold' }}>{order.notes || 'يفتح يعلم المندوب'}</div>
            </div>
            
            {/* Store Name and Phone */}
            <div style={{ padding: '8px 16px', borderBottom: '2px solid black', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', width: '90px' }}>اسم المتجر:</div>
                <div style={{ flex: 1, fontSize: '16px', fontWeight: 'bold' }}>{order.merchantName}</div>
              </div>
              {merchant?.phone && (
                <div style={{ display: 'flex' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', width: '90px' }}>هاتف المتجر:</div>
                  <div style={{ flex: 1, fontSize: '16px', fontWeight: 'bold', direction: 'ltr', textAlign: 'right' }}>{merchant.phone}</div>
                </div>
              )}
            </div>

            {/* Footer with barcodes */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px' }}>
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QRCode value={order.trackingNumber} size={70} level="M" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transform: 'scale(1.1)' }}>
                 <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' }}>{order.id.replace(/\D/g, '').substring(0, 5) || order.id}</div>
                 <Barcode 
                   value={order.id} 
                   width={1.6} 
                   height={45} 
                   displayValue={false} 
                   margin={0} 
                 />
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Global Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: 100mm 150mm;
              margin: 0;
            }
            body { 
              margin: 0;
              padding: 0;
              background-color: white;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
    </div>
  );
}
