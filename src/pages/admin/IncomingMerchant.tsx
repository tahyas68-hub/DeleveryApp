import React, { useState, useMemo } from 'react';
import { Package, Search, Calendar, CheckSquare, XCircle, ArrowLeft, Printer, CheckIcon } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

export default function IncomingMerchant() {
  const { orders, updateOrderStatus } = useOrders();
  const incomingOrders = orders.filter(o => o.status === 'merchant_pending');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return incomingOrders;
    const query = searchQuery.toLowerCase();
    return incomingOrders.filter(o => 
      o.id.toLowerCase().includes(query) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query)) ||
      o.merchantName.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query)
    );
  }, [incomingOrders, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleReceive = (id: string) => {
    updateOrderStatus(id, 'main_warehouse');
    alert("تم الاستلام وتحويل الطلب إلى المخزن الرئيسي");
  };

  const handleReceiveSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`هل أنت متأكد من استلام ${selectedIds.length} طلبات إلى المخزن الرئيسي؟`)) {
      selectedIds.forEach(id => updateOrderStatus(id, 'main_warehouse'));
      setSelectedIds([]);
      alert("تمت عملية الاستلام بنجاح!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">الشحنات الواردة من التاجر</h1>
          <p className="text-slate-500 font-medium mt-1">
            مراجعة واستلام الشحنات الواردة من التاجر إلى المخزن الرئيسي
          </p>
        </div>
        {selectedIds.length > 0 && (
          <button 
            onClick={handleReceiveSelected}
            className="bg-[#0F3B73] hover:bg-[#154b8f] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <CheckSquare className="w-5 h-5" />
            استلام {selectedIds.length} طلبات محددة
          </button>
        )}
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="بحث برقم الشحنة أو التاجر..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                      checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">تفاصيل العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ الكلي</th>
                <th className="px-6 py-4 font-bold text-slate-600">أجور التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">الكمية (طرود)</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20 text-center text-slate-300 font-bold text-lg">
                    لا توجد شحنات مطابقة
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(o.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                          checked={selectedIds.includes(o.id)}
                          onChange={() => handleToggleSelect(o.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-[#0F3B73]">
                      <div>{o.id}</div>
                      <div className="text-xs text-slate-400">{o.date}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{o.merchantName}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{o.customerName}</div>
                      <div className="text-xs text-slate-500 font-en">{o.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{o.province}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[120px]">{o.address}</div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-slate-700">{o.totalAmount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-amber-600">{o.deliveryFee?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-emerald-600">{o.amount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-blue-600 text-center">{o.pieces}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold border border-orange-100 whitespace-nowrap">استلام من التاجر</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          to={`/admin/print-sticker/${o.id}`}
                          target="_blank"
                          className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                          title="طباعة الستكر"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleReceive(o.id)}
                          className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors whitespace-nowrap"
                        >
                          استلام
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
    </div>
  );
}
