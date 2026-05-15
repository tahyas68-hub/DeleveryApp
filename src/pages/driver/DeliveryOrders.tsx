import React, { useState } from 'react';
import { Package, Search, Calendar, MapPin, Check, X, Clock, SplitSquareHorizontal, Copy } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';

export default function DeliveryOrders() {
  const { orders, updateOrderStatus, addOrder } = useOrders();
  const { getDriverCommission } = useSettings();
  const driverOrders = orders.filter(o => o.status === 'driver_assigned');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [partialModalOpen, setPartialModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [partialAmount, setPartialAmount] = useState<string>('');

  const filteredOrders = driverOrders.filter(
    (o) => 
      !searchTerm ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.merchantName && o.merchantName.includes(searchTerm)) ||
      (o.address && o.address.includes(searchTerm))
  );

  const handleDeliver = (order: any) => {
    const commission = getDriverCommission(order.province);
    updateOrderStatus(order.id, 'delivered', {
       collectedAmount: order.totalAmount, 
       merchantDue: order.totalAmount - order.deliveryFee,
       driverCommission: commission,
       companyProfit: order.deliveryFee - commission,
       financialStatus: 'collected_from_driver'
    });
    alert("تم تسليم الطلب");
  };

  const handleReturn = (id: string) => {
    updateOrderStatus(id, 'returned', {
      collectedAmount: 0,
       deliveryFee: 0,
       merchantDue: 0,
       driverCommission: 0,
       companyProfit: 0,
       financialStatus: 'pending'
    });
    alert("تم إرجاع الطلب");
  };

  const handlePostpone = (id: string) => {
    updateOrderStatus(id, 'postponed', {
      collectedAmount: 0,
       deliveryFee: 0,
       merchantDue: 0,
       driverCommission: 0,
       companyProfit: 0,
       financialStatus: 'pending'
    });
    alert("تم تأجيل الطلب");
  };

  const openPartialModal = (order: any) => {
    setSelectedOrder(order);
    setPartialAmount('');
    setPartialModalOpen(true);
  };

  const handlePartialDelivery = () => {
    if (!selectedOrder || !partialAmount) return;
    
    const amountNum = parseFloat(partialAmount) || 0;
    
    // Financial logic for partial:
    const applyDeliveryFee = amountNum > 0 ? selectedOrder.deliveryFee : 0;
    const newOrderAmount = amountNum > 0 ? amountNum - applyDeliveryFee : 0;
    const commission = amountNum > 0 ? getDriverCommission(selectedOrder.province) : 0;
    const companyProfit = applyDeliveryFee - commission;

    const remainderTotal = selectedOrder.totalAmount - amountNum;

    updateOrderStatus(selectedOrder.id, 'delivered_partial', {
      orderAmount: newOrderAmount,
      amount: newOrderAmount,
      collectedAmount: amountNum, 
      deliveryFee: applyDeliveryFee, 
      merchantDue: newOrderAmount,
      driverCommission: commission,
      companyProfit: companyProfit,
      financialStatus: amountNum > 0 ? 'collected_from_driver' : 'pending',
      isPartial: true
    });
    
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
    
    alert("تم تسجيل التسليم الجزئي و إنشاء طلب راجع بالباقي");
    setPartialModalOpen(false);
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

      {partialModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">تسليم جزئي للطلب {selectedOrder.id}</h2>
              <button 
                onClick={() => setPartialModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-slate-600 font-bold text-xs text-right">المبلغ المستلم (الجزء المسلم) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    placeholder="أدخل المبلغ..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] focus:ring-2 focus:ring-[#0F3B73]/20 transition-all outline-none" 
                  />
                </div>
                {partialAmount && !isNaN(Number(partialAmount)) && (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm font-bold text-orange-800 flex justify-between items-center">
                    <span>المبلغ المتبقي (للراجع):</span>
                    <span className="font-en">
                      {Math.max(0, (selectedOrder.amount + selectedOrder.deliveryFee) - Number(partialAmount)).toLocaleString()} د.ع
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">
                سيتم معاملة هذا المبلغ على أنه الطلب المسلم، وسيتم إنشاء طلب راجع بالباقي.
              </p>
              <button 
                onClick={handlePartialDelivery}
                className="w-full bg-[#0F3B73] text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all"
              >
                تأكيد التسليم الجزئي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
