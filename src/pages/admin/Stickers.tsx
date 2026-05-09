import React, { useState } from 'react';
import { Tag, Search, Printer } from 'lucide-react';

export default function Stickers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">طباعة الستكرات</h1>
          <p className="text-slate-500 font-medium mt-1">توليد وطباعة ستكرات الباركود للطلبات</p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
         <Printer className="w-16 h-16 text-slate-300 mb-4" />
         <h2 className="text-xl font-bold text-slate-700 mb-2">أداة طباعة الستكرات</h2>
         <p className="text-slate-500 mb-6 max-w-sm mx-auto">اختر الطلبات أو أدخل أرقام التتبع لتوليد الستكرات بتنسيق PDF جاهز للطباعة</p>
         <button className="bg-[#0F3B73] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#0F3B73]/90 transition-colors">
            فتح أداة الطباعة
         </button>
      </div>
    </div>
  );
}
