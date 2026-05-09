import React, { useState } from 'react';
import { Wallet, Package, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

export default function DriverWallet() {
  const { orders } = useOrders();
  
  // Filter only the delivered orders (either fully or partially)
  const liabilityOrders = orders.filter(o => o.status === 'delivered');

  const totalLiability = liabilityOrders.reduce((sum, order) => {
    // The driver collects the item amount plus the delivery fee.
    return sum + (order.amount || 0) + (order.deliveryFee || 0);
  }, 0);

  const getStatusBadge = (isPartial: boolean) => {
    if (!isPartial) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
          تم التسليم
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">
        تسليم جزئي
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">كشف ذمة المندوب</h1>
          <p className="text-slate-500 font-medium mt-1">
            الطلبات المسلمة والمسلمة جزئياً والمبالغ المستلمة التي بذمتك
          </p>
        </div>
      </div>

      {/* Total Liability Card */}
      <div className="bg-[#0F3B73] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <p className="text-blue-200 font-bold mb-2 flex items-center gap-2">
            <Wallet className="w-5 h-5" /> إجمالي المبالغ المستلمة (بذمتك)
          </p>
          <div className="flex items-end gap-2">
            <h2 className="text-5xl font-black tracking-tight font-en">{totalLiability.toLocaleString()}</h2>
            <span className="text-xl font-bold text-blue-200 mb-1">د.ع</span>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-auto">
          <button className="w-full md:w-auto bg-white text-[#0F3B73] px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            تصفية الذمة مع المخزن
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden text-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">تفاصيل الطلبات المسلمة</h3>
            <span className="text-xs font-bold text-slate-500">{liabilityOrders.length} طلبات</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right w-max-full">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الشحنة</th>
                <th className="px-6 py-4 font-bold text-slate-600">اسم المتجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600 whitespace-nowrap">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">تاريخ التسليم</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-blue-700 bg-blue-50/50">المبلغ المستلم (الذمة)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liabilityOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium">لا توجد مبالغ بذمتك حالياً</p>
                  </td>
                </tr>
              ) : (
                liabilityOrders.map((order) => {
                  const collected = (order.amount || 0) + (order.deliveryFee || 0);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-en font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-en font-medium text-slate-600">{order.trackingNumber || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">{order.merchantName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">{order.customerName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[100px]" title={order.address}>{order.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="font-en">{order.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(!!order.isPartial)}
                      </td>
                      <td className="px-6 py-4 font-en font-medium text-slate-600">
                        {(order.amount || 0).toLocaleString()} د.ع
                      </td>
                      <td className="px-6 py-4 font-en font-medium text-slate-600">
                        {(order.deliveryFee || 0).toLocaleString()} د.ع
                      </td>
                      <td className="px-6 py-4 bg-blue-50/30">
                        <span className="font-en font-black text-blue-700">{collected.toLocaleString()} د.ع</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

