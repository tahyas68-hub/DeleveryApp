import React from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

export default function DriverMap() {
  const { orders } = useOrders();
  const { user } = useAuth();
  
  const myOrders = orders.filter(o => o.driverId === user?.id && o.status === 'driver_assigned');
  const currentTask = myOrders[0] || {
    address: 'لم يتم تحديد وجهة',
    province: 'غير معروف',
    customerName: 'لا يوجد'
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-100">
      {/* Search/Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 flex gap-4 items-center">
            <div className="w-10 h-10 bg-brand-50 text-brand rounded-xl flex items-center justify-center shrink-0">
               <Navigation className="w-5 h-5 fill-brand/20" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">الوجهة الحالية</p>
               <p className="font-bold text-slate-800 leading-tight">{currentTask.address}, {currentTask.province}</p>
            </div>
         </div>
      </div>

      {/* Fake Map Background */}
      <div className="flex-1 w-full bg-[#E5E3DF] relative">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
         
         {/* Fake Route Canvas */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
           <path d="M 150,400 Q 200,300 250,350 T 300,200" fill="none" stroke="#0F3B73" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 10" className="animate-[dash_1s_linear_infinite]" />
         </svg>
         
         {/* Current Position Marker */}
         <div className="absolute top-[400px] left-[150px] -mt-5 -ml-5 z-20">
           <div className="w-10 h-10 bg-brand rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce">
              <div className="w-3 h-3 bg-white rounded-full"></div>
           </div>
           <div className="absolute top-full left-1/2 -ml-16 w-32 text-center mt-2">
             <span className="bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">أنت هنا</span>
           </div>
         </div>

         {/* Destination Marker */}
         <div className="absolute top-[200px] left-[300px] -mt-8 -ml-5 z-10">
           <MapPin className="w-10 h-10 text-blue-500 drop-shadow-xl" fill="white" />
           <div className="absolute top-full left-1/2 -ml-16 w-32 text-center mt-1">
             <span className="bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">العميل: {currentTask.customerName}</span>
           </div>
         </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-white pb-safe pt-4 px-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20">
         <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>
         <div className="flex justify-between items-end mb-6">
           <div>
             <h2 className="text-3xl font-black text-slate-800 font-en">12 <span className="text-lg text-slate-500 font-bold font-sans">دقيقة</span></h2>
             <p className="text-slate-500 font-medium">4.2 كيلومتر • وصول متوقع 04:30 م</p>
           </div>
           <button className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-blue-100 mb-2 hover:bg-blue-100 transition-colors">
             إنهاء
           </button>
         </div>
      </div>
    </div>
  );
}
