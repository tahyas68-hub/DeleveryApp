import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { RotateCcw, CheckCircle, Search, Store } from 'lucide-react';
import { OrderTableHeaders, OrderTableCells } from '../../components/OrderTableCells';

export default function MerchantReturns() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Only show orders that have been returned by the company to this merchant
  const returnsFromCompany = orders.filter(
    (o) => o.merchantId === user?.id && o.status === 'returned_to_merchant'
  );

  const filteredOrders = returnsFromCompany.filter((o) =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, id]);
    } else {
      setSelectedOrders(prev => prev.filter(orderId => orderId !== id));
    }
  };

  const handleConfirmReceipt = (id: string) => {
    updateOrderStatus(id, 'merchant_received_return');
  };

  const handleBulkConfirmReceipt = () => {
    if (selectedOrders.length === 0) return;
    if (window.confirm(`هل أنت متأكد من تأكيد استلام ${selectedOrders.length} طلبات راجعة؟`)) {
      selectedOrders.forEach(id => {
        updateOrderStatus(id, 'merchant_received_return');
      });
      setSelectedOrders([]);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F3B73]">رواجع من الشركة</h1>
          <p className="text-slate-500 font-bold mt-1">
            الطلبات التي تم إرجاعها من قِبل الشركة وتنتظر تأكيد استلامك لها.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث في الرواجع..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/20 focus:border-[#0F3B73] transition-all font-medium text-slate-800"
            />
          </div>
          {selectedOrders.length > 0 && (
             <button 
               onClick={handleBulkConfirmReceipt}
               className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors active:scale-95 whitespace-nowrap"
             >
               <CheckCircle className="w-5 h-5" /> 
               تأكيد الاستلام ({selectedOrders.length})
             </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    className="w-4 h-4 rounded text-[#0F3B73] focus:ring-[#0F3B73] border-slate-300 cursor-pointer"
                  />
                </th>
                <OrderTableHeaders showMerchant={false} />
                <th className="px-6 py-4 font-bold text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500 font-bold">
                    لا توجد طلبات راجعة من الشركة قيد الانتظار حالياً
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors ${selectedOrders.includes(order.id) ? 'bg-[#0F3B73]/5' : ''}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        className="w-4 h-4 rounded text-[#0F3B73] focus:ring-[#0F3B73] border-slate-300 cursor-pointer"
                      />
                    </td>
                    <OrderTableCells order={order} showMerchant={false} />
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleConfirmReceipt(order.id)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg font-bold flex items-center gap-2 transition-colors border border-emerald-200"
                        title="تأكيد استلام الطلب من الشركة"
                      >
                        <CheckCircle className="w-4 h-4" />
                        تأكيد استلام
                      </button>
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
