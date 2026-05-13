import React, { useState } from 'react';
import { Wallet, Package, MapPin, Calendar, CheckCircle2, PercentCircle, FileText, ChevronDown, Check, TrendingUp, Printer, ChevronRight } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';

export default function DriverPerformance() {
  const { orders } = useOrders();
  
  const [dateFilter, setDateFilter] = useState('تقرير اليوم');
  
  // Filter only the delivered orders (either fully or partially)
  const liabilityOrders = orders.filter(o => o.status === 'delivered' || o.status === 'returned_partial');

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-4 sm:px-0 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-right">
          <h1 className="text-xl font-black text-slate-800 leading-tight">
            تقارير الأداء<br/>الشخصي
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <h2 className="font-bold text-slate-800 text-lg leading-tight">ali</h2>
            <p className="text-slate-500 text-sm font-medium mt-0.5">مندوب توصيل</p>
          </div>
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
            A
          </div>
        </div>
      </div>

      {/* Print Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button 
          onClick={() => window.location.href = '/driver/commission-report'}
          className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors shadow-sm w-full"
        >
          <div className="text-right flex-1">
            <p className="font-bold text-sm">طباعة كشف المندوب</p>
          </div>
          <Printer className="w-8 h-8 text-blue-600 opacity-80" />
        </button>

        <button 
          onClick={() => window.location.href = '/driver/commission-report'}
          className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors shadow-sm w-full"
        >
          <div className="text-right flex-1">
            <p className="font-bold text-sm">طباعة تقرير: كشف عمولة مندوب</p>
          </div>
          <FileText className="w-8 h-8 text-blue-600 opacity-80" />
        </button>
      </div>

      {/* Selectors */}
      <div className="space-y-3 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="relative">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 appearance-none font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-right"
            dir="rtl"
          >
            <option>تقرير اليوم</option>
            <option>يوم أمس</option>
            <option>هذا الأسبوع</option>
            <option>آخر 7 أيام</option>
            <option>هذا الشهر</option>
            <option>هذا العام (سنوي)</option>
            <option>فترة مخصصة</option>
          </select>
          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Delivered Stat */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div className="w-[52px] h-[52px] bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <div className="text-right">
            <p className="text-slate-600 font-bold text-[15px] mb-2 leading-tight">تم<br/>التوصيل</p>
            <p className="text-[40px] font-black font-en text-slate-800 leading-none mt-1">{liabilityOrders.length}</p>
          </div>
        </div>

        {/* Total Orders Stat */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div className="w-[52px] h-[52px] bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-8 h-8 stroke-[3]" />
          </div>
          <div className="text-right">
            <p className="text-slate-600 font-bold text-[15px] mb-2 leading-tight">إجمالي<br/>الطلبيات</p>
            <p className="text-[40px] font-black font-en text-slate-800 leading-none mt-1">{orders.length}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
