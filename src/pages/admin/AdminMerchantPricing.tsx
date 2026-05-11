import React from 'react';
import { Tags, Edit2, Save } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AdminMerchantPricing() {
  const { merchants, updateMerchant } = useSettings();

  const handleCustomPriceChange = (id: string, value: string) => {
    updateMerchant(id, { customPrice: Number(value) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">تسعير التجار</h1>
          <p className="text-slate-500 font-medium mt-1">تخصيص أسعار التوصيل لكل تاجر على حدة</p>
        </div>
      </div>

       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <table className="w-full text-right">
           <thead className="bg-slate-50 border-b border-slate-200">
             <tr>
               <th className="px-6 py-4 font-bold text-slate-600">اسم التاجر</th>
               <th className="px-6 py-4 font-bold text-slate-600">السعر الافتراضي (بغداد)</th>
               <th className="px-6 py-4 font-bold text-slate-600">السعر المخصص</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {merchants.map(m => (
               <tr key={m.id} className="hover:bg-slate-50">
                 <td className="px-6 py-4 font-bold text-slate-800">{m.name}</td>
                 <td className="px-6 py-4 font-en text-slate-500 line-through">{m.defaultPrice} د.ع</td>
                 <td className="px-6 py-4">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <input 
                        type="number" 
                        value={m.customPrice}
                        onChange={(e) => handleCustomPriceChange(m.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-en font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-left" 
                        dir="ltr"
                      />
                      <span className="text-xs font-bold text-slate-500">د.ع</span>
                    </div>
                 </td>
               </tr>
             ))}
             {merchants.length === 0 && (
               <tr>
                 <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-bold">
                   لا يوجد تجار حالياً لعرض التسعيرة
                 </td>
               </tr>
             )}
           </tbody>
        </table>
      </div>
    </div>
  );
}
