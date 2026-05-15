import React, { useState } from 'react';
import { Package, Search, ArrowRightLeft, RefreshCcw, Truck } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';

export default function WarehouseReturns() {
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  
  const drivers = users.filter(u => u.role === 'driver');
  
  // Fetch orders that are returned or partially returned
  const returnedOrders = orders.filter(o => o.status === 'returned' || o.status === 'returned_partial');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});

  const handleReturnToMainWarehouse = (id: string) => {
    // Return to main warehouse logical choice given the list of statuses
    updateOrderStatus(id, 'main_warehouse');
    alert(`تم إرجاع الطلب للمخزن الرئيسي بنجاح`);
  };

  const handleAssignToDriver = (id: string) => {
    const driverId = selectedDrivers[id];
    if (!driverId) {
      alert("الرجاء اختيار مندوب لإعادة التوزيع");
      return;
    }
    const driver = drivers.find(d => d.id === driverId);
    if(driver) {
       updateOrderStatus(id, 'driver_assigned', { driverId: driver.id, driverName: driver.name });
       alert(`تم تحويل الطلب إلى المندوب ${driver.name} لإعادة التوزيع`);
    }
  };

  const filteredOrders = returnedOrders.filter(o => {
    return o.id.includes(searchQuery) || o.merchantName.includes(searchQuery) || (o.customerPhone && o.customerPhone.includes(searchQuery));
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المرتجعات</h1>
          <p className="text-slate-500 mt-1">عرض الطلبات الراجعة وإرجاعها إلى المخزن الرئيسي أو إعادة توزيعها</p>
        </div>
        <div className="flex items-center gap-4 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
           <RefreshCcw className="w-5 h-5 text-red-600" />
           <div>
             <p className="text-xs font-bold text-red-600/80">طلبات راجعة</p>
             <p className="text-lg font-black text-red-700">{returnedOrders.length}</p>
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
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ</th>
                <th className="px-6 py-4 font-bold text-slate-600">تفاصيل العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600 border-r border-slate-200 text-center" colSpan={2}>الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="font-bold">لا توجد طلبات راجعة</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-en font-bold text-[#0F3B73]">
                      <div>{order.id}</div>
                      <div className="text-xs text-slate-400">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.merchantName}</td>
                    <td className="px-6 py-4">
                      <span className="font-en font-bold text-emerald-600">
                        {order.amount?.toLocaleString()} د.ع
                        {(order.id.endsWith('-P') || order.remainingAmount !== undefined) ? (
                            <div className="flex flex-col gap-1 mt-1 font-sans">
                              <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                                المبلغ المتبقي للراجع: {order.remainingAmount !== undefined ? order.remainingAmount.toLocaleString() : order.amount.toLocaleString()} د.ع
                              </span>
                              {order.receivedAmount !== undefined && (
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                  تم استلام: {order.receivedAmount.toLocaleString()} د.ع
                                </span>
                              )}
                            </div>
                        ) : order.status === 'returned_partial' && !order.id.endsWith('-P') && <span className="text-xs text-orange-600 block mt-1 font-sans">راجع جزئي</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{order.customerName}</div>
                      <div className="text-xs text-slate-500 font-en">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{order.province}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[120px]">{order.address}</div>
                    </td>
                    <td className="px-4 py-4 w-48 border-r border-slate-100">
                         <div className="flex flex-col gap-2 w-full">
                           <span className={`px-2 py-1.5 rounded-lg text-center text-xs font-bold border ${
                             order.status === 'returned' 
                               ? 'bg-red-50 text-red-700 border-red-100' 
                               : 'bg-orange-50 text-orange-700 border-orange-100'
                           }`}>
                             {order.status === 'returned' ? 'راجع كلي' : 'راجع جزئي'}
                           </span>
                           <button 
                             onClick={() => handleReturnToMainWarehouse(order.id)}
                             className="bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 px-3 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                           >
                             <ArrowRightLeft className="w-3.5 h-3.5" />
                             إلى المخزن الرئيسي
                           </button>
                         </div>
                    </td>
                    <td className="px-4 py-4 w-60">
                         <div className="flex flex-col gap-2 w-full">
                           <label className="text-xs font-bold text-slate-500">إعادة توزيع على مندوب:</label>
                           <div className="flex items-center gap-1.5">
                             <select 
                               className="flex-1 border border-slate-200 rounded-lg px-2 py-2 focus:border-blue-500 outline-none text-xs font-bold text-slate-900 bg-white"
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
                               className="text-white bg-[#0F3B73] hover:bg-[#0F3B73]/90 px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm flex items-center justify-center shrink-0"
                               title="إرسال للمندوب"
                             >
                               <Truck className="w-4 h-4" />
                             </button>
                           </div>
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
