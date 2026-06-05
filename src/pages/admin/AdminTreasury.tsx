import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, X, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminTreasury() {
  const { transactions, addTransaction } = useFinance();
  const { user } = useAuth();
  
  const totalInbound = transactions.filter(t => t.type === 'receipt' && (t.toEntity === 'الحساب المالي للشركة' || t.toEntity === 'admin')).reduce((sum, t) => sum + t.amount, 0);
  const totalOutbound = transactions.filter(t => t.type === 'payment' && (t.fromEntity === 'الحساب المالي للشركة' || t.fromEntity === 'admin')).reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalInbound - totalOutbound;

  const [activeModal, setActiveModal] = useState<'deposit' | 'expense' | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) {
      alert('الرجاء إدخال المبلغ والوصف بشكل صحيح');
      return;
    }

    if (activeModal === 'expense' && amount > currentBalance) {
      alert('لا يوجد رصيد كافٍ في الصندوق لإتمام عملية الصرف!');
      return;
    }

    addTransaction({
      type: activeModal === 'deposit' ? 'receipt' : 'payment',
      amount: amount,
      fromEntity: activeModal === 'deposit' ? 'إيداع يدوي' : 'الحساب المالي للشركة',
      toEntity: activeModal === 'deposit' ? 'الحساب المالي للشركة' : 'جهة صرف',
      referenceId: `manual-${activeModal}-${Date.now()}`,
      description: description,
      userId: user?.id || 'admin'
    });

    setActiveModal(null);
    setAmount(0);
    setDescription('');
  };

  return (
    <div className="space-y-6 flex flex-col pt-4 sm:pt-0" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">الصندوق المالي</h1>
          <p className="text-slate-500 font-medium mt-1">السيولة النقدية المتاحة في صندوق الشركة حالياً</p>
        </div>
      </div>

      <div className="bg-[#0F3B73] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 flex-shrink-0 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <p className="text-blue-200 font-bold mb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5" /> الرصيد الإجمالي في الصندوق
        </p>
        <div className="flex items-end gap-2">
          <h2 className="text-5xl font-black tracking-tight font-en">{currentBalance.toLocaleString()}</h2>
          <span className="text-xl font-bold text-blue-200 mb-1">د.ع</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center sm:text-right">
           <h3 className="font-bold text-slate-800 mb-4 text-xl">إيداع في الصندوق</h3>
           <button 
             onClick={() => setActiveModal('deposit')}
             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
           >
              <ArrowDownRight className="w-5 h-5" /> إضافة مبلغ
           </button>
         </div>
         <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center sm:text-right">
           <h3 className="font-bold text-slate-800 mb-4 text-xl">صرف من الصندوق</h3>
           <button 
             onClick={() => setActiveModal('expense')}
             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
           >
              <ArrowUpRight className="w-5 h-5" /> تسجيل مصروف
           </button>
         </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-right font-sans"
            >
              <div className={`p-6 border-b flex items-center justify-between ${
                activeModal === 'deposit' ? 'bg-blue-50 border-blue-100' : 'bg-blue-50 border-blue-100'
              }`}>
                <div className="flex items-center gap-2">
                  {activeModal === 'deposit' ? (
                    <ArrowDownRight className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-blue-600" />
                  )}
                  <h3 className={`text-lg font-black ${
                    activeModal === 'deposit' ? 'text-blue-900' : 'text-blue-900'
                  }`}>
                    {activeModal === 'deposit' ? 'إيداع مبلغ في الصندوق' : 'صرف مبلغ من الصندوق'}
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveModal(null);
                    setAmount(0);
                    setDescription('');
                  }}
                  className={`p-1 rounded-full transition-all ${
                    activeModal === 'deposit' ? 'hover:bg-blue-100 text-blue-800' : 'hover:bg-blue-100 text-blue-800'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold text-xs">قيمة المبلغ (د.ع)</label>
                  <input 
                    type="number" 
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="أدخل المبلغ"
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-en font-black text-slate-800 text-lg text-center focus:bg-white focus:border-blue-500 hover:border-slate-300 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold text-xs">الوصف / البيان</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={activeModal === 'deposit' ? 'مثال: تمويل الصندوق من الإدارة' : 'مثال: شراء قرطاسية للمكتب'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-right text-slate-800 focus:bg-white focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setActiveModal(null);
                      setAmount(0);
                      setDescription('');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className={`${
                      activeModal === 'deposit' 
                        ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/10' 
                        : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/10'
                    } text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md`}
                  >
                    <Check className="w-5 h-5" />
                    <span>تأكيد وتسجيل</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

