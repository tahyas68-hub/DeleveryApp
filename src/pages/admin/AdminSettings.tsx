import React, { useState, useRef } from 'react';
import { Save } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { db } from '../../lib/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export default function AdminSettings() {
  const { 
    defaultDriverCommission, updateDefaultDriverCommission, 
    requireMerchantApproval, updateRequireMerchantApproval,
    companyName, updateCompanyName,
    companyLogo, updateCompanyLogo,
    companyPhone, updateCompanyPhone,
    companyAddress, updateCompanyAddress
  } = useSettings();
  
  const [defaultDriverCommissionLocal, setDefaultDriverCommissionLocal] = useState(defaultDriverCommission);
  const [requireMerchantApprovalLocal, setRequireMerchantApprovalLocal] = useState(requireMerchantApproval);
  const [companyNameLocal, setCompanyNameLocal] = useState(companyName);
  const [companyPhoneLocal, setCompanyPhoneLocal] = useState(companyPhone);
  const [companyAddressLocal, setCompanyAddressLocal] = useState(companyAddress);
  const [companyLogoLocal, setCompanyLogoLocal] = useState(companyLogo);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setDefaultDriverCommissionLocal(defaultDriverCommission);
  }, [defaultDriverCommission]);

  React.useEffect(() => {
    setRequireMerchantApprovalLocal(requireMerchantApproval);
  }, [requireMerchantApproval]);

  React.useEffect(() => {
    setCompanyNameLocal(companyName);
  }, [companyName]);

  React.useEffect(() => {
    setCompanyPhoneLocal(companyPhone);
  }, [companyPhone]);

  React.useEffect(() => {
    setCompanyAddressLocal(companyAddress);
  }, [companyAddress]);

  React.useEffect(() => {
    setCompanyLogoLocal(companyLogo);
  }, [companyLogo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
         alert('حجم الملف كبير جداً. الحد الأقصى هو 2 ميجابايت.');
         return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            if (width > 300 || height > 300) {
              const ratio = Math.min(300 / width, 300 / height);
              width = width * ratio;
              height = height * ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
              setCompanyLogoLocal(compressedDataUrl);
            }
          } catch(err) {
            console.error(err);
            alert('حدث خطأ أثناء معالجة الصورة');
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (defaultDriverCommissionLocal === undefined || isNaN(defaultDriverCommissionLocal)) {
        alert("يرجى إدخال عمولة صحيحة");
        return;
      }
      await updateDefaultDriverCommission(defaultDriverCommissionLocal);
      await updateRequireMerchantApproval(requireMerchantApprovalLocal);
      await updateCompanyName(companyNameLocal || '');
      await updateCompanyPhone(companyPhoneLocal || '');
      await updateCompanyAddress(companyAddressLocal || '');
      await updateCompanyLogo(companyLogoLocal || '');
      alert('تم حفظ الإعدادات بنجاح!');
    } catch(err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleExportDB = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('هل أنت متأكد من استيراد قاعدة البيانات؟ سيتم استبدال البيانات الحالية.')) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        for (const key in data) {
          localStorage.setItem(key, data[key]);
        }
        alert('تم استيراد قاعدة البيانات بنجاح. سيتم إعادة تحميل الصفحة.');
        window.location.reload();
      } catch (error) {
        alert('حدث خطأ أثناء استيراد الملف. تأكد من أن الملف بصيغة JSON صالحة.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearDB = async () => {
    if (window.confirm("هل أنت متأكد من مسح جميع محتويات قاعدة البيانات (الإعدادات ستتم إعادتها للمصنع)؟")) {
      try {
        localStorage.clear();
        await setDoc(doc(db, 'orders', 'all'), { value: [] });
        await setDoc(doc(db, 'logs', 'all'), { value: [] });
        await setDoc(doc(db, 'transactions', 'all'), { value: [] });
        await setDoc(doc(db, 'branches', 'all'), { value: [] });
        const initUsers = [{
          id: 'admin-1',
          name: 'أحمد المسؤول',
          username: 'admin',
          password: '123',
          role: 'admin',
          phone: '0700000000',
          status: 'active'
        }];
        await setDoc(doc(db, 'users', 'all'), { value: initUsers });
        
        await setDoc(doc(db, 'settings', 'driverCommission'), { value: 0 });
        await setDoc(doc(db, 'settings', 'companyName'), { value: '' });
        await setDoc(doc(db, 'settings', 'companyLogo'), { value: '' });
        await setDoc(doc(db, 'settings', 'companyPhone'), { value: '' });
        await setDoc(doc(db, 'settings', 'companyAddress'), { value: '' });
        // Keeping governorates and merchants since deleting them causes fallback to defaults anyway, 
        // but maybe we just delete them to reset to defaults. Deleting them might trigger useFirebaseSync to re-write defaults
        await deleteDoc(doc(db, 'settings', 'governorates'));
        await deleteDoc(doc(db, 'settings', 'merchants'));
        await deleteDoc(doc(db, 'settings', 'requireMerchantApproval'));
        
        alert("تم مسح محتويات قاعدة البيانات وإعادتها للوضع الافتراضي بنجاح! سيتم إعادة تحميل الصفحة للتطبيق.");
        window.location.reload();
        window.location.replace('/');
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء مسح البيانات');
      }
    }
  };

  const handleResetDB = async () => {
    const input = window.prompt('تحذير: سيتم حذف جميع سجلات النظام بشكل نهائي ولن يمكن استعادتها. لتأكيد هذا الإجراء، اكتب "تصفير" أدناه:');
    if (input && input.trim() === 'تصفير') {
      try {
        const usersSnap = await getDoc(doc(db, 'users', 'all'));
        let modifiedUsers = null;
        if (usersSnap.exists()) {
          const parsed = usersSnap.data().value;
          if (Array.isArray(parsed)) {
            modifiedUsers = parsed.filter((u: any) => u.role === 'admin');
          }
        }
        if (!modifiedUsers || modifiedUsers.length === 0) {
           modifiedUsers = [{
            id: 'admin-1',
            name: 'أحمد المسؤول',
            username: 'admin',
            password: '123',
            role: 'admin',
            phone: '0700000000',
            status: 'active'
          }];
        }
        
        const auth = localStorage.getItem('auth_user');
        
        // Clear EVERYTHING in localStorage
        localStorage.clear();
        
        // Restore ONLY essential system configs and the admin user
        if (auth) localStorage.setItem('auth_user', auth);

        await setDoc(doc(db, 'orders', 'all'), { value: [] });
        await setDoc(doc(db, 'logs', 'all'), { value: [] });
        await setDoc(doc(db, 'transactions', 'all'), { value: [] });
        await setDoc(doc(db, 'branches', 'all'), { value: [] });
        await setDoc(doc(db, 'users', 'all'), { value: modifiedUsers });
        
        // Note: We don't touch settings documents so they are preserved
        
        alert('تم تصفير البيانات للتو. الصفحة سيتم تحديثها.');
        window.location.replace('/');
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء التصفير');
      }
    } else {
      if (input !== null) {
        alert('تم إلغاء العملية، الكلمة التي ادخلتها غير مطابقة.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إعدادات النظام</h1>
          <p className="text-slate-500">إدارة إعدادات النظام والتطبيق.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveChanges} className="bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform flex items-center gap-2 whitespace-nowrap">
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">تفاصيل الشركة</h3>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">اسم الشركة</label>
                  <input type="text" value={companyNameLocal} onChange={(e) => setCompanyNameLocal(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عمولة المندوب</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={defaultDriverCommissionLocal} 
                      onChange={(e) => setDefaultDriverCommissionLocal(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold font-en text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-right" 
                    />
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">د.ع</span>
                  </div>
               </div>
               
               <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-3 text-sm">إعدادات الطلبات الواردة</h4>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={requireMerchantApprovalLocal} 
                      onChange={(e) => setRequireMerchantApprovalLocal(e.target.checked)}
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <div>
                      <div className="font-bold text-slate-800">تفعيل موافقة الإدارة على الشحنات الواردة من التاجر</div>
                      <div className="text-xs text-slate-500 mt-1">إذا تم التعطيل، ستذهب الطلبات المضافة من قبل التجار مباشرة إلى "المخزن الرئيسي" دون الحاجة لموافقة الإدارة.</div>
                    </div>
                  </label>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">شعار الشركة</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden">
                    {companyLogoLocal ? (
                       <img src={companyLogoLocal} alt="Logo" className="absolute inset-0 w-full h-full object-contain mb-4" style={{ padding: '0.5rem', opacity: 0.8 }} />
                    ) : null}
                    <div className="space-y-1 text-center relative z-10 w-full bg-white/70 py-2 rounded-lg backdrop-blur-sm">
                      <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-focus focus-within:outline-none">
                          <span>تحميل الشعار</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG حتى 2MB</p>
                    </div>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">رقم هاتف الشركة</label>
                  <input type="text" dir="ltr" value={companyPhoneLocal} onChange={(e) => setCompanyPhoneLocal(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-en text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-right" placeholder="07XXXXXXXXX" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الشركة</label>
                  <input type="text" value={companyAddressLocal} onChange={(e) => setCompanyAddressLocal(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="بغداد، الكرادة" />
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">إدارة البيانات والنظام</h3>
               <div className="space-y-4">
                  <button onClick={handleExportDB} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    تصدير قاعدة البيانات (Backup)
                  </button>
                  
                  <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImportDB} 
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    استيراد قاعدة البيانات (Restore)
                  </button>
               </div>

               <div className="mt-8 pt-6 border-t border-red-100">
                  <h4 className="font-bold text-red-600 mb-2">منطقة الخطر</h4>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">تحذير: سيقوم هذا الإجراء بحذف بيانات معينة، واستعادة النظام.</p>
                  
                  <button onClick={handleResetDB} className="w-full mb-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    تصفير الحسابات والطلبات فقط (الاحتفاظ بالإعدادات)
                  </button>

                  <button onClick={handleClearDB} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    مسح محتويات قاعدة البيانات كاملاً وإعادة التعيين
                  </button>
               </div>
            </div>
          </div>
      </div>
    </div>
  );
}

