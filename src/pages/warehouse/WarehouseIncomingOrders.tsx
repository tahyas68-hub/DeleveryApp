import React, { useState } from 'react';
import { Package, Search, History, Building2, Truck, Star, ArrowLeftRight, Check, X } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useBranches } from '../../context/BranchContext';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export default function WarehouseIncomingOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  
  const drivers = users.filter(u => u.role === 'driver');
  
  const branchOrders = orders.filter(o => o.status === 'branch_transfering');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleReceiveOrder = (id: string) => {
    updateOrderStatus(id, 'branch_warehouse');
  };

  const handleReceiveSelected = () => {
    selectedIds.forEach(id => updateOrderStatus(id, 'branch_warehouse'));
    setSelectedIds([]);
  };

  const filteredOrders = branchOrders.filter(o => {
    return o.id.includes(searchQuery) || o.merchantName.includes(searchQuery);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الطلبات الواردة</h1>
          <p className="text-slate-500 mt-1">إستلام الطلبات من المخزن الرئيسي وتجهيزها للتوزيع</p>
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
          
          {selectedIds.length > 0 && (
            <button 
              onClick={handleReceiveSelected}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              تأكيد استلام ({selectedIds.length}) طلب
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-[#0F3B73] focus:ring-[#0F3B73]"
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredOrders.map(o => o.id));
                      else setSelectedIds([]);
                    }}
                    checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                  />
                </th>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">تفاصيل العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ الكلي</th>
                <th className="px-6 py-4 font-bold text-slate-600">أجور التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">المخزن المحول منه</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الكمية</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="font-bold">لا توجد طلبات واردة بانتظار الإستلام</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(order.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-[#0F3B73] focus:ring-[#0F3B73]"
                        checked={selectedIds.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds([...selectedIds, order.id]);
                          else setSelectedIds(selectedIds.filter(id => id !== order.id));
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-[#0F3B73]">
                      <div>{order.id}</div>
                      <div className="text-xs text-slate-400">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.merchantName}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{order.customerName}</div>
                      <div className="text-xs text-slate-500 font-en">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{order.province}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[120px]">{order.address}</div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-slate-700 whitespace-nowrap">{order.totalAmount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-amber-600 whitespace-nowrap">{order.deliveryFee?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-emerald-600 whitespace-nowrap">{order.amount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-bold text-slate-600 text-center">المخزن الرئيسي</td>
                    <td className="px-6 py-4 font-en font-bold text-blue-600 text-center">{order.pieces}</td>
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                        <button 
                          onClick={() => handleReceiveOrder(order.id)}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors text-xs whitespace-nowrap"
                        >
                          <Check className="w-4 h-4" /> تأكيد استلام
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
