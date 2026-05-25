import React, { useState, useEffect } from 'react';
import { Package, Search, Calendar, MapPin, CheckCircle2, DollarSign } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DeliverOrder() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { getDriverCommission } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const driverOrders = orders.filter(o => 
    (o.status === 'driver_assigned' || o.status === 'postponed' || o.status === 'returned' || o.status === 'returned_partial') && 
    o.driverId === user?.id
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(location.state?.orderId || '');
  const [receivedAmount, setReceivedAmount] = useState<string>('');

  useEffect(() => {
    if (selectedOrderId) {
      const ord = driverOrders.find(o => o.id === selectedOrderId);
      if (ord) setReceivedAmount((ord.amount + ord.deliveryFee).toString());
    }
  }, []);

  const selectedOrder = driverOrders.find(o => o.id === selectedOrderId);

  const handleDeliver = () => {
    if (selectedOrderId && selectedOrder) {
      if (receivedAmount && !isNaN(Number(receivedAmount))) {
        const amountNum = parseFloat(receivedAmount);
        const commission = getDriverCommission(selectedOrder.province);
        
        updateOrderStatus(selectedOrderId, 'delivered', {
           collectedAmount: amountNum,
           merchantDue: amountNum - selectedOrder.deliveryFee,
           driverCommission: commission,
           companyProfit: selectedOrder.deliveryFee - commission,
           financialStatus: 'pending' // driver has it, next is transferring
        });
      } else {
        const commission = getDriverCommission(selectedOrder.province);
        updateOrderStatus(selectedOrderId, 'delivered', {
           collectedAmount: selectedOrder.totalAmount, // assume full amount collected if not specified manually
           merchantDue: selectedOrder.totalAmount - selectedOrder.deliveryFee,
           driverCommission: commission,
           companyProfit: selectedOrder.deliveryFee - commission,
           financialStatus: 'pending'
        });
      }
      setSelectedOrderId('');
      setReceivedAmount('');
      alert('تم تأشير الطلب كمسلم بنجاح وإرسال التحديث للإدارة');
      navigate('/driver/delivery-orders');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">تسليم طلب</h1>
          <p className="text-slate-500 font-medium mt-1">
            اختر الطلب لتسليمه وإدخال المبلغ المستلم
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
               const ord = driverOrders.find(o => o.id === e.target.value);
               if (ord) setReceivedAmount((ord.amount + ord.deliveryFee).toString());
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

      {/* Delivery Action Panel */}
      {selectedOrder && (
        <div className="bg-white border border-blue-200 rounded-3xl shadow-sm overflow-hidden p-6 max-w-3xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">تأكيد تسليم الطلب {selectedOrder.id}</h4>
              <p className="text-slate-500 text-sm">أدخل المبلغ المستلم لتأكيد عملية التسليم</p>
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
              <label className="block text-sm font-bold text-slate-700 mb-2">المبلغ المستلم فعلياً من العميل <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-en font-bold text-slate-800 text-lg"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 font-bold">
                  د.ع
                  <DollarSign className="w-5 h-5" />
                </div>
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
              onClick={handleDeliver}
              disabled={!receivedAmount || isNaN(Number(receivedAmount))}
              className="px-6 py-2.5 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              تأشير كـ "تم التسليم"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
