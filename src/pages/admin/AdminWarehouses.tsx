import React, { useState } from 'react';
import { Package, Truck, Search, Plus, MapPin, Search as SearchIcon, ArrowLeftRight } from 'lucide-react';
import { dummyWarehouses } from '../../lib/extended-dummy';
import { useOrders } from '../../context/OrderContext';
import { useBranches } from '../../context/BranchContext';

export default function AdminWarehouses() {
  const { orders, updateOrderStatus } = useOrders();
  const { branches } = useBranches();
  
  const mainWarehouses = dummyWarehouses.filter(w => w.type === 'main');
  const mainOrders = orders.filter(o => o.status === 'main_warehouse');
  
  const [selectedBranches, setSelectedBranches] = useState<Record<string, string>>({});

  const handleTransferToBranch = (id: string) => {
    const branchName = selectedBranches[id];
    if (!branchName) {
      alert("الرجاء اختيار فرع للتحويل");
      return;
    }
    updateOrderStatus(id, 'branch_transfering', { branchName });
    alert(`تم تحويل الطلب إلى ${branchName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المستودعات</h1>
          <p className="text-slate-500">المستودعات الرئيسية والطاقة الاستيعابية.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainWarehouses.map(warehouse => {
             return (
              <div key={warehouse.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#0F3B73] text-white">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{warehouse.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5" /> {warehouse.city}
                    </div>
                  </div>
                </div>
              </div>
             );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <h2 className="text-xl font-bold text-slate-800">الطلبات في المخزن الرئيسي</h2>
           <p className="text-slate-500 mt-1">تخصيص الطلبات وتحويلها إلى الفروع</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">تفاصيل العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">العنوان</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ الكلي</th>
                <th className="px-6 py-4 font-bold text-slate-600">أجور التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الكمية</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات التحويل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mainOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center text-slate-300 font-bold text-lg">
                    لا توجد طلبات في المخزن الرئيسي حالياً
                  </td>
                </tr>
              ) : (
                mainOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
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
                    <td className="px-6 py-4 font-en font-bold text-slate-700 whitespace-nowrap">{o.totalAmount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-amber-600 whitespace-nowrap">{o.deliveryFee?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-emerald-600 whitespace-nowrap">{o.amount?.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-bold text-blue-600 text-center">{o.pieces}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                         <select 
                           className="border border-slate-200 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none w-40 text-slate-900 bg-white"
                           onChange={(e) => setSelectedBranches(prev => ({...prev, [o.id]: e.target.value}))}
                           value={selectedBranches[o.id] || ""}
                         >
                           <option value="" disabled>اختر الفرع...</option>
                           {branches.map(b => (
                             <option key={b.id} value={b.name}>{b.name}</option>
                           ))}
                         </select>
                         <button 
                           onClick={() => handleTransferToBranch(o.id)}
                           className="text-white bg-[#0F3B73] hover:bg-[#0F3B73]/90 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 whitespace-nowrap"
                         >
                           <ArrowLeftRight className="w-3.5 h-3.5" /> تحويل للفرع
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
