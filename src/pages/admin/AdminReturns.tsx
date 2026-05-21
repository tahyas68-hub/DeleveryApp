import React, { useState } from 'react';
import { Package, Search, ArrowRightLeft, Building2, Store } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useBranches } from '../../context/BranchContext';

export default function AdminReturns() {
  const { orders, updateOrderStatus } = useOrders();
  const { branches } = useBranches();
  
  // Fetch orders that are returned or partially returned AND are currently in the main warehouse
  const returnedOrders = orders.filter(o => 
    (o.status === 'returned' || o.status === 'returned_partial') &&
    o.branchName === 'المركز الرئيسي'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<Record<string, string>>({});

  const handleReturnToMerchant = (id: string) => {
    updateOrderStatus(id, 'returned_to_merchant');
    alert(`تم تحويل الطلب لتسليمه للتاجر`);
  };

  const handleTransferToBranch = (id: string) => {
    const branchName = selectedBranches[id];
    if (!branchName) {
      alert("الرجاء اختيار فرع للتحويل");
      return;
    }
    updateOrderStatus(id, 'branch_transfering', { branchName });
    alert(`تم تحويل الطلب إلى ${branchName}`);
  };

  const filteredOrders = returnedOrders.filter(o => {
    return o.id.includes(searchQuery) || o.merchantName.includes(searchQuery);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">رواجع الفروع</h1>
          <p className="text-slate-500 font-medium mt-1">عرض الطلبات الراجعة من الفروع لإرجاعها للتاجر أو تحويلها لفرع آخر</p>
        </div>
        <div className="flex items-center gap-4 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
           <Package className="w-5 h-5 text-red-600" />
           <div>
             <p className="text-xs font-bold text-red-600/80">طلبات راجعة</p>
             <p className="text-lg font-black text-red-700">{returnedOrders.length}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث برقم الطلب او اسم التاجر..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">تفاصيل العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ الكلي</th>
                <th className="px-6 py-4 font-bold text-slate-600">أجور التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الكمية</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">حالة الراجعة</th>
                <th className="px-6 py-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-bold">لا توجد طلبات راجعة</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-en font-bold text-[#0F3B73]">
                      <div>{order.id}</div>
                      <div className="text-xs text-slate-400">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.merchantName}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{order.customerName}</div>
                      <div className="text-xs text-slate-500 font-en">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{order.province}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[120px]">{order.address}</div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-slate-700 whitespace-nowrap">
                      {order.totalAmount?.toLocaleString() || (order.amount + (order.deliveryFee || 0)).toLocaleString()} د.ع
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-amber-600 whitespace-nowrap">{order.deliveryFee?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-emerald-600 whitespace-nowrap">
                      {order.amount?.toLocaleString()} د.ع
                      {(order.id.endsWith('-P') || order.remainingAmount !== undefined) && (
                        <div className="flex flex-col gap-1 mt-1 font-sans">
                          <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                            المبلغ المتبقي للراجع: {order.remainingAmount !== undefined ? order.remainingAmount.toLocaleString() : order.amount.toLocaleString()} د.ع
                          </span>
                          {order.receivedAmount !== undefined && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              تم استلام: {order.receivedAmount.toLocaleString()} د.ع
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-blue-600 text-center">{order.pieces}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                        {order.status === 'returned_partial' ? 'راجع جزئي' : 'راجع كلي'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-center justify-center">
                         {/* Return to Merchant */}
                         <button 
                           onClick={() => handleReturnToMerchant(order.id)}
                           className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 w-full transition-colors text-xs whitespace-nowrap border border-amber-200"
                         >
                           <Store className="w-3.5 h-3.5" /> راجع إلى التاجر
                         </button>

                         {/* Return to Branch */}
                         <div className="flex items-center w-full gap-1">
                           <select 
                             value={selectedBranches[order.id] || ''}
                             onChange={(e) => setSelectedBranches({...selectedBranches, [order.id]: e.target.value})}
                             className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-[#0F3B73]/20 bg-white"
                           >
                             <option value="">اختر الفرع...</option>
                             {branches.map(b => (
                               <option key={b.name} value={b.name}>{b.name}</option>
                             ))}
                           </select>
                           <button 
                             onClick={() => handleTransferToBranch(order.id)}
                             disabled={!selectedBranches[order.id]}
                             className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${selectedBranches[order.id] ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                             title="تحويل إلى الفرع"
                           >
                             <ArrowRightLeft className="w-4 h-4" />
                           </button>
                         </div>
                      </div>
                    </td>
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
