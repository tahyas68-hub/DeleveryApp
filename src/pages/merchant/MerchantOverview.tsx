import React from 'react';
import { 
  ClipboardList, CheckSquare, Clock, XSquare, PackageSearch, PackageMinus, 
  Calculator, Receipt, PackageCheck, FileText, CheckCircle2, AlertCircle, RefreshCcw,
  Plus, FileDown, Layers, CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export default function MerchantOverview() {
  const { user } = useAuth();
  const { orders } = useOrders();
  
  const latestOrders = orders.slice(0, 5);

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'returned').length;
  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] -m-4 lg:-m-8 p-6 md:p-10 space-y-10 text-right overflow-x-hidden" dir="rtl">
      {/* Welcome Header */}
      <div className="relative pr-6 pt-4">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0F3B73] rounded-full"></div>
        <p className="text-slate-400 font-bold mb-2 text-sm">نظرة عامة</p>
        <h1 className="text-5xl font-black text-[#0F3B73] tracking-tight">مرحباً، {user?.name || 'التاجر'}</h1>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1"></div>
        <div className="lg:col-span-1"></div>
        
        {/* Active Orders Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between group hover:border-[#0F3B73]/30 transition-all shadow-xl">
           <div className="text-right">
              <p className="text-slate-400 font-bold text-sm mb-1">طلبات نشطة</p>
              <h2 className="text-4xl font-black text-[#0F3B73] font-en tracking-tighter">{activeOrdersCount}</h2>
           </div>
           <div className="w-16 h-16 bg-[#0F3B73]/5 rounded-2xl flex items-center justify-center">
              <PackageSearch className="w-8 h-8 text-[#0F3B73]" />
           </div>
        </div>

        {/* Completed Orders Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-xl">
           <div className="text-right">
              <p className="text-slate-400 font-bold text-sm mb-1">طلبات مكتملة</p>
              <h2 className="text-4xl font-black text-[#0F3B73] font-en tracking-tighter">{completedOrdersCount}</h2>
           </div>
           <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
           </div>
        </div>
      </div>

      {/* Quick Actions Title */}
      <div className="flex justify-start">
        <h2 className="text-2xl font-black text-[#0F3B73]">العمليات السريعة</h2>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Link 
          to="/merchant/orders?action=add" 
          className="bg-[#0F3B73] hover:bg-opacity-95 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-white stroke-[3px]" />
          </div>
          <h3 className="text-white font-black text-xl md:text-2xl mb-2">إضافة طلب</h3>
          <p className="text-white/80 font-bold text-sm md:text-base">بدء شحنة جديدة</p>
        </Link>

        <button 
          className="bg-[#10b981] hover:bg-emerald-600 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden w-full"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <FileDown className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-black text-xl md:text-2xl mb-2">استيراد إكسل</h3>
          <p className="text-white/80 font-bold text-sm md:text-base">رفع طلبات متعددة</p>
        </button>

        <Link 
          to="/merchant/orders" 
          className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-md transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <div className="w-16 h-16 bg-[#0F3B73]/5 rounded-2xl flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-[#0F3B73]" />
          </div>
          <h3 className="text-[#0F3B73] font-black text-xl md:text-2xl mb-2">جميع الطلبات</h3>
          <p className="text-slate-400 font-bold text-sm md:text-base">متابعة كافة الشحنات</p>
        </Link>

        <Link 
          to="/merchant/finance" 
          className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-md transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-[#0F3B73] font-black text-xl md:text-2xl mb-2">كشف الحساب</h3>
          <p className="text-slate-400 font-bold text-sm md:text-base">المبالغ والتحصيلات</p>
        </Link>
      </div>

      {/* Latest Orders Section */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl bg-white mt-10">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#0F3B73]">أحدث الطلبات</h2>
            <Link to="/merchant/orders" className="text-[#0F3B73] font-bold text-sm hover:underline">
              عرض الكل
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#0F3B73]/5 rounded-xl">
                <tr>
                  <th className="px-6 py-4 text-[#0F3B73] font-black text-xs uppercase rounded-r-xl w-32">رقم الطلب</th>
                  <th className="px-6 py-4 text-[#0F3B73] font-black text-xs uppercase w-40">رقم الشحنة</th>
                  <th className="px-6 py-4 text-[#0F3B73] font-black text-xs uppercase">العميل</th>
                  <th className="px-6 py-4 text-[#0F3B73] font-black text-xs uppercase rounded-l-xl w-48">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-black text-slate-800">#{order.id}</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-500">{order.trackingNumber}</td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-800">{order.customerName}</span>
                    </td>
                    <td className="px-6 py-5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
                {latestOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-bold">
                      لا توجد طلبات حديثة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
