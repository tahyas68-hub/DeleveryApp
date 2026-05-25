import React, { useState } from 'react';
import { Package, Search, Calendar, MapPin, Check, X, Clock, SplitSquareHorizontal, Copy } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export default function DeliveryOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const { getDriverCommission } = useSettings();
  const driverOrders = orders.filter(
    o => 
      (o.status === 'driver_assigned' || o.status === 'postponed' || o.status === 'returned' || o.status === 'returned_partial') && 
      o.driverId === user?.id
  );
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = driverOrders.filter(
    (o) => 
      !searchTerm ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.merchantName && o.merchantName.includes(searchTerm)) ||
      (o.address && o.address.includes(searchTerm))
  );

  const handleDeliver = (order: any) => {
    navigate('/driver/deliver-order', { state: { orderId: order.id } });
  };

  const handleReturn = (id: string) => {
    navigate('/driver/return-order', { state: { orderId: id } });
  };

  const handlePostpone = (id: string) => {
    navigate('/driver/postpone-order', { state: { orderId: id } });
  };

  const openPartialModal = (order: any) => {
    navigate('/driver/partial-delivery', { state: { orderId: order.id } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">طلبات قيد التوصيل</h1>
          <p className="text-slate-500 font-medium mt-1">
            الطلبات التي وردت من المخزن الرئيسي وتم تعيينها لك لغرض التوصيل.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-[28rem]">
          <select
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700 appearance-none"
          >
             <option value="">-- عرض كل الطلبات قيد التوصيل --</option>
             {driverOrders.map(o => (
               <option key={o.id} value={o.id}>
                 {o.id} - {o.merchantName} - {o.customerName} - {o.province}
               </option>
             ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 items-center gap-2 text-slate-600 font-bold w-full md:w-auto justify-center">
            <Package className="w-5 h-5 text-blue-500" />
            <span>إجمالي الطلبات:</span>
            <span className="text-blue-600 ml-1">{filteredOrders.length}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right w-max-full">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">الاجمالي المطلوب</th>
                <th className="px-6 py-4 font-bold text-slate-600 whitespace-nowrap">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاريخ</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium">لا توجد طلبات جارية</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-en font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">{order.id}</span>
                        <button 
                          onClick={() => {
                             navigator.clipboard.writeText(order.id);
                             alert('تم نسخ رقم الطلب بنجاح');
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-[#0F3B73] transition-colors"
                          title="نسخ رقم الطلب"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{order.merchantName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-en font-bold text-blue-600">{(order.amount + order.deliveryFee).toLocaleString()} د.ع</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[200px]" title={order.address}>{order.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-en">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        <button onClick={() => handleDeliver(order)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors" title="تسليم">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => openPartialModal(order)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors" title="تسليم جزئي">
                          <SplitSquareHorizontal className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleReturn(order.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors" title="راجع">
                          <X className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePostpone(order.id)} className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors" title="تأجيل">
                          <Clock className="w-4 h-4" />
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
