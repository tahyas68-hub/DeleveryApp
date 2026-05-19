import React, { useState } from 'react';
import { Package, Search, Calendar, CheckSquare, XCircle, ArrowLeft, Printer } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

export default function IncomingMerchant() {
  const { orders, updateOrderStatus } = useOrders();
  const incomingOrders = orders.filter(o => o.status === 'merchant_pending');

  const handleReceive = (id: string) => {
    updateOrderStatus(id, 'main_warehouse');
    alert("تم الاستلام وتحويل الطلب إلى المخزن الرئيسي");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">الشحنات الواردة من التاجر</h1>
          <p className="text-slate-500 font-medium mt-1">
            مراجعة واستلام الشحنات الواردة من التاجر إلى المخزن الرئيسي
          </p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input type="text" placeholder="بحث برقم الشحنة أو التاجر..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">تفاصيل العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ الكلي</th>
                <th className="px-6 py-4 font-bold text-slate-600">أجور التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">الكمية (طرود)</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomingOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-20 text-center text-slate-300 font-bold text-lg">
                    لا توجد شحنات واردة من التجار حالياً
                  </td>
                </tr>
              ) : (
                incomingOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-en font-bold text-[#0F3B73]">
                      <div>{o.id}</div>
                      <div className="text-xs text-slate-400">{o.date}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{o.merchantName}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{o.customerName}</div>
                      <div className="text-xs text-slate-500 font-en">{o.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{o.province}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[120px]">{o.address}</div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-slate-700">{o.totalAmount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-amber-600">{o.deliveryFee?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-emerald-600">{o.amount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-blue-600 text-center">{o.pieces}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold border border-orange-100 whitespace-nowrap">استلام من التاجر</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          to={`/admin/print-sticker/${o.id}`}
                          target="_blank"
                          className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                          title="طباعة الستكر"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleReceive(o.id)}
                          className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors whitespace-nowrap"
                        >
                          استلام إلى المخزن الرئيسي
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
