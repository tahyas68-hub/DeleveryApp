import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  ArrowLeft, 
  Truck, 
  Barcode,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function WarehousePullOrders() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  
  const drivers = users.filter(u => u.role === 'driver');
  // Order is currently with a driver
  const pullableOrders = orders.filter(o => o.status === 'driver_assigned');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sourceDriverId, setSourceDriverId] = useState('');

  const handlePullSelected = () => {
    if (selectedIds.length === 0) {
      alert('الرجاء تحديد الطلبات المراد سحبها أولاً');
      return;
    }

    selectedIds.forEach(id => {
      // Revert status to branch_warehouse and clear the driver assignment
      updateOrderStatus(id, 'branch_warehouse', { driverId: undefined, driverName: undefined });
    });
    setSelectedIds([]);
    alert(`تم سحب الطلبات بنجاح وإرجاعها لمخزن الفرع`);
  };

  const filteredOrders = pullableOrders.filter(o => {
    const matchesSearch = (o.trackingNumber || '').includes(searchQuery) || (o.merchantName || '').includes(searchQuery);
    const matchesDriver = sourceDriverId ? o.driverId === sourceDriverId : true;
    return matchesSearch && matchesDriver;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#0F3B73]">
             <Truck className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wider">العمليات اللوجستية للفرع</span>
          </div>
          <h1 className="text-3xl font-black text-[#0F3B73]">سحب الطلبات من المندوب</h1>
        </div>
        
        <button 
          onClick={() => navigate('/warehouse')}
          className="flex items-center gap-2 bg-white text-[#0F3B73] border-2 border-[#0F3B73]/20 px-6 py-2.5 rounded-xl font-black hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة لقائمة العمليات
        </button>
      </div>

      {/* Actions Box */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-6">
        <div className="flex items-center gap-4 flex-1 w-full lg:w-auto">
          <span className="font-black text-slate-700 whitespace-nowrap">تصفية المندوب:</span>
          
          <div className="relative flex-1 lg:max-w-[240px]">
            <select 
              value={sourceDriverId}
              onChange={(e) => setSourceDriverId(e.target.value)}
              className="w-full bg-slate-100 border-2 border-slate-200 text-slate-900 px-10 py-3.5 rounded-2xl font-black appearance-none focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/10 focus:border-[#0F3B73] transition-colors cursor-pointer"
            >
              <option value="" className="font-bold">جميع المناديب...</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id} className="font-bold">{d.name}</option>
              ))}
            </select>
            <Truck className="w-5 h-5 text-slate-400 absolute right-4 top-4 pointer-events-none" />
            <ChevronDown className="w-5 h-5 text-slate-400 absolute left-4 top-4 pointer-events-none" />
          </div>

          <button 
            disabled={selectedIds.length === 0}
            onClick={handlePullSelected}
            className="flex items-center gap-2 bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 text-white px-8 py-3.5 rounded-2xl font-black transition-all hover:bg-blue-600 shadow-lg shadow-blue-50"
          >
            سحب من المندوب
          </button>
        </div>

        <div className="relative flex-1 w-full max-w-md">
          <input 
            type="text" 
            placeholder="البحث برقم الطلب، التاجر..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-4 pr-12 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/10 focus:border-[#0F3B73] transition-all"
          />
          <Search className="w-6 h-6 text-slate-400 absolute right-4 top-3.5" />
          <Barcode className="w-5 h-5 text-slate-300 absolute left-4 top-4" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                <th className="px-6 py-5 w-12 text-center">
                   <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredOrders.map(o => o.id));
                        else setSelectedIds([]);
                      }}
                      checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                   />
                </th>
                <th className="px-6 py-5 font-black text-slate-700">رقم الطلب</th>
                <th className="px-6 py-5 font-black text-slate-700">رقم الشحنة</th>
                <th className="px-6 py-5 font-black text-slate-700">التاجر / المتجر</th>
                <th className="px-6 py-5 font-black text-slate-700">المندوب الحالي</th>
                <th className="px-6 py-5 font-black text-slate-700">العميل</th>
                <th className="px-6 py-5 font-black text-slate-700">التاريخ</th>
                <th className="px-6 py-5 font-black text-slate-700">المبلغ الاجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-32 text-center text-slate-400 font-bold text-lg">
                    لا توجد طلبات مع المناديب حالياً لغرض السحب.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(order.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-5 text-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds([...selectedIds, order.id]);
                          else setSelectedIds(selectedIds.filter(id => id !== order.id));
                        }}
                      />
                    </td>
                    <td className="px-6 py-5 font-en font-bold text-[#0F3B73]">{(order.id || '').slice(0, 8)}</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-600">{order.trackingNumber || '-'}</td>
                    <td className="px-6 py-5 font-bold text-slate-800">{order.merchantName || '-'}</td>
                    <td className="px-6 py-5 font-bold text-slate-600">{order.driverName || '-'}</td>
                    <td className="px-6 py-5 font-bold text-slate-600">{order.customerName || '-'}</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-400">{order.date ? order.date.split('T')[0] : 'N/A'}</td>
                    <td className="px-6 py-5 font-en font-black text-slate-800">{(order.totalAmount || 0).toLocaleString()} د.ع</td>
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
