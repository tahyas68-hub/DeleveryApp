import React, { useState } from 'react';
import { Wallet, CheckCircle2, Printer, Calendar, FileText, ArrowDownRight, ArrowUpRight, DollarSign, LayoutDashboard } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { motion, AnimatePresence } from 'motion/react';
import { PrintHeader } from '../../components/PrintHeader';

export default function DriverAccounts() {
  const { orders } = useOrders();
  const { getDriverCommission } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'liability' | 'commission'>('liability');
  
  // Date Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // 1. Liability Orders (Pending)
  const liabilityOrders = orders.filter(o => 
    (o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial') && 
    o.financialStatus === 'pending'
  );

  const totalLiability = liabilityOrders.reduce((sum, order) => {
    const net = typeof order.collectedAmount === 'number' 
      ? order.collectedAmount 
      : ((order.amount || 0) + (order.deliveryFee || 0));
    return sum + net;
  }, 0);

  // Delivered to company
  const deliveredCompanyOrders = orders.filter(o => 
    (o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial') && 
    o.financialStatus !== 'pending'
  );

  const deliveredToCompany = deliveredCompanyOrders.reduce((sum, order) => {
    const net = typeof order.collectedAmount === 'number' 
      ? order.collectedAmount 
      : ((order.amount || 0) + (order.deliveryFee || 0));
    return sum + net;
  }, 0);

  // 2. Commission Orders
  const relevantCommissionOrders = orders.filter(o => 
    (o.status === 'delivered' || o.status === 'delivered_partial') &&
    o.driverCommissionStatus !== 'paid'
  );
  
  const totalCommission = relevantCommissionOrders.reduce((sum, order) => sum + (typeof order.driverCommission === 'number' ? order.driverCommission : getDriverCommission(order.province)), 0);

  const receivedCommissionOrders = orders.filter(o => 
    (o.status === 'delivered' || o.status === 'delivered_partial') &&
    o.driverCommissionStatus === 'paid'
  );

  const receivedCommissions = receivedCommissionOrders.reduce((sum, order) => sum + (typeof order.driverCommission === 'number' ? order.driverCommission : getDriverCommission(order.province)), 0);


  // Filter based on dates for lists
  const filterByDate = (order: any) => {
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
    if (dateFrom) keep = keep && orderDate >= new Date(dateFrom);
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      keep = keep && orderDate <= to;
    }
    return keep;
  };

  const filteredLiabilityOrders = liabilityOrders.filter(filterByDate);
  const filteredCommissionOrders = relevantCommissionOrders.filter(filterByDate);

  const filteredTotalLiability = filteredLiabilityOrders.reduce((sum, order) => {
    const net = typeof order.collectedAmount === 'number' 
      ? order.collectedAmount 
      : ((order.amount || 0) + (order.deliveryFee || 0));
    return sum + net;
  }, 0);

  const filteredTotalCommission = filteredCommissionOrders.reduce((sum, order) => sum + (typeof order.driverCommission === 'number' ? order.driverCommission : getDriverCommission(order.province)), 0);

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-0 mt-4" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            الحسابات
          </h1>
          <p className="text-slate-500 mt-1 text-sm">متابعة الذمم المالية والعمولات المستحقة</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
             onClick={() => window.print()}
             className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm"
          >
             <Printer className="w-5 h-5" />
             طباعة مستند / تفاصيل
          </button>
        </div>
      </div>

      {/* The 4 large statistic cards (Category Cards Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        
        {/* Card 1: Liability */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <p className="text-slate-500 font-bold mb-2">الذمة المالية (عليه)</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-en text-[#0F3B73] tracking-tight">{totalLiability.toLocaleString()}</span>
            <span className="text-sm font-bold text-blue-600">د.ع</span>
          </div>
          <div className="absolute top-5 left-5 w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Delivered to company */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <p className="text-slate-500 font-bold mb-2">المبالغ المسلمة للشركة</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-en text-purple-700 tracking-tight">{deliveredToCompany.toLocaleString()}</span>
            <span className="text-sm font-bold text-purple-500">د.ع</span>
          </div>
          <div className="absolute top-5 left-5 w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Net Due Commission */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <p className="text-slate-500 font-bold mb-2 text-[13px]">العمولة الصافية المستحقة للمندوب</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-en text-emerald-700 tracking-tight">{totalCommission.toLocaleString()}</span>
            <span className="text-sm font-bold text-emerald-500">د.ع</span>
          </div>
          <div className="absolute top-5 left-5 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Collected Commissions Only */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <p className="text-slate-500 font-bold mb-2">عمولات مقبوضة فقط</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-en text-orange-700 tracking-tight">{receivedCommissions.toLocaleString()}</span>
            <span className="text-sm font-bold text-orange-500">د.ع</span>
          </div>
          <div className="absolute top-5 left-5 w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Date Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-end gap-4 print:hidden">
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
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-en text-sm text-slate-700"
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
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-en text-sm text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 print:hidden">
        <button
          onClick={() => setActiveTab('liability')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'liability' ? 'border-[#0F3B73] text-[#0F3B73]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-5 h-5" />
          كشف الذمة المالية
        </button>
        <button
          onClick={() => setActiveTab('commission')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'commission' ? 'border-[#0F3B73] text-[#0F3B73]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          كشف العمولة
        </button>
      </div>

      {/* Print Headers */}
      <div className="hidden print:block w-full bg-white text-black pt-4 z-50 overflow-visible px-8 mb-8" dir="rtl">
         <PrintHeader 
           title={activeTab === 'liability' ? 'كشف الذمة المالية للمندوب' : 'كشف عمولة المندوب'}
           date={dateFrom && dateTo ? `${dateFrom} إلى ${dateTo}` : (dateFrom ? `من ${dateFrom}` : (dateTo ? `إلى ${dateTo}` : undefined))}
           stats={activeTab === 'liability' ? [
             { label: 'الذمة المالية (عليه)', value: totalLiability.toLocaleString() },
             { label: 'المبالغ المسلمة للشركة', value: deliveredToCompany.toLocaleString() },
             { label: 'العمولة الصافية المستحقة', value: totalCommission.toLocaleString() },
             { label: 'عدد الطلبات', value: filteredLiabilityOrders.length }
           ] : [
             { label: 'العمولة المستحقة', value: filteredTotalCommission.toLocaleString() },
             { label: 'عمولات مقبوضة', value: receivedCommissions.toLocaleString() },
             { label: 'عدد الطلبات', value: filteredCommissionOrders.length }
           ]}
         />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'liability' && (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
              <div className="overflow-x-auto">
                <table className="w-full text-center table-fixed">
                  <thead className="bg-[#0F3B73] text-white print:bg-slate-100 print:text-slate-900 border-b-2 border-[#0F3B73]">
                    <tr>
                      <th className="px-3 py-4 font-bold text-[15px] border-l border-slate-100/20 print:border-slate-300">التسلسل</th>
                      <th className="px-3 py-4 font-bold text-[15px] border-l border-slate-100/20 print:border-slate-300">رقم الطلب</th>
                      <th className="px-3 py-4 font-bold text-[15px] border-l border-slate-100/20 print:border-slate-300">تاريخ تسليم الطلب</th>
                      <th className="px-3 py-4 font-bold text-[15px] print:border-slate-300">المبلغ المستلم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                    {filteredLiabilityOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500 print:border print:border-slate-300">
                          <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2 print:hidden" />
                          <p className="font-medium text-[15px]">لا توجد طلبات في هذه الفترة</p>
                        </td>
                      </tr>
                    ) : (
                      filteredLiabilityOrders.map((order, index) => {
                        const net = typeof order.collectedAmount === 'number'
                          ? order.collectedAmount 
                          : ((order.amount || 0) + (order.deliveryFee || 0));
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3 py-4 font-bold text-slate-700 text-base border-l border-slate-100 print:border-slate-300">
                              {index + 1}
                            </td>
                            <td className="px-3 py-4 font-en font-bold text-slate-700 text-base border-l border-slate-100 print:border-slate-300">
                              {order.id}
                            </td>
                            <td className="px-3 py-4 font-en font-medium text-slate-700 text-base border-l border-slate-100 print:border-slate-300">
                              {order.date ? order.date.split('T')[0] : 'N/A'}
                            </td>
                            <td className="px-3 py-4 font-en font-black text-slate-900 bg-slate-50 print:bg-transparent text-base border-slate-100 print:border-slate-300">
                              {net.toLocaleString()}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                  {filteredLiabilityOrders.length > 0 && (
                    <tfoot className="bg-slate-50 border-t-2 border-slate-200 print:bg-slate-100 print:border-slate-900">
                      <tr>
                        <td colSpan={3} className="px-3 py-4 font-black text-center text-slate-900 bg-slate-100/50 print:bg-transparent text-lg border-l border-slate-200 print:border-slate-300">
                          المجموع
                        </td>
                        <td className="px-3 py-4 font-en font-black text-slate-900 bg-slate-100/50 print:bg-transparent text-xl print:border-slate-300">
                          {filteredTotalLiability.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {activeTab === 'commission' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
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
                    {filteredCommissionOrders.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-bold print:border print:border-slate-300">
                          لا توجد طلبات في هذه الفترة
                        </td>
                      </tr>
                    ) : (
                      filteredCommissionOrders.map((order, index) => {
                        const driverCommission = typeof order.driverCommission === 'number' ? order.driverCommission : getDriverCommission(order.province);
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
                  {filteredCommissionOrders.length > 0 && (
                    <tfoot className="bg-emerald-50 border-t-2 border-emerald-100 print:bg-slate-100 print:border-slate-900">
                      <tr>
                        <td colSpan={2} className="px-6 py-4 font-bold text-emerald-900 text-left text-lg print:border print:border-slate-300 print:text-slate-900">
                          إجمالي عمولة المندوب:
                        </td>
                        <td className="px-6 py-4 font-en font-black text-emerald-700 text-xl print:border print:border-slate-300 print:text-slate-900">
                          {filteredTotalCommission.toLocaleString()} د.ع
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Printable Footers */}
      <div className="hidden print:flex justify-between px-16 mt-20 pt-10 pb-10">
         <div className="text-center">
            <p className="font-black text-lg mb-12">توقيع المستلم (المندوب)</p>
            <p className="text-black font-black">________________________</p>
         </div>
         <div className="text-center">
            <p className="font-black text-lg mb-12">المدير المالي</p>
            <p className="text-black font-black">________________________</p>
         </div>
      </div>
    </div>
  );
}
