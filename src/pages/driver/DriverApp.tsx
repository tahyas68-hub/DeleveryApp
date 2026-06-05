import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Phone, MessageCircle, MoreVertical, Navigation, CheckCircle2, AlertTriangle, Clock, Wallet, Package, RefreshCcw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export default function DriverApp() {
  const { orders } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Real orders assigned to this driver
  const myOrders = orders.filter(o => o.driverId === user?.id);

  // Status groupings
  const toDeliverOrders = myOrders.filter(o => o.status === 'driver_assigned' || o.status === 'postponed');
  const completedOrders = myOrders.filter(o => o.status === 'delivered');
  const returnedOrders = myOrders.filter(o => o.status === 'returned' || o.status === 'returned_partial');

  const tasks = toDeliverOrders;

  // Fake state for modal
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleAction = (path: string) => {
    navigate(path, { state: { orderId: selectedTask } });
    setSelectedTask(null);
  };

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
             <p className="text-2xl font-bold font-en">{toDeliverOrders.length}</p>
           </div>
           <div>
             <p className="text-primary-100 text-xs">مكتمل</p>
             <p className="text-2xl font-bold font-en">{completedOrders.length}</p>
           </div>
           <div>
             <p className="text-primary-100 text-xs">مرتجع</p>
             <p className="text-2xl font-bold font-en">{returnedOrders.length}</p>
           </div>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">الوصول السريع</h3>
        <div className="grid grid-cols-4 gap-3">
          <button onClick={() => navigate('/driver/wallet')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">المحفظة</span>
          </button>
          
          <button onClick={() => navigate('/driver/delivery-orders')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">العهد</span>
          </button>
          
          <button onClick={() => navigate('/driver/postponed-returned-orders')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">الرواجع</span>
          </button>

          <button onClick={() => navigate('/driver/commission-report')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">العمولات</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">قائمة الشحنات ({user?.branch || 'الكل'})</h3>
          <button className="text-brand text-xs font-bold uppercase tracking-wider">ترتيب تلقائي</button>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500 font-bold">لا يوجد شحنات للتبليم حالياً</p>
          </div>
        ) : (
          tasks.map((task, i) => (
            <div key={task.id} className="bg-white p-4 rounded-xl border shadow-sm relative overflow-hidden cursor-pointer" onClick={() => setSelectedTask(task.id)}>
               {/* Status Indicator Line */}
               <div className={`absolute top-0 right-0 w-1.5 h-full ${i === 0 ? 'bg-brand' : 'bg-slate-200'}`}></div>
               
               <div className="pl-2 pr-2">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">{task.trackingNumber}</span>
                     <h4 className="font-bold text-slate-800">{task.customerName}</h4>
                   </div>
                   <OrderStatusBadge status={task.status} />
                 </div>
                 
                 <div className="flex items-start gap-2 text-slate-500 text-sm mt-3 font-medium">
                   <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                   <p className="leading-tight">{task.province} - {task.address}</p>
                 </div>
                 
                 {/* Quick Actions */}
                 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                   <button className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center" onClick={(e) => { e.stopPropagation(); window.open(`https://maps.google.com/?q=${task.address}`); }}>
                     <Navigation className="w-3.5 h-3.5 ml-1" /> ابدأ الملاحة
                   </button>
                   <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border-2 border-blue-100" onClick={(e) => { e.stopPropagation(); window.open(`tel:${task.customerPhone}`); }}>
                     <Phone className="w-4 h-4" />
                   </button>
                   <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border-2 border-blue-100" onClick={(e) => { e.stopPropagation(); window.open(`sms:${task.customerPhone}`); }}>
                     <MessageCircle className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Simulated Bottom Sheet for Delivery Action */}
      {selectedTask && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 z-50 transition-opacity" onClick={() => setSelectedTask(null)}></div>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-2xl shadow-2xl z-50 p-6 animate-in slide-in-from-bottom border-t border-slate-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <h3 className="text-lg font-bold text-center mb-6">تحديث حالة الطلب</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => handleAction('/driver/deliver-order')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm">
                 <CheckCircle2 className="w-8 h-8" />
                 <span className="font-bold">تم التسليم</span>
              </button>
              <button onClick={() => handleAction('/driver/partial-delivery')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors shadow-sm">
                 <CheckCircle2 className="w-8 h-8 opacity-50" />
                 <span className="font-bold">تسليم جزئي</span>
              </button>
              <button onClick={() => handleAction('/driver/return-order')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors shadow-sm">
                 <AlertTriangle className="w-8 h-8" />
                 <span className="font-bold">مرتجع</span>
              </button>
              <button onClick={() => handleAction('/driver/postpone-order')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors shadow-sm">
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
