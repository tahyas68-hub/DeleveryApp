import React, { useState } from 'react';
import { DollarSign, Search, Building2, TrendingUp, Calendar, CheckCircle, FileText, X } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useBranches } from '../../context/BranchContext';
import { useFinance } from '../../context/FinanceContext';

export default function AdminBranchIncomes() {
  const { orders, updateOrderStatus } = useOrders();
  const { branches } = useBranches();
  const { addTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  // Calculate incomes per branch dynamically
  const transferredOrders = orders.filter(o => o.financialStatus === 'branch_transferred');
  const receivedOrders = orders.filter(o => o.financialStatus === 'admin_received' || o.financialStatus === 'merchant_paid');
  
  const branchIncomes = branches.map(branchInfo => {
    const branchName = branchInfo.name;
    const branchOrders = transferredOrders.filter(o => (o.branchName || 'غير محدد') === branchName);
    const historicalOrders = receivedOrders.filter(o => (o.branchName || 'غير محدد') === branchName);
    
    // Amount collected and transferred to admin (Pending Confirmation)
    const totalAmount = branchOrders.reduce((sum, o) => {
      const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.amount || 0);
      return sum + collected;
    }, 0);

    // Historical Confirmed Amount
    const historicalAmount = historicalOrders.reduce((sum, o) => {
      const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.amount || 0);
      return sum + collected;
    }, 0);

    const historicalDriverCommissions = historicalOrders.reduce((sum, o) => {
       const commission = o.driverCommissionStatus === 'paid' ? (o.driverCommission || 0) : 0;
       return sum + commission;
    }, 0);

    const historicalNetIncome = historicalAmount - historicalDriverCommissions;

    const driverCommissions = branchOrders.reduce((sum, o) => {
       // Only count commissions if they were paid at the branch
       const commission = o.driverCommissionStatus === 'paid' ? (o.driverCommission || 0) : 0;
       return sum + commission;
    }, 0);

    const deliveryFees = branchOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    const netIncome = totalAmount - driverCommissions;

    return {
      ...branchInfo,
      deliveredOrdersCount: branchOrders.length,
      branchOrders,
      totalAmount,
      driverCommissions,
      deliveryFees,
      netIncome,
      historicalNetIncome
    };
  });

  const filteredBranches = branchIncomes.filter(b => 
    b.name.includes(searchTerm) || b.city.includes(searchTerm) || b.manager.includes(searchTerm)
  );

  const grandTotal = branchIncomes.reduce((sum, b) => sum + b.netIncome, 0);

  const handleConfirmAdminReceipt = () => {
    if (!selectedBranch) return;
    
    // Add transaction
    addTransaction({
      type: 'receipt', // Changed back to receipt so Treasury picks it up
      amount: selectedBranch.netIncome,
      fromEntity: 'warehouse',
      toEntity: 'الحساب المالي للشركة', // To be logically consistent with admin treasury
      referenceId: `admin-receipt-${Date.now()}`,
      description: `تأكيد استلام موارد فرع ${selectedBranch.name}`,
      userId: 'admin'
    });

    // Update order status
    selectedBranch.branchOrders.forEach((o: any) => {
      updateOrderStatus(o.id, o.status, { financialStatus: 'admin_received' });
    });

    setSelectedBranch(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-[#0F3B73]" />
            واردات الفروع
          </h1>
          <p className="text-slate-500 mt-1 font-medium">متابعة المبالغ الواردة من كل فرع بشكل تفصيلي</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
             <DollarSign className="w-5 h-5 text-emerald-600" />
           </div>
           <div>
             <p className="text-xs font-bold text-emerald-600/80">إجمالي الواردات الكلي</p>
             <p className="text-xl font-black font-en">{grandTotal.toLocaleString()} <span className="text-sm">د.ع</span></p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="بحث باسم الفرع أو المدينة..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/20" 
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#0F3B73]/5 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">الفرع</th>
                <th className="px-6 py-4 font-bold text-slate-600">الطلبات الواصلة</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبالغ قيد التأكيد (وارد)</th>
                <th className="px-6 py-4 font-bold text-slate-600">تم استلامه مسبقاً (سحب)</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center flex-1">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold">لا توجد فروع مطابقة للبحث</td>
                </tr>
              ) : (
                filteredBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                           <Building2 className="w-4 h-4" />
                         </div>
                         {branch.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-slate-600">{branch.deliveredOrdersCount}</td>
                    <td className="px-6 py-4 font-en font-black text-[#0F3B73]">{branch.netIncome.toLocaleString()}</td>
                    <td className="px-6 py-4 font-en font-black text-emerald-600">{branch.historicalNetIncome.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => setSelectedBranch(branch)}
                          disabled={branch.netIncome <= 0 || branch.deliveredOrdersCount === 0}
                          className="flex items-center gap-1.5 bg-[#0F3B73] hover:bg-[#0A2A55] text-white px-3 py-2 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          تأكيد وقبض الواردات
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

      {/* Confirmation Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 bg-[#0F3B73]/5 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#0F3B73] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                مستند قبض واردات الفرع
              </h2>
              <button 
                onClick={() => setSelectedBranch(null)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <span className="text-slate-500 font-bold block mb-1">صافي وارد الصندوق من: {selectedBranch.name}</span>
                <span className="text-3xl font-black text-[#0F3B73] font-en">{selectedBranch.netIncome.toLocaleString()} <span className="text-sm font-sans">د.ع</span></span>
              </div>
              
              <div className="text-slate-600 text-sm font-bold bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>بانجاز هذه العملية يتم احتساب المبالغ المستحقة للتاجر وتكون جاهزة في شاشة (حسابات التجار)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={handleConfirmAdminReceipt}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-black transition-colors"
                >
                تأكيد العملية
              </button>
              <button 
                onClick={() => setSelectedBranch(null)}
                className="hidden sm:block px-6 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-3 rounded-xl font-bold transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
