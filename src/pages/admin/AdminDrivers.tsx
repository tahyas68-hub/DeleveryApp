import React, { useState } from 'react';
import { 
  Bike, 
  Search, 
  Plus, 
  Printer, 
  FileText,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import { useUsers } from '../../context/UserContext';

export default function AdminDrivers() {
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  
  const drivers = users.filter(u => u.role === 'driver');
  const filteredDrivers = drivers.filter(d => 
    d.name.includes(searchTerm) || d.phone?.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#0F3B73]">المندوبين</h1>
          <p className="text-slate-500 font-bold">إدارة أسطول التوصيل والحسابات</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white text-slate-400 border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white text-slate-400 border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all">
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white p-2 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row gap-2">
         <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="بحث عن مندوب..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0F3B73]/10 focus:bg-white rounded-3xl px-12 py-4 font-black transition-all outline-none"
            />
            <Search className="w-6 h-6 text-slate-300 absolute right-5 top-1/2 -translate-y-1/2" />
         </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
             <thead>
               <tr className="bg-slate-50/50 border-b border-slate-100">
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest text-center w-16">م</th>
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest">الاسم</th>
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest">النوع</th>
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest">الهاتف</th>
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest">التغطية</th>
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest text-center">الرصيد</th>
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest text-center">الحالة</th>
                 <th className="px-6 py-6 font-black text-slate-400 text-xs uppercase tracking-widest text-center">إجراءات</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {filteredDrivers.length === 0 ? (
                 <tr>
                    <td colSpan={8} className="px-6 py-20 text-center text-slate-400 font-bold">لا يوجد مندوبين مطابقين للبحث</td>
                 </tr>
               ) : (
                 filteredDrivers.map((driver, index) => (
                   <tr key={driver.id} className="hover:bg-slate-50/80 transition-colors group">
                     <td className="px-6 py-6 font-en font-bold text-slate-400 text-center">{index + 1}</td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-3 text-right">
                           <div className="w-10 h-10 rounded-full bg-[#0F3B73]/5 flex items-center justify-center text-[#0F3B73] font-black border border-[#0F3B73]/10">
                              {driver.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-700 text-lg">{driver.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold">للعرض فقط</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">
                           {driver.vehicleType === 'motorcycle' ? 'دراجة' : 'سيارة'}
                        </span>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-2 font-en font-bold text-slate-600">
                           <MessageCircle className="w-4 h-4 text-blue-500" />
                           {driver.phone || '07731941507'}
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <span className="text-slate-600 font-bold">عام</span>
                     </td>
                     <td className="px-6 py-6 text-center">
                        <span className="font-en font-bold text-blue-600 text-lg">0</span>
                     </td>
                     <td className="px-6 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black ${
                          driver.status === 'active' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {driver.status === 'active' ? 'نشط' : 'غير متصل'}
                        </span>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex items-center justify-center">
                           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                              <MoreVertical className="w-5 h-5" />
                           </button>
                        </div>
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
