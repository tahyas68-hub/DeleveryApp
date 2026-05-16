import React, { useState } from 'react';
import { Printer, Calendar, FileText } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';

export default function DriverCommissionReport() {
  const { orders } = useOrders();
  const { governorates, getDriverCommission } = useSettings();

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // We should only consider delivered orders
  const relevantOrders = orders.filter(o => o.status === 'delivered' || o.status === 'returned_partial');

  // Filter based on dates
  const filteredOrders = relevantOrders.filter(order => {
    if (!dateFrom && !dateTo) return true;
    
    if (!order.date) return true;
    const orderDateParts = order.date.split('/');
    let orderDate;
    if (orderDateParts.length === 3) {
      orderDate = new Date(`${orderDateParts[2]}-${orderDateParts[1]}-${orderDateParts[0]}`);
    } else {
      orderDate = new Date(order.date);
    }
    
    if (isNaN(orderDate.getTime())) return true; // fallback if can't parse

    let keep = true;
    if (dateFrom) {
      keep = keep && orderDate >= new Date(dateFrom);
    }
    if (dateTo) {
      // Set to time to end of day
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      keep = keep && orderDate <= to;
    }
    return keep;
  });

  const totalCommission = filteredOrders.reduce((sum, order) => sum + getDriverCommission(order.province), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-0 mt-4" dir="rtl">
      
      {/* Header & Print Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            كشف عمولة المندوب
          </h1>
          <p className="text-slate-500 mt-1 text-sm">عرض تفاصيل العمولات المستحقة للمندوب بناءً على الطلبات المسلمة</p>
        </div>
        
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-colors text-sm w-full sm:w-auto justify-center"
        >
          <Printer className="w-5 h-5" />
          طباعة كشف عمولة مندوب
        </button>
      </div>

      {/* Date Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-end gap-4 print:hidden">
        <div className="flex-1 w-full relative">
          <label className="block text-xs font-bold text-slate-600 mb-2">من تاريخ</label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="date" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-en text-sm"
            />
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <label className="block text-xs font-bold text-slate-600 mb-2">إلى تاريخ</label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="date" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-en text-sm"
            />
          </div>
        </div>
      </div>

      <div className="hidden print:block mb-8 text-center">
         <h2 className="text-2xl font-black text-slate-900 border-b-2 border-slate-900 pb-2 inline-block">كشف عمولة المندوب</h2>
         <p className="mt-4 text-slate-600 font-bold">التاريخ: {dateFrom || 'الكل'} إلى {dateTo || 'الكل'}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden pb-4 print:border-none print:shadow-none print:rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#0F3B73] text-white print:bg-slate-100 print:text-slate-900">
              <tr>
                <th className="px-6 py-4 font-bold rounded-tr-3xl print:rounded-none print:border print:border-slate-300">التسلسل</th>
                <th className="px-6 py-4 font-bold print:border print:border-slate-300">تاريخ تسليم الطلب</th>
                <th className="px-6 py-4 font-bold rounded-tl-3xl print:rounded-none print:border print:border-slate-300">المبلغ الواصل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-bold print:border print:border-slate-300">
                    لا توجد طلبات في هذه الفترة
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => {
                  const driverCommission = getDriverCommission(order.province);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-en font-bold text-slate-600 print:border print:border-slate-300 print:text-slate-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-en font-bold text-slate-800 print:border print:border-slate-300">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 font-en font-black text-emerald-600 print:border print:border-slate-300 print:text-slate-900">
                        {driverCommission.toLocaleString()} د.ع
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            <tfoot className="bg-emerald-50 border-t-2 border-emerald-100 print:bg-slate-100 print:border-slate-900">
              <tr>
                <td colSpan={2} className="px-6 py-4 font-bold text-emerald-900 text-left text-lg print:border print:border-slate-300 print:text-slate-900">
                  إجمالي عمولة المندوب:
                </td>
                <td className="px-6 py-4 font-en font-black text-emerald-700 text-xl print:border print:border-slate-300 print:text-slate-900">
                  {totalCommission.toLocaleString()} د.ع
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
}
