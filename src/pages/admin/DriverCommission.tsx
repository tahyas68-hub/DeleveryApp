import React, { useState } from 'react';
import { Printer, Calendar, FileText, Download } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { useUsers } from '../../context/UserContext';

export default function DriverCommission() {
  const { orders } = useOrders();
  const { governorates, getDriverCommission } = useSettings();
  const { users } = useUsers();

  const drivers = users.filter(u => u.role === 'driver');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // We should only consider delivered orders assigned to the selected driver
  const relevantOrders = orders.filter(
    o => (o.status === 'delivered' || o.status === 'returned_partial' || o.status === 'delivered_partial') && 
         (!selectedDriverId || o.driverId === selectedDriverId)
  );

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
    
    if (isNaN(orderDate.getTime())) return true;

    let keep = true;
    if (dateFrom) {
      keep = keep && orderDate >= new Date(dateFrom);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      keep = keep && orderDate <= to;
    }
    return keep;
  });

  const totalCommission = filteredOrders.reduce((sum, order) => {
    if (order.status === 'delivered' || order.status === 'delivered_partial') {
      return sum + (typeof order.driverCommission === 'number' ? order.driverCommission : getDriverCommission(order.province));
    }
    return sum;
  }, 0);

  const handlePrint = () => {
    if (!selectedDriverId && drivers.length > 0) {
      alert('الرجاء اختيار مندوب قبل الطباعة');
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-0" dir="rtl">
      {/* Header & Print Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-800">عمولة المندوب</h1>
          <p className="text-slate-500 font-medium mt-1">إعداد ومتابعة حسابات عمولات المندوبين</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <button 
            onClick={handlePrint}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors text-sm w-full sm:w-auto justify-center"
          >
            <Printer className="w-5 h-5" />
            طباعة كشف المندوب
          </button>
          
          <button 
            onClick={handlePrint}
            className="bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-colors text-sm w-full sm:w-auto justify-center"
          >
            <Printer className="w-5 h-5" />
            طباعة تقرير: كشف عمولة
          </button>
        </div>
      </div>

      {/* Selectors and Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-end gap-4 print:hidden">
        <div className="flex-1 w-full relative">
          <label className="block text-xs font-bold text-slate-600 mb-2">اختر المندوب</label>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700"
          >
            <option value="">جميع المندوبين</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 w-full relative">
          <label className="block text-xs font-bold text-slate-600 mb-2">من تاريخ</label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="date" 
              lang="en"
              dir="ltr"
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
              lang="en"
              dir="ltr"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-en text-sm"
            />
          </div>
        </div>
      </div>

      <div className="hidden print:block mb-8 text-center">
         <h2 className="text-2xl font-black text-slate-900 border-b-2 border-slate-900 pb-2 inline-block">كشف عمولة مندوب</h2>
         <p className="mt-4 text-slate-600 font-bold">المندوب: {drivers.find(d => d.id === selectedDriverId)?.name || 'الكل'} | التاريخ: {dateFrom || 'الكل'} إلى {dateTo || 'الكل'}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden pb-4 print:border-none print:shadow-none print:rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#0F3B73] text-white print:bg-slate-100 print:text-slate-900">
              <tr>
                <th className="px-6 py-4 font-bold rounded-tr-3xl print:rounded-none print:border print:border-slate-300">مسلسل</th>
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
                  const driverCommission = (order.status === 'delivered' || order.status === 'delivered_partial')
                    ? (typeof order.driverCommission === 'number' ? order.driverCommission : getDriverCommission(order.province))
                    : 0;
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
