import React, { useState } from 'react';
import { Percent, Search, Download } from 'lucide-react';

export default function DriverCommission() {
  const [commissions] = useState([
    { driverId: 'DRV-1', name: 'كرار محمد', ordersCount: 45, totalDeliveryBase: 225000, commissionRate: '20%', earned: 45000 },
    { driverId: 'DRV-2', name: 'علي حسن', ordersCount: 30, totalDeliveryBase: 150000, commissionRate: '20%', earned: 30000 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">عمولة المندوب</h1>
          <p className="text-slate-500 font-medium mt-1">إعداد ومتابعة حسابات عمولات المندوبين</p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between bg-slate-50/50">
           <h3 className="font-bold text-slate-700">كشف العمولات (الشهر الحالي)</h3>
           <button className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2">
             <Download className="w-4 h-4" /> تصدير
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">المندوب</th>
                <th className="px-6 py-4 font-bold text-slate-600">عدد الطلبات</th>
                <th className="px-6 py-4 font-bold text-slate-600">إجمالي أجور التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600">نسبة العمولة</th>
                <th className="px-6 py-4 font-bold text-slate-600">العمولة المستحقة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commissions.map((c) => (
                <tr key={c.driverId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                  <td className="px-6 py-4 font-en font-bold text-slate-600">{c.ordersCount}</td>
                  <td className="px-6 py-4 font-en font-bold text-slate-600">{c.totalDeliveryBase.toLocaleString()} د.ع</td>
                  <td className="px-6 py-4 font-en font-bold text-emerald-600">{c.commissionRate}</td>
                  <td className="px-6 py-4 font-en font-black text-blue-600">{c.earned.toLocaleString()} د.ع</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors">
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
