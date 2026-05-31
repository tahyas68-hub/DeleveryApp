import * as XLSX from 'xlsx-js-style';

export const handleFileDownload = async (wb: XLSX.WorkBook, fileName: string) => {
  try {
    // Detect Android WebView (AppCreator24, etc.)
    const userAgent = navigator.userAgent;
    const isWebView = /wv|Android.*Version\/[0-9].[0-9]/i.test(userAgent) || /AppCreator24/i.test(userAgent);
    
    if (isWebView) {
      alert("جاري تجهيز الملف السحابي (لتجاوز قيود التطبيق)... يرجى الانتظار.");
      try {
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const formData = new FormData();
        formData.append('file', blob, fileName);
        
        const response = await fetch('https://file.io/?expires=1d', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        if (result.success && result.link) {
          // Open the file.io page in the app, which safely provides an HTTPS download link.
          window.location.href = result.link;
        } else {
            alert('تعذر توفير رابط سحابي. يرجى فتح النظام عبر متصفح جوجل كروم لتتمكن من تحميل الإكسل.');
        }
        return;
      } catch (apiError) {
        console.error('File.io upload failed:', apiError);
        alert('حدث خطأ في الاتصال بالخادم. فضلاً افتح النظام في متصفح جوجل كروم.');
        return;
      }
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

