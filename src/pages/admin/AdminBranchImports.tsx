import React, { useState } from 'react';
import { Building2, Search, ArrowDownToLine } from 'lucide-react';

export default function AdminBranchImports() {
  const [imports] = useState([
    { id: 'IMP-001', branch: 'فرع البصرة', amount: 1500000, date: '2026-05-01', status: 'completed' },
    { id: 'IMP-002', branch: 'فرع أربيل', amount: 2000000, date: '2026-05-02', status: 'pending' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">واردات الفروع</h1>
          <p className="text-slate-500 font-medium mt-1">تتبع المبالغ المحولة والموردة من الفروع إلى الإدارة الرئيسية</p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الحركة</th>
                <th className="px-6 py-4 font-bold text-slate-600">الفرع المُورّد</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاريخ</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {imports.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-en font-bold text-slate-600">{row.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800"><Building2 className="w-4 h-4 inline ml-1 text-slate-400"/> {row.branch}</td>
                  <td className="px-6 py-4 font-en font-bold text-blue-600">{row.amount.toLocaleString()} د.ع</td>
                  <td className="px-6 py-4 font-en text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 text-center">
                    {row.status === 'pending' ? (
                      <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold border border-orange-100">قيد التحويل</span>
                    ) : (
                      <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-bold border border-green-100">تم الاستلام</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.status === 'pending' && (
                       <button className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1 mx-auto">
                         <ArrowDownToLine className="w-4 h-4" /> تأكيد
                       </button>
                    )}
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
