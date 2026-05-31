import * as XLSX from 'xlsx-js-style';

export const handleFileDownload = async (wb: XLSX.WorkBook, fileName: string) => {
  try {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const file = new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // 1. Try Web Share API (Best for Mobile / WebViews if supported)
    if (navigator.share && navigator.canShare) {
      try {
        // Some webviews fail on canShare, so we check first but we also catch errors
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: fileName,
            files: [file]
          });
          return; 
        }
      } catch (e: any) {
        console.error('Share failed:', e);
        if (e.name === 'AbortError') return; // User cancelled
      }
    }

    // 2. Check if we are in an Android WebView wrapper (appcreator24 etc.)
    const isWebView = /wv|Android.*Version\/[0-9].[0-9]/i.test(navigator.userAgent);
    
    if (isWebView) {
      // 3. Fallback for Webview: Upload to file.io and download via external HTTPS link
      // This bypasses the Android DownloadManager's inability to download blob:// URLs
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('https://file.io/?expires=1d', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        if (result.success && result.link) {
          // Navigating to the HTTPS link will trigger Android's native DownloadManager
          window.location.href = result.link;
          return;
        }
      } catch (apiError) {
        console.error('File.io upload failed:', apiError);
      }
    }

    // 4. Default web fallback (Uses Blob URI - will crash Webview but works in standard Chrome/Safari)
    try {
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      console.error('WriteFile failed:', err);
      // Very last resort: Data URI
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
