import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function AdminTreasury() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">الصندوق المالي</h1>
          <p className="text-slate-500 font-medium mt-1">السيولة النقدية المتاحة في صندوق الشركة حالياً</p>
        </div>
      </div>

      <div className="bg-[#0F3B73] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 flex-shrink-0 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <p className="text-blue-200 font-bold mb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5" /> الرصيد الإجمالي في الصندوق
        </p>
        <div className="flex items-end gap-2">
          <h2 className="text-5xl font-black tracking-tight font-en">0</h2>
          <span className="text-xl font-bold text-blue-200 mb-1">د.ع</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         <div className="bg-white rounded-3xl p-6 border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-4">إيداع في الصندوق</h3>
           <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <ArrowDownRight className="w-5 h-5" /> إضافة مبلغ
           </button>
         </div>
         <div className="bg-white rounded-3xl p-6 border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-4">صرف من الصندوق</h3>
           <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <ArrowUpRight className="w-5 h-5" /> تسجيل مصروف
           </button>
         </div>
      </div>
    </div>
  );
}
