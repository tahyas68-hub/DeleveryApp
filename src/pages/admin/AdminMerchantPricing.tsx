import React from 'react';
import { Tags, Edit2 } from 'lucide-react';

export default function AdminMerchantPricing() {
  const merchants: any[] = [];

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
               <th className="px-6 py-4 font-bold text-slate-600">السعر الافتراضي</th>
               <th className="px-6 py-4 font-bold text-slate-600">السعر المخصص</th>
               <th className="px-6 py-4 font-bold text-slate-600 text-center">تعديل التسعيرة</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {merchants.map(m => (
               <tr key={m.id} className="hover:bg-slate-50">
                 <td className="px-6 py-4 font-bold text-slate-800">{m.name}</td>
                 <td className="px-6 py-4 font-en text-slate-500 line-through">{m.defaultPrice}</td>
                 <td className="px-6 py-4 font-en font-black text-emerald-600">{m.customPrice}</td>
                 <td className="px-6 py-4 text-center">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors inline-block">
                       <Edit2 className="w-4 h-4" />
                    </button>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
