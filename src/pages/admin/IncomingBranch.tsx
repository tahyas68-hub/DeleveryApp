import React, { useState } from 'react';
import { History, Search, Building2 } from 'lucide-react';

export default function IncomingBranch() {
  const [orders] = useState([
    { id: 'BR-1001', branch: 'فرع البصرة', qty: 45, date: '2026-05-02', status: 'pending' },
    { id: 'BR-1002', branch: 'فرع أربيل', qty: 120, date: '2026-05-01', status: 'received' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">الوارد من الفروع</h1>
          <p className="text-slate-500 font-medium mt-1">
            الطلبات والشحنات المرتجعة أو المحولة من الفروع الأخرى
          </p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input type="text" placeholder="بحث..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الإرسالية</th>
                <th className="px-6 py-4 font-bold text-slate-600">الفرع المرسل</th>
                <th className="px-6 py-4 font-bold text-slate-600">عدد الطلبات المتضمنة</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاريخ</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-en font-bold">{o.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800"><Building2 className="w-4 h-4 inline ml-1 text-slate-400"/> {o.branch}</td>
                  <td className="px-6 py-4 font-en font-bold text-blue-600">{o.qty}</td>
                  <td className="px-6 py-4 font-en text-slate-500">{o.date}</td>
                  <td className="px-6 py-4 text-center">
                    {o.status === 'pending' ? (
                      <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold border border-orange-100">بالطريق</span>
                    ) : (
                      <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-bold border border-green-100">تم الاستلام بمخزننا</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors">
                      عرض وتدقيق
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
