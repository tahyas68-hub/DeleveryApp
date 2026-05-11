import React from 'react';
import { Shield, Activity, User } from 'lucide-react';

export default function AdminOperations() {
  const operations: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">سجل العمليات</h1>
          <p className="text-slate-500 font-medium mt-1">مراقبة وتتبع جميع الحركات والتغييرات الحرجة على النظام</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-right text-sm">
           <thead className="bg-slate-50 border-b border-slate-200">
             <tr>
               <th className="px-6 py-4 font-bold text-slate-600">العملية</th>
               <th className="px-6 py-4 font-bold text-slate-600">المُنفّذ</th>
               <th className="px-6 py-4 font-bold text-slate-600">المرجع</th>
               <th className="px-6 py-4 font-bold text-slate-600">الوقت</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {operations.map(op => (
               <tr key={op.id} className="hover:bg-slate-50">
                 <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                   <Activity className="w-4 h-4 text-orange-500" /> {op.action}
                 </td>
                 <td className="px-6 py-4 text-slate-600">
                   {op.entity} <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded ml-1">{op.role}</span>
                 </td>
                 <td className="px-6 py-4 font-en font-bold text-slate-500">{op.entityId}</td>
                 <td className="px-6 py-4 text-slate-500">{op.time}</td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
