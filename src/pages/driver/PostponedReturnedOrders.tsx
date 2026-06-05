import React, { useState } from 'react';
import { Package, Search, Calendar, MapPin, Edit3 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export default function PostponedReturnedOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const { orders, updateOrderStatus } = useOrders();
  const { user } = useAuth(); // Import useAuth!

  const filteredOrders = orders.filter(
    (o) => 
      (o.status === 'returned' || o.status === 'postponed' || o.status === 'returned_partial') &&
      o.driverId === user?.id && // Only this driver's returned orders!
      (searchTerm === '' ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.includes(searchTerm)))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">الطلبات المؤجلة والراجعة</h1>
          <p className="text-slate-500 font-medium mt-1">
            قائمة بجميع الطلبات المرتجعة كلياً، المرتجعة جزئياً، والمؤجلة
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">البحث</label>
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="أدخل رقم الطلب، رقم الشحنة، أو رقم هاتف العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right w-max-full">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الشحنة</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ</th>
                <th className="px-6 py-4 font-bold text-slate-600">اسم المتجر او التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600 whitespace-nowrap">العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600 whitespace-nowrap">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">تاريخ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium">لا توجد طلبات مطابقة</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-en font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">
                          {order.id}
                        </span>
                        <button 
                          onClick={() => {
                             navigator.clipboard.writeText(order.id);
                             alert('تم نسخ رقم الطلب بنجاح');
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-[#0F3B73] transition-colors"
                          title="نسخ رقم الطلب"
                        >
                          <Edit3 className="w-4 h-4 hidden" />
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-en font-medium text-slate-600">{order.trackingNumber || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-en font-bold text-blue-600">
                        {(order.amount + (order.deliveryFee || 0)).toLocaleString()} د.ع
                        {(order.id.endsWith('-P') || order.remainingAmount !== undefined) ? (
                            <div className="flex flex-col gap-1 mt-1 font-sans">
                              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                                المبلغ المتبقي للراجع: {order.remainingAmount !== undefined ? order.remainingAmount.toLocaleString() : order.amount.toLocaleString()} د.ع
                              </span>
                              {order.receivedAmount !== undefined && (
                                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                                  تم استلام: {order.receivedAmount.toLocaleString()} د.ع
                                </span>
                              )}
                            </div>
                        ) : order.status === 'returned_partial' && !order.id.endsWith('-P') && <span className="text-xs text-blue-600 block leading-tight mt-1">راجع جزئي</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{order.merchantName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{order.customerName}</span>
                        <span className="font-en text-xs text-slate-500">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[150px]" title={order.address}>{order.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-en">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من إرجاع هذا الطلب ليكون قيد التوصيل؟')) {
                            updateOrderStatus(order.id, 'driver_assigned');
                          }
                        }}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        إرجاع قيد التوصيل
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
