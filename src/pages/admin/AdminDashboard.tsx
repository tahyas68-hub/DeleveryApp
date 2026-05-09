import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Package, AlertCircle, Truck } from 'lucide-react';
import { formatCurrency } from '../../lib/dummy';

const data = [
  { name: 'السبت', requests: 4000, delivered: 2400, revenue: 2400 },
  { name: 'الأحد', requests: 3000, delivered: 1398, revenue: 2210 },
  { name: 'الإثنين', requests: 2000, delivered: 9800, revenue: 2290 },
  { name: 'الثلاثاء', requests: 2780, delivered: 3908, revenue: 2000 },
  { name: 'الأربعاء', requests: 1890, delivered: 4800, revenue: 2181 },
  { name: 'الخميس', requests: 2390, delivered: 3800, revenue: 2500 },
  { name: 'الجمعة', requests: 3490, delivered: 4300, revenue: 2100 },
];

const StatCard = ({ title, value, subValue, icon: Icon, trend, trendUp, titleColor, textColor='text-primary', subTextColor='text-gray-400' }: any) => (
  <div className="bg-white p-5 rounded-xl border shadow-sm">
    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
    <p className={`text-3xl font-black ${textColor}`}>{value} {subValue && <span className={`text-sm font-normal ${subTextColor}`}>{subValue}</span>}</p>
    {trend && (
      <div className={`flex items-center mt-2 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-brand-600'}`}>
        <span>{trend}</span>
      </div>
    )}
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex gap-2 mr-auto">
          <button className="bg-brand text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
             إضافة مستودع +
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="الطلبات النشطة" value="14,208" trend="↑ 12% مقارنة بأمس" trendUp={true} textColor="text-primary" />
        <StatCard title="حالة الأسطول" value="89%" subValue="في الطريق" trend="" textColor="text-primary" />
        <StatCard title="نسبة التسليم بالوقت" value="96.4%" trend="الهدف: 95%" trendUp={true} textColor="text-primary" />
        <StatCard title="رصيد المحفظة" value="42.5K" subValue="دينار عراقي" trend="متاح للسحب" trendUp={false} textColor="text-emerald-600" />
      </div>

      {/* Charts & Interactive Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Placeholder Section */}
        <div className="col-span-1 lg:col-span-8 bg-slate-200 rounded-2xl relative overflow-hidden h-[400px] border">
          {/* Abstract Map Representation */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-10 left-20 w-3 h-3 bg-brand rounded-full shadow-[0_0_10px_#FF6B00]"></div>
          <div className="absolute top-40 left-60 w-3 h-3 bg-brand rounded-full shadow-[0_0_10px_#FF6B00]"></div>
          <div className="absolute bottom-20 right-40 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3B82F6]"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-sm transform rotate-45"></div>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border text-xs">
            <p className="font-bold mb-1">التتبع الحي للمندوبين</p>
            <div className="flex space-x-4 space-x-reverse">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-brand ml-1"></div> مناديب نشطين</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 ml-1"></div> مستودعات</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-1 lg:col-span-4 bg-white rounded-2xl border p-6 flex flex-col h-[400px]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">تنبيهات حرجة</h3>
          <div className="space-y-4 flex-1 overflow-hidden">
            <div className="flex gap-3 items-start p-3 border-r-4 border-red-500 bg-red-50 rounded-l-lg">
              <div className="text-red-500 pt-0.5">⚠️</div>
              <div>
                <p className="text-sm font-bold text-red-900">تأخير في المرتجع #9822</p>
                <p className="text-xs text-red-700">المندوب: أحمد س. • الكاظمية</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 border-r-4 border-brand-500 bg-brand-50 rounded-l-lg">
              <div className="text-brand-500 pt-0.5">📦</div>
              <div>
                <p className="text-sm font-bold text-brand-900">فشل رفع ملف الطلبات</p>
                <p className="text-xs text-brand-700">التاجر: مؤسسة الفارس • 12 خطأ</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 border-r-4 border-emerald-500 bg-emerald-50 rounded-l-lg">
              <div className="text-emerald-500 pt-0.5">✅</div>
              <div>
                <p className="text-sm font-bold text-emerald-900">اكتملت مزامنة المستودع</p>
                <p className="text-xs text-emerald-700">الفرع الشرقي • 4,200 شحنة تم تحديثها</p>
              </div>
            </div>
          </div>
          <button className="mt-4 text-center w-full py-2 border-2 border-primary text-primary font-bold rounded-lg text-sm hover:bg-primary hover:text-white transition-colors">
            عرض السجل كاملاً
          </button>
        </div>
      </div>
    </div>
  );
}
