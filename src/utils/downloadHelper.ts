import * as XLSX from 'xlsx-js-style';

export const handleFileDownload = async (wb: XLSX.WorkBook, fileName: string) => {
  try {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileOrWebView = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|wv|AppCreator24/i.test(userAgent);

    if (isMobileOrWebView) {
      // Create a visual indicator instead of system alert()
      const loadingToast = document.createElement('div');
      loadingToast.style.position = 'fixed';
      loadingToast.style.bottom = '20px';
      loadingToast.style.left = '50%';
      loadingToast.style.transform = 'translateX(-50%)';
      loadingToast.style.backgroundColor = '#0F3B73';
      loadingToast.style.color = 'white';
      loadingToast.style.padding = '12px 20px';
      loadingToast.style.borderRadius = '24px';
      loadingToast.style.zIndex = '999999';
      loadingToast.style.fontSize = '14px';
      loadingToast.style.fontFamily = 'Arial, sans-serif';
      loadingToast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      loadingToast.innerText = "جاري تحضير ملف الإكسل...";
      document.body.appendChild(loadingToast);

      try {
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // 1. Try file upload to catbox.moe directly
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blob, fileName);

        let downloadUrl = '';
        try {
            const response = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                downloadUrl = await response.text();
            }
        } catch (catboxErr) {
            console.error('Catbox upload failed:', catboxErr);
        }

        // 2. Fallback to tmpfiles.org if catbox failed
        if (!downloadUrl || !downloadUrl.startsWith('http')) {
            const fallbackFormData = new FormData();
            fallbackFormData.append('file', blob, fileName);
            const fallbackRes = await fetch('https://tmpfiles.org/api/v1/upload', {
                method: 'POST',
                body: fallbackFormData
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackData?.data?.url) {
                downloadUrl = fallbackData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            }
        }

        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }

        if (downloadUrl && downloadUrl.startsWith('http')) {
          // Show modal with explicit download link
          const modal = document.createElement('div');
          modal.style.position = 'fixed';
          modal.style.top = '0'; modal.style.left = '0'; modal.style.width = '100%'; modal.style.height = '100%';
          modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
          modal.style.display = 'flex'; modal.style.justifyContent = 'center'; modal.style.alignItems = 'center';
          modal.style.zIndex = '999999';
          modal.style.backdropFilter = 'blur(4px)';
          
          modal.innerHTML = `
            <div style="background: white; padding: 32px 24px; border-radius: 20px; text-align: center; max-width: 85%; width: 320px; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);" dir="rtl">
              <div style="width: 56px; height: 56px; background: #d1fae5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </div>
              <h3 style="margin-top: 0; color: #1e293b; font-size: 1.25rem; font-weight: bold; margin-bottom: 8px;">جاهز للتحميل</h3>
              <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 24px; line-height: 1.5;">تم تجهيز الملف بنجاح. اضغط على الزر أدناه لبدء التنزيل والحفظ في جهازك.</p>
              
              <a href="${downloadUrl}" target="_blank" download="${fileName}" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #10b981; color: white; padding: 14px 20px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 1.05rem; margin-bottom: 12px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                تحميل الإكسل
              </a>
              
              <button id="close-modal-btn" style="width: 100%; background: #f1f5f9; border: none; color: #475569; padding: 12px 20px; border-radius: 12px; font-weight: bold; font-size: 0.95rem; cursor: pointer;">إغلاق والتراجع</button>
            </div>
          `;
          document.body.appendChild(modal);
          
          const closeBtn = document.getElementById('close-modal-btn');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
               document.body.removeChild(modal);
            });
          }
        } else {
             alert('فشل في رفع الملف للتنزيل. الرجاء المحاولة مرة أخرى.');
        }
        return;
      } catch (uploadErr) {
        if (document.body.contains(loadingToast)) document.body.removeChild(loadingToast);
        console.error('Upload failed:', uploadErr);
        
        // Final fallback: Share API
        try {
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const file = new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
             await navigator.share({
                 files: [file],
                 title: fileName
             });
             return;
          }
        } catch (shareErr) {
            console.error('Share failed', shareErr);
        }

        alert('حدث خطأ في الاتصال. لا يدعم هذا التطبيق التنزيل المباشر أو الرفع.');
      }
    } else {
      // For desktop, it's safe to use XLSX.writeFile which triggers blob download immediately
      XLSX.writeFile(wb, fileName);
    }
  } catch (error: any) {
    console.error('Export error:', error);
    alert('حدث خطأ أثناء التصدير: ' + error.message);
  }
};

