import React, { useState } from 'react';
import { Package, ArrowDown, Building2, Bike, Search, TableProperties, Trash2 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';
import { OrderStatus } from '../../context/OrderContext';

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { 
      id: 'main_warehouse', 
      label: 'طلبات في المخزن الرئيسي', 
      desc: 'تسليم للمخزن',
      count: orders.filter(o => o.status === 'merchant_pending' || o.status === 'main_warehouse').length, 
      icon: ArrowDown, 
      colors: 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] ring-[#3b82f6]' 
    },
    { 
      id: 'branch_transfering', 
      label: 'طلبات قيد التوصيل', 
      desc: 'تسليم للفرع',
      count: orders.filter(o => o.status === 'branch_transfering' || o.status === 'branch_warehouse').length, 
      icon: Building2, 
      colors: 'bg-gradient-to-br from-[#10b981] to-[#059669] ring-[#10b981]' 
    },
    { 
      id: 'driver_assigned', 
      label: 'طلبات لدى المندوب', 
      desc: 'تسليم للمندوب',
      count: orders.filter(o => o.status === 'driver_assigned').length, 
      icon: Bike, 
      colors: 'bg-gradient-to-br from-[#f59e0b] to-[#d97706] ring-[#f59e0b]' 
    },
  ];

  const handleAction = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab !== 'all') {
      if (activeTab === 'main_warehouse' && o.status !== 'merchant_pending' && o.status !== 'main_warehouse') return false;
      if (activeTab === 'branch_transfering' && o.status !== 'branch_transfering' && o.status !== 'branch_warehouse') return false;
      if (activeTab === 'driver_assigned' && o.status !== 'driver_assigned') return false;
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(q) || 
             o.trackingNumber?.toLowerCase().includes(q) || 
             o.customerName?.toLowerCase().includes(q) || 
             o.customerPhone?.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-slate-800">شاشة الطلبات</h1>
        <p className="text-slate-500 font-medium mt-1">إعداد وتسليم الطلبات للحالات المختلفة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isActive = activeTab === stat.id;
          return (
            <button
              key={stat.id}
              onClick={() => setActiveTab(isActive ? 'all' : stat.id)}
              className={`relative overflow-hidden p-6 rounded-3xl flex flex-row items-center justify-start gap-4 transition-all duration-300 ${stat.colors} ${
                isActive 
                  ? 'ring-4 ring-offset-2 ring-offset-slate-50 scale-[1.02] shadow-xl' 
                  : 'hover:scale-[1.02] shadow-md opacity-90 hover:opacity-100'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-sm border border-white/20 z-10">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-right flex-1 z-10">
                <h3 className="text-lg sm:text-xl font-black text-white">{stat.label}</h3>
                <p className="text-white/90 font-bold text-xs sm:text-sm mt-1 bg-black/20 px-3 py-1 rounded-full inline-block backdrop-blur-md">{stat.count} طلب</p>
              </div>
              {/* Optional background decoration */}
              <div className="absolute left-0 bottom-0 opacity-10 transform -translate-x-4 translate-y-4 pointer-events-none">
                <Icon className="w-32 h-32 text-white" />
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-8 mb-4 flex justify-between items-end">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
           <TableProperties className="w-6 h-6 text-blue-600" />
           {activeTab === 'all' && 'جميع الطلبات'}
           {activeTab === 'main_warehouse' && 'جدول طلبات في المخزن الرئيسي'}
           {activeTab === 'branch_transfering' && 'جدول طلبات قيد التوصيل'}
           {activeTab === 'driver_assigned' && 'جدول طلبات لدى المندوب'}
        </h2>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
           <div className="relative">
             <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="البحث برقم الطلب، أو الهاتف، أو اسم العميل..." 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
             />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">التاريخ</th>
                <th className="px-6 py-4 font-bold text-slate-600">العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ</th>
                <th className="px-6 py-4 font-bold text-slate-600">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">لا يوجد طلبات مطابقة</td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold font-en text-[#0F3B73]">{o.trackingNumber || o.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500 font-en">{o.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{o.customerName}</div>
                      <div className="text-xs font-en text-slate-500">{o.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 font-bold font-en text-slate-800">
                      {o.amount?.toLocaleString()} د.ع
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4">
                      {o.status === 'merchant_pending' && (
                        <button onClick={() => handleAction(o.id, 'main_warehouse')} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-2">
                          تأكيد للمخزن الرئيسي
                        </button>
                      )}
                      {(o.status === 'main_warehouse' || o.status === 'branch_transfering') && (
                        <button onClick={() => handleAction(o.id, 'branch_warehouse')} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-2">
                          تأكيد للفرع
                        </button>
                      )}
                      {o.status === 'branch_warehouse' && (
                        <button onClick={() => handleAction(o.id, 'driver_assigned')} className="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-2">
                          تأكيد للمندوب
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذه العملية.')) {
                            deleteOrder(o.id);
                          }
                        }}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-1.5 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer shadow-sm border border-red-100 align-middle"
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
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
