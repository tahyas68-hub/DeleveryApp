import React from 'react';
import { 
  Package, LayoutDashboard, Plus, FileDown, 
  Layers, CreditCard, MessageCircle, ArrowRight,
  TrendingUp, CheckCircle2, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MerchantOverview() {
  const { user } = useAuth();
  const latestOrders = [
    { id: '10017', tracking: '20260429-6', customer: 'G', phone: '07829928152', status: 'delivered' },
    { id: '10016', tracking: '20260429-5', customer: 'L', phone: '0774 220 5072', status: 'delivered' },
    { id: '10014', tracking: '20260429-3', customer: 'K', phone: '0770 441 5611', status: 'returned' },
    { id: '10013', tracking: '20260429-2', customer: 'L', phone: '07812152878', status: 'pending' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered':
        return <span className="bg-[#E5F5D0]/10 text-[#10b981] px-4 py-1.5 rounded-full font-bold text-xs">تم التسليم</span>;
      case 'pending':
        return <span className="bg-amber-100/10 text-amber-500 px-4 py-1.5 rounded-full font-bold text-xs">قيد التسليم</span>;
      case 'returned':
        return <span className="text-slate-400 font-bold text-xs whitespace-nowrap">راجع من مندوب (بانتظار سحب)</span>;
      default:
        return <span className="text-slate-500 text-xs">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] -m-4 lg:-m-8 p-6 md:p-10 space-y-10 text-right overflow-x-hidden" dir="rtl">
      {/* Welcome Header */}
      <div className="relative pr-6 pt-4">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0F3B73] rounded-full"></div>
        <p className="text-slate-400 font-bold mb-2 text-sm">نظرة عامة</p>
        <h1 className="text-5xl font-black text-[#0F3B73] tracking-tight">مرحباً، {user?.name || 'بوتيك نايا'}</h1>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1"></div>
        <div className="lg:col-span-1"></div>
        
        {/* Active Orders Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between group hover:border-[#0F3B73]/30 transition-all shadow-xl">
           <div className="text-right">
              <p className="text-slate-400 font-bold text-sm mb-1">طلبات نشطة</p>
              <h2 className="text-4xl font-black text-[#0F3B73] font-en tracking-tighter">3</h2>
           </div>
           <div className="w-16 h-16 bg-[#0F3B73]/5 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-[#0F3B73]" />
           </div>
        </div>

        {/* Completed Orders Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-xl">
           <div className="text-right">
              <p className="text-slate-400 font-bold text-sm mb-1">طلبات مكتملة</p>
              <h2 className="text-4xl font-black text-[#0F3B73] font-en tracking-tighter">13</h2>
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
        {/* Add Order */}
        <Link 
          to="/merchant/orders?action=add" 
          className="bg-[#0F3B73] hover:bg-opacity-95 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-white stroke-[3px]" />
          </div>
          <h3 className="text-white font-black text-3xl mb-3">إضافة طلب</h3>
          <p className="text-white/80 font-bold text-lg">بدء شحنة جديدة</p>
        </Link>

        {/* Excel Import */}
        <button 
          className="bg-[#10b981] hover:bg-emerald-600 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <FileDown className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-white font-black text-3xl mb-3">استيراد إكسل</h3>
          <p className="text-white/80 font-bold text-lg">رفع طلبات متعددة</p>
        </button>

        {/* All Orders */}
        <Link 
          to="/merchant/orders" 
          className="bg-white border border-slate-200 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-lg transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <div className="w-20 h-20 bg-[#0F3B73]/5 rounded-2xl flex items-center justify-center mb-6">
            <Layers className="w-10 h-10 text-[#0F3B73]" />
          </div>
          <h3 className="text-[#0F3B73] font-black text-3xl mb-3">جميع الطلبات</h3>
          <p className="text-slate-400 font-bold text-lg">متابعة كافة الشحنات</p>
        </Link>

        {/* Account Statement */}
        <Link 
          to="/merchant/finance" 
          className="bg-white border border-slate-200 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-lg transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-[#0F3B73] font-black text-3xl mb-3">كشف الحساب</h3>
          <p className="text-slate-400 font-bold text-lg">المبالغ والتحصيلات</p>
        </Link>
      </div>

      {/* Latest Orders Section */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl bg-white mt-10">
        <div className="px-10 py-8 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-2xl font-black text-[#0F3B73]">أحدث الطلبات</h2>
          <Link to="/merchant/orders" className="text-[#0F3B73] font-bold hover:underline">
            عرض الكل
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-10 py-6 text-slate-400 font-black text-xs uppercase">رقم الطلب</th>
                <th className="px-10 py-6 text-slate-400 font-black text-xs uppercase">رقم الشحنة</th>
                <th className="px-10 py-6 text-slate-400 font-black text-xs uppercase">العميل</th>
                <th className="px-10 py-6 text-slate-400 font-black text-xs uppercase">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {latestOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-7 font-black text-slate-800 text-lg">#{order.id}</td>
                  <td className="px-10 py-7 font-en font-bold text-slate-500 text-lg">{order.tracking}</td>
                  <td className="px-10 py-7">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold text-slate-800 text-lg">{order.customer}</span>
                      <div className="flex items-center gap-1.5 text-slate-400 font-en font-bold text-sm">
                        <MessageCircle className="w-4 h-4 text-[#10b981]" />
                        <span>{order.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
