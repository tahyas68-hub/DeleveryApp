import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShieldCheck, Truck, Store, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [step, setStep] = useState<'pick' | 'form'>('pick');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username, selectedRole);
      navigate(`/${selectedRole}`);
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'merchant': return 'بوابة التاجر';
      case 'admin': return 'الإدارة الرئيسية';
      case 'warehouse': return 'إدارة المستودع';
      case 'driver': return 'تطبيق المندوب';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <span className="text-4xl font-bold text-white tracking-tighter">D</span>
        </div>
        <h1 className="text-4xl font-bold text-[#0F3B73] font-en tracking-tight">Delevary</h1>
        <p className="text-slate-500 text-center max-w-sm mt-2 font-medium">
          المنصة اللوجستية المتكاملة لإدارة مستودعاتك، وتتبع مناديبك بسلاسة.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8">
        {step === 'pick' ? (
          <>
            <h2 className="text-xl font-bold text-[#0F3B73] mb-6 text-center uppercase tracking-widest">اختر بوابة الدخول</h2>
            
            <div className="space-y-4">
              <button onClick={() => handleRoleSelect('merchant')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#0F3B73] hover:bg-slate-50 transition-colors group text-right">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#0F3B73] group-hover:text-white transition-colors shrink-0">
                  <Store className="w-6 h-6 text-slate-500 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">بوابة التاجر</h3>
                  <p className="text-xs text-slate-500 font-medium">إدارة الطلبات، الكشوفات، والتتبع</p>
                </div>
              </button>

              <button onClick={() => handleRoleSelect('admin')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#0F3B73] hover:bg-slate-50 transition-colors group text-right">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#0F3B73] group-hover:text-white transition-colors shrink-0">
                  <ShieldCheck className="w-6 h-6 text-slate-500 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">الإدارة الرئيسية</h3>
                  <p className="text-xs text-slate-500 font-medium">لوحة تحكم النظام، والتقارير</p>
                </div>
              </button>

              <button onClick={() => handleRoleSelect('warehouse')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#FF6B00] hover:bg-orange-50 transition-colors group text-right">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition-colors shrink-0">
                  <Package className="w-6 h-6 text-slate-500 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">إدارة المستودع الفرعي</h3>
                  <p className="text-xs text-slate-500 font-medium">إدارة الشحنات وتوزيع المندوبين</p>
                </div>
              </button>

              <button onClick={() => handleRoleSelect('driver')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-brand hover:bg-brand-50 transition-colors group text-right">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
                  <Truck className="w-6 h-6 text-slate-500 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">تطبيق المندوب (PWA)</h3>
                  <p className="text-xs text-slate-500 font-medium">المهام اليومية، والمحفظة</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <button 
                type="button" 
                onClick={() => setStep('pick')}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-[#0F3B73]">{getRoleTitle(selectedRole)}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">اسم المستخدم</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#0F3B73] transition-colors font-bold text-right"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">كلمة المرور</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#0F3B73] transition-colors font-bold text-right"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0F3B73] text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-[#0F3B73]/20"
            >
              تسجيل الدخول
            </button>
          </form>
        )}
      </div>
      
      <p className="mt-8 text-[10px] uppercase font-bold text-gray-400 tracking-widest">v4.2.0-Alpha • Delevary 2026</p>
    </div>
  );
}
