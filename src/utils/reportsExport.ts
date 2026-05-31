import * as XLSX from 'xlsx-js-style';

export const exportCustomTableToExcel = async (title: string, headers: string[], data: any[][]) => {
  try {
    const dateStr = new Date().toISOString().split('T')[0];
    const fullTitle = `${title}\nالتاريخ: ${dateStr}`;

    const aoaData = [
      [fullTitle, ...headers.slice(1).map(() => '')], // Merged title row
      headers,
      ...data
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoaData);

    const numCols = headers.length;

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }); 

    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ rightToLeft: true });

    ws['!cols'] = headers.map(() => ({ wch: 20 }));

    ws['!rows'] = [
      { hpt: 45 }, // Title
      { hpt: 25 }, // Header
    ];

    const range = XLSX.utils.decode_range(ws['!ref'] || `A1:${XLSX.utils.encode_col(numCols - 1)}1`);
    
    for (let C = 0; C < numCols; C++) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
    }

    for(let R = 0; R <= range.e.r; ++R) {
      for(let C = 0; C < numCols; C++) {
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
        }

        ws[cell_ref].s = cellStyle;
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));

    const safeTitle = title.replace(/[:\\/?*\[\]]/g, '_');
    const fileName = `${safeTitle}.xlsx`;

    const { handleFileDownload } = await import('./downloadHelper');
    await handleFileDownload(wb, fileName);
  } catch (err: any) {
    console.error(err);
    alert('حدث خطأ أثناء تصدير التقرير: ' + err.message);
  }
};
