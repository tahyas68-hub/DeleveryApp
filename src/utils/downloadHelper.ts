import * as XLSX from 'xlsx-js-style';

export const handleFileDownload = async (wb: XLSX.WorkBook, fileName: string) => {
  try {
    // Detect Android WebView (AppCreator24, etc.)
    const userAgent = navigator.userAgent;
    const isWebView = /wv|Android.*Version\/[0-9].[0-9]/i.test(userAgent) || /AppCreator24/i.test(userAgent);
    
    if (isWebView) {
      const currentUrl = window.location.href;
      prompt(
        "التطبيق الحالي لا يدعم التنزيل المباشر للملفات.\n\nيرجى نسخ الرابط أدناه وفتحه في متصفح خارجي (مثل جوجل كروم) لتتمكن من تصدير الإكسل:",
        currentUrl
      );
      return;
    }

    // Default web approach (Safe for Chrome, Safari, etc.)
    try {
      XLSX.writeFile(wb, fileName);
    } catch (writeErr: any) {
      console.error('XLSX.writeFile failed:', writeErr);
      const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
      const url = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + base64;
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

  } catch (error: any) {
    console.error('Export error:', error);
    alert('حدث خطأ أثناء التصدير: ' + error.message);
  }
};

