import React, { useState } from 'react';
import { Package, Search, Calendar, MapPin, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function PostponeOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('');
  const [postponeDate, setPostponeDate] = useState<string>('');

  const [orders, setOrders] = useState<any[]>([]);

  const filteredOrders = orders.filter(
    (o) => 
      searchTerm && (
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.shipmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerPhone.includes(searchTerm)
      )
  );

  const handlePostpone = (orderId: string) => {
    if (!reason.trim() || !postponeDate) {
      alert('الرجاء إدخال سبب التأجيل وتاريخ التأجيل الجديد');
      return;
    }
    // In a real app, this would make an API call to mark as postponed
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'postponed' } : o));
    setSelectedOrder(null);
    setReason('');
    setPostponeDate('');
    alert('تم تأشير الطلب كمؤجل بنجاح وإرسال التحديث للإدارة');
  };

  const getStatusBadge = (status: string) => {
    if (status === 'postponed') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
          مؤجل
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
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">تأجيل طلب</h1>
          <p className="text-slate-500 font-medium mt-1">
            ابحث عن الطلب لتأجيله مع تحديد التاريخ الجديد وسبب التأجيل
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
                      <tr className={`hover:bg-slate-50/80 transition-colors ${selectedOrder === order.id ? 'bg-purple-50/30' : ''}`}>
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
                                 setReason('');
                                 setPostponeDate('');
                               }}
                               className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap text-xs"
                             >
                               تأجيل الطلب
                             </button>
                          )}
                        </td>
                      </tr>
                      {/* Action Panel (expanded) */}
                      {selectedOrder === order.id && order.status === 'delivering' && (
                        <tr>
                          <td colSpan={10} className="p-0 border-b border-purple-100 bg-purple-50/20">
                            <div className="p-6">
                              <div className="bg-white border border-purple-200 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-base">تأجيل الطلب {order.id}</h4>
                                    <p className="text-slate-500 text-sm">حدد موعد التأجيل الجديد وأدخل السبب</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ التأجيل الجديد <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                      <input
                                        type="date"
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
                                        className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-slate-700"
                                      />
                                      <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
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
                                    onClick={() => handlePostpone(order.id)}
                                    disabled={!reason.trim() || !postponeDate}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-5 h-5" />
                                    تأكيد التأجيل
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
