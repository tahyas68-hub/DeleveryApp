import React, { useState } from 'react';
import { DollarSign, Search, Building2, TrendingUp, Calendar } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useBranches } from '../../context/BranchContext';

export default function AdminBranchIncomes() {
  const { orders } = useOrders();
  const { branches } = useBranches();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate incomes per branch
  const branchIncomes = branches.map(branch => {
    const branchOrders = orders.filter(o => 
      o.branchName === branch.name &&
      o.financialStatus === 'branch_transferred'
    );
    
    // Amount collected and transferred to admin
    const totalAmount = branchOrders.reduce((sum, o) => {
      const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.amount || 0);
      return sum + collected;
    }, 0);

    const driverCommissions = branchOrders.reduce((sum, o) => {
       // Only count commissions if they were paid at the branch
       const commission = o.driverCommissionStatus === 'paid' ? (o.driverCommission || 0) : 0;
       return sum + commission;
    }, 0);

    const deliveryFees = branchOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    const netIncome = totalAmount - driverCommissions;

    return {
      ...branch,
      deliveredOrdersCount: branchOrders.length,
      totalAmount,
      driverCommissions,
      deliveryFees,
      netIncome
    };
  });

  const filteredBranches = branchIncomes.filter(b => 
    b.name.includes(searchTerm) || b.city.includes(searchTerm) || b.manager.includes(searchTerm)
  );

  const grandTotal = branchIncomes.reduce((sum, b) => sum + b.netIncome, 0);

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
                <th className="px-6 py-4 font-bold text-slate-600">المدينة</th>
                <th className="px-6 py-4 font-bold text-slate-600">الطلبات الواصلة</th>
                <th className="px-6 py-4 font-bold text-slate-600">إجمالي المبالغ</th>
                <th className="px-6 py-4 font-bold text-slate-600">عمولات المناديب المصروفة</th>
                <th className="px-6 py-4 font-bold text-slate-600">صافي وارد الصندوق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">لا توجد فروع مطابقة للبحث</td>
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
                    <td className="px-6 py-4 font-bold text-slate-600">{branch.city}</td>
                    <td className="px-6 py-4 font-en font-bold text-slate-600">{branch.deliveredOrdersCount}</td>
                    <td className="px-6 py-4 font-en font-bold text-emerald-600">{branch.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 font-en font-bold text-red-500">{branch.driverCommissions.toLocaleString()}</td>
                    <td className="px-6 py-4 font-en font-black text-[#0F3B73]">{branch.netIncome.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
