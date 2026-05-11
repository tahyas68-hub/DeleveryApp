import React, { useState } from 'react';
import { Truck, Search, Plus, MapPin, Search as SearchIcon, Star } from 'lucide-react';
import { useUsers } from '../../context/UserContext';

export default function AdminDrivers() {
  const { users } = useUsers();
  const drivers = users.filter(u => u.role === 'driver');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المندوبين</h1>
          <p className="text-slate-500">متابعة أسطول التوصيل، التقييم، والحمولة الحالية.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            إضافة مندوب
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <input type="text" placeholder="البحث بالاسم أو رقم الجوال..." className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              <SearchIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <select className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                 <option>جميع الحالات</option>
                 <option>متصل</option>
                 <option>مشغول (توصيل)</option>
                 <option>غير متصل</option>
               </select>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">المندوب</th>
                <th className="px-6 py-4">المركبة</th>
                <th className="px-6 py-4">الحمولة الحالية</th>
                <th className="px-6 py-4">التقييم</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">لا يوجد مندوبين مسجلين</td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold shrink-0">
                         {driver.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold text-slate-800">{driver.name}</p>
                         <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5">
                           <p className="text-xs text-slate-500 font-en">{driver.phone}</p>
                         </div>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                     {driver.vehicleType === 'van' ? 'شاحنة مغلقة (فان)' : driver.vehicleType === 'motorcycle' ? 'دراجة نارية' : 'دينا'}
                   </td>
                   <td className="px-6 py-4">
                     <div className="w-32">
                       <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 font-en">
                         <span>{driver.currentLoad || 0}</span>
                         <span>{driver.maxLoad || 50} MAX</span>
                       </div>
                       <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                         <div className={`h-full ${((driver.currentLoad || 0) / (driver.maxLoad || 50)) > 0.8 ? 'bg-red-500' : 'bg-brand'}`} style={{ width: `${((driver.currentLoad || 0) / (driver.maxLoad || 50)) * 100}%` }}></div>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-1 font-bold text-slate-700">
                       <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                       <span className="font-en pt-1">{driver.rating}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     {driver.status === 'active' && <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider">متصل</span>}
                     {driver.status === 'busy' && <span className="inline-flex items-center px-2 py-1 bg-brand-100 text-brand-700 rounded text-[10px] font-bold uppercase tracking-wider">مشغول</span>}
                     {driver.status === 'offline' && <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">غير متصل</span>}
                   </td>
                   <td className="px-6 py-4 text-left">
                     <button className="text-primary hover:bg-primary-50 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors">
                       التفاصيل
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
