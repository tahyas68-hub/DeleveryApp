import * as XLSX from 'xlsx';

export const exportOrdersToExcel = (orders: any[], title: string = 'الطلبات : قيد الشحن') => {
  // Define custom data structure based on user request
  const excelData = orders.map(o => ({
    'رقم الطلب': o.id,
    'رقم الشحنة': o.trackingNumber || o.id,
    'رقم العميل': o.customerPhone,
    'اسم العميل': o.customerName,
    'اسم متجر': o.merchantName,
    'المبلغ الكلي': o.totalAmount !== undefined ? o.totalAmount : ((o.amount || 0) + (o.deliveryFee || 0))
  }));

  // Create a new workbook and a worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([]);

  // Add the title row
  XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });
  
  // Merge cells for the title
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });
  
  // Add the header and data starting from the second row
  XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: false });

  // Right to left view
  if (!ws['!views']) ws['!views'] = [];
  ws['!views'].push({ rightToLeft: true });

  // Adjust column widths
  ws['!cols'] = [
    { wch: 15 }, // رقم الطلب
    { wch: 20 }, // رقم الشحنة
    { wch: 15 }, // رقم العميل
    { wch: 30 }, // اسم العميل
    { wch: 25 }, // اسم متجر
    { wch: 15 }, // المبلغ الكلي
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');

  // Save the workbook
  XLSX.writeFile(wb, `${title}.xlsx`);
};
