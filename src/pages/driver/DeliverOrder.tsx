import React, { useState } from 'react';
import { Package, Search, Calendar, MapPin, CheckCircle2, DollarSign } from 'lucide-react';

export default function DeliverOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<string>('');

  const [orders, setOrders] = useState([
    { 
      id: 'ORD-8921',
      shipmentNo: 'SHP-123456',
      merchantName: 'بوتيك نايا',
      customerName: 'أحمد محمد', 
      customerPhone: '0501234567', 
      address: 'الجادرية، بغداد', 
      date: '2026-05-02 08:30 AM',
      amount: 15000, 
      deliveryFee: 5000,
      totalAmount: 20000,
      status: 'delivering',
    },
    { 
      id: 'ORD-8922', 
      shipmentNo: 'SHP-987654',
      merchantName: 'متجر الإلكترونيات',
      customerName: 'سارة خالد', 
      customerPhone: '0551234567', 
      address: 'المنصور، بغداد', 
      date: '2026-05-02 09:15 AM',
      amount: 45000, 
      deliveryFee: 5000,
      totalAmount: 50000,
      status: 'delivering',
    },
  ]);

  const filteredOrders = orders.filter(
    (o) => 
      searchTerm && (
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.shipmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerPhone.includes(searchTerm)
      )
  );

  const handleDeliver = (orderId: string) => {
    // In a real app, this would make an API call to mark as delivered
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
    setSelectedOrder(null);
    setReceivedAmount('');
    alert('تم تأشير الطلب كمسلم بنجاح وإرسال التحديث للإدارة');
  };

  const getStatusBadge = (status: string) => {
    if (status === 'delivered') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
          تم التسليم
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
        قيد التوصيل
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">تسليم طلب</h1>
          <p className="text-slate-500 font-medium mt-1">
            ابحث عن الطلب لتسليمه وإدخال المبلغ المستلم
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">البحث عن الطلب</label>
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

      {/* Search Results */}
      {searchTerm && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden text-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="font-bold text-slate-700">نتائج البحث</h3>
             <span className="text-xs font-bold text-slate-500">{filteredOrders.length} نتيجة</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right w-max-full">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                  <th className="px-6 py-4 font-bold text-slate-600">رقم الشحنة</th>
                  <th className="px-6 py-4 font-bold text-slate-600">اسم المتجر او التاجر</th>
                  <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                  <th className="px-6 py-4 font-bold text-slate-600">مبلغ التوصيل</th>
                  <th className="px-6 py-4 font-bold text-slate-600">الاجمالي المطلق</th>
                  <th className="px-6 py-4 font-bold text-slate-600 whitespace-nowrap">العنوان</th>
                  <th className="px-6 py-4 font-bold text-slate-600">التاريخ</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                      <p className="text-lg font-medium">لم يتم العثور على طلبات مطابقة للبحث</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className={`hover:bg-slate-50/80 transition-colors ${selectedOrder === order.id ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <span className="font-en font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-en font-medium text-slate-600">{order.shipmentNo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">{order.merchantName}</span>
                        </td>
                        <td className="px-6 py-4 font-en font-medium text-slate-600">
                          {order.amount.toLocaleString()} د.ع
                        </td>
                        <td className="px-6 py-4 font-en font-medium text-slate-600">
                          {order.deliveryFee.toLocaleString()} د.ع
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-en font-bold text-blue-600">{order.totalAmount.toLocaleString()} د.ع</span>
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
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {order.status === 'delivering' && (
                             <button
                               onClick={() => {
                                 setSelectedOrder(selectedOrder === order.id ? null : order.id);
                                 setReceivedAmount(order.totalAmount.toString());
                               }}
                               className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap text-xs"
                             >
                               إجراء التوصيل
                             </button>
                          )}
                        </td>
                      </tr>
                      {/* Delivery Action Panel (expanded) */}
                      {selectedOrder === order.id && order.status === 'delivering' && (
                        <tr>
                          <td colSpan={10} className="p-0 border-b border-blue-100 bg-blue-50/20">
                            <div className="p-6">
                              <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-base">تأكيد تسليم الطلب {order.id}</h4>
                                    <p className="text-slate-500 text-sm">أدخل المبلغ المستلم لتأكيد عملية التسليم</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">إجمالي مبلغ الطلب المطلوب</label>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-en font-black text-slate-800 text-lg">
                                       {order.totalAmount.toLocaleString()} د.ع
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

                                <div className="flex justify-end gap-3 pt-4">
                                  <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-6 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                  >
                                    إلغاء
                                  </button>
                                  <button
                                    onClick={() => handleDeliver(order.id)}
                                    disabled={!receivedAmount || isNaN(Number(receivedAmount))}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-5 h-5" />
                                    تأشير كـ "تم التسليم"
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
