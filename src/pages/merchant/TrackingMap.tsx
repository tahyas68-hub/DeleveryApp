import React, { useState } from 'react';
import { Search, MapPin, Truck, RefreshCcw, Navigation2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUsers } from '../../context/UserContext';
import { useOrders } from '../../context/OrderContext';

export default function TrackingMap() {
  const { users } = useUsers();
  const { orders } = useOrders();
  const [activeDriver, setActiveDriver] = useState<string | null>(null);

  const activeDrivers = users.filter(d => d.role === 'driver' && d.status !== 'offline');

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-4 lg:-m-8">
      {/* Top Action Bar */}
      <div className="flex justify-start p-4 bg-slate-50 border-b border-slate-200">
        <Link to="/merchant" className="bg-[#0F3B73] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-md shadow-[#0F3B73]/20 w-fit">
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>

      {/* Header Panel */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">التتبع المباشر للأسطول</h1>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            تحديث تلقائي (Every 5s)
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="ابحث عن رقم تتبع أو اسم مندوب..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>
          <button className="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Area */}
        <div className="flex-1 bg-slate-100 relative h-full">
          {/* FAKE MAP PATTERN */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0F3B73 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '100px 100px', backgroundPosition: '0 0, 50px 50px' }}></div>
          
          {/* HUB MARKER */}
          <div className="absolute top-1/2 left-1/2 -mt-4 -ml-4 z-10 flex flex-col items-center group">
             <div className="w-8 h-8 bg-primary rounded shadow-lg shadow-primary/30 flex items-center justify-center transform rotate-45 border-2 border-white">
               <div className="w-3 h-3 bg-white transform -rotate-45"></div>
             </div>
             <div className="bg-white px-2 py-1 rounded text-xs font-bold shadow-md uppercase tracking-wider mt-1 border border-slate-200 absolute top-full hidden group-hover:block whitespace-nowrap">
               المستودع الرئيسي
             </div>
          </div>

          {/* DRIVER MARKERS */}
          {activeDrivers.map((driver, index) => {
            // Fake positions around center
            const top = 50 + (index === 0 ? -15 : index === 1 ? 20 : -5) + '%';
            const left = 50 + (index === 0 ? -25 : index === 1 ? 15 : 30) + '%';
            const isActive = activeDriver === driver.id;

            return (
              <div 
                key={driver.id}
                className={`absolute z-20 flex flex-col items-center cursor-pointer transition-transform duration-500 ${isActive ? 'scale-125 z-30' : 'hover:scale-110'}`}
                style={{ top, left }}
                onClick={() => setActiveDriver(driver.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative ${isActive ? 'bg-brand shadow-brand/40 animate-bounce' : 'bg-[#0F3B73]'}`}>
                  <Truck className="w-5 h-5 text-white" />
                  {driver.status === 'busy' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                  )}
                </div>
                {isActive && (
                   <div className="bg-white px-3 py-2 rounded-lg text-sm font-bold shadow-xl border border-slate-200 absolute bottom-full mb-2 whitespace-nowrap flex flex-col items-center">
                     <span className="text-slate-800">{driver.name}</span>
                     <span className="text-[10px] text-slate-500 font-en">{driver.vehicleType}</span>
                     <div className="absolute -bottom-2 left-1/2 -ml-2 border-4 border-transparent border-t-white"></div>
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Sidebar */}
        <div className={`bg-white border-r border-slate-200 shadow-xl overflow-y-auto transition-all duration-300 ${activeDriver ? 'w-80' : 'w-0 border-r-0'}`}>
          {activeDriver && (() => {
            const driver = activeDrivers.find(d => d.id === activeDriver)!;
            const driverOrders = orders.filter(o => o.driverId === driver.id);

            return (
              <div className="p-4 w-80">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{driver.name}</h3>
                    <p className="text-sm text-slate-500">{driver.phone}</p>
                  </div>
                  <button onClick={() => setActiveDriver(null)} className="text-slate-400 hover:text-slate-600">×</button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">حمولة المركبة</p>
                    <p className="font-bold text-slate-800 font-en">{driver.currentLoad || 0} / {driver.maxLoad || 50}</p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-brand h-full" style={{ width: `${((driver.currentLoad || 0)/(driver.maxLoad || 50))*100}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">التقييم</p>
                    <div className="flex items-center gap-1 font-bold text-slate-800 font-en">
                      <span className="text-amber-400 text-lg leading-none pt-1">★</span> {driver.rating || 5.0}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2">سجل شحنات الرحلة التابعة لك</h4>
                  
                  {driverOrders.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-slate-100">لا توجد شحنات لك مع هذا المندوب في الرحلة الحالية.</p>
                  ) : (
                    driverOrders.map(order => (
                      <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-en text-[10px] font-bold text-slate-500 tracking-wider block bg-slate-100 px-2 rounded">{order.trackingNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-[#E5F5D0] text-[#10b981]' :
                            order.status === 'driver_assigned' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status === 'delivered' ? 'تم التسليم' :
                             order.status === 'driver_assigned' ? 'قيد التوصيل' : 'معالجة'}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-800">{order.customerName}</h5>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
