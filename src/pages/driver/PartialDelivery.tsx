import React, { useState, useEffect } from 'react';
import { Package, Search, Calendar, MapPin, CheckCircle2, DollarSign, XCircle, FileText } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PartialDelivery() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, addOrder } = useOrders();
  const { getDriverCommission } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const driverOrders = orders.filter(o => o.status === 'driver_assigned' && o.driverId === user?.id);

  const [selectedOrderId, setSelectedOrderId] = useState<string>(location.state?.orderId || '');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const selectedOrder = driverOrders.find(o => o.id === selectedOrderId);

  const handlePartialDeliver = () => {
    if (!reason) {
      alert('الرجاء إدخال سبب التسليم الجزئي');
      return;
    }
    if (!selectedOrder) return;

    const amountNum = parseFloat(receivedAmount) || 0;
    
    // Financial logic for partial:
    // Only charge delivery fee if collected amount > 0
    // The actual delivery fee for this branch/province
    const applyDeliveryFee = amountNum > 0 ? selectedOrder.deliveryFee : 0;
    
    // Recalculate true order amount based on collected
    const newOrderAmount = amountNum > 0 ? amountNum - applyDeliveryFee : 0;
    
    const commission = amountNum > 0 ? getDriverCommission(selectedOrder.province) : 0;
    const companyProfit = applyDeliveryFee - commission;

    const remainderTotal = selectedOrder.totalAmount - amountNum;

    // Update current order as partial delivered
    updateOrderStatus(selectedOrder.id, 'delivered', {
      orderAmount: newOrderAmount,
      amount: newOrderAmount, // Keep backward compatibility
      collectedAmount: amountNum, 
      deliveryFee: applyDeliveryFee, // ensure if 0 it reflects
      merchantDue: newOrderAmount,
      driverCommission: commission,
      companyProfit: companyProfit,
      financialStatus: 'pending',
      isPartial: true
    });

    // Sub-order for the remaining (Returned)
    // No delivery fee, no driver commission
    addOrder({
      id: `${selectedOrder.id}-P`,
      trackingNumber: `${selectedOrder.trackingNumber}-P`,
      merchantName: selectedOrder.merchantName,
      customerName: selectedOrder.customerName,
      customerPhone: selectedOrder.customerPhone,
      address: selectedOrder.address,
      province: selectedOrder.province,
      pieces: selectedOrder.pieces,
      
      amount: remainderTotal > 0 ? remainderTotal : 0,
      totalAmount: remainderTotal > 0 ? remainderTotal : 0,
      orderAmount: remainderTotal > 0 ? remainderTotal : 0,
      collectedAmount: 0,
      deliveryFee: 0, 
      merchantDue: 0,
      driverCommission: 0,
      companyProfit: 0,
      financialStatus: 'pending',

      status: 'returned_partial',
      isPartial: true,
      date: new Date().toISOString().split('T')[0]
    });

    setSelectedOrderId('');
    setReceivedAmount('');
    setReason('');
    alert(`تم تأشير الطلب كمسلم (جزئي).\nتم استلام مبلغ (${receivedAmount} د.ع).\nتم إنشاء طلب جديد للمواد الراجعة وإرساله إلى المخزن.`);
    navigate('/driver/delivery-orders');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">تسليم جزئي</h1>
          <p className="text-slate-500 font-medium mt-1">
            اختر الطلب لتسليمه جزئياً وإدخال المبلغ المستلم والسبب
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
               setReceivedAmount('');
               setReason('');
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
        <div className="bg-white border border-orange-200 rounded-3xl shadow-sm overflow-hidden p-6 max-w-3xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">تسليم جزئي للطلب {selectedOrder.id}</h4>
              <p className="text-slate-500 text-sm">أدخل المبلغ المستلم والسبب لتأكيد العملية</p>
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
              <label className="block text-sm font-bold text-slate-700 mb-2">المبلغ المستلم فعلياً من العميل (الجزئي) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full bg-white border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-en font-bold text-slate-800 text-lg"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 font-bold">
                  د.ع
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            {receivedAmount && !isNaN(Number(receivedAmount)) && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm font-bold text-orange-800 flex justify-between items-center mt-4">
                <span>المبلغ المتبقي (للراجع):</span>
                <span className="font-en">
                  {Math.max(0, (selectedOrder.amount + selectedOrder.deliveryFee) - Number(receivedAmount)).toLocaleString()} د.ع
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">سبب التسليم الجزئي والتفاصيل <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="اكتب هنا سبب استلام جزء من الشحنة أو المبالغ المرتجعة..."
                  rows={3}
                  className="w-full bg-white border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-slate-700 text-right pr-4 pl-12"
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
              onClick={handlePartialDeliver}
              disabled={!receivedAmount || isNaN(Number(receivedAmount)) || !reason.trim()}
              className="px-6 py-2.5 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              تأكيد التسليم الجزئي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
