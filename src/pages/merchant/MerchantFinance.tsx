import React from 'react';
import { FileText, Wallet, Printer, FileDown, Clock, ArrowRight, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import * as XLSX from 'xlsx';
import { PrintHeader } from '../../components/PrintHeader';

export default function MerchantFinance() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const merchantOrders = orders.filter(o => o.merchantId === user?.id);

  // Filter out returned orders for pending calculation if needed. 
  // Let's define the groups explicitly:
  const pendingStatuses = ['merchant_pending', 'main_warehouse', 'branch_transfering', 'branch_warehouse', 'driver_assigned', 'postponed'];
  const deliveredStatuses = ['delivered', 'delivered_partial', 'returned_partial'];

  // Current balance: delivered and partial AND NOT PAID
  const currentBalance = merchantOrders
    .filter(o => deliveredStatuses.includes(o.status) && o.financialStatus !== 'merchant_paid')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  // Pending balance: not delivered, not totally returned
  const pendingAmount = merchantOrders
    .filter(o => pendingStatuses.includes(o.status))
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Paid withdrawals
  const withdrawals = merchantOrders
    .filter(o => deliveredStatuses.includes(o.status) && o.financialStatus === 'merchant_paid')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  // Generate transactions from Delivered & Returned_Partial orders
  const transactions = merchantOrders
    .filter(o => deliveredStatuses.includes(o.status) || o.status === 'returned')
    .map((o) => {
      let typeStr = 'توصيل ناجح';
      if (o.status === 'returned_partial') typeStr = 'توصيل جزئي';
      if (o.status === 'returned') typeStr = 'مرتجع';
      return {
        id: o.id,
        trxId: `TRX-${(o.id || "").split('-')[1] || Math.floor(Math.random() * 10000)}`,
        type: typeStr,
        details: o.trackingNumber,
        date: o.date,
        amount: o.amount || 0, // order amount (merchant net)
        deliveryFee: o.deliveryFee || 0,
        totalAmount: o.totalAmount || ((o.amount || 0) + (o.deliveryFee || 0)),
        customerName: o.customerName || '',
        customerPhone: o.customerPhone || '',
        address: `${o.province || ''} - ${o.address || ''}`
      };
    });

  const exportToExcel = () => {
    const wsData = transactions.map((trx, index) => ({
      'التسلسل': index + 1,
      'رقم العملية': trx.trxId,
      'رقم الطلب': trx.details,
      'اسم العميل': trx.customerName,
      'هاتف العميل': trx.customerPhone,
      'العنوان': trx.address,
      'النوع': trx.type,
      'المبلغ الكلي (المحصل)': trx.totalAmount,
      'أجور التوصيل': trx.deliveryFee,
      'مبلغ الطلب': trx.amount,
      'تاريخ': trx.date,
    }));
    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "العمليات_المالية");
    XLSX.writeFile(workbook, "كشف_حساب.xlsx");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] -m-4 lg:-m-8 text-right pb-20 overflow-x-hidden" dir="rtl">
      <div className="p-6 md:p-10 space-y-12 max-w-7xl mx-auto print:hidden">
        {/* Top Action Bar */}
        <div className="flex justify-start no-print">
          <Link to="/merchant" className="bg-[#0F3B73] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-[#0F3B73]/20 w-fit">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Main Title & Action Buttons Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
          <div className="relative pr-6 flex-1">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0F3B73] rounded-full"></div>
            <p className="text-slate-400 font-bold text-sm mb-2 opacity-80">نظرة عامة</p>
            <h1 className="text-5xl font-black text-[#0F3B73] mb-4 tracking-tight">الحسابات والأرباح</h1>
            <p className="text-slate-500 font-medium tracking-wide">متابعة رصيدك المالي وتفاصيل العمليات</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto no-print">
             <button onClick={exportToExcel} className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all">
                <FileDown className="w-5 h-5" />
                <span>تصدير Excel</span>
             </button>
          </div>
        </div>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
           {/* Current Balance Card (Green) */}
           <div className="bg-[#10b981] p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col items-center text-center shadow-lg relative group overflow-hidden print:border print:border-gray-300 print:text-black print:bg-white print:shadow-none">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 print:bg-gray-100">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white print:text-gray-800" />
              </div>
              <h3 className="text-white font-black text-sm sm:text-xl mb-1 sm:mb-2 print:text-gray-800">الرصيد الحالي</h3>
              <div className="flex items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
                 <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-en tracking-tighter print:text-gray-900">{currentBalance.toLocaleString()}</span>
                 <span className="text-sm sm:text-xl font-black text-white/90 print:text-gray-600">د.ع</span>
              </div>
              <p className="text-white/80 font-bold text-xs sm:text-sm md:text-base print:text-gray-500">جاهز للسحب</p>
           </div>

           {/* Withdrawals Card (Blue) */}
           <div className="bg-[#3b82f6] p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col items-center text-center shadow-lg relative group overflow-hidden print:border print:border-gray-300 print:text-black print:bg-white print:shadow-none">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 print:bg-gray-100">
                <Landmark className="w-6 h-6 sm:w-8 sm:h-8 text-white print:text-gray-800" />
              </div>
              <h3 className="text-white font-black text-sm sm:text-xl mb-1 sm:mb-2 print:text-gray-800">المسحوبات</h3>
              <div className="flex items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
                 <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-en tracking-tighter print:text-gray-900">{withdrawals.toLocaleString()}</span>
                 <span className="text-sm sm:text-xl font-black text-white/90 print:text-gray-600">د.ع</span>
              </div>
              <p className="text-white/80 font-bold text-xs sm:text-sm md:text-base print:text-gray-500">تم تسليمها للتاجر</p>
           </div>

           {/* Pending Amounts Card (Orange) */}
           <div className="bg-[#f59e0b] p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden print:border print:border-gray-300 print:text-black print:bg-white print:shadow-none">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 print:bg-gray-100">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white print:text-gray-800" />
              </div>
              <h3 className="text-white font-black text-sm sm:text-xl mb-1 sm:mb-2 print:text-gray-800">مبالغ معلقة</h3>
              <div className="flex items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
                 <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-en tracking-tighter print:text-gray-900">{pendingAmount.toLocaleString()}</span>
                 <span className="text-sm sm:text-xl font-black text-white/90 print:text-gray-600">د.ع</span>
              </div>
              <p className="text-white/80 font-bold text-xs sm:text-sm md:text-base print:text-gray-500">مبالغ قيد التوصيل</p>
           </div>
        </div>

        {/* Transactions Section */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl bg-white print:border-gray-300 print:shadow-none">
          <div className="bg-[#0F3B73] px-10 py-6 print:bg-gray-100">
            <h2 className="text-2xl font-black text-white print:text-gray-800">سجل العمليات المالية (الفاتورة)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-sm font-black border-b border-slate-100 print:bg-gray-50 print:text-gray-700">
                <tr>
                  <th className="px-6 py-4">التسلسل</th>
                  <th className="px-6 py-4">رقم الطلب</th>
                  <th className="px-6 py-4">تفاصيل العميل</th>
                  <th className="px-6 py-4 text-center">النوع</th>
                  <th className="px-6 py-4">المبلغ الكلي</th>
                  <th className="px-6 py-4">أجور التوصيل</th>
                  <th className="px-6 py-4">مبلغ الطلب</th>
                  <th className="px-6 py-4">تاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.length > 0 ? transactions.map((trx, index) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-black text-slate-800">{index + 1}</td>
                    <td className="px-6 py-5 font-bold text-slate-600">
                      <div className="flex flex-col">
                        <span className="text-[#0F3B73] font-en">{trx.details}</span>
                        <span className="text-xs text-slate-400 font-en">{trx.trxId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{trx.customerName}</span>
                        <span className="text-sm font-en text-slate-500">{trx.customerPhone}</span>
                        <span className="text-xs text-slate-400 truncate max-w-[120px]">{trx.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap border ${trx.type === 'مرتجع' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-en font-bold text-slate-700">
                      {trx.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-en font-bold text-amber-600">
                      {trx.deliveryFee.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-en font-black text-emerald-600">
                      {trx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-en font-bold text-slate-400 text-sm">{trx.date}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-10 py-12 text-center text-slate-500 font-bold text-lg">
                      لا توجد عمليات مالية مكتملة حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Printable Financial Report */}
      <div id="printable-financial-report" className="hidden print:block w-full bg-white text-black pt-4 z-50 overflow-visible px-8" dir="rtl">
         <PrintHeader 
           title="كشف حساب لتاجر"
           stats={[
             { label: 'الرصيد الجاهز للسحب', value: currentBalance.toLocaleString() },
             { label: 'إجمالي المسحوبات', value: withdrawals.toLocaleString() },
             { label: 'مبالغ معلقة (قيد التوصيل)', value: pendingAmount.toLocaleString() },
             { label: 'عدد العمليات', value: transactions.length }
           ]}
         />

         <table className="w-full text-center border-collapse mb-12 border-2 border-slate-500 text-sm">
            <thead>
               <tr className="border-b-2 border-black bg-slate-100">
                  <th className="p-2 font-black text-black border-l border-slate-300">التسلسل</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">رقم البوليصة</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">واسم المستلم</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">المحافظة</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">النوع</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">أجور التوصيل</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">مبلغ الطلب</th>
                  <th className="p-2 font-black text-black">الصافي الخاص بالتاجر</th>
               </tr>
            </thead>
            <tbody>
               {transactions.map((trx, index) => (
                    <tr key={trx.id} className="border-b border-slate-300">
                        <td className="p-2 font-bold border-l border-slate-300">{index + 1}</td>
                        <td className="p-2 font-bold border-l border-slate-300 font-en text-slate-700">{trx.details}</td>
                        <td className="p-2 font-bold border-l border-slate-300">{trx.customerName}</td>
                        <td className="p-2 font-bold border-l border-slate-300">{trx.address.split('-')[0]}</td>
                        <td className="p-2 font-bold border-l border-slate-300">{trx.type}</td>
                        <td className="p-2 font-bold border-l border-slate-300 font-en">{(trx.deliveryFee || 0).toLocaleString()}</td>
                        <td className="p-2 font-bold border-l border-slate-300 font-en">{(trx.amount || 0).toLocaleString()}</td>
                        <td className="p-2 font-black text-slate-900 font-en">{(trx.amount || 0).toLocaleString()}</td>
                    </tr>
               ))}
               <tr className="border-t-[3px] border-black bg-slate-100">
                  <td colSpan={7} className="p-2 font-black text-center border-l border-slate-300 text-lg">صافي حساب التاجر</td>
                  <td className="p-2 font-black text-slate-900 text-xl font-en">{currentBalance.toLocaleString()}</td>
               </tr>
            </tbody>
         </table>

         <div className="flex justify-between px-16 mt-20 pt-10 pb-10">
            <div className="text-center">
               <p className="font-black text-lg mb-12">توقيع المستلم (التاجر)</p>
               <p className="text-black font-black">________________________</p>
            </div>
            <div className="text-center">
               <p className="font-black text-lg mb-12">المدير المالي</p>
               <p className="text-black font-black">________________________</p>
            </div>
         </div>
      </div>
    </div>
  );
}
