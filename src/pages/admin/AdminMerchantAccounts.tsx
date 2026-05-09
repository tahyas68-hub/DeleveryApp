import React, { useState } from 'react';
import { Store, Search, CreditCard } from 'lucide-react';
import { useUsers } from '../../context/UserContext';

export default function AdminMerchantAccounts() {
  const { users } = useUsers();
  const merchants = users.filter(u => u.role === 'merchant');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">حسابات التجار</h1>
          <p className="text-slate-500 font-medium mt-1">إدارة أرصدة وتصفية حسابات التجار المشتركين</p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input type="text" placeholder="بحث باسم التاجر..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">الرصيد المتاح للتحويل</th>
                <th className="px-6 py-4 font-bold text-slate-600">تاريخ آخر تصفية</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {merchants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold">لا يوجد تجار مسجلين</td>
                </tr>
              ) : (
                merchants.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800"><Store className="w-4 h-4 inline ml-1 text-slate-400"/> {acc.name}</td>
                    <td className="px-6 py-4 font-en font-black" style={{ color: (acc.balance || 0) >= 0 ? '#10B981' : '#EF4444' }}>
                       {(acc.balance || 0).toLocaleString()} د.ع
                    </td>
                    <td className="px-6 py-4 font-en text-slate-500">{acc.lastClearance || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-white bg-[#0F3B73] hover:bg-[#0F3B73]/90 px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center gap-2 mx-auto">
                        <CreditCard className="w-4 h-4" /> تصفية الحساب
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
