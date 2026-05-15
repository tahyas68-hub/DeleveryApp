import React, { useState } from 'react';
import { Save, Plus, MapPin, Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'delivery' | 'app'>('delivery');
  const { governorates, bulkUpdateGovernorates, defaultDriverCommission, updateDefaultDriverCommission } = useSettings();
  
  const [localGovs, setLocalGovs] = useState([...governorates]);
  const [defaultDriverCommissionLocal, setDefaultDriverCommissionLocal] = useState(defaultDriverCommission);

  // Sync if context updates externally (e.g. initial load)
  React.useEffect(() => {
    setLocalGovs(governorates);
  }, [governorates]);

  React.useEffect(() => {
    setDefaultDriverCommissionLocal(defaultDriverCommission);
  }, [defaultDriverCommission]);

  const handleUpdateLocal = (id: number, data: any) => {
    setLocalGovs(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  };

  const handleSaveChanges = () => {
    bulkUpdateGovernorates(localGovs);
    updateDefaultDriverCommission(defaultDriverCommissionLocal);
    alert('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إعدادات النظام والتسعير</h1>
          <p className="text-slate-500">إدارة تسعيرة التوصيل، أوقات الذروة، والمحافظات.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveChanges} className="bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform flex items-center gap-2 whitespace-nowrap">
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button 
            className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'delivery' ? 'text-primary border-b-2 border-primary bg-primary-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('delivery')}
          >
            تسعيرة التوصيل (المحافظات)
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'app' ? 'text-primary border-b-2 border-primary bg-primary-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('app')}
          >
            إعدادات التطبيق
          </button>
        </div>

        {activeTab === 'delivery' && (
          <div>
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <input type="text" placeholder="البحث عن منطقة أو محافظة..." className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
                <button className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors">
                  <Plus className="w-4 h-4" /> إضافة تسعيرة محافظة
                </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">المحافظة</th>
                    <th className="px-6 py-4">تسعيرة التوصيل</th>
                    <th className="px-6 py-4">عمولة المندوب</th>
                    <th className="px-6 py-4">زيادة وقت الذروة (%)</th>
                    <th className="px-6 py-4">أوقات الذروة</th>
                    <th className="px-6 py-4">حالة التوصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localGovs.map((gov) => (
                    <tr key={gov.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <MapPin className="w-4 h-4 text-primary" /> {gov.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-24">
                          <input 
                            type="number" 
                            value={gov.base} 
                            onChange={(e) => handleUpdateLocal(gov.id, { base: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-md px-2 py-1 pr-8 font-en focus:outline-none focus:ring-1 focus:ring-blue-500" 
                          />
                          <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-bold">د.ع</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-24">
                          <input 
                            type="number" 
                            value={gov.commission} 
                            onChange={(e) => handleUpdateLocal(gov.id, { commission: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-md px-2 py-1 pr-8 font-en focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                          />
                          <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-bold">د.ع</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-20">
                          <input 
                            type="number" 
                            value={gov.peak} 
                            onChange={(e) => handleUpdateLocal(gov.id, { peak: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-md px-2 py-1 pr-6 font-en focus:outline-none focus:ring-1 focus:ring-primary" 
                          />
                          <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-bold">%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-en text-slate-600 text-xs font-bold">{gov.hours}</td>
                      <td className="px-6 py-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={gov.active} 
                            onChange={(e) => handleUpdateLocal(gov.id, { active: e.target.checked })}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 font-medium">
              * يمكن تحديد أسعار خاصة لكل تاجر من خلال <Link to="/admin/merchant-pricing" className="text-primary hover:underline font-bold">تسعيرة التجار</Link>. الأسعار أعلاه هي الأسعار الافتراضية.
            </div>
          </div>
        )}

        {activeTab === 'app' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">تفاصيل الشركة</h3>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">اسم الشركة</label>
                  <input type="text" defaultValue="شركة الراصد للتوصيل السريع" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عمولة المندوب (الافتراضية)</label>
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
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">شعار الشركة</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-focus focus-within:outline-none">
                          <span>تحميل الشعار</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG حتى 2MB</p>
                    </div>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">رقم هاتف الشركة</label>
                  <input type="text" dir="ltr" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-en text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-right" placeholder="07XXXXXXXXX" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الشركة</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="بغداد، الكرادة" />
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">إدارة البيانات والنظام</h3>
               <div className="space-y-4">
                  <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    تصدير قاعدة البيانات (Backup)
                  </button>
                  
                  <button className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    استيراد قاعدة البيانات (Restore)
                  </button>
               </div>

               <div className="mt-8 pt-6 border-t border-red-100">
                  <h4 className="font-bold text-red-600 mb-2">منطقة الخطر</h4>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">تحذير: سيقوم هذا الإجراء بحذف جميع بيانات النظام الحالية واستعادتها لحالة المصنع.</p>
                  <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    تصفير بيانات النظام
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
