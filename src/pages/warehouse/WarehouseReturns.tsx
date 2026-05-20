import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  ArrowLeft, 
  RotateCcw, 
  Barcode,
  History
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';

export default function WarehouseReturns() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  
  const returnedOrders = orders.filter(o => o.status === 'returned' || o.status === 'returned_partial');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handlePullSelected = () => {
    selectedIds.forEach(id => {
      updateOrderStatus(id, 'returned'); // Or a specific 'branch_returned' status if needed
    });
    setSelectedIds([]);
    alert('تم سحب الطلبات المحددة للمخزن بنجاح');
  };

  const filteredOrders = returnedOrders.filter(o => {
    return (o.trackingNumber || '').includes(searchQuery) || (o.merchantName || '').includes(searchQuery) || (o.driverName || '').includes(searchQuery);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#0F3B73]">
             <History className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wider">العمليات اللوجستية للفرع</span>
          </div>
          <h1 className="text-3xl font-black text-[#0F3B73]">سحب الراجع من مندوب</h1>
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
          <span className="font-black text-slate-700 whitespace-nowrap">الإجراءات المتوفرة:</span>
          
          <button 
            disabled={selectedIds.length === 0}
            onClick={handlePullSelected}
            className="flex items-center gap-2 bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 text-white px-8 py-3.5 rounded-2xl font-black transition-all hover:bg-blue-700 shadow-lg shadow-blue-50"
          >
            <RotateCcw className="w-5 h-5" />
            سحب المحدد للمخزن
          </button>
        </div>

        <div className="relative flex-1 w-full max-w-md">
          <input 
            type="text" 
            placeholder="مسح الباركود لسحب الراجع..." 
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
          <table className="w-full text-right border-collapse whitespace-nowrap min-w-[1000px]">
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
                <th className="px-6 py-5 font-black text-slate-700">المندوب</th>
                <th className="px-6 py-5 font-black text-slate-700">التاجر / المتجر</th>
                <th className="px-6 py-5 font-black text-slate-700">العميل</th>
                <th className="px-6 py-5 font-black text-slate-700">العنوان</th>
                <th className="px-6 py-5 font-black text-slate-700 text-center">الحالة</th>
                <th className="px-6 py-5 font-black text-slate-700 text-left">مبلغ الطلب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-32 text-center text-slate-400 font-bold text-lg">
                    لا توجد طلبات راجعة في المخزن حالياً (جاهزة للتحويل).
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
                    <td className="px-6 py-5 font-en font-bold text-[#0F3B73]">{order.trackingNumber}</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-600">{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-5 font-bold text-slate-800">{order.driverName || 'علي'}</td>
                    <td className="px-6 py-5 font-bold text-slate-900">{order.merchantName}</td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{order.customerName}</span>
                          <span className="text-xs text-slate-400 font-en font-bold">{order.customerPhone}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{order.province} - {order.address}</td>
                    <td className="px-6 py-5 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                         order.status === 'returned' 
                           ? 'bg-red-50 text-red-600' 
                           : 'bg-orange-50 text-orange-600'
                       }`}>
                         {order.status === 'returned' ? 'راجع من مندوب (بانتظار سحب)' : 'قيد التسليم'}
                       </span>
                    </td>
                    <td className="px-6 py-5 font-en font-black text-slate-900 text-left whitespace-nowrap">{order.totalAmount.toLocaleString()} د.ع</td>
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
