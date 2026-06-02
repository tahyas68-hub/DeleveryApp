import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  History, 
  FileText, 
  Check, 
  X, 
  Wrench, 
  Coins, 
  Printer, 
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useUsers } from '../../context/UserContext';
import { useFinance } from '../../context/FinanceContext';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { PrintHeader } from '../../components/PrintHeader';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminMerchantAccounts() {
  const { users, addUser, updateUser } = useUsers();
  const { transactions, addTransaction } = useFinance();
  const { orders, updateOrderStatus } = useOrders();
  const { companyName, companyLogo } = useSettings();

  const merchants = users.filter(u => u.role === 'merchant');

  // Interactive Modals State
  const [ledgerMerchant, setLedgerMerchant] = useState<any | null>(null);
  const [settleMerchant, setSettleMerchant] = useState<any | null>(null);
  const [activePrintMerchant, setActivePrintMerchant] = useState<any | null>(null);
  
  // Form States for Settlement
  const [settleAmount, setSettleAmount] = useState<number>(0);
  const [settleDescription, setSettleDescription] = useState<string>('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  const merchantsWithDynamicBalance = merchants.map(m => {
    const merchantOrders = orders.filter(
      (o) => (o.merchantId === m.id || o.merchantName === m.name) && 
      ['delivered', 'delivered_partial', 'returned_partial'].includes(o.status)
    );

    // Calculate dynamic balance from orders with financialStatus === 'admin_received'
    const dynamicBalance = merchantOrders.reduce((sum, o) => {
      // Only pay merchant if HQ has received the funds, OR if there's legacy missing financialStatus context
      if (o.financialStatus === 'admin_received' || (o.financialStatus !== 'merchant_paid' && o.financialStatus !== 'pending' && o.financialStatus !== 'collected_from_driver' && o.financialStatus !== 'branch_transferred')) {
        const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.totalAmount || o.amount || 0);
        const fee = o.deliveryFee || 0;
        const net = o.merchantDue !== undefined ? o.merchantDue : (collected - fee);
        return sum + net;
      }
      return sum;
    }, 0);

    return {
      ...m,
      dynamicBalance
    };
  });

  // Handle open settlement modal
  const openSettlement = (merchant: any) => {
    setSettleMerchant(merchant);
    setSettleAmount(merchant.dynamicBalance || 0);
    setSettleDescription(`تصفية حساب التاجر: ${merchant.name}`);
  };

  // 2. Submit Settlement
  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleMerchant) return;

    if (settleAmount <= 0) {
      alert('الرجاء إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (settleAmount > (settleMerchant.dynamicBalance || 0)) {
      alert('الرصيد غير كاف لعمل هذه التسوية بهذه القيمة');
      return;
    }

    // Add a payout payment transaction inside company finances
    addTransaction({
      type: 'payment',
      amount: settleAmount,
      fromEntity: 'الحساب المالي للشركة',
      toEntity: settleMerchant.name,
      referenceId: `settlement-${Date.now()}`,
      userId: settleMerchant.id,
      description: settleDescription || 'تسوية حساب التاجر'
    });

    // Update orders statuses
    orders
      .filter((o) => {
        const isTarget = (o.merchantId === settleMerchant.id || o.merchantName === settleMerchant.name);
        const isDelivered = ['delivered', 'delivered_partial', 'returned_partial'].includes(o.status);
        const isReadyForPayment = o.financialStatus === 'admin_received' || (o.financialStatus !== 'merchant_paid' && o.financialStatus !== 'pending' && o.financialStatus !== 'collected_from_driver' && o.financialStatus !== 'branch_transferred');
        return isTarget && isDelivered && isReadyForPayment;
      })
      .forEach(o => updateOrderStatus(o.id, o.status, { financialStatus: 'merchant_paid' }));

    // Legacy update to user profile balance
    const newBalance = Math.max(0, (settleMerchant.balance || 0) - settleAmount);
    updateUser(settleMerchant.id, {
      balance: newBalance,
      lastClearance: new Date().toLocaleDateString('ar-IQ')
    });

    alert(`تمت عملية التسوية بنجاح وصرف مبلغ ${settleAmount.toLocaleString()} د.ع للتاجر`);
    setSettleMerchant(null);
  };

  // 3. Fix Financial Errors (إصلاح الأخطاء المالية)
  const handleFixFinancialErrors = () => {
    let fixCount = 0;
    merchants.forEach((m) => {
      // Find all completed (delivered) orders for this merchant
      const merchantOrders = orders.filter(
        (o) => (o.merchantId === m.id || o.merchantName === m.name) && 
        ['delivered', 'delivered_partial', 'returned_partial'].includes(o.status)
      );

      // Sum values of completed orders for the merchant
      const totalEarned = merchantOrders.reduce((sum, o) => {
        const isReadyForPayment = o.financialStatus === 'admin_received' || o.financialStatus === 'merchant_paid' || (o.financialStatus !== 'pending' && o.financialStatus !== 'collected_from_driver' && o.financialStatus !== 'branch_transferred');
        if (isReadyForPayment) {
          const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.totalAmount || o.amount || 0);
          const fee = o.deliveryFee || 0;
          const net = o.merchantDue !== undefined ? o.merchantDue : (collected - fee);
          return sum + net;
        }
        return sum;
      }, 0);

      // Get all settlements paid to this merchant from transactions log
      const merchantPayments = transactions.filter(
        (t) => t.userId === m.id && t.type === 'payment'
      );
      const totalPaid = merchantPayments.reduce((sum, t) => sum + (t.amount || 0), 0);

      const calculatedBalance = Math.max(0, totalEarned - totalPaid);

      // If there's a mismatch or if the current balance was never initialized, correct it
      if (typeof m.balance === 'undefined' || m.balance !== calculatedBalance) {
        updateUser(m.id, { balance: calculatedBalance });
        fixCount++;
      }
    });

    alert(`تم فحص قيود الحسابات بنجاح. تم تعديل وأرشفة فروقات الأرصدة لـ (${fixCount}) من التجار بناءً على حالة تسليم وصولات الطلبات الفعالة.`);
  };

  // Trigger Print for specific merchant statement
  const handlePrintStatement = (merchant: any) => {
    setActivePrintMerchant(merchant);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Filter merchants based on search
  const filteredMerchants = merchantsWithDynamicBalance.filter(
    (m) =>
      m.name.includes(searchTerm) ||
      (m.phone && m.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 text-sm" dir="rtl">
      {/* MODAL: Print Statement Preview & Print Mode Layout */}
      <AnimatePresence>
        {activePrintMerchant && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto p-4 flex items-center justify-center print:static print:p-0 print:bg-white print:overflow-visible">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-5xl w-full p-8 text-black print:shadow-none print:border-none print:p-0 print:rounded-none flex flex-col relative max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible"
              dir="rtl"
            >
              {/* On-screen Header Actions (hidden in print) */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F3B73]/10 text-[#0F3B73] rounded-xl flex items-center justify-center">
                    <Printer className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#0F3B73] text-base">معاينة كشف الحساب المالي</h3>
                    <p className="text-slate-400 font-bold text-xs">يمكنك طباعة الكشف أو تصديره للمستلم</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setTimeout(() => {
                        window.print();
                      }, 50);
                    }}
                    className="bg-[#0F3B73] hover:bg-[#0c2f5c] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الكشف الرسمي</span>
                  </button>
                  <button 
                    onClick={() => setActivePrintMerchant(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                     إغلاق المعاينة
                  </button>
                </div>
              </div>

              {/* Printable Statement Layout (Matches screenshot 1 layout) */}
              <div className="w-full bg-white text-black p-2 print:p-0">
                {/* Upper Section */}
                <div className="flex flex-row justify-between items-start gap-4 mb-4">
                  {/* Left Column: Print Info / Button (Visual counterpart of screenshot) */}
                  <div className="flex flex-col items-start text-right">
                    {/* On-screen visual placeholder button to look exactly like the screenshot */}
                    <button 
                      onClick={() => {
                        setTimeout(() => window.print(), 100);
                      }}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-md flex items-center gap-2 mb-3 print:hidden transition-all cursor-pointer"
                    >
                      طباعة الكشف الرسمي
                    </button>
                    {/* Just visual box on print */}
                    <div className="hidden print:block bg-[#2563EB] text-white px-5 py-2 rounded-lg font-bold text-xs mb-3">
                      طباعة الكشف الرسمي
                    </div>

                    <div className="space-y-1 text-slate-500 font-bold text-xs font-en">
                      <div>تاريخ الإصدار: <span className="text-black font-black">{new Date().toLocaleDateString('ar-IQ')}</span></div>
                      <div>رقم الكشف: <span className="text-black font-black">1779357946</span></div>
                      <div>الصفحة: <span className="text-black font-black">1 من 1</span></div>
                    </div>
                  </div>

                  {/* Middle Title */}
                  <div className="text-center flex-1 self-center">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">كشف حساب مالي (للتاجر)</h1>
                    <p className="text-slate-500 font-bold text-sm mt-1">سجل المستحقات المالية عن الطلبات المسلمة</p>
                  </div>

                  {/* Right Column: Logo header */}
                  <div className="flex items-center gap-3">
                    <div className="text-left font-sans">
                      <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1">
                        {companyName}
                      </h2>
                      <p className="text-[10px] text-slate-400 font-bold">شحن مالي سريع وآمن لجميع المحافظات</p>
                    </div>
                    {/* Fast delivery truck logo markup matching screenshot */}
                    <div className="relative w-16 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-1">
                      {companyLogo ? (
                         <img src={companyLogo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <>
                          <div className="absolute right-1 top-2 w-3 h-[2px] bg-amber-500"></div>
                          <div className="absolute right-0.5 top-3.5 w-4 h-[2px] bg-amber-500"></div>
                          <div className="absolute right-1.5 top-5 w-2.5 h-[2px] bg-amber-500"></div>
                          <svg width="40" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 transform translate-x-1">
                            <rect x="2" y="7" width="13" height="9" rx="2" fill="#F59E0B" stroke="#F59E0B" />
                            <path d="M15 9h3.5a1.5 1.5 0 0 1 1 1.5l1.5 2.5a2 2 0 0 1 .5 1V16h-6V9z" fill="#F59E0B" stroke="#F59E0B" />
                            <circle cx="6.5" cy="18.5" r="2.5" fill="black" />
                            <circle cx="16.5" cy="18.5" r="2.5" fill="black" />
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Solid Divider Line */}
                <div className="border-t-[3px] border-[#0F3B73] my-6" />

                {/* Info Boxes Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Box 1 (Right): Merchant info (covers col-span-2) */}
                  <div className="md:col-span-2 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#0F3B73] font-black text-sm">اسم المتجر / التاجر:</span>
                      <span className="text-slate-800 font-black text-base">{activePrintMerchant.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#0F3B73] font-black text-sm">رقم الهاتف:</span>
                      <span className="text-slate-700 font-bold text-base font-en">{activePrintMerchant.phone || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Box 2 (Left): Account status */}
                  <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                      <span className="text-[#0F3B73] font-black text-sm">حالة الحساب:</span>
                      <span className={`font-black text-base ${activePrintMerchant.balance > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                        {activePrintMerchant.balance > 0 ? 'كشف ذمة غير مسدد' : 'كشف مسدد بالكامل'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orders Statement Table */}
                <div className="overflow-hidden border border-slate-200 rounded-2xl mb-8">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-3 font-black text-slate-700 text-xs text-center border-l border-slate-200">#</th>
                        <th className="p-3 font-black text-slate-700 text-xs text-center border-l border-slate-200">رقم الطلب</th>
                        <th className="p-3 font-black text-slate-700 text-xs text-center border-l border-slate-200">اسم العميل</th>
                        <th className="p-3 font-black text-slate-700 text-xs text-center border-l border-slate-200">التاريخ</th>
                        <th className="p-3 font-black text-slate-700 text-xs text-center border-l border-slate-200">المبلغ المحصل</th>
                        <th className="p-3 font-black text-slate-700 text-xs text-center border-l border-slate-200">أجور التوصيل</th>
                        <th className="p-3 font-black text-slate-700 text-xs text-center">الصافي للتاجر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {orders
                        .filter(o => {
                          const isTarget = (o.merchantId === activePrintMerchant.id || o.merchantName === activePrintMerchant.name);
                          const isDelivered = ['delivered', 'delivered_partial', 'returned_partial'].includes(o.status);
                          const isReadyForPayment = o.financialStatus === 'admin_received' || (o.financialStatus !== 'merchant_paid' && o.financialStatus !== 'pending' && o.financialStatus !== 'collected_from_driver' && o.financialStatus !== 'branch_transferred');
                          return isTarget && isDelivered && isReadyForPayment;
                        })
                        .length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 font-bold text-sm">
                            لا توجد طلبات مسلمة ومكتملة جاهزة للصرف في هذا الكشف
                          </td>
                        </tr>
                      ) : (
                        orders
                          .filter(o => {
                            const isTarget = (o.merchantId === activePrintMerchant.id || o.merchantName === activePrintMerchant.name);
                            const isDelivered = ['delivered', 'delivered_partial', 'returned_partial'].includes(o.status);
                            const isReadyForPayment = o.financialStatus === 'admin_received' || (o.financialStatus !== 'merchant_paid' && o.financialStatus !== 'pending' && o.financialStatus !== 'collected_from_driver' && o.financialStatus !== 'branch_transferred');
                            return isTarget && isDelivered && isReadyForPayment;
                          })
                          .map((o, idx) => {
                            const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.totalAmount || o.amount || 0);
                            const fee = o.deliveryFee || 0;
                            const net = o.merchantDue !== undefined ? o.merchantDue : (collected - fee);
                            return (
                              <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-bold border-l border-slate-100 text-slate-600 text-xs">{idx + 1}</td>
                                <td className="p-3 font-bold border-l border-slate-100 text-slate-800 font-en text-xs">{o.id}</td>
                                <td className="p-3 font-bold border-l border-slate-100 text-slate-800 text-xs">{o.customerName}</td>
                                <td className="p-3 font-bold border-l border-slate-100 text-slate-500 font-en text-xs">{o.date ? o.date.split('T')[0] : 'N/A'}</td>
                                <td className="p-3 font-bold border-l border-slate-100 text-slate-700 font-en text-xs">{collected.toLocaleString()}</td>
                                <td className="p-3 font-bold border-l border-slate-100 text-slate-600 font-en text-xs">{fee.toLocaleString()}</td>
                                <td className="p-3 font-black text-emerald-600 font-en text-xs">{net.toLocaleString()}</td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footers Cards Block (Bottom-left equivalent, with matching company/theme color) */}
                <div className="flex justify-end gap-4 mt-6">
                  {/* Card 1: Total Collected */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 w-52 text-center flex flex-col justify-center items-center">
                    <span className="text-slate-400 font-black text-xs block mb-1">إجمالي المبالغ المحصلة</span>
                    <span className="text-slate-800 font-black text-2xl font-en">
                      {orders
                        .filter(o => {
                          const isTarget = (o.merchantId === activePrintMerchant.id || o.merchantName === activePrintMerchant.name);
                          const isDelivered = ['delivered', 'delivered_partial', 'returned_partial'].includes(o.status);
                          const isReadyForPayment = o.financialStatus === 'admin_received' || (o.financialStatus !== 'merchant_paid' && o.financialStatus !== 'pending' && o.financialStatus !== 'collected_from_driver' && o.financialStatus !== 'branch_transferred');
                          return isTarget && isDelivered && isReadyForPayment;
                        })
                        .reduce((sum, o) => {
                          const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.totalAmount || o.amount || 0);
                          return sum + collected;
                        }, 0)
                        .toLocaleString()}
                    </span>
                  </div>

                  {/* Card 2: Net amount due to pay */}
                  <div className="bg-[#0F3B73] text-white rounded-2xl p-5 w-60 text-center flex flex-col justify-center items-center shadow-lg shadow-[#0F3B73]/10">
                    <span className="text-slate-200/90 font-black text-xs block mb-1">صافي المبلغ المستحق للدفع</span>
                    <span className="text-white font-black text-2xl font-en">
                      {(activePrintMerchant.balance || 0).toLocaleString()} <span className="text-xs font-sans font-black mr-0.5">د.ع</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Signatures section for printable view */}
                <div className="hidden print:flex justify-between px-12 mt-16 pt-6 pb-2 border-t border-slate-100">
                  <div className="text-center">
                    <p className="font-black text-xs text-slate-600 mb-10">توقيع المستلم للتاجر</p>
                    <p className="text-slate-400 text-xs">________________________</p>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-xs text-slate-600 mb-10">المدير المالي والتدقيق</p>
                    <p className="text-slate-400 text-xs">________________________</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Layout Screen Content */}
      <div className="space-y-6 print:hidden">
        {/* Title and Fix Button - EXACT format of the screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">حسابات التجار</h1>
            <p className="text-slate-500 font-medium mt-1.5 text-base">إدارة مستحقات التجار وتسوية الحسابات</p>
          </div>
          <div>
            <button 
              onClick={handleFixFinancialErrors}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all w-full sm:w-auto"
            >
              <Wrench className="w-5 h-5 shrink-0" />
              <span>إصلاح الأخطاء المالية</span>
            </button>
          </div>
        </div>

        {/* Unified Table Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
          {/* Header toolbar for search */}
          <div className="p-6 border-b border-slate-50/80 flex gap-4 bg-[#0F3B73]/5">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="البحث باسم المتجر أو رقم الهاتف للتصفية المباشرة..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 pl-12 text-slate-700 font-bold placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/20" 
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#0F3B73]/5 border-b border-slate-100/50">
                  <th className="px-8 py-5 text-slate-500 font-black text-[15px] tracking-wide w-1/3">التاجر / المتجر</th>
                  <th className="px-6 py-5 text-slate-500 font-black text-[15px] tracking-wide text-center">رقم الهاتف</th>
                  <th className="px-6 py-5 text-slate-500 font-black text-[15px] tracking-wide text-center">المستحق (للتاجر)</th>
                  <th className="px-8 py-5 text-slate-500 font-black text-[15px] tracking-wide text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMerchants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-bold text-lg">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#0F3B73]" />
                      لا يوجد تجار مسجلين حالياً
                    </td>
                  </tr>
                ) : (
                  filteredMerchants.map((merchant) => {
                    const balance = merchant.dynamicBalance || 0;
                    return (
                      <tr key={merchant.id} className="hover:bg-slate-50/50 transition-all group">
                        {/* Name Column */}
                        <td className="px-8 py-6 font-black text-[#0F3B73] text-lg">
                          <div className="flex flex-col items-start gap-1">
                            <span className="hover:underline cursor-pointer">{merchant.name}</span>
                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs mt-0.5">
                              <Store className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{merchant.storeAddress || 'منصة التوصيل'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone Column */}
                        <td className="px-6 py-6 font-en font-bold text-slate-700 text-center text-[15px]">
                          {merchant.phone || '-'}
                        </td>

                        {/* Due Column */}
                        <td className="px-6 py-6 text-center">
                          {balance <= 0 ? (
                            <span className="text-emerald-500 font-black text-base bg-emerald-50/80 px-4 py-1.5 rounded-full inline-block">لا يوجد</span>
                          ) : (
                            <div className="inline-flex flex-col items-center">
                              <span className="text-[#EF4444] font-black text-xl font-en">
                                {balance.toLocaleString()} د.ع
                              </span>
                              <span className="text-[#EF4444]/70 font-bold text-[11px] mt-1">مطلوب سداده</span>
                            </div>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-3">
                            {/* Option 1: Payout Settle (Green) */}
                            {balance > 0 && (
                              <button 
                                onClick={() => openSettlement(merchant)}
                                className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-sm shrink-0 whitespace-nowrap shadow-sm active:scale-95"
                              >
                                <Coins className="w-4 h-4 shrink-0" />
                                <span>تسوية (دفع)</span>
                              </button>
                            )}

                            {/* Option 2: Statement (Blue) */}
                            <button 
                              onClick={() => handlePrintStatement(merchant)}
                              className="bg-[#2B6CB0] hover:bg-[#1E40AF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-sm shrink-0 whitespace-nowrap shadow-sm active:scale-95"
                            >
                              <FileText className="w-4 h-4 shrink-0" />
                              <span>كشف</span>
                            </button>

                            {/* Option 3: Ledger History (Dark Slate) */}
                            <button 
                              onClick={() => setLedgerMerchant(merchant)}
                              className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-sm shrink-0 whitespace-nowrap shadow-sm active:scale-95"
                            >
                              <History className="w-4 h-4 shrink-0" />
                              <span>سجل</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: Ledger/History Modal (Matches screenshot 2 layout) */}
      <AnimatePresence>
        {ledgerMerchant && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col text-right font-sans"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]">
                <button 
                  onClick={() => setLedgerMerchant(null)}
                  className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-black text-white">سجل طلبات التاجر: {ledgerMerchant.name}</h3>
              </div>

              {/* Body table wrapper */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-[#0F172A]">
                <div className="bg-white rounded-2xl p-4 shadow-inner border border-slate-800/10">
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">رقم الطلب</th>
                          <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">العميل</th>
                          <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">المبلغ المحصل</th>
                          <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">أجرة التوصيل</th>
                          <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">الصافي للتاجر</th>
                          <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">الحالة</th>
                          <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100 font-sans">تمت التسوية؟</th>
                          <th className="px-4 py-3 font-black text-slate-700 text-xs font-sans">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const merchantActiveOrders = orders.filter(
                            (o) => o.merchantId === ledgerMerchant.id || o.merchantName === ledgerMerchant.name
                          );

                          if (merchantActiveOrders.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="py-12 text-center text-slate-400 font-bold text-sm">
                                  لا توجد طلبات مسلمة مسجلة
                                </td>
                              </tr>
                            );
                          }

                          return merchantActiveOrders.map((o) => {
                            const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.totalAmount || o.amount || 0);
                            const fee = o.deliveryFee || 0;
                            const net = o.merchantDue !== undefined ? o.merchantDue : (collected - fee);
                            const isSettled = o.financialStatus === 'merchant_paid';

                            const getArabicStatus = (status: string) => {
                              switch (status) {
                                case 'merchant_pending': return 'قيد الانتظار';
                                case 'main_warehouse': return 'المستودع الرئيسي';
                                case 'branch_transfering': return 'جاري نقل الفرع';
                                case 'branch_warehouse': return 'مستودع الفرع';
                                case 'driver_assigned': return 'خرج مع المندوب';
                                case 'delivered': return 'واصل كلي';
                                case 'delivered_partial': return 'واصل جزئي';
                                case 'returned_partial': return 'راجع جزئي';
                                case 'returned': return 'راجع كلي';
                                case 'returned_to_merchant': return 'راجع للتاجر';
                                case 'postponed': return 'مؤجل';
                                default: return status;
                              }
                            };

                            return (
                              <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-bold font-en text-slate-800 text-xs">{o.id}</td>
                                <td className="px-4 py-3 font-bold text-slate-700 text-xs">{o.customerName}</td>
                                <td className="px-4 py-3 font-bold font-en text-slate-700 text-xs">{collected.toLocaleString()}</td>
                                <td className="px-4 py-3 font-bold font-en text-slate-600 text-xs">{fee.toLocaleString()}</td>
                                <td className="px-4 py-3 font-black font-en text-emerald-600 text-xs">{net.toLocaleString()}</td>
                                <td className="px-4 py-3 font-bold text-xs">{getArabicStatus(o.status)}</td>
                                <td className="px-4 py-3 font-bold text-xs">
                                  {isSettled ? (
                                    <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-sans">نعم</span>
                                  ) : (
                                    <span className="text-red-500 bg-red-50 px-2.5 py-1 rounded-full text-[11px] font-sans">لا</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-bold font-en text-slate-500 text-xs">
                                  {o.date ? o.date.split('T')[0] : 'N/A'}
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-4 border-t border-slate-800 flex justify-end bg-[#1E293B]">
                <button 
                  onClick={() => setLedgerMerchant(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2 rounded-xl transition-all cursor-pointer"
                >
                  إغلاق السجل
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Settlement Payment Modal */}
      <AnimatePresence>
        {settleMerchant && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-right font-sans"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-black text-emerald-900">تسوية رصيد وصرف مستحقات للتاجر</h3>
                </div>
                <button 
                  onClick={() => setSettleMerchant(null)}
                  className="p-1 hover:bg-emerald-100 rounded-full transition-all text-emerald-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSettleSubmit} className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-slate-400 font-bold text-xs block">إجمالي الرصيد المستحق المتوفر للتاجر</span>
                  <span className="text-[#EF4444] font-black text-2xl font-en block">
                    {(settleMerchant.balance || 0).toLocaleString()} د.ع
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold text-xs">قيمة المبلغ المراد صرفه وتسويته (د.ع)</label>
                  <input 
                    type="number" 
                    max={settleMerchant.balance || 0}
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(parseInt(e.target.value) || 0)}
                    placeholder="أدخل قيمة الصرف"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-en font-black text-slate-800 text-lg text-center focus:bg-white focus:border-emerald-500 hover:border-slate-300 outline-none transition-all"
                    required
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold px-1 mt-1">
                    <span>الرصيد المتبقي بعد العملية:</span>
                    <span className="font-en text-slate-600">
                      {Math.max(0, (settleMerchant.balance || 0) - settleAmount).toLocaleString()} د.ع
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold text-xs font-sans">بيان وتفاصيل الصرف (سند الصرف)</label>
                  <input 
                    type="text" 
                    value={settleDescription}
                    onChange={(e) => setSettleDescription(e.target.value)}
                    placeholder="مثال: تسوية دفعة ووصولات التوصيل المالي"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-right text-slate-800 focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setSettleMerchant(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                  >
                    إلغاء العملية
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#10B981] hover:bg-[#059669] text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <Check className="w-5 h-5" />
                    <span>تأكيد الدفع والتسوية</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
