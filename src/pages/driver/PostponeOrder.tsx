import React, { useState } from 'react';
import { Package, Search, Calendar, MapPin, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PostponeOrder() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const driverOrders = orders.filter(o => 
    (o.status === 'driver_assigned' || o.status === 'postponed') && 
    o.driverId === user?.id
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(location.state?.orderId || '');
  const [reason, setReason] = useState<string>('');
  const [postponeDate, setPostponeDate] = useState<string>('');

  const selectedOrder = driverOrders.find(o => o.id === selectedOrderId);

  const handlePostpone = () => {
    if (!reason.trim() || !postponeDate) {
      alert('الرجاء إدخال سبب التأجيل وتاريخ التأجيل الجديد');
      return;
    }
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.id, 'postponed', {
      collectedAmount: 0,
       deliveryFee: 0,
       merchantDue: 0,
       driverCommission: 0,
       companyProfit: 0,
       financialStatus: 'pending'
    });
    setSelectedOrderId('');
    setReason('');
    setPostponeDate('');
    alert('تم تأشير الطلب كمؤجل بنجاح وإرسال التحديث للإدارة');
    navigate('/driver/delivery-orders');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">تأجيل طلب</h1>
          <p className="text-slate-500 font-medium mt-1">
            اختر الطلب لتأجيله مع تحديد التاريخ الجديد وسبب التأجيل
          </p>
        </div>
      </div>

      {/* Search Bar / Dropdown */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">اختيار الطلب</label>
        <div className="relative max-w-2xl">
          <select
            value={selectedOrderId}
            onChange={(e) => {
               setSelectedOrderId(e.target.value);
               setReason('');
               setPostponeDate('');
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700 text-lg appearance-none"
          >
            <option value="">-- اختر الطلب --</option>
            {driverOrders.map(o => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.merchantName} - {(o.amount + o.deliveryFee).toLocaleString()} د.ع
              </option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      {selectedOrder && (
        <div className="bg-white border border-purple-200 rounded-3xl shadow-sm overflow-hidden p-6 max-w-3xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">تأجيل الطلب {selectedOrder.id}</h4>
              <p className="text-slate-500 text-sm">حدد موعد التأجيل الجديد وأدخل السبب</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block mb-1">العميل:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.customerName} - {selectedOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">العنوان:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.province} - {selectedOrder.address}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">إجمالي مبلغ الطلب المطلوب</label>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-en font-black text-slate-800 text-lg">
                 {(selectedOrder.amount + selectedOrder.deliveryFee).toLocaleString()} د.ع
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ التأجيل الجديد <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  lang="en"
                  dir="ltr"
                  value={postponeDate}
                  onChange={(e) => setPostponeDate(e.target.value)}
                  className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-en font-bold text-slate-800 text-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">سبب التأجيل <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="اكتب هنا سبب تأجيل الطلب (مثال: العميل طلب التأجيل ليوم غد)..."
                  rows={3}
                  className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-slate-700 text-right pr-4 pl-12"
                />
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={() => setSelectedOrderId('')}
              className="px-6 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handlePostpone}
              disabled={!reason.trim() || !postponeDate}
              className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              تأكيد التأجيل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
