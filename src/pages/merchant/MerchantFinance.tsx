import React from 'react';
import { FileText, Wallet, Printer, FileDown, Clock, ArrowRight, Menu, HelpCircle, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MerchantFinance() {
  const { user } = useAuth();
  const merchantName = user?.name || 'بوتيك نايا';
  
  const transactions: any[] = [];

  return (
    <div className="min-h-screen bg-[#f8fafc] -m-4 lg:-m-8 text-right pb-20 overflow-x-hidden" dir="rtl">
      <div className="p-6 md:p-10 space-y-12 max-w-7xl mx-auto">
        {/* Top Action Bar */}
        <div className="flex justify-start">
          <Link to="/merchant" className="bg-[#0F3B73] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-[#0F3B73]/20 w-fit">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Main Title & Action Buttons Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
          <div className="relative pr-6 flex-1">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0F3B73] rounded-full"></div>
            <p className="text-slate-400 font-bold text-sm mb-2 opacity-80">نظرة عامة</p>
            <h1 className="text-5xl font-black text-[#0F3B73] mb-4 tracking-tight">الحسابات والأرباح</h1>
            <p className="text-slate-500 font-medium tracking-wide">متابعة رصيدك المالي وتفاصيل العمليات</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all">
                <FileDown className="w-5 h-5" />
                <span>تصدير Excel</span>
             </button>
             <button className="w-full sm:w-auto bg-[#2B6CB0] text-white px-7 py-3.5 rounded-xl font-black flex items-center justify-center gap-2.5 hover:bg-opacity-95 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                <Printer className="w-6 h-6" />
                <span className="text-lg">طباعة الكشف</span>
             </button>
          </div>
        </div>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Current Balance Card (Green) */}
           <div className="bg-[#10b981] p-6 md:p-8 rounded-3xl flex flex-col items-center text-center shadow-lg relative group overflow-hidden">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-black text-xl mb-2">الرصيد الحالي</h3>
              <div className="flex items-baseline gap-2 mb-2">
                 <span className="text-4xl md:text-5xl font-black text-white font-en tracking-tighter">0</span>
                 <span className="text-xl font-black text-white/90">د.ع</span>
              </div>
              <p className="text-white/80 font-bold text-sm md:text-base">جاهز للسحب</p>
           </div>

           {/* Withdrawals Card (Blue) */}
           <div className="bg-[#3b82f6] p-6 md:p-8 rounded-3xl flex flex-col items-center text-center shadow-lg relative group overflow-hidden">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-black text-xl mb-2">المسحوبات</h3>
              <div className="flex items-baseline gap-2 mb-2">
                 <span className="text-4xl md:text-5xl font-black text-white font-en tracking-tighter">450,000</span>
                 <span className="text-xl font-black text-white/90">د.ع</span>
              </div>
              <p className="text-white/80 font-bold text-sm md:text-base">تم تسليمها للتاجر</p>
           </div>

           {/* Pending Amounts Card (Orange) - Full Width */}
           <div className="md:col-span-2 bg-[#f59e0b] p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-black text-xl mb-2">مبالغ معلقة (قيد التوصيل)</h3>
              <div className="flex items-baseline gap-2 mb-2">
                 <span className="text-4xl md:text-5xl font-black text-white font-en tracking-tighter">135,000</span>
                 <span className="text-xl font-black text-white/90">د.ع</span>
              </div>
              <p className="text-white/80 font-bold text-sm md:text-base">انتظار إتمام عمليات التوصيل</p>
           </div>
        </div>

        {/* Transactions Section */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl bg-white">
          <div className="bg-[#0F3B73] px-10 py-6">
            <h2 className="text-2xl font-black text-white">سجل العمليات المالية</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-sm font-black border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6">التسلسل</th>
                  <th className="px-10 py-6">رقم العملية</th>
                  <th className="px-10 py-6 text-center">النوع</th>
                  <th className="px-10 py-6">التفاصيل (رقم الطلب)</th>
                  <th className="px-10 py-6">تاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((trx, index) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-7 font-black text-slate-800 text-lg">{index + 1}</td>
                    <td className="px-10 py-7 font-en font-black text-slate-800 text-lg">{trx.trxId}</td>
                    <td className="px-10 py-7 text-center">
                      <span className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-black text-sm whitespace-nowrap border border-slate-100">
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-10 py-7 font-bold text-slate-600 text-lg">{trx.details}</td>
                    <td className="px-10 py-7 font-en font-bold text-slate-400 text-lg">{trx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
}
