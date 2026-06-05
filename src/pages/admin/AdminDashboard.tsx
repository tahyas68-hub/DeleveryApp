import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Package, AlertCircle, Truck, Star, Warehouse, Building2, CheckSquare, PackageCheck, XSquare, RefreshCcw, PackageMinus, Clock } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

const data: any[] = [];

const StatCard = ({ title, value, subValue, icon: Icon, trend, trendUp, titleColor, textColor='text-primary', subTextColor='text-gray-400', bg='bg-white' }: any) => (
  <div className={`${bg} p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#0F3B73]/30 transition-all`}>
    <div className="text-right">
       <p className="text-slate-500 font-bold text-sm mb-1">{title}</p>
       <h2 className={`text-4xl font-black ${textColor} font-en tracking-tighter`}>{value}</h2>
    </div>
    {Icon && (
      <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center">
         <Icon className="w-8 h-8 opacity-70" />
      </div>
    )}
  </div>
);

export default function AdminDashboard() {
  const { orders } = useOrders();

  const stats = [
    {
      title: 'جديد (انتظار الاستلام)',
      count: orders.filter(o => o.status === 'merchant_pending').length,
      icon: Star,
      bg: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'قيد النقل للفرع',
      count: orders.filter(o => o.status === 'branch_transfering').length,
      icon: Truck,
      bg: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'في المخزن الرئيسي',
      count: orders.filter(o => o.status === 'main_warehouse').length,
      icon: Warehouse,
      bg: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    {
      title: 'في مخزن الفرع',
      count: orders.filter(o => o.status === 'branch_warehouse').length,
      icon: Building2,
      bg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'بحوزة المندوب',
      count: orders.filter(o => o.status === 'driver_assigned').length,
      icon: Truck,
      bg: 'bg-sky-50',
      textColor: 'text-sky-600'
    },
    {
      title: 'تم التسليم',
      count: orders.filter(o => o.status === 'delivered').length,
      icon: CheckSquare,
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'واصل جزئي',
      count: orders.filter(o => o.status === 'delivered_partial').length,
      icon: PackageCheck,
      bg: 'bg-emerald-100',
      textColor: 'text-emerald-700'
    },
    {
      title: 'مؤجل',
      count: orders.filter(o => o.status === 'postponed').length,
      icon: Clock,
      bg: 'bg-orange-100',
      textColor: 'text-orange-700'
    },
    {
      title: 'رفض',
      count: orders.filter(o => o.status === 'returned').length,
      icon: XSquare,
      bg: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'راجع جزئي',
      count: orders.filter(o => o.status === 'returned_partial').length,
      icon: PackageMinus,
      bg: 'bg-red-100',
      textColor: 'text-red-700'
    },
    {
      title: 'راجع مخزن',
      count: orders.filter(o => o.status === 'returned_to_merchant').length,
      icon: RefreshCcw,
      bg: 'bg-slate-50',
      textColor: 'text-slate-600'
    }
  ];

  return (
    <div className="space-y-8 h-full bg-[#f8fafc] -m-4 lg:-m-8 p-6 md:p-10 text-right" dir="rtl">
      <div className="relative pr-6 pt-4 mb-8">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand rounded-full"></div>
        <p className="text-slate-400 font-bold mb-2 text-sm">نظرة عامة</p>
        <h1 className="text-5xl font-black text-primary tracking-tight">لوحة التحكم</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title} 
            value={stat.count.toString()} 
            icon={stat.icon}
            bg={stat.bg}
            textColor={stat.textColor}
          />
        ))}
      </div>

      {/* Charts & Interactive Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Map Placeholder Section */}
        <div className="col-span-1 lg:col-span-8 bg-slate-200 rounded-2xl relative overflow-hidden h-[400px] border border-slate-100 shadow-sm">
          {/* Abstract Map Representation */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-10 left-20 w-3 h-3 bg-brand rounded-full shadow-[0_0_10px_#FF6B00]"></div>
          <div className="absolute top-40 left-60 w-3 h-3 bg-brand rounded-full shadow-[0_0_10px_#FF6B00]"></div>
          <div className="absolute bottom-20 right-40 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3B82F6]"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-sm transform rotate-45"></div>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border text-xs shadow-sm">
            <p className="font-bold mb-1 text-primary">التتبع الحي للمندوبين</p>
            <div className="flex space-x-4 space-x-reverse text-slate-600">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-brand ml-1"></div> مناديب نشطين</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 ml-1"></div> مستودعات</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-1 lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col h-[400px] shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">تنبيهات حرجة</h3>
          <div className="space-y-4 flex-1 overflow-hidden">
            <div className="text-center py-10 text-slate-400">
               <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
               <p className="font-bold">لا توجد تنبيهات حالية</p>
            </div>
          </div>
          <button className="mt-4 text-center w-full py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-xl text-sm hover:bg-slate-50 hover:text-primary hover:border-primary/20 transition-colors">
            عرض السجل كاملاً
          </button>
        </div>
      </div>
    </div>
  );
}
