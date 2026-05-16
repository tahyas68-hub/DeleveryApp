import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  ChevronDown,
  CheckCircle,
  Clock,
  RotateCcw,
  BarChart3,
  ArrowLeft,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

export default function WarehouseReports() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [period, setPeriod] = useState('this-month');
  const [reportType, setReportType] = useState('general');

  const stats = [
    { label: 'إجمالي الطلبات', value: orders.length, icon: BarChart3, color: 'blue' },
    { label: 'تم التوصيل', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'emerald' },
    { label: 'راجعة', value: orders.filter(o => o.status === 'returned').length, icon: RotateCcw, color: 'red' },
    { label: 'قيد المعالجة', value: orders.filter(o => o.status === 'processing').length, icon: Clock, color: 'orange' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#0F3B73]">تقارير الفرع</h1>
          <p className="text-slate-500 font-bold flex items-center gap-2">
            بوابة مدير الفرع <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> تقارير وإحصائيات
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
             onClick={() => navigate('/warehouse')}
             className="flex items-center gap-2 bg-white text-[#0F3B73] border-2 border-[#0F3B73]/20 px-5 py-2.5 rounded-2xl font-black hover:bg-slate-50 transition-colors"
           >
             <ArrowLeft className="w-5 h-5" />
             العودة
           </button>
          <button 
             onClick={() => { setReportType('general'); setTimeout(() => window.print(), 100); }}
             className="flex items-center gap-2 bg-white text-slate-700 border-2 border-slate-100 hover:border-[#0F3B73]/20 px-5 py-2.5 rounded-2xl font-black transition-all text-sm sm:text-base print:hidden"
          >
            <Printer className="w-5 h-5" />
            طباعة تقرير الطلبات
          </button>
          <button 
             onClick={() => { setReportType('financial'); setTimeout(() => window.print(), 100); }}
             className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all text-sm sm:text-base print:hidden"
          >
            <Download className="w-5 h-5" />
            طباعة التقرير المالي
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0F3B73]/5 p-2 rounded-[32px] flex flex-col md:flex-row gap-2 print:hidden">
        <div className="flex-1 relative">
           <select 
             value={period}
             onChange={(e) => setPeriod(e.target.value)}
             className="w-full bg-white border-2 border-transparent text-slate-900 rounded-3xl px-6 py-4 font-black focus:outline-none focus:border-[#0F3B73]/20 appearance-none text-center"
           >
             <option value="today">اليوم</option>
             <option value="this-week">هذا الأسبوع</option>
             <option value="this-month">هذا الشهر</option>
             <option value="last-month">الشهر الماضي</option>
           </select>
           <ChevronDown className="w-5 h-5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="flex-1 relative">
           <select 
             value={reportType}
             onChange={(e) => setReportType(e.target.value)}
             className="w-full bg-white border-2 border-transparent text-slate-900 rounded-3xl px-6 py-4 font-black focus:outline-none focus:border-[#0F3B73]/20 appearance-none text-center"
           >
             <option value="general">تقرير عام (الطلبات)</option>
             <option value="financial">التقرير المالي</option>
             <option value="drivers">أداء المندوبين</option>
           </select>
           <ChevronDown className="w-5 h-5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center gap-3 group hover:border-[#0F3B73]/20 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-center">
               <p className="text-[#0F3B73] text-2xl font-black">{stat.value}</p>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* General Report View */}
      {reportType === 'general' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-[#0F3B73]">التقرير العام للطلبات</h2>
              <p className="text-slate-400 font-bold">الفترة: هذا الشهر (من 2026-05-01 إلى 2026-05-31)</p>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                   <table className="w-full text-right border-collapse min-w-[800px]">
                      <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                              <th className="px-6 py-5 font-black text-slate-400 text-sm">التاريخ</th>
                              <th className="px-6 py-5 font-black text-slate-400 text-sm">التسلسل</th>
                              <th className="px-6 py-5 font-black text-slate-400 text-sm">رقم الشحنة</th>
                              <th className="px-6 py-5 font-black text-slate-400 text-sm">العميل / المتجر</th>
                              <th className="px-6 py-5 font-black text-slate-400 text-sm">المندوب</th>
                              <th className="px-6 py-5 font-black text-slate-400 text-sm">الحالة</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {orders.slice(0, 8).map((order, index) => (
                              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                  <td className="px-6 py-5 font-en font-bold text-slate-500 whitespace-nowrap">{order.date ? order.date.split('T')[0] : 'N/A'}</td>
                                  <td className="px-6 py-5 font-en font-bold text-slate-400">{index + 1}</td>
                                  <td className="px-6 py-5 font-en font-black text-blue-600">{order.trackingNumber}</td>
                                  <td className="px-6 py-5">
                                      <div className="flex flex-col whitespace-nowrap">
                                          <span className="font-black text-slate-700">{order.merchantName}</span>
                                          <span className="text-slate-400 text-xs font-bold">{order.customerName}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-5 font-bold text-slate-600 whitespace-nowrap">{order.driverName || 'معلق'}</td>
                                  <td className="px-6 py-5 italic font-bold">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">{
                                      order.status === 'delivered' ? 'مكتمل' : 
                                      order.status === 'returned' ? 'راجع' :
                                      order.status === 'processing' ? 'قيد المعالجة' : 'معلق'
                                    }</span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                   </table>
               </div>
          </div>
        </div>
      )}

      {/* Financial Report View */}
      {reportType === 'financial' && (
        <div className="space-y-6 print:hidden">
          <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-[#0F3B73]">التقرير المالي</h2>
              <p className="text-slate-400 font-bold">ملخص الإيرادات والمصروفات</p>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-right border-collapse min-w-[800px]">
                     <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">التاريخ</th>
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">رقم الطلب</th>
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">التاجر / المتجر</th>
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">مبلغ الطلب</th>
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">العمولة (التوصيل)</th>
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">المحصل</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                         {orders.slice(0, 8).map((order) => (
                             <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                 <td className="px-6 py-5 font-en font-bold text-slate-500 whitespace-nowrap">{order.date ? order.date.split('T')[0] : 'N/A'}</td>
                                 <td className="px-6 py-5 font-en font-black text-blue-600">{order.trackingNumber}</td>
                                 <td className="px-6 py-5 font-bold text-slate-700 whitespace-nowrap">{order.merchantName}</td>
                                 <td className="px-6 py-5 font-en font-bold text-slate-800 whitespace-nowrap">{(order.orderAmount || 0).toLocaleString()} د.ع</td>
                                 <td className="px-6 py-5 font-en font-bold text-emerald-600 whitespace-nowrap">{(order.deliveryFee || 0).toLocaleString()} د.ع</td>
                                 <td className="px-6 py-5 font-en font-black text-[#0F3B73] whitespace-nowrap">{(order.collectedAmount || 0).toLocaleString()} د.ع</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          </div>
        </div>
      )}

      {/* Drivers Report View */}
      {reportType === 'drivers' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-[#0F3B73]">أداء المندوبين</h2>
              <p className="text-slate-400 font-bold">ملخص توصيلات والتزامات المندوبين</p>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-right border-collapse min-w-[800px]">
                     <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">المندوب</th>
                            <th className="px-6 py-5 font-black text-slate-400 text-sm">إجمالي الطلبات</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        <tr>
                            <td colSpan={2} className="px-6 py-12 text-center text-slate-400 font-bold">يتطلب جمع البيانات من سجلات المندوبين...</td>
                        </tr>
                     </tbody>
                 </table>
             </div>
          </div>
        </div>
      )}

      {/* Printable Financial Report */}
      <div id="printable-financial-report" className="hidden print:block w-full bg-white text-black pt-4 z-50" dir="rtl">
         {/* Report Header */}
         <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
               {/* Logo */}
               <div className="w-16 h-16 bg-[#0F3B73] rounded-2xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
               </div>
            </div>
            <h1 className="text-2xl font-black text-[#0F3B73]">شركة العراب للشحن والتوصيل السريع</h1>
         </div>

         <div className="flex justify-between items-start mb-8 border-b-2 border-slate-200 pb-6">
            <div className="space-y-2 text-right">
               <p className="font-bold text-slate-800">الشركة: <span className="font-black text-[#0F3B73]">شركة العراب للشحن</span></p>
               <p className="font-bold text-slate-800">رقم التقرير: <span className="font-black">RPT-{Math.floor(Math.random() * 100000)}</span></p>
            </div>
            <div className="space-y-2 text-right">
               <p className="font-bold text-slate-800">العدد: <span className="font-black border border-slate-300 px-2 py-0.5 rounded">{orders.length} طلبات</span></p>
               <p className="font-bold text-slate-800">التقرير: <span className="font-black">تقرير مالي عام</span></p>
               <p className="font-bold text-slate-800">التاريخ: <span className="font-black whitespace-nowrap">{new Date().toLocaleDateString('ar-IQ')}</span></p>
            </div>
         </div>

         {/* Report Table */}
         <table className="w-full text-right border-collapse mb-12 border-2 border-slate-500">
            <thead>
               <tr className="border-b-2 border-black bg-slate-100">
                  <th className="p-3 font-black text-black border-l border-slate-300">رقم الطلب</th>
                  <th className="p-3 font-black text-black border-l border-slate-300">التاجر / المتجر</th>
                  <th className="p-3 font-black text-black border-l border-slate-300">مبلغ الطلب</th>
                  <th className="p-3 font-black text-black border-l border-slate-300">أجرة التوصيل</th>
                  <th className="p-3 font-black text-black">المحصل</th>
               </tr>
            </thead>
            <tbody>
               {orders.map(order => (
                  <tr key={order.id} className="border-b border-slate-300">
                      <td className="p-3 font-bold border-l border-slate-300 font-en text-slate-700">{order.trackingNumber}</td>
                      <td className="p-3 font-bold border-l border-slate-300">{order.merchantName}</td>
                      <td className="p-3 font-bold text-slate-800 border-l border-slate-300 font-en text-left dir-ltr">{(order.orderAmount || 0).toLocaleString()} د.ع</td>
                      <td className="p-3 font-bold text-slate-800 border-l border-slate-300 font-en text-left dir-ltr">{(order.deliveryFee || 0).toLocaleString()} د.ع</td>
                      <td className="p-3 font-black text-[#0F3B73] font-en text-left dir-ltr">{(order.collectedAmount || 0).toLocaleString()} د.ع</td>
                  </tr>
               ))}
               {/* Totals */}
               <tr className="border-t-[3px] border-black bg-slate-100">
                  <td colSpan={2} className="p-3 font-black text-center border-l border-slate-300">الإجمالي الكلي:</td>
                  <td className="p-3 font-black text-slate-800 border-l border-slate-300 font-en text-left dir-ltr">{orders.reduce((sum, o) => sum + (o.orderAmount || 0), 0).toLocaleString()} د.ع</td>
                  <td className="p-3 font-black text-slate-800 border-l border-slate-300 font-en text-left dir-ltr">{orders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0).toLocaleString()} د.ع</td>
                  <td className="p-3 font-black text-emerald-700 text-lg font-en text-left dir-ltr">{orders.reduce((sum, o) => sum + (o.collectedAmount || 0), 0).toLocaleString()} د.ع</td>
               </tr>
            </tbody>
         </table>

         {/* Signatures */}
         <div className="flex justify-between px-16 mt-20 pt-10">
            <div className="text-center">
               <p className="font-black text-lg mb-12">اسم مدير الفرع والتوقيع</p>
               <p className="text-black font-black">________________________</p>
            </div>
            <div className="text-center">
               <p className="font-black text-lg mb-12">اسم المحاسب المالي والتوقيع</p>
               <p className="text-black font-black">________________________</p>
            </div>
         </div>
      </div>
    </div>
  );
}
