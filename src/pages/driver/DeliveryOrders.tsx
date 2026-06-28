import React, { useState } from 'react';
import { Package, Search, Calendar, MapPin, Check, X, Clock, SplitSquareHorizontal, Copy } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { OrderTableHeaders, OrderTableCells } from '../../components/OrderTableCells';

export default function DeliveryOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const { getDriverCommission } = useSettings();
  const driverOrders = orders.filter(
    o => 
      (o.status === 'driver_assigned') && 
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
        <button 
           onClick={() => {
             import('../../utils/excelExport').then(({ exportOrdersToExcel }) => {
               exportOrdersToExcel(filteredOrders, 'الطلبات قيد التوصيل');
             }).catch(err => {
               console.error(err);
               alert('حدث خطأ أثناء التصدير: ' + err.message);
             });
           }}
           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-blue-500/20"
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
           حفظ إكسل
         </button>
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
                <OrderTableHeaders showMerchant={true} />
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium">لا توجد طلبات جارية</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <OrderTableCells order={order} showMerchant={true} />
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        <button onClick={() => handleDeliver(order)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors" title="تسليم">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => openPartialModal(order)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors" title="تسليم جزئي">
                          <SplitSquareHorizontal className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleReturn(order.id)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors" title="راجع">
                          <X className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePostpone(order.id)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors" title="تأجيل">
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
