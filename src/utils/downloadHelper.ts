import * as XLSX from 'xlsx-js-style';

export const handleFileDownload = async (wb: XLSX.WorkBook, fileName: string) => {
  try {
    // Detect Android WebView (AppCreator24, etc.)
    const userAgent = navigator.userAgent;
    const isWebView = /wv|Android.*Version\/[0-9].[0-9]/i.test(userAgent) || /AppCreator24/i.test(userAgent);
    
    if (isWebView) {
      alert("جاري تجهيز وتنزيل الملف... يرجى الانتظار.");
      try {
        const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
        
        const response = await fetch('/api/upload-excel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            base64,
            fileName
          })
        });
        
        const result = await response.json();
        if (result.downloadUrl) {
          // Open the native download link securely from our own backend
          window.location.href = result.downloadUrl;
        } else {
          alert('فشل في استلام رابط التنزيل. الرجاء المحاولة مرة أخرى.');
        }
        return;
      } catch (apiError) {
        console.error('Upload to server failed:', apiError);
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

