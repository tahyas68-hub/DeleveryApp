import React, { useState } from 'react';
import { dummyOrders, getStatusColor, getStatusText } from '../../lib/dummy';
import { MapPin, Phone, MessageCircle, MoreVertical, Navigation, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function DriverApp() {
  const tasks = dummyOrders.filter(o => o.status === 'shipped' || o.status === 'processing');
  
  // Fake state for modal
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-6">
      {/* Header Info */}
      <div className="bg-primary text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h2 className="text-xl font-bold relative z-10">مهام اليوم</h2>
        <div className="flex gap-6 mt-4 relative z-10">
           <div>
             <p className="text-primary-100 text-xs">للتبليم</p>
             <p className="text-2xl font-bold font-en">14</p>
           </div>
           <div>
             <p className="text-primary-100 text-xs">مكتمل</p>
             <p className="text-2xl font-bold font-en">3</p>
           </div>
           <div>
             <p className="text-primary-100 text-xs">مرتجع</p>
             <p className="text-2xl font-bold font-en">1</p>
           </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">قائمة الشحنات (وادي الرمة)</h3>
          <button className="text-brand text-xs font-bold uppercase tracking-wider">ترتيب تلقائي</button>
        </div>

        {tasks.map((task, i) => (
          <div key={task.id} className="bg-white p-4 rounded-xl border shadow-sm relative overflow-hidden cursor-pointer" onClick={() => setSelectedTask(task.id)}>
             {/* Status Indicator Line */}
             <div className={`absolute top-0 right-0 w-1.5 h-full ${i === 0 ? 'bg-brand' : 'bg-slate-200'}`}></div>
             
             <div className="pl-2 pr-1">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">{task.trackingNumber}</span>
                   <h4 className="font-bold text-slate-800">{task.customerName}</h4>
                 </div>
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status as any)}`}>
                   {getStatusText(task.status as any)}
                 </span>
               </div>
               
               <div className="flex items-start gap-2 text-slate-500 text-sm mt-3 font-medium">
                 <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                 <p className="leading-tight">{task.city} - {task.address}</p>
               </div>
               
               {/* Quick Actions */}
               <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                 <button className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center">
                   <Navigation className="w-3.5 h-3.5 ml-1" /> ابدأ الملاحة
                 </button>
                 <button className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 border-2 border-green-100">
                   <Phone className="w-4 h-4" />
                 </button>
                 <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border-2 border-blue-100">
                   <MessageCircle className="w-4 h-4" />
                 </button>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Simulated Bottom Sheet for Delivery Action */}
      {selectedTask && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-50 transition-opacity" onClick={() => setSelectedTask(null)}></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-2xl shadow-2xl z-50 p-6 animate-in slide-in-from-bottom border-t border-slate-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <h3 className="text-lg font-bold text-center mb-6">تحديث حالة الطلب</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm">
                 <CheckCircle2 className="w-8 h-8" />
                 <span className="font-bold">تم التسليم</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors shadow-sm">
                 <CheckCircle2 className="w-8 h-8 opacity-50" />
                 <span className="font-bold">تسليم جزئي</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors shadow-sm">
                 <AlertTriangle className="w-8 h-8" />
                 <span className="font-bold">مرتجع</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors shadow-sm">
                 <Clock className="w-8 h-8" />
                 <span className="font-bold">تأجيل</span>
              </button>
            </div>
            
            <button className="w-full border-2 border-slate-300 text-slate-600 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setSelectedTask(null)}>إلغاء</button>
          </div>
        </>
      )}
    </div>
  );
}
