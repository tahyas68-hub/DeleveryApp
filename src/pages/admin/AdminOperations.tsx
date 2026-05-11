import React, { useState } from 'react';
import { Activity, Search, Package, Check, Clock, AlertTriangle, RotateCcw, Copy } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { OrderStatus } from '../../context/OrderContext';

type TabView = 'all' | 'driver_assigned' | 'returned_partial' | 'returned' | 'postponed';

export default function AdminOperations() {
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<TabView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionQuery, setActionQuery] = useState('');

  const filteredOrders = orders.filter(o => {
    if (activeTab !== 'all' && o.status !== activeTab) return false;
    if (searchQuery && !o.trackingNumber.includes(searchQuery) && !o.id.includes(searchQuery)) return false;
    return true;
  });

  const searchedOrder = actionQuery ? orders.find(o => o.trackingNumber === actionQuery || o.id === actionQuery) : null;

  const handleAction = (status: OrderStatus) => {
    if (searchedOrder) {
      updateOrderStatus(searchedOrder.id, status);
      setActionQuery('');
      alert(`تم تحويل حالة الطلب إلى: ${getStatusText(status)}`);
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'merchant_pending': return 'قيد الانتظار (تاجر)';
      case 'main_warehouse': return 'بالمخزن الرئيسي';
      case 'branch_transfering': return 'محول للفرع';
      case 'branch_warehouse': return 'بمخزن الفرع';
      case 'driver_assigned': return 'قيد التوصيل';
      case 'delivered': return 'تم التسليم';
      case 'returned_partial': return 'مسلم جزئياً';
      case 'returned': return 'راجع';
      case 'postponed': return 'مؤجل';
      default: return 'غير معروف';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'driver_assigned': return <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-bold border border-purple-100">قيد التوصيل</span>;
      case 'delivered': return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold border border-emerald-100">تم التسليم</span>;
      case 'returned_partial': return <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-xs font-bold border border-orange-100">مسلم جزئياً</span>;
      case 'returned': return <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold border border-red-100">راجع</span>;
      case 'postponed': return <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold border border-blue-100">مؤجل</span>;
      default: return <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-bold border border-slate-200">{getStatusText(status)}</span>;
    }
  };

  const tabs: { id: TabView, label: string, icon: any, count: number }[] = [
    { id: 'all', label: 'الطلبيات', icon: Package, count: orders.length },
    { id: 'driver_assigned', label: 'قيد التوصيل', icon: Activity, count: orders.filter(o => o.status === 'driver_assigned').length },
    { id: 'returned_partial', label: 'مسلمة جزئياً', icon: AlertTriangle, count: orders.filter(o => o.status === 'returned_partial').length },
    { id: 'returned', label: 'راجعة', icon: RotateCcw, count: orders.filter(o => o.status === 'returned').length },
    { id: 'postponed', label: 'مؤجلة', icon: Clock, count: orders.filter(o => o.status === 'postponed').length },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">بوابة العمليات</h1>
          <p className="text-slate-500 font-medium mt-1">إدارة حالات الطلبات والبحث السريع واجراء العمليات</p>
        </div>
      </div>
      
      {/* Action Area */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
         <div className="flex-1 w-full relative">
            <label className="block text-sm font-bold text-slate-700 mb-2">إجراء عملية على طلب</label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="أدخل رقم الطلب أو التتبع هنا..." 
                value={actionQuery}
                onChange={e => setActionQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-[#0F3B73] transition-colors font-bold text-right"
              />
            </div>
         </div>
         {searchedOrder && (
           <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                 <div>
                    <span className="text-xs font-bold text-slate-500 block">الطلب: <span className="font-en text-slate-800">{searchedOrder.trackingNumber}</span></span>
                    <span className="text-sm font-bold text-slate-800 mt-1 block">{searchedOrder.customerName}</span>
                 </div>
                 {getStatusBadge(searchedOrder.status)}
              </div>
              <div className="flex flex-wrap gap-2">
                 <button onClick={() => handleAction('delivered')} className="bg-[#E5F5D0] text-[#10b981] hover:bg-[#10b981] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    تسليم كامل
                 </button>
                 <button onClick={() => handleAction('returned_partial')} className="bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    مسلم جزئياً
                 </button>
                 <button onClick={() => handleAction('returned')} className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    راجع
                 </button>
                 <button onClick={() => handleAction('postponed')} className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    مؤجل
                 </button>
              </div>
           </div>
         )}
         {!searchedOrder && actionQuery && (
           <div className="flex-1 w-full bg-red-50 text-red-600 rounded-xl p-4 font-bold text-sm text-center border border-red-100">
              لم يتم العثور على الطلب
           </div>
         )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border transition-all text-right flex flex-col items-start gap-3 relative overflow-hidden ${
                isActive 
                  ? 'bg-[#0F3B73] border-[#0F3B73] text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#0F3B73]/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-slate-50'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold whitespace-nowrap">{tab.label}</div>
                <div className={`text-2xl font-black font-en tracking-tighter ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {tab.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="البحث في القائمة..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
             <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                 <th className="px-6 py-4 font-bold text-slate-600">رقم التتبع</th>
                 <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                 <th className="px-6 py-4 font-bold text-slate-600">التاجر</th>
                 <th className="px-6 py-4 font-bold text-slate-600">المندوب</th>
                 <th className="px-6 py-4 font-bold text-slate-600">الحالة</th>
                 <th className="px-6 py-4 font-bold text-slate-600 text-center">نسخ</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredOrders.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                       <Package className="w-12 h-12 text-slate-300 mx-auto w-full mb-3" />
                       <span className="text-slate-500 font-bold block">لا توجد طلبات في هذه القائمة</span>
                    </td>
                 </tr>
               ) : (
                 filteredOrders.map(order => (
                   <tr key={order.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-en font-bold text-slate-800">{order.trackingNumber}</td>
                     <td className="px-6 py-4 font-en text-slate-600">{order.id}</td>
                     <td className="px-6 py-4 font-bold text-slate-800">{order.merchantName}</td>
                     <td className="px-6 py-4 font-bold text-slate-600">{order.driverName || '-'}</td>
                     <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                     <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => {
                             navigator.clipboard.writeText(order.trackingNumber);
                             setActionQuery(order.trackingNumber);
                          }}
                          className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-[#0F3B73] transition-colors inline-block"
                          title="نسخ رقم التتبع"
                        >
                          <Copy className="w-4 h-4" />
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
