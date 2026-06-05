import React, { useState } from 'react';
import { Tags, Bike, Store, MapPin, Percent } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useUsers } from '../../context/UserContext';

export default function AdminDriverPricing() {
  const { driversPricing, updateDriverPricing, governorates, defaultDriverCommission } = useSettings();
  const { users } = useUsers();
  const driverUsers = users.filter(u => u.role === 'driver');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const handleCustomDefaultCommissionChange = (driverId: string, driverName: string, value: string) => {
    const numValue = Number(value);
    const existing = driversPricing.find(d => d.id === driverId);
    
    updateDriverPricing(driverId, {
      name: driverName,
      defaultCommission: value === '' ? defaultDriverCommission : numValue,
      provincePrices: existing?.provincePrices || {}
    });
  };

  const handleCustomProvincePriceChange = (driverId: string, driverName: string, provinceName: string, value: string) => {
    const numValue = Number(value);
    const existing = driversPricing.find(d => d.id === driverId);
    
    const currentPrices = existing?.provincePrices ? { ...existing.provincePrices } : {};
    
    if (value === '') {
      delete currentPrices[provinceName];
    } else {
      currentPrices[provinceName] = numValue;
    }

    updateDriverPricing(driverId, {
      name: driverName,
      defaultCommission: existing?.defaultCommission ?? defaultDriverCommission,
      provincePrices: currentPrices
    });
  };

  const selectedDriverData = driversPricing.find(d => d.id === selectedDriverId);
  const selectedUser = driverUsers.find(u => u.id === selectedDriverId);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F3B73]">تسعيرة المندوبين</h1>
          <p className="text-slate-500 font-bold mt-1">تخصيص عمولة التوصيل لكل مندوب إما بشكل عام أو حسب المحافظة</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <label className="block text-slate-700 font-bold mb-2">اختر المندوب:</label>
        <select 
          className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F3B73] focus:border-transparent cursor-pointer"
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
        >
          <option value="" disabled>-- الرجاء اختيار المندوب --</option>
          {driverUsers.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {selectedDriverId && selectedUser && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-[#0F3B73]" />
              العمولة الافتراضية للمندوب (شاملة كل المحافظات)
            </h2>
            <div className="flex items-center gap-2 max-w-sm">
                <input 
                  type="number" 
                  min="0"
                  placeholder="العمولة الافتراضية للشركة ككل"
                  value={selectedDriverData?.defaultCommission !== undefined ? selectedDriverData.defaultCommission : ''}
                  onChange={(e) => handleCustomDefaultCommissionChange(selectedUser.id, selectedUser.name, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-en font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-[#0F3B73] focus:border-transparent text-left placeholder-slate-300"
                  dir="ltr"
                />
                <span className="font-bold text-slate-500">د.ع</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-bold">اتركها فارغة لاستخدام عمولة التوصيل العالمية للشركة.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#0F3B73]" />
                تسعيرة التوصيل الخاصة بالمندوب {selectedUser.name} حسب المحافظة
              </h2>
            </div>
            <table className="w-full text-right">
              <thead className="bg-[#0F3B73] text-white">
                <tr>
                  <th className="px-6 py-4 font-bold rounded-tr-3xl">المحافظة</th>
                  <th className="px-6 py-4 font-bold rounded-tl-3xl text-center">العمولة المخصصة للمحافظة (د.ع)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {governorates.map(g => {
                  const currentVal = selectedDriverData?.provincePrices?.[g.name];
                  
                  return (
                    <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-lg">
                        <MapPin className="w-5 h-5 inline ml-2 text-slate-400" />
                        {g.name}
                      </td>
                      <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-2 max-w-[200px] mx-auto">
                            <input 
                              type="number" 
                              min="0"
                              placeholder={`الافتراضي: ${selectedDriverData?.defaultCommission ?? defaultDriverCommission}`}
                              value={currentVal !== undefined ? currentVal : ''}
                              onChange={(e) => handleCustomProvincePriceChange(selectedUser.id, selectedUser.name, g.name, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-en text-xl font-black text-[#0F3B73] focus:outline-none focus:ring-2 focus:ring-[#0F3B73] focus:border-transparent text-center placeholder-slate-300"
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
        </div>
      )}
    </div>
  );
}
