import React, { useState } from 'react';
import { FileText, Download, BarChart2, Filter, Calendar, Search, Users, Truck, RotateCcw, Building2, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminReports() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      type: 'PDF / Excel',
      category: 'finance',
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      bgIcon: 'bg-emerald-50'
    },
    { 
      id: 2, 
      title: 'كشف حساب التجار العام', 
      description: 'إحصائيات شاملة لمبيعات وحسابات كافة التجار',
      type: 'PDF / Excel',
      category: 'merchants',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50'
    },
    { 
      id: 3, 
      title: 'تقرير أداء المناديب', 
      description: 'إحصائيات التوصيل والطلبيات الناجحة والراجعة للمناديب',
      type: 'PDF',
      category: 'drivers',
      icon: <Truck className="w-6 h-6 text-purple-600" />,
      bgIcon: 'bg-purple-50'
    },
    { 
      id: 4, 
      title: 'تقرير الطلبيات المرتجعة', 
      description: 'تفاصيل المرتجعات الكلية والجزئية مع ذكر الأسباب الواردة',
      type: 'PDF / CSV',
      category: 'operations',
      icon: <RotateCcw className="w-6 h-6 text-red-600" />,
      bgIcon: 'bg-red-50'
    },
    { 
      id: 5, 
      title: 'تقرير حركة المخازن', 
      description: 'بيانات وجرد الشحنات في المخزن الرئيسي والفرعي',
      type: 'Excel',
      category: 'operations',
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      bgIcon: 'bg-indigo-50'
    },
    { 
      id: 6, 
      title: 'التقرير المالي الشامل', 
      description: 'تقارير مالية مجمعة للواردات والصادرات والخزينة',
      type: 'PDF',
      category: 'finance',
      icon: <DollarSign className="w-6 h-6 text-teal-600" />,
      bgIcon: 'bg-teal-50'
    },
    { 
      id: 7, 
      title: 'تقرير النشاط العام', 
      description: 'ملخص يومي/أسبوعي/شهري لأهم أحداث وحركات المنصة',
      type: 'PDF',
      category: 'all',
      icon: <BarChart2 className="w-6 h-6 text-orange-600" />,
      bgIcon: 'bg-orange-50'
    },
    { 
      id: 8, 
      title: 'كشوفات الفروع', 
      description: 'تقارير الإنجاز والأرباح الخاصة بكل فرع على حدة',
      type: 'PDF / Excel',
      category: 'operations',
      icon: <FileText className="w-6 h-6 text-cyan-600" />,
      bgIcon: 'bg-cyan-50'
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
            <input type="date" className="text-sm bg-transparent border-none focus:outline-none font-en text-slate-800" />
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold">إلى</span>
            <input type="date" className="text-sm bg-transparent border-none focus:outline-none font-en text-slate-800" />
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
                  <button className="flex-1 flex justify-center items-center gap-2 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                    <Download className="w-4 h-4" /> تصدير
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
