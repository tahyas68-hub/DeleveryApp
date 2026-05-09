import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, XCircle, Calendar, Filter, MapPin, Check, X, Inbox, ChevronRight, ChevronLeft, ArrowLeftRight } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';

export default function WarehouseIncomingOrders() {
  const [activeTab, setActiveTab] = useState('new');
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  
  const drivers = users.filter(u => u.role === 'driver');
  const branchOrders = orders.filter(o => 
    o.status === 'branch_transfering' || o.status === 'branch_warehouse'
  );
  
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleReceive = (id: string) => {
    updateOrderStatus(id, 'branch_warehouse');
    alert("تم استلام الطلب بالفرع");
  };

  const handleAssignDriver = (id: string, driverName: string) => {
    if (!driverName) {
      alert("الرجاء اختيار المندوب");
      return;
    }
    updateOrderStatus(id, 'driver_assigned', { driverName });
    alert(`تم تسليم الطلب إلى المندوب ${driverName}`);
  };

  const filteredOrders = branchOrders.filter(o => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new') return o.status === 'branch_transfering';
    if (activeTab === 'delivering') return o.status === 'branch_warehouse';
    return false;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'branch_transfering': return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold border border-yellow-100">وارد من المخزن الرئيسي</span>;
      case 'branch_warehouse': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">في الفرع </span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">الوارد من المخزن الرئيسي</h1>
          <p className="text-slate-500 font-medium mt-1">متابعة واستلام الشحنات المحولة من المخزن الرئيسي وتوجيه المندوبين.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-slate-100 p-4 sm:px-6 flex flex-col lg:flex-row justify-between items-center gap-4">
           <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto overflow-x-auto hide-scrollbar">
             <button
               onClick={() => setActiveTab('new')}
               className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'new' ? 'bg-white text-[#0F3B73] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
             >
               شحنات واردة للتسلم
             </button>
             <button
               onClick={() => setActiveTab('delivering')}
               className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'delivering' ? 'bg-white text-[#0F3B73] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
             >
               مستلمة (جاهزة للتوزيع)
             </button>
           </div>
        </div>

        <div className="p-0 overflow-x-auto min-h-[300px] relative w-full">
          {isLoading ? (
            <div className="p-6 space-y-4 w-full">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 bg-slate-100/60 animate-pulse rounded-2xl w-full"></div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <Inbox className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد طلبات هنا حالياً</h3>
            </div>
          ) : (
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-5 whitespace-nowrap">رقم الطلب</th>
                  <th className="px-6 py-5 whitespace-nowrap">العميل</th>
                  <th className="px-6 py-5 whitespace-nowrap">العنوان</th>
                  <th className="px-6 py-5 whitespace-nowrap">محافظة التسليم</th>
                  <th className="px-6 py-5 whitespace-nowrap">الحالة</th>
                  <th className="px-6 py-5 text-center whitespace-nowrap">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(order => (
                   <tr key={order.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                     <td className="px-6 py-4 font-en font-bold text-slate-700 whitespace-nowrap">{order.id}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <p className="font-bold text-slate-800">{order.customerName}</p>
                       <p className="text-xs text-slate-500 font-en mt-1">{order.customerPhone}</p>
                     </td>
                     <td className="px-6 py-4">
                       <span className="flex items-center gap-1.5 text-slate-600 w-[200px] sm:w-[300px] truncate">
                         <MapPin className="w-4 h-4 shrink-0 text-slate-400" /> <span className="truncate">{order.address}</span>
                       </span>
                     </td>
                     <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                       {order.province}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       {getStatusBadge(order.status)}
                     </td>
                     <td className="px-6 py-4">
                       {order.status === 'branch_transfering' ? (
                         <div className="flex justify-center">
                           <button 
                             onClick={() => handleReceive(order.id)}
                             className="bg-emerald-50 text-emerald-600 px-4 py-2 hover:bg-emerald-500 hover:text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-sm"
                           >
                              استلام الطلب
                           </button>
                         </div>
                       ) : (
                         <div className="flex justify-center items-center gap-2">
                           <select 
                             onChange={(e) => setSelectedDriver(e.target.value)}
                             defaultValue=""
                             className="border border-slate-200 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none w-40"
                           >
                             <option value="" disabled>اختر مندوباً...</option>
                             {Array.from(new Set(drivers.map(d => d.branch || 'غير محدد'))).map(branch => (
                               <optgroup key={branch} label={branch}>
                                 {drivers.filter(d => (d.branch || 'غير محدد') === branch).map(d => (
                                   <option key={d.id} value={d.name}>{d.name}</option>
                                 ))}
                               </optgroup>
                             ))}
                           </select>
                           <button
                             onClick={() => handleAssignDriver(order.id, selectedDriver)}
                             className="bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-3 py-1.5 rounded-lg font-bold text-xs"
                           >
                             تسليم لمندوب
                           </button>
                         </div>
                       )}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
