import React, { useState } from 'react';
import { FileText, Download, BarChart2, Filter, Calendar, Search, Users, Truck, RotateCcw, Building2, TrendingUp, DollarSign } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';
import { exportCustomTableToExcel } from '../../utils/reportsExport';
import { exportOrdersToExcel } from '../../utils/excelExport';

export default function AdminReports() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { orders } = useOrders();
  const { users } = useUsers();
  const { getDeliveryFee, getDriverCommission } = useSettings();

  const reportsCategories = [
    { id: 'all', label: 'الكل' },
    { id: 'finance', label: 'المالية والأرباح' },
    { id: 'merchants', label: 'التجار' },
    { id: 'drivers', label: 'المناديب' },
    { id: 'operations', label: 'العمليات والمخازن' },
  ];

  const reportsList = [
    { 
      id: 1, 
      title: 'تقرير أرباح المنصة', 
      description: 'يحتوي على صافي أرباح المنصة من التوصيل والعمولات',
      type: 'Excel',
      category: 'finance',
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
        const data = orders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial').map(o => {
          const fee = o.deliveryFee || getDeliveryFee(o.province);
          const comm = (typeof o.driverCommission === 'number') ? o.driverCommission : getDriverCommission(o.province, o.driverId);
          const profit = fee - comm;
          return [
            o.id,
            o.trackingNumber || '',
            o.date,
            fee,
            comm,
            profit
          ];
        });
        exportCustomTableToExcel('تقرير أرباح المنصة', ['رقم الطلب', 'رقم الشحنة', 'التاريخ', 'أجرة التوصيل', 'عمولة المندوب', 'صافي الربح'], data);
      }
    },
    { 
      id: 2, 
      title: 'كشف حساب التجار العام', 
      description: 'إحصائيات شاملة لمبيعات وحسابات كافة التجار',
      type: 'Excel',
      category: 'merchants',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
        const merchants = users.filter(u => u.role === 'merchant');
        const data = merchants.map(m => {
          const mOrders = orders.filter(o => o.merchantId === m.id);
          const totalOrders = mOrders.length;
          const delivered = mOrders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial').length;
          const returned = mOrders.filter(o => o.status === 'returned' || o.status === 'returned_partial').length;
          
          const currentBalance = mOrders
             .filter(o => (o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial') && o.financialStatus !== 'merchant_paid')
             .reduce((sum, o) => sum + (o.amount || 0), 0);
          
          return [
            m.name,
            totalOrders,
            delivered,
            returned,
            currentBalance
          ];
        });
        exportCustomTableToExcel('كشف حساب التجار العام', ['اسم التاجر', 'اجمالي الطلبات', 'الطلبات الواصلة', 'المرتجعات', 'المبالغ المعلقة (غير مدفوعة)'], data);
      }
    },
    { 
      id: 3, 
      title: 'تقرير أداء المناديب', 
      description: 'إحصائيات التوصيل والطلبيات الناجحة والراجعة للمناديب',
      type: 'Excel',
      category: 'drivers',
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
        const drivers = users.filter(u => u.role === 'driver');
        const data = drivers.map(d => {
          const dOrders = orders.filter(o => o.driverId === d.id);
          const totalAssigned = dOrders.length;
          const delivered = dOrders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial').length;
          const pending = dOrders.filter(o => o.status === 'driver_assigned' || o.status === 'postponed').length;
          const returned = dOrders.filter(o => o.status === 'returned' || o.status === 'returned_partial').length;
          const commission = dOrders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial')
             .reduce((sum, o) => sum + ((typeof o.driverCommission === 'number') ? o.driverCommission : getDriverCommission(o.province, o.driverId)), 0);
             
          return [
            d.name,
            totalAssigned,
            delivered,
            pending,
            returned,
            commission
          ];
        });
        exportCustomTableToExcel('تقرير أداء المناديب', ['اسم المندوب', 'الطلبات المسندة', 'الواصلة', 'قيد التوصيل/مؤجلة', 'المرتجعة', 'الأرباح الكلية'], data);
      }
    },
    { 
      id: 4, 
      title: 'تقرير الطلبيات المرتجعة', 
      description: 'تفاصيل المرتجعات الكلية والجزئية مع ذكر الأسباب الواردة',
      type: 'Excel',
      category: 'operations',
      icon: <RotateCcw className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
        const returnedOrders = orders.filter(o => o.status === 'returned' || o.status === 'returned_partial');
        exportCustomTableToExcel('الطلبات المرتجعة', ['رقم الطلب', 'رقم الشحنة', 'اسم التاجر', 'المندوب', 'المحافظة', 'حالة الراجع'], returnedOrders.map(o => [
          o.id,
          o.trackingNumber || o.id,
          o.merchantName || '',
          o.driverName || 'غير مسند',
          o.province,
          o.status === 'returned' ? 'مرتجع كلي' : 'مرتجع جزئي'
        ]));
      }
    },
    { 
      id: 5, 
      title: 'تقرير حركة المخازن', 
      description: 'بيانات وجرد الشحنات في المخزن الرئيسي والفرعي',
      type: 'Excel',
      category: 'operations',
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
        const warehouseOrders = orders.filter(o => o.status === 'main_warehouse' || o.status === 'branch_warehouse' || o.status === 'branch_transfering');
        exportCustomTableToExcel('حركة المخازن', ['رقم الطلب', 'رقم الشحنة', 'اسم التاجر', 'المكان الحالي'], warehouseOrders.map(o => [
          o.id,
          o.trackingNumber || o.id,
          o.merchantName || '',
          o.status === 'main_warehouse' ? 'المخزن الرئيسي' : o.status === 'branch_warehouse' ? 'مخزن الفرع' : 'قيد النقل للفرع'
        ]));
      }
    },
    { 
      id: 6, 
      title: 'التقرير المالي الشامل', 
      description: 'تقارير مالية مجمعة للواردات والصادرات والخزينة',
      type: 'Excel',
      category: 'finance',
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
         const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial');
         const totalSales = deliveredOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
         const totalDeliveryFees = deliveredOrders.reduce((sum, o) => sum + (o.deliveryFee || getDeliveryFee(o.province)), 0);
         const totalPlatformsProfits = deliveredOrders.reduce((sum, o) => {
           const fee = o.deliveryFee || getDeliveryFee(o.province);
           const comm = (typeof o.driverCommission === 'number') ? o.driverCommission : getDriverCommission(o.province, o.driverId);
           return sum + (fee - comm);
         }, 0);
         const totalDriversCommissions = deliveredOrders.reduce((sum, o) => sum + ((typeof o.driverCommission === 'number') ? o.driverCommission : getDriverCommission(o.province, o.driverId)), 0);
         
         exportCustomTableToExcel('التقرير المالي الشامل', ['البيان', 'المبلغ (د.ع)'], [
           ['اجمالي مبيعات التجار (الواصلة)', totalSales],
           ['اجمالي أجور التوصيل', totalDeliveryFees],
           ['اجمالي عمولات المناديب', totalDriversCommissions],
           ['صافي أرباح المنصة', totalPlatformsProfits]
         ]);
      }
    },
    { 
      id: 7, 
      title: 'تقرير النشاط العام', 
      description: 'ملخص يومي/أسبوعي/شهري لأهم أحداث وحركات المنصة',
      type: 'Excel',
      category: 'all',
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
         const totalOrders = orders.length;
         const delivered = orders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial').length;
         const returned = orders.filter(o => o.status === 'returned' || o.status === 'returned_partial').length;
         const pending = orders.filter(o => ['merchant_pending', 'main_warehouse', 'branch_warehouse'].includes(o.status)).length;
         
         exportCustomTableToExcel('النشاط العام', ['البيان', 'العدد'], [
           ['إجمالي الطلبات في النظام', totalOrders],
           ['الطلبات الواصلة', delivered],
           ['الطلبات المرتجعة', returned],
           ['طلبات قيد التنفيذ/مخازن', pending]
         ]);
      }
    },
    { 
      id: 8, 
      title: 'كشوفات الفروع', 
      description: 'تقارير الإنجاز والأرباح الخاصة بكل فرع على حدة',
      type: 'Excel',
      category: 'operations',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      onExport: () => {
        const provinces = [...new Set(orders.map(o => o.province).filter(Boolean))];
        const data = provinces.map(p => {
           const pOrders = orders.filter(o => o.province === p);
           const total = pOrders.length;
           const delivered = pOrders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial').length;
           const returned = pOrders.filter(o => o.status === 'returned' || o.status === 'returned_partial').length;
           return [
             p,
             total,
             delivered,
             returned
           ];
        });
        exportCustomTableToExcel('كشوفات الفروع', ['المحافظة (الفرع)', 'اجمالي الطلبات', 'الطلبات الواصلة', 'المرتجعات'], data);
      }
    }
  ];

  const filteredReports = reportsList.filter(report => {
    const matchesCategory = activeCategory === 'all' || report.category === activeCategory;
    const matchesSearch = report.title.includes(searchTerm) || report.description.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-l from-[#0F3B73] to-[#1a5baf] p-8 rounded-3xl text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">مركز التقارير والإحصائيات</h1>
          <p className="text-white/80 font-medium text-sm md:text-base max-w-xl leading-relaxed">
            توليد واستعراض وطباعة تقارير النظام الشاملة للمالية، التجار، المناديب، والعمليات بدقة عالية واحترافية.
          </p>
        </div>
        <div className="relative z-10 bg-white/10 p-3 rounded-2xl backdrop-blur-sm self-start sm:self-center">
          <BarChart2 className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {reportsCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0F3B73] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="البحث عن تقرير..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3B73] focus:bg-white transition-all text-sm font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Date Range Selection - Optional */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-blue-800 font-bold">
          <Filter className="w-5 h-5 text-blue-600" />
          <span>تخصيص فترة التقارير (اختياري)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold">من</span>
            <input type="date" lang="en" dir="ltr" className="text-sm bg-transparent border-none focus:outline-none font-en text-slate-800" />
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold">إلى</span>
            <input type="date" lang="en" dir="ltr" className="text-sm bg-transparent border-none focus:outline-none font-en text-slate-800" />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredReports.length > 0 ? (
           filteredReports.map(report => (
             <div key={report.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm group hover:shadow-md hover:border-[#0F3B73]/30 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 ${report.bgIcon} rounded-2xl flex items-center justify-center`}>
                       {report.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg flex items-center justify-center h-6">
                      {report.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#0F3B73] transition-colors">{report.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
                    {report.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    <BarChart2 className="w-4 h-4" /> عرض
                  </button>
                  <button 
                    onClick={() => report.onExport && report.onExport()}
                    className="flex-1 flex justify-center items-center gap-2 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" /> تصدير إكسل
                  </button>
                </div>
             </div>
           ))
         ) : (
           <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
              <FileText className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-bold">لم يتم العثور على تقارير مطابقة للبحث</p>
           </div>
         )}
      </div>
    </div>
  );
}
