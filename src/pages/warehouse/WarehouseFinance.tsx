import React from 'react';
import { 
  DollarSign, 
  Wallet, 
  Clock, 
  ChevronLeft, 
  Printer, 
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  {
    label: 'الرصيد الحالي (المحفظة)',
    value: '210,000',
    unit: 'د.ع',
    subtext: 'ذمة المندوبين',
    icon: DollarSign,
    color: 'emerald'
  },
  {
    label: 'الصندوق المالي (المسحوبات)',
    value: '0',
    unit: 'د.ع',
    subtext: 'تم سحبها من المندوبين',
    icon: Wallet,
    color: 'blue'
  },
  {
    label: 'مبالغ معلقة',
    value: '290,000',
    unit: 'د.ع',
    subtext: 'طلبات عند المندوب أو المخزن',
    icon: Clock,
    color: 'orange'
  }
];

const transactions = [
  { id: 1, sn: 1, opNum: 7, type: 'صرف (عمولة)', details: 'استلام مبالغ من صندوق الفرع للمركز الرئيسي', date: '2026-05-11 09:26:15', amount: -77000 },
  { id: 2, sn: 2, opNum: 6, type: 'صرف (عمولة)', details: 'صرف عمولة للمندوب: علي (عن 4 طلب)', date: '2026-05-11 09:25:39', amount: -8000 },
  { id: 3, sn: 3, opNum: 5, type: 'إيداع (قبض)', details: 'قبض مبالغ من المندوب: علي', date: '2026-05-11 09:25:31', amount: 85000 },
];

export default function WarehouseFinance() {
  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="space-y-1">
          <p className="text-slate-500 font-bold flex items-center gap-2">
            نظرة عامة
          </p>
          <h1 className="text-3xl font-black text-[#0F3B73]">الحسابات والأرباح</h1>
          <p className="text-slate-400 font-medium">متابعة رصيدك المالي وتفاصيل العمليات</p>
        </div>
        
        <div className="flex items-center gap-3 print:hidden">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
            تصدير Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-colors">
            <Printer className="w-5 h-5" />
            طباعة الكشف
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group`}
          >
            <div className={`absolute top-0 right-0 w-2 h-full bg-${stat.color}-500`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <p className={`text-sm font-black text-${stat.color}-600`}>{stat.label}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-4xl font-black text-slate-900">{stat.value}</span>
                <span className="text-lg font-bold text-slate-500">{stat.unit}</span>
              </div>
              <p className="text-slate-400 font-bold mt-2 text-sm">{stat.subtext}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <div className="bg-[#8CB33E] p-5">
           <h2 className="text-white text-xl font-black text-center">سجل العمليات المالية</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                <th className="px-4 py-3 font-black text-slate-700">التسلسل</th>
                <th className="px-4 py-3 font-black text-slate-700">رقم العملية</th>
                <th className="px-4 py-3 font-black text-slate-700">النوع</th>
                <th className="px-4 py-3 font-black text-slate-700">التفاصيل (رقم الطلب)</th>
                <th className="px-4 py-3 font-black text-slate-700">تاريخ</th>
                <th className="px-4 py-3 font-black text-slate-700">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-600">{t.sn}</td>
                  <td className="px-4 py-3 font-en font-bold text-slate-800">{t.opNum}</td>
                  <td className={`px-4 py-3 font-bold ${t.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {t.type}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 whitespace-normal min-w-[200px]">{t.details}</td>
                  <td className="px-4 py-3 font-en font-bold text-slate-600">{t.date}</td>
                  <td className={`px-4 py-3 font-en font-black text-base lg:text-lg ${t.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    <div className="flex items-center gap-1">
                      <span>{t.amount > 0 ? '(+)' : '(-)'}</span>
                      <span dir="ltr">{Math.abs(t.amount).toLocaleString()} د.ع</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
               <p className="font-bold text-slate-800">العدد: <span className="font-black border border-slate-300 px-2 py-0.5 rounded">{transactions.length} عمليات</span></p>
               <p className="font-bold text-slate-800">التقرير: <span className="font-black">سجل العمليات المالية للمخزن</span></p>
               <p className="font-bold text-slate-800">التاريخ: <span className="font-black whitespace-nowrap">{new Date().toLocaleDateString('ar-IQ')}</span></p>
            </div>
         </div>

         {/* Report Table */}
         <table className="w-full text-right border-collapse mb-12 border-2 border-slate-500">
            <thead>
               <tr className="border-b-2 border-black bg-slate-100">
                  <th className="p-3 font-black text-black border-l border-slate-300">التسلسل</th>
                  <th className="p-3 font-black text-black border-l border-slate-300">رقم العملية</th>
                  <th className="p-3 font-black text-black border-l border-slate-300">النوع</th>
                  <th className="p-3 font-black text-black border-l border-slate-300">التفاصيل</th>
                  <th className="p-3 font-black text-black border-l border-slate-300">التاريخ</th>
                  <th className="p-3 font-black text-black">المبلغ</th>
               </tr>
            </thead>
            <tbody>
               {transactions.map(t => (
                  <tr key={t.id} className="border-b border-slate-300">
                      <td className="p-3 font-bold border-l border-slate-300">{t.sn}</td>
                      <td className="p-3 font-bold border-l border-slate-300">{t.opNum}</td>
                      <td className="p-3 font-bold border-l border-slate-300">{t.type}</td>
                      <td className="p-3 font-bold border-l border-slate-300">{t.details}</td>
                      <td className="p-3 font-bold border-l border-slate-300 font-en text-slate-700">{t.date}</td>
                      <td className={`p-3 font-black font-en text-left dir-ltr ${t.amount < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                        {t.amount > 0 ? '(+) ' : '(-) '}
                        {Math.abs(t.amount).toLocaleString()} د.ع
                      </td>
                  </tr>
               ))}
               {/* Totals */}
               <tr className="border-t-[3px] border-black bg-slate-100">
                  <td colSpan={5} className="p-3 font-black text-center border-l border-slate-300">صافي العمليات:</td>
                  <td className="p-3 font-black text-slate-800 text-lg font-en text-left dir-ltr">
                     {transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} د.ع
                  </td>
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
