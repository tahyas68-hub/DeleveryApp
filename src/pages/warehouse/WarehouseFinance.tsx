import React from 'react';
import { 
  DollarSign, 
  Wallet, 
  Clock, 
  Printer, 
  FileSpreadsheet,
  Package
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useOrders } from '../../context/OrderContext';
import { PrintHeader } from '../../components/PrintHeader';

export default function WarehouseFinance() {
  const { transactions, addTransaction } = useFinance();
  const { orders, updateOrderStatus } = useOrders();

  // 1. Calculate pending amounts with drivers
  const pendingAmount = orders.reduce((sum, o) => {
    if ((o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial') && (o.financialStatus === 'pending' || o.financialStatus === 'driver_cleared')) {
      const amountToCollect = o.collectedAmount !== undefined ? o.collectedAmount : (o.amount || 0);
      return sum + amountToCollect;
    }
    return sum;
  }, 0);

  // Filter transactions related to warehouse
  const warehouseTransactions = transactions.filter(
    t => t.fromEntity === 'warehouse' || t.toEntity === 'warehouse'
  );

  // 2. Calculate current wallet balance (what is actually inside the branch box)
  let currentBalance = 0;
  let adminWithdrawals = 0;

  warehouseTransactions.forEach(t => {
    if (t.toEntity === 'warehouse' && t.type === 'receipt') {
      // Received money from drivers
      currentBalance += t.amount;
    } else if (t.fromEntity === 'warehouse' && t.type === 'payment') {
      // Paid commissions to drivers
      currentBalance -= t.amount;
    } else if (t.fromEntity === 'warehouse' && t.type === 'transfer') {
      // Transferred to Admin
      currentBalance -= t.amount;
      adminWithdrawals += t.amount;
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="space-y-1">
          <p className="text-slate-500 font-bold flex items-center gap-2">
            نظرة عامة
          </p>
          <h1 className="text-3xl font-black text-[#0F3B73]">الحسابات والأرباح</h1>
          <p className="text-slate-400 font-medium">متابعة رصيدك المالي وتفاصيل العمليات</p>
        </div>
        
        <div className="flex items-center gap-3 print:hidden">
          {currentBalance > 0 && (
            <button 
              onClick={() => {
                if (window.confirm(`هل أنت متأكد من تسليم مبلغ ${currentBalance.toLocaleString()} د.ع للإدارة الرئيسية؟`)) {
                    addTransaction({
                      type: 'transfer',
                      amount: currentBalance,
                      fromEntity: 'warehouse',
                      toEntity: 'الحساب المالي للشركة',
                      referenceId: `transfer-admin-${Date.now()}`,
                      description: 'تسليم الرصيد المتاح من فرع المخزن إلى المركز الرئيسي',
                      userId: 'session-user'
                    });

                  orders
                    .filter(o => o.financialStatus === 'collected_from_driver' && (o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial'))
                    .forEach(o => updateOrderStatus(o.id, o.status, { financialStatus: 'branch_transferred' }));
                }
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              تسليم الصندوق للإدارة
            </button>
          )}
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
            تصدير Excel
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 print:hidden">
         {/* Card 1: Balance (Green) */}
         <div className="bg-[#10b981] p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden print:border print:border-gray-300 print:text-black print:bg-white print:shadow-none">
            <div className="w-8 h-8 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 print:bg-gray-100">
              <DollarSign className="w-5 h-5 sm:w-8 sm:h-8 text-white print:text-gray-800" />
            </div>
            <h3 className="text-white font-black text-[10px] sm:text-lg mb-1 print:text-gray-800 leading-tight">الرصيد الحالي</h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0 sm:gap-2 mb-1">
               <span className="text-lg sm:text-4xl md:text-5xl font-black text-white font-en tracking-tighter print:text-gray-900 leading-none">{currentBalance.toLocaleString()}</span>
            </div>
            <p className="text-white/80 font-bold text-[8px] sm:text-sm md:text-base print:text-gray-500 truncate w-full">صندوق الفرع المتاح</p>
         </div>

         {/* Card 2: Withdrawals (Blue) */}
         <div className="bg-[#3b82f6] p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden print:border print:border-gray-300 print:text-black print:bg-white print:shadow-none">
            <div className="w-8 h-8 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 print:bg-gray-100">
              <Wallet className="w-5 h-5 sm:w-8 sm:h-8 text-white print:text-gray-800" />
            </div>
            <h3 className="text-white font-black text-[10px] sm:text-lg mb-1 print:text-gray-800 leading-tight">مسحوبات الإدارة</h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0 sm:gap-2 mb-1">
               <span className="text-lg sm:text-4xl md:text-5xl font-black text-white font-en tracking-tighter print:text-gray-900 leading-none">{adminWithdrawals.toLocaleString()}</span>
            </div>
            <p className="text-white/80 font-bold text-[8px] sm:text-sm md:text-base print:text-gray-500 truncate w-full">تم تحويلها للمركز</p>
         </div>

         {/* Card 3: Pending (Orange) */}
         <div className="bg-[#f59e0b] p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden print:border print:border-gray-300 print:text-black print:bg-white print:shadow-none">
            <div className="w-8 h-8 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 print:bg-gray-100">
              <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-white print:text-gray-800" />
            </div>
            <h3 className="text-white font-black text-[10px] sm:text-lg mb-1 print:text-gray-800 leading-tight">مبالغ معلقة</h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0 sm:gap-2 mb-1">
               <span className="text-lg sm:text-4xl md:text-5xl font-black text-white font-en tracking-tighter print:text-gray-900 leading-none">{pendingAmount.toLocaleString()}</span>
            </div>
            <p className="text-white/80 font-bold text-[8px] sm:text-sm md:text-base print:text-gray-500 truncate w-full">عند المندوبين</p>
         </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <div className="bg-[#8CB33E] p-5 flex justify-between items-center">
           <h2 className="text-white text-xl font-black text-center w-full">سجل العمليات المالية</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                <th className="px-4 py-3 font-black text-slate-700">التسلسل</th>
                <th className="px-4 py-3 font-black text-slate-700">رقم العملية</th>
                <th className="px-4 py-3 font-black text-slate-700">النوع</th>
                <th className="px-4 py-3 font-black text-slate-700">التفاصيل</th>
                <th className="px-4 py-3 font-black text-slate-700">تاريخ</th>
                <th className="px-4 py-3 font-black text-slate-700">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {warehouseTransactions.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-bold">لا توجد عمليات مالية حالياً</td>
                </tr>
              ) : (
                warehouseTransactions.map((t, index) => {
                  const isNegative = t.fromEntity === 'warehouse';

                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-600">{warehouseTransactions.length - index}</td>
                      <td className="px-4 py-3 font-en font-bold text-slate-800">{t.id}</td>
                      <td className={`px-4 py-3 font-bold ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>
                        {t.type === 'receipt' && isNegative ? 'سحب إدارة' : t.type === 'receipt' ? 'قبض' : t.type === 'payment' ? 'صرف' : 'تحويل'}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800 whitespace-normal min-w-[200px]">{t.description}</td>
                      <td className="px-4 py-3 font-en font-bold text-slate-600">{new Date(t.timestamp).toLocaleString('ar-IQ')}</td>
                      <td className={`px-4 py-3 font-en font-black text-base lg:text-lg ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>
                        <div className="flex items-center gap-1">
                          <span>{isNegative ? '(-)' : '(+)'}</span>
                          <span dir="ltr">{t.amount.toLocaleString()} د.ع</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Financial Report */}
      <div id="printable-financial-report" className="hidden print:block w-full bg-white text-black pt-4 z-50 overflow-visible" dir="rtl">
         <PrintHeader 
           title="الكشف المالي للمخزن"
           stats={[
             { label: 'الرصيد المتاح بالمخزن', value: currentBalance.toLocaleString() },
             { label: 'المسحوبات للإدارة', value: adminWithdrawals.toLocaleString() },
             { label: 'مبالغ معلقة (عند المندوبين)', value: pendingAmount.toLocaleString() },
             { label: 'عدد العمليات', value: warehouseTransactions.length }
           ]}
         />

         {/* Report Table */}
         <table className="w-full text-center border-collapse mb-12 border-2 border-slate-500 text-sm">
            <thead>
               <tr className="border-b-2 border-black bg-slate-100">
                  <th className="p-2 font-black text-black border-l border-slate-300">التسلسل</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">رقم العملية</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">النوع</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">التفاصيل</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">التاريخ</th>
                  <th className="p-2 font-black text-black">المبلغ</th>
               </tr>
            </thead>
            <tbody>
               {warehouseTransactions.map((t, index) => {
                  const isNegative = t.fromEntity === 'warehouse';
                  return (
                    <tr key={t.id} className="border-b border-slate-300">
                        <td className="p-2 font-bold border-l border-slate-300">{warehouseTransactions.length - index}</td>
                        <td className="p-2 font-bold border-l border-slate-300 font-en">{t.id}</td>
                        <td className="p-2 font-bold border-l border-slate-300">{t.type === 'receipt' && isNegative ? 'سحب إدارة' : t.type === 'receipt' ? 'قبض' : t.type === 'payment' ? 'صرف' : 'تحويل'}</td>
                        <td className="p-2 font-bold border-l border-slate-300">{t.description}</td>
                        <td className="p-2 font-bold border-l border-slate-300 font-en text-slate-700">{new Date(t.timestamp).toLocaleDateString('ar-IQ')}</td>
                        <td className={`p-2 font-black font-en text-left dir-ltr ${isNegative ? 'text-red-700' : 'text-emerald-700'}`}>
                          {isNegative ? '(-) ' : '(+) '}
                          {t.amount.toLocaleString()} د.ع
                        </td>
                    </tr>
                 );
               })}
               {/* Totals */}
               <tr className="border-t-[3px] border-black bg-slate-100">
                  <td colSpan={5} className="p-3 font-black text-center border-l border-slate-300 text-lg">صافي رصيد المخزن المتاح:</td>
                  <td className="p-3 font-black text-slate-900 text-xl font-en text-left dir-ltr">
                     {currentBalance.toLocaleString()} د.ع
                  </td>
               </tr>
            </tbody>
         </table>

         {/* Signatures */}
         <div className="flex justify-between px-16 mt-20 pt-10 pb-10">
            <div className="text-center">
               <p className="font-black text-lg mb-12">مدير الفرع</p>
               <p className="text-black font-black">________________________</p>
            </div>
            <div className="text-center">
               <p className="font-black text-lg mb-12">التدقيق المالي</p>
               <p className="text-black font-black">________________________</p>
            </div>
         </div>
      </div>
    </div>
  );
}
