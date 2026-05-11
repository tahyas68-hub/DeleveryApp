import React, { useState } from 'react';
import { Package, Search, Truck, Check } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useBranches } from '../../context/BranchContext';

export default function WarehouseDispatch() {
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  
  const drivers = users.filter(u => u.role === 'driver');
  
  const branchOrders = orders.filter(o => o.status === 'branch_warehouse');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});

  const handleAssignToDriver = (id: string) => {
    const driverId = selectedDrivers[id];
    if (!driverId) {
      alert("الرجاء اختيار مندوب");
      return;
    }
    const driver = drivers.find(d => d.id === driverId);
    if(driver) {
       updateOrderStatus(id, 'driver_assigned', { driverId: driver.id, driverName: driver.name });
       alert(`تم تحويل الطلب إلى المندوب ${driver.name}`);
    }
  };

  const filteredOrders = branchOrders.filter(o => {
    return o.id.includes(searchQuery) || o.merchantName.includes(searchQuery);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">توزيع المناديب</h1>
          <p className="text-slate-500 mt-1">توزيع الطلبات الموجودة في الفرع على المناديب المتوفرين</p>
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
           <Truck className="w-5 h-5 text-emerald-600" />
           <div>
             <p className="text-xs font-bold text-emerald-600/80">طلبات بانتظار التوزيع</p>
             <p className="text-lg font-black text-emerald-700">{branchOrders.length}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث برقم الطلب او اسم التاجر..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-bold">رقم الطلب</th>
                <th className="px-6 py-4 font-bold">التاجر</th>
                <th className="px-6 py-4 font-bold">محافظة التسليم</th>
                <th className="px-6 py-4 font-bold text-center">إجراءات التوزيع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Truck className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="font-bold">لا توجد طلبات بانتظار التوزيع</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-en font-bold text-slate-800">{order.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.merchantName}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{order.province}</td>
                    <td className="px-6 py-4">
                         <div className="flex items-center gap-2 max-w-[250px] mx-auto">
                           <select 
                             className="border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none w-full text-xs font-bold text-slate-900 bg-white"
                             onChange={(e) => setSelectedDrivers(prev => ({...prev, [order.id]: e.target.value}))}
                             value={selectedDrivers[order.id] || ""}
                           >
                             <option value="" disabled>اختر المندوب...</option>
                             {Array.from(new Set(drivers.map(d => d.branch || 'غير محدد'))).map(branch => (
                               <optgroup key={branch} label={branch}>
                                 {drivers.filter(d => (d.branch || 'غير محدد') === branch).map(d => (
                                   <option key={d.id} value={d.id}>{d.name}</option>
                                 ))}
                               </optgroup>
                             ))}
                           </select>
                           <button 
                             onClick={() => handleAssignToDriver(order.id)}
                             className="text-white bg-[#0F3B73] hover:bg-[#0F3B73]/90 px-3 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center shrink-0"
                             title="توزيع"
                           >
                             <Truck className="w-4 h-4" />
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
