import React, { useState } from 'react';
import { DollarSign, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function AdminFinance() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">الحسابات المالية</h1>
          <p className="text-slate-500 font-medium mt-1">نظرة عامة على الإيرادات والمصروفات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
           <p className="text-slate-500 font-bold mb-2">إجمالي الإيرادات</p>
           <h3 className="text-3xl font-black font-en text-emerald-600">4,500,000 د.ع</h3>
           <div className="absolute top-6 left-6 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
             <ArrowDownRight className="w-6 h-6" />
           </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
           <p className="text-slate-500 font-bold mb-2">إجمالي المصروفات</p>
           <h3 className="text-3xl font-black font-en text-red-600">1,250,000 د.ع</h3>
           <div className="absolute top-6 left-6 w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
             <ArrowUpRight className="w-6 h-6" />
           </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
           <p className="text-slate-500 font-bold mb-2">صافي الربح</p>
           <h3 className="text-3xl font-black font-en text-blue-600">3,250,000 د.ع</h3>
           <div className="absolute top-6 left-6 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
             <Wallet className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center justify-center min-h-[300px]">
         <p className="text-slate-400 font-bold">رسم بياني للحسابات المالية قريباً...</p>
      </div>
    </div>
  );
}
