import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, Truck, Star, Bell, Shield, MapPin, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DriverProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Navigate back to the login/landing screen
    navigate('/');
  };

  return (
    <div className="p-4 space-y-6 pb-24 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">حسابي</h2>
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 relative overflow-hidden">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl flex-shrink-0">
          ع
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">عمر خالد</h3>
          <p className="text-sm font-medium text-slate-500 mb-1">مندوب توصيل - منطقة الشمال</p>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 w-fit px-2 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
             <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
             <p className="text-xs text-slate-400 font-bold uppercase">الرقم الوظيفي</p>
             <p className="font-bold text-slate-700 font-en">DRV-8452</p>
          </div>
        </div>
        <div className="p-4 border-b border-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
             <Phone className="w-4 h-4" />
          </div>
          <div className="flex-1">
             <p className="text-xs text-slate-400 font-bold uppercase">رقم الجوال</p>
             <p className="font-bold text-slate-700 font-en dir-ltr text-right">050 123 4567</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
             <Truck className="w-4 h-4" />
          </div>
          <div className="flex-1">
             <p className="text-xs text-slate-400 font-bold uppercase">المركبة</p>
             <p className="font-bold text-slate-700">سيارة سيدان - لوحة: أ ب ج 123</p>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="px-5 pt-5 pb-2 text-sm font-bold text-slate-400 uppercase tracking-wider">الإعدادات</h3>
        <button className="w-full p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-slate-700 font-bold">
            <Bell className="w-5 h-5 text-slate-400" />
            <span>الإشعارات</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <button className="w-full p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-slate-700 font-bold">
            <Shield className="w-5 h-5 text-slate-400" />
            <span>تغيير كلمة المرور</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-slate-700 font-bold">
            <MapPin className="w-5 h-5 text-slate-400" />
            <span>المناطق المفضلة</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white border border-blue-100 px-4 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
      >
        <LogOut className="w-5 h-5" />
        تسجيل الخروج
      </button>

    </div>
  );
}
