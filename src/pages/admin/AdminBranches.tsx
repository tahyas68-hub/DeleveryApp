import React, { useState } from 'react';
import { Building2, Search, Plus } from 'lucide-react';

export default function AdminBranches() {
  const [branches] = useState([
    { id: '1', name: 'فرع بغداد (الرئيسي)', manager: 'أحمد علي', phone: '0770000000', drivers: 25, orders: 1250, status: 'نشط' },
    { id: '2', name: 'فرع البصرة', manager: 'محمد جاسم', phone: '0780000000', drivers: 10, orders: 320, status: 'نشط' },
    { id: '3', name: 'فرع أربيل', manager: 'سيروان كريم', phone: '0750000000', drivers: 15, orders: 480, status: 'نشط' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">إدارة الفروع</h1>
          <p className="text-slate-500 font-medium mt-1">عرض وإدارة فروع الشركة والمخازن التابعة لها</p>
        </div>
        <button className="bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> إضافة فرع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#0F3B73]/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 group-hover:bg-blue-100/50 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0F3B73]/10 text-[#0F3B73] rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800">{branch.name}</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{branch.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">المدير:</span>
                <span className="font-bold text-slate-800">{branch.manager}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">رقم الهاتف:</span>
                <span className="font-en font-bold text-slate-800">{branch.phone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">المندوبين:</span>
                <span className="font-en font-bold text-slate-800">{branch.drivers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">الطلبات الحالية:</span>
                <span className="font-en font-bold text-blue-600">{branch.orders}</span>
              </div>
            </div>

            <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-colors border border-slate-200">
               إدارة الفرع
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
