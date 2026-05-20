import React, { useState } from 'react';
import { Package, Search, Warehouse, CheckCircle, ArrowRightLeft, Store } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useBranches } from '../../context/BranchContext';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export default function MainWarehouse() {
  const { orders, updateOrderStatus } = useOrders();
  const { branches } = useBranches();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'returned'>('new');
  const [selectedBranches, setSelectedBranches] = useState<Record<string, string>>({});

  const mainWarehouseOrders = orders.filter(o => o.status === 'main_warehouse');
  const returnedOrders = orders.filter(o => 
    (o.status === 'returned' || o.status === 'returned_partial') && 
    o.branchName === 'المركز الرئيسي'
  );

  const displayedOrders = activeTab === 'new' ? mainWarehouseOrders : returnedOrders;

  const filteredOrders = displayedOrders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.id.toLowerCase().includes(q) || 
           o.trackingNumber?.toLowerCase().includes(q) || 
           o.customerName?.toLowerCase().includes(q) || 
           o.customerPhone?.includes(q) ||
           o.merchantName?.toLowerCase().includes(q);
  });

  const handleTransferToBranch = (id: string, customBranch?: string) => {
    if (customBranch) {
      updateOrderStatus(id, 'branch_transfering', { branchName: customBranch });
      alert(`تم تحويل الطلب إلى ${customBranch}`);
    } else {
      updateOrderStatus(id, 'branch_transfering');
    }
  };

  const handleReturnToMerchant = (id: string) => {
    updateOrderStatus(id, 'returned_to_merchant');
    alert('تم تحويل الطلب لتسليمه للتاجر');
  };

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-slate-800">المخزن الرئيسي</h1>
        <p className="text-slate-500 font-medium mt-1">الطلبات المستلمة من التجار أو الراجعة من الفروع والجاهزة للتحويل</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute left-0 bottom-0 opacity-10 transform -translate-x-4 translate-y-4">
            <Warehouse className="w-32 h-32 text-white" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
               <Package className="w-7 h-7 text-white" />
             </div>
             <div>
               <h3 className="text-white font-bold text-lg">طلبات واردة</h3>
               <div className="text-white font-black text-3xl mt-1 tracking-tight">{mainWarehouseOrders.length}</div>
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute left-0 bottom-0 opacity-10 transform -translate-x-4 translate-y-4">
            <ArrowRightLeft className="w-32 h-32 text-white" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
               <Package className="w-7 h-7 text-white" />
             </div>
             <div>
               <h3 className="text-white font-bold text-lg">طلبات راجعة</h3>
               <div className="text-white font-black text-3xl mt-1 tracking-tight">{returnedOrders.length}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('new')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 ${
            activeTab === 'new' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          الطلبات الجديدة المستلمة
        </button>
        <button
          onClick={() => setActiveTab('returned')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'returned' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          الرواجع المستلمة من الفروع
          {returnedOrders.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{returnedOrders.length}</span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mt-4">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <Warehouse className="w-5 h-5 text-blue-600" />
             {activeTab === 'new' ? 'الطلبات الحالية في المخزن' : 'الطلبات الراجعة في المخزن'}
           </h2>
           <div className="relative w-full sm:w-64">
             <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="البحث في الطلبات..." 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-xl py-2 pr-10 pl-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm"
             />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الشحنة</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">المحافظة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                    {activeTab === 'new' ? 'لا يوجد طلبات في المخزن الرئيسي حالياً' : 'لا يوجد طلبات راجعة في المخزن حالياً'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold font-en text-[#0F3B73]">{(o.id || '').slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600 font-en">{o.trackingNumber || '-'}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{o.merchantName}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{o.customerName}</div>
                      <div className="text-xs font-en text-slate-500">{o.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">{o.province}</td>
                    <td className="px-6 py-4">
                      {activeTab === 'new' ? (
                        <div className="flex justify-center">
                          <button 
                            onClick={() => handleTransferToBranch(o.id)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            تحويل للفرع
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                           <button 
                             onClick={() => handleReturnToMerchant(o.id)}
                             className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors text-xs border border-amber-200"
                           >
                             <Store className="w-4 h-4" /> 
                             إرجاع إلى التاجر
                           </button>

                           <div className="flex items-center gap-1">
                             <select 
                               value={selectedBranches[o.id] || ''}
                               onChange={(e) => setSelectedBranches({...selectedBranches, [o.id]: e.target.value})}
                               className="border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0F3B73]/20 bg-white text-xs w-28 font-bold"
                             >
                               <option value="">اختر الفرع...</option>
                               {branches.map(b => (
                                 <option key={b.name} value={b.name}>{b.name}</option>
                               ))}
                             </select>
                             <button 
                               onClick={() => {
                                 const branchName = selectedBranches[o.id];
                                 if (!branchName) {
                                   alert('الرجاء اختيار فرع للتحويل');
                                   return;
                                 }
                                 handleTransferToBranch(o.id, branchName);
                               }}
                               disabled={!selectedBranches[o.id]}
                               className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${selectedBranches[o.id] ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                               title="تحويل إلى الفرع"
                             >
                               <ArrowRightLeft className="w-4 h-4" />
                             </button>
                           </div>
                        </div>
                      )}
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
