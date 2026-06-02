import React, { useState } from 'react';
import { DollarSign, Wallet, ArrowDownRight, ArrowUpRight, FileText, Download, LayoutDashboard, Store, Bike, History, Printer } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useFinance } from '../../context/FinanceContext';
import { motion, AnimatePresence } from 'motion/react';
import { PrintHeader } from '../../components/PrintHeader';

export default function AdminFinance() {
  const { orders, updateOrderStatus } = useOrders();
  const { transactions, addTransaction } = useFinance();
  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'drivers' | 'branches' | 'transactions'>('overview');

  interface MerchantStats {
    name: string;
    balance: number;
    pending: number;
    paid: number;
  }

  interface DriverStats {
    name: string;
    collected: number;
    commission: number;
    paid: number;
  }

  // Overview Stats
  const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial');
  
  const totalInbound = deliveredOrders.reduce((sum, o) => sum + (o.collectedAmount !== undefined ? o.collectedAmount : (o.amount || 0)), 0);
  const totalOutbound = deliveredOrders.reduce((sum, o) => sum + (o.merchantDue || 0) + (o.driverCommission || 0), 0);
  const totalCompanyProfit = totalInbound - totalOutbound;

  // Merchants Data
  const merchantBalances = orders.reduce((acc, order) => {
    if (!order.merchantId) return acc;
    if (!acc[order.merchantId]) acc[order.merchantId] = { name: order.merchantName, balance: 0, pending: 0, paid: 0 };
    
    if (order.financialStatus === 'merchant_paid') {
      acc[order.merchantId].paid += order.merchantDue || 0;
    } else if (order.status === 'delivered' || order.status === 'delivered_partial') {
      acc[order.merchantId].balance += order.merchantDue || 0; // Owed to merchant
    } else {
      acc[order.merchantId].pending += order.merchantDue || 0; // Not yet delivered
    }
    return acc;
  }, {} as Record<string, MerchantStats>);

  // Drivers Data
  const driverBalances = orders.reduce((acc, order) => {
    if (!order.driverId) return acc;
    if (!acc[order.driverId]) acc[order.driverId] = { name: order.driverName, collected: 0, commission: 0, paid: 0 };
    
    if (order.financialStatus === 'collected_from_driver' || order.financialStatus === 'merchant_paid' || order.financialStatus === 'branch_transferred') {
      acc[order.driverId].commission += order.driverCommission || 0;
    } else if (order.status === 'delivered' || order.status === 'delivered_partial') {
      acc[order.driverId].collected += (order.collectedAmount !== undefined ? order.collectedAmount : (order.amount || 0));
      acc[order.driverId].commission += (order.driverCommission || 0);
    }
    return acc;
  }, {} as Record<string, DriverStats>);

  const handlePayMerchant = (merchantId: string, merchantName: string, amount: number) => {
    if (amount <= 0) {
      alert("لا يوجد رصيد جاهز للسحب");
      return;
    }
    if (window.confirm(`هل أنت متأكد من إنشاء سند صرف للتاجر بقيمة ${amount}؟`)) {
      // Create transaction
      addTransaction({
        type: 'payment',
        amount: amount,
        fromEntity: 'شركة',
        toEntity: merchantName,
        referenceId: `MERCHANT-PAY-${merchantId}`,
        userId: 'admin',
        description: 'تصفية حساب تاجر'
      });
      // Update all delivered orders for this merchant to 'merchant_paid'
      orders.filter(o => o.merchantId === merchantId && (o.status === 'delivered' || o.status === 'delivered_partial') && o.financialStatus !== 'merchant_paid')
            .forEach(o => updateOrderStatus(o.id, o.status, { financialStatus: 'merchant_paid' }));
      alert("تم إنشاء سند الصرف وتحديث حالة الطلبات");
    }
  };

  const handleReceiveFromDriver = (driverId: string, driverName: string, amount: number) => {
     if (amount <= 0) {
      alert("لا يوجد مبلغ محصل بذمة المندوب");
      return;
    }
    if (window.confirm(`هل أنت متأكد من إنشاء سند قبض من المندوب بقيمة ${amount}؟`)) {
      addTransaction({
        type: 'receipt',
        amount: amount,
        fromEntity: driverName,
        toEntity: 'شركة',
        referenceId: `DRIVER-RECV-${driverId}`,
        userId: 'admin',
        description: 'استلام مبالغ من المندوب'
      });
      orders.filter(o => o.driverId === driverId && (o.status === 'delivered' || o.status === 'delivered_partial') && (o.financialStatus === 'collected_from_driver' || o.financialStatus === 'pending'))
            .forEach(o => updateOrderStatus(o.id, o.status, { financialStatus: 'company_received' }));
      alert("تم استلام القاصة من المندوب بنجاح");
    }
  };

  const handlePayDriverCommission = (driverId: string, driverName: string, amount: number) => {
    if (amount <= 0) {
      alert("لا توجد عمولات مستحقة");
      return;
    }
    if (window.confirm(`هل أنت متأكد من إنشاء سند صرف عمولة للمندوب بقيمة ${amount}؟`)) {
      addTransaction({
        type: 'payment',
        amount: amount,
        fromEntity: 'شركة',
        toEntity: driverName,
        referenceId: `DRIVER-COMM-${driverId}`,
        userId: 'admin',
        description: 'تصفية عمولات مندوب'
      });
      // In a real app we'd track "driver_commission_paid" boolean on the order, but we can't easily overwrite financialStatus if it's "merchant_paid" vs "company_received".
      // We will skip fully marking order as driver_commission_paid to avoid overwriting merchant status, unless we have a separate boolean 'isDriverCommissionPaid'.
      alert("تم إنشاء سند صرف لعمولة المندوب");
    }
  };

  return (
    <div className="space-y-6 text-sm" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-[#0F3B73]">النظام المالي الشامل</h1>
          <p className="text-slate-500 font-medium mt-1">دورة الأموال، القيود المحاسبية، والتقارير</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setTimeout(() => window.print(), 100)}
             className="flex items-center gap-2 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-colors"
          >
            <Printer className="w-5 h-5" />
            طباعة التقرير المالي
          </button>
        </div>
      </div>

      {/* Category Cards Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'overview', label: 'نظرة عامة', desc: 'ملخص مالي شامل', icon: LayoutDashboard, activeBg: 'bg-blue-600', activeBorder: 'border-blue-600', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', shadow: 'shadow-blue-600/20' },
          { id: 'merchants', label: 'كشوفات التجار', desc: 'حسابات وتسويات التجار', icon: Store, activeBg: 'bg-emerald-600', activeBorder: 'border-emerald-600', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', shadow: 'shadow-emerald-600/20' },
          { id: 'drivers', label: 'عهد ومناديب', desc: 'ذمم وعمولات المناديب', icon: Bike, activeBg: 'bg-orange-600', activeBorder: 'border-orange-600', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', shadow: 'shadow-orange-600/20' },
          { id: 'transactions', label: 'السجل المالي', desc: 'حركة الأموال والقيود', icon: History, activeBg: 'bg-purple-600', activeBorder: 'border-purple-600', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', shadow: 'shadow-purple-600/20' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`relative overflow-hidden text-right p-5 rounded-[24px] border-2 transition-all duration-300 flex flex-col gap-3 ${
              activeTab === t.id 
                ? `${t.activeBorder} ${t.activeBg} shadow-xl ${t.shadow} transform -translate-y-1` 
                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              activeTab === t.id ? 'bg-white/20 text-white' : `${t.iconBg} ${t.iconColor}`
            }`}>
              <t.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-black text-lg ${activeTab === t.id ? 'text-white' : 'text-slate-800'}`}>
                {t.label}
              </h3>
              <p className={`text-xs font-bold mt-1 ${activeTab === t.id ? 'text-white/80' : 'text-slate-400'}`}>
                {t.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                 <p className="text-slate-500 font-bold mb-2">أرباح الشركة المحققة</p>
                 <h3 className="text-3xl font-black font-en text-[#0F3B73]">{totalCompanyProfit.toLocaleString()} د.ع</h3>
                 <div className="absolute top-6 left-6 w-12 h-12 bg-blue-50 text-[#0F3B73] rounded-2xl flex items-center justify-center">
                   <Wallet className="w-6 h-6" />
                 </div>
              </div>
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
                 <p className="text-emerald-700 font-bold mb-2">إجمالي المقبوضات</p>
                 <h3 className="text-3xl font-black font-en text-emerald-800">{totalInbound.toLocaleString()}</h3>
                 <div className="absolute top-6 left-6 w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center">
                   <ArrowDownRight className="w-6 h-6" />
                 </div>
              </div>
              <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm relative overflow-hidden">
                 <p className="text-red-700 font-bold mb-2">إجمالي المصروفات</p>
                 <h3 className="text-3xl font-black font-en text-red-800">{totalOutbound.toLocaleString()}</h3>
                 <div className="absolute top-6 left-6 w-12 h-12 bg-white text-red-600 rounded-2xl flex items-center justify-center">
                   <ArrowUpRight className="w-6 h-6" />
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'merchants' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#0F3B73]/5 text-[#0F3B73] font-bold">
                  <tr>
                    <th className="px-6 py-4">التاجر</th>
                    <th className="px-6 py-4 text-orange-600">قيد التوصيل (المتوقع)</th>
                    <th className="px-6 py-4 text-emerald-600">الرصيد الجاهز للسحب</th>
                    <th className="px-6 py-4 text-slate-500">تم صرفه مسبقاً</th>
                    <th className="px-6 py-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(merchantBalances).map(([id, data]) => {
                    const merchantData = data as MerchantStats;
                    return (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-800">{merchantData.name}</td>
                        <td className="px-6 py-4 font-en text-orange-600">{merchantData.pending.toLocaleString()}</td>
                        <td className="px-6 py-4 font-en font-black text-emerald-600">{merchantData.balance.toLocaleString()}</td>
                        <td className="px-6 py-4 font-en text-slate-500">{merchantData.paid.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                           <button onClick={() => handlePayMerchant(id, merchantData.name, merchantData.balance)} className="bg-[#0F3B73] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90">
                              سند صرف للتاجر
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#0F3B73]/5 text-[#0F3B73] font-bold">
                  <tr>
                    <th className="px-6 py-4">المندوب</th>
                    <th className="px-6 py-4 text-emerald-600">المبلغ بنذمة المندوب (المحصل)</th>
                    <th className="px-6 py-4 text-blue-600">عمولات مستحقة</th>
                    <th className="px-6 py-4 text-slate-500">تم صرفه مسبقاً</th>
                    <th className="px-6 py-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(driverBalances).map(([id, data]) => {
                    const driverData = data as DriverStats;
                    return (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-800">{driverData.name}</td>
                        <td className="px-6 py-4 font-en font-black text-emerald-600">{driverData.collected.toLocaleString()}</td>
                        <td className="px-6 py-4 font-en text-blue-600">{driverData.commission.toLocaleString()}</td>
                        <td className="px-6 py-4 font-en text-slate-500">{driverData.paid.toLocaleString()}</td>
                        <td className="px-6 py-4 justify-center flex gap-2">
                           <button onClick={() => handleReceiveFromDriver(id, driverData.name, driverData.collected)} className="bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90">
                              سند قبض من المندوب
                           </button>
                           <button onClick={() => handlePayDriverCommission(id, driverData.name, driverData.commission)} className="bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90">
                              سند صرف عمولة
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-3">رقم السند</th>
                    <th className="px-6 py-3">النوع</th>
                    <th className="px-6 py-3">المبلغ</th>
                    <th className="px-6 py-3">من</th>
                    <th className="px-6 py-3">إلى</th>
                    <th className="px-6 py-3">رقم الطلب</th>
                    <th className="px-6 py-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.length === 0 ? (
                    <tr>
                       <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">لا توجد حركات مالية مسجلة</td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-en text-slate-500 text-xs">{t.id}</td>
                        <td className="px-6 py-4">
                          {t.type === 'receipt' && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">سند قبض</span>}
                          {t.type === 'payment' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded">سند صرف</span>}
                          {t.type === 'transfer' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">سند تحويل</span>}
                        </td>
                        <td className="px-6 py-4 font-en font-black text-slate-800">{t.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">{t.fromEntity}</td>
                        <td className="px-6 py-4">{t.toEntity}</td>
                        <td className="px-6 py-4 font-en">{t.referenceId}</td>
                        <td className="px-6 py-4 font-en text-slate-500 text-xs">{new Date(t.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Printable Financial Report */}
      <div id="printable-financial-report" className="hidden print:block w-full bg-white text-black pt-4 z-50 overflow-visible" dir="rtl">
         <PrintHeader 
           title="التقرير المالي للإدارة"
           stats={[
             { label: 'أرباح الشركة المحققة', value: totalCompanyProfit.toLocaleString() },
             { label: 'إجمالي المقبوضات', value: totalInbound.toLocaleString() },
             { label: 'إجمالي المصروفات', value: totalOutbound.toLocaleString() },
             { label: 'عدد الحركات', value: transactions.length }
           ]}
         />

         <table className="w-full text-center border-collapse mb-12 border-2 border-slate-500 text-sm">
            <thead>
               <tr className="border-b-2 border-black bg-slate-100">
                  <th className="p-2 font-black text-black border-l border-slate-300">رقم السند</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">النوع</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">من</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">إلى</th>
                  <th className="p-2 font-black text-black border-l border-slate-300">التاريخ</th>
                  <th className="p-2 font-black text-black">المبلغ</th>
               </tr>
            </thead>
            <tbody>
               {transactions.map((t, index) => (
                    <tr key={t.id} className="border-b border-slate-300">
                        <td className="p-2 font-bold border-l border-slate-300 font-en text-slate-700">{t.id}</td>
                        <td className="p-2 font-bold border-l border-slate-300">
                           {t.type === 'receipt' ? 'قبض' : t.type === 'payment' ? 'صرف' : 'تحويل'}
                        </td>
                        <td className="p-2 font-bold border-l border-slate-300">{t.fromEntity}</td>
                        <td className="p-2 font-bold border-l border-slate-300">{t.toEntity}</td>
                        <td className="p-2 font-bold border-l border-slate-300 font-en">{new Date(t.timestamp).toLocaleDateString('ar-IQ')}</td>
                        <td className="p-2 font-black text-slate-900 font-en">{(t.amount || 0).toLocaleString()}</td>
                    </tr>
               ))}
               <tr className="border-t-[3px] border-black bg-slate-100">
                  <td colSpan={5} className="p-2 font-black text-center border-l border-slate-300 text-lg">صافي الحركة</td>
                  <td className="p-2 font-black text-slate-900 text-xl font-en">{(totalInbound - totalOutbound).toLocaleString()}</td>
               </tr>
            </tbody>
         </table>

         <div className="flex justify-between px-16 mt-20 pt-10 pb-10">
            <div className="text-center">
               <p className="font-black text-lg mb-12">المدير المالي</p>
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
