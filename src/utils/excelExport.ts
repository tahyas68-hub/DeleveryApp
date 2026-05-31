import * as XLSX from 'xlsx-js-style';

export const exportOrdersToExcel = (orders: any[], title: string = 'جدول بالطلبات قيد التوصيل') => {
  try {
    const getStatusText = (status: string) => {
      switch (status) {
        case 'merchant_pending': return 'قيد التنفيذ';
        case 'driver_assigned': return 'قيد التسليم';
        case 'postponed': return 'مؤجل';
        case 'delivered': return 'تم التسليم';
        case 'delivered_partial': return 'واصل جزئي';
        case 'returned': return 'مرتجع';
        case 'returned_partial': return 'مرتجع جزئي';
        default: return 'قيد التسليم';
      }
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const fullTitle = `${title}\nالتاريخ: ${dateStr}`;

    const headerRow = [
      'التسلسل', 'الحالة', 'التاريخ', 'المتجر / التاجر', 'العنوان', 
      'الاجمالي', 'التوصيل', 'المبلغ', 'نوع الشحنة', 
      'هاتف العميل', 'رقم الطلب', 'رقم الشحنة'
    ];

    const aoaData = [
      [fullTitle, "", "", "", "", "", "", "", "", "", "", ""], // Row 1: Title
      headerRow, // Row 2: Headers
    ];

    orders.forEach((o, index) => {
      const amount = typeof o.amount === 'number' ? o.amount : 0;
      const delivery = typeof o.deliveryFee === 'number' ? o.deliveryFee : 0;
      const total = typeof o.totalAmount === 'number' ? o.totalAmount : (amount + delivery);
      
      const addressStr = o.province ? `${o.province} - ${o.address || ''}`.trim() : (o.address || '');

      const row = [
        index + 1,
        getStatusText(o.status),
        o.date || dateStr,
        o.merchantName || '',
        addressStr,
        total,
        delivery,
        amount,
        o.pieces ? (o.pieces === 1 ? 'قطعة واحدة' : `${o.pieces} قطع`) : 'قطعة واحدة',
        o.customerPhone || '',
        o.id || '',
        o.trackingNumber || o.id || ''
      ];
      aoaData.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoaData);

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } });

    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ rightToLeft: true });

    ws['!cols'] = [
      { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 35 }, 
      { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, 
      { wch: 15 }, { wch: 20 },
    ];

    ws['!rows'] = [
      { hpt: 45 }, { hpt: 25 },
    ];

    const range = XLSX.utils.decode_range(ws['!ref'] || "A1:L1");
    
    for (let C = 0; C <= 11; C++) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
    }

    for(let R = 0; R <= range.e.r; ++R) {
      for(let C = 0; C <= 11; C++) {
        const cell_address = {c:C, r:R};
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if(!ws[cell_ref]) continue;

        let cellStyle: any = {
          font: { name: 'Arial', sz: 12, bold: false, color: { rgb: "000000" } },
          alignment: { vertical: "center", horizontal: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };

        if (R === 0) {
          cellStyle.fill = { fgColor: { rgb: "FFC000" } };
          cellStyle.font.bold = true;
          cellStyle.font.sz = 14;
          cellStyle.alignment.horizontal = "right";
          cellStyle.alignment.wrapText = true;
        } else if (R === 1) {
          cellStyle.fill = { fgColor: { rgb: "9BC2E6" } };
          cellStyle.font.bold = true;
        } else {
          if (R % 2 === 0) {
            cellStyle.fill = { fgColor: { rgb: "FCE4D6" } };
          } else {
            cellStyle.fill = { fgColor: { rgb: "E2EFDA" } };
          }
          if (C === 5 || C === 6 || C === 7) {
              ws[cell_ref].z = '#,##0.00';
          }
        }
        ws[cell_ref].s = cellStyle;
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    const safeTitle = title.replace(/[:\\/?*\[\]]/g, '_');
    XLSX.writeFile(wb, `${safeTitle}.xlsx`);
  } catch (err: any) {
    console.error(err);
    alert('حدث خطأ أثناء التصدير: ' + err.message);
  }
};
