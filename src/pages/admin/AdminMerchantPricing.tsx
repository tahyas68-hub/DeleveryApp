import React, { useState } from 'react';
import { Tags, Edit2, Save, Store, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useUsers } from '../../context/UserContext';

export default function AdminMerchantPricing() {
  const { merchants, updateMerchant, governorates } = useSettings();
  const { users } = useUsers();
  const merchantUsers = users.filter(u => u.role === 'merchant');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');

  const handleCustomPriceChange = (merchantId: string, merchantName: string, provinceName: string, value: string) => {
    const numValue = Number(value);
    const existing = merchants.find(m => m.id === merchantId);
    
    // Create copy of existing or init new provincePrices
    const currentPrices = existing?.provincePrices ? { ...existing.provincePrices } : {};
    
    if (value === '') {
      // Remove custom price if empty
      delete currentPrices[provinceName];
    } else {
      currentPrices[provinceName] = numValue;
    }

    updateMerchant(merchantId, {
      name: merchantName,
      provincePrices: currentPrices
    });
  };

  const selectedMerchantData = merchants.find(m => m.id === selectedMerchantId);
  const selectedUser = merchantUsers.find(u => u.id === selectedMerchantId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">تسعير التجار</h1>
          <p className="text-slate-500 font-medium mt-1">تخصيص أسعار التوصيل لكل تاجر على حدة حسب المحافظة</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <label className="block text-slate-700 font-bold mb-2">اختر التاجر:</label>
        <select 
          className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          value={selectedMerchantId}
          onChange={(e) => setSelectedMerchantId(e.target.value)}
        >
          <option value="" disabled>-- الرجاء اختيار تاجر --</option>
          {merchantUsers.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {selectedMerchantId && selectedUser && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              تسعيرة التوصيل لـ {selectedUser.name}
            </h2>
          </div>
          <table className="w-full text-right">
             <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                 <th className="px-6 py-4 font-bold text-slate-600">المحافظة</th>
                 <th className="px-6 py-4 font-bold text-slate-600">تسعيرة التاجر الخاصة</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {governorates.map(g => {
                 const currentVal = selectedMerchantData?.provincePrices?.[g.name];
                 
                 return (
                   <tr key={g.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-bold text-slate-800">
                       <MapPin className="w-4 h-4 inline ml-1 text-slate-400" />
                       {g.name}
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <input 
                            type="number" 
                            min="0"
                            placeholder="أدخل تسعيرة التاجر"
                            value={currentVal !== undefined ? currentVal : ''}
                            onChange={(e) => handleCustomPriceChange(selectedUser.id, selectedUser.name, g.name, e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-en font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-left placeholder-slate-300"
                            dir="ltr"
                          />
                          <span className="text-xs font-bold text-slate-500">د.ع</span>
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
