import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Barcode
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export default function WarehouseInventory() {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.trackingNumber || '').includes(searchTerm) || 
                         (o.customerName || '').includes(searchTerm) || 
                         (o.customerPhone || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#0F3B73]">
             <Package className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wider">العمليات اللوجستية للفرع</span>
          </div>
          <h1 className="text-3xl font-black text-[#0F3B73]">كل الطلبات</h1>
          <p className="text-slate-400 font-bold">عرض وتدقيق كافة الطلبات حالياً في الفرع بكل حالاتها</p>
        </div>
        
        <button className="flex items-center gap-2 bg-white text-[#0F3B73] border-2 border-[#0F3B73]/20 px-6 py-2.5 rounded-xl font-black hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          العودة لقائمة العمليات
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="بحث برقم الطلب، اسم العميل، أو الهاتف..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/20 focus:border-[#0F3B73] transition-all"
          />
          <Search className="w-6 h-6 text-slate-400 absolute right-4 top-3.5" />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:w-48">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/20 focus:border-[#0F3B73] transition-all"
            >
              <option value="all">كل الحالات</option>
              <option value="delivered">تم التسليم</option>
              <option value="processing">قيد المعالجة</option>
              <option value="shipped">قيد التوصيل</option>
              <option value="returned">راجع</option>
            </select>
          </div>
          
          <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            بحث
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 font-black text-slate-700">رقم الطلب</th>
                <th className="px-6 py-5 font-black text-slate-700">رقم الشحنة</th>
                <th className="px-6 py-5 font-black text-slate-700">التاجر / المتجر</th>
                <th className="px-6 py-5 font-black text-slate-700">العميل</th>
                <th className="px-6 py-5 font-black text-slate-700">المندوب</th>
                <th className="px-6 py-5 font-black text-slate-700">الحالة</th>
                <th className="px-6 py-5 font-black text-slate-700">المبلغ</th>
                <th className="px-6 py-5 font-black text-slate-700">التوصيل</th>
                <th className="px-6 py-5 font-black text-slate-700">الإجمالي</th>
                <th className="px-6 py-5 font-black text-slate-700">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-20 text-center text-slate-400 font-bold">
                    لا توجد طلبات تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-en font-bold text-slate-900">{order.trackingNumber || '-'}</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-600">{(order.id || '').slice(0, 8)}</td>
                    <td className="px-6 py-5 font-bold text-slate-900">{order.merchantName || '-'}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{order.customerName || '-'}</span>
                        <span className="text-xs font-en font-bold text-slate-400 tracking-wider">{order.customerPhone || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-600">{order.driverName || '-'}</td>
                    <td className="px-6 py-5"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-6 py-5 font-en font-bold text-slate-900">{((order.totalAmount || 0) - (order.deliveryFee || 0)).toLocaleString()} د.ع</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-600">{(order.deliveryFee || 0).toLocaleString()} د.ع</td>
                    <td className="px-6 py-5 font-en font-black text-[#0F3B73]">{(order.totalAmount || 0).toLocaleString()} د.ع</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-400 text-sm">{order.date ? order.date.split('T')[0] : 'N/A'}</td>
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
