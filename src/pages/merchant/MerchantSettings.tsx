import React, { useState, useRef } from 'react';
import { 
  User, Store, Phone, Lock, Eye, EyeOff, Save, 
  UserCircle, Building2, Smartphone, Key, ArrowRight, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from '../../context/UserContext';

export default function MerchantSettings() {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { updateUser: updateGlobalUser } = useUsers();
  const [activeTab, setActiveTab] = useState<'personal' | 'store'>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [merchantName, setMerchantName] = useState(user?.name || 'بوتيك نايا');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '07706375157');
  const [username, setUsername] = useState(user?.username || 'omr');
  const [password, setPassword] = useState(user?.password || '••••••');
  
  // Store info states
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [storeAddress, setStoreAddress] = useState(user?.storeAddress || '');
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | null>(user?.storeLogoUrl || null);

  const tabs = [
    { id: 'personal', label: 'المعلومات الشخصية', icon: UserCircle },
    { id: 'store', label: 'معلومات المتجر', icon: Building2 },
  ];

  const handleSavePersonalInfo = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updates = { 
        name: merchantName,
        phone: phoneNumber,
        username,
        password
      };
      updateAuthUser(updates);
      if (user?.id) {
        updateGlobalUser(user.id, updates);
      }
      setIsSaving(false);
      alert('تم حفظ البيانات الشخصية بنجاح!');
    }, 800);
  };

  const handleSaveStoreInfo = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updates = { 
        storeName, 
        storeAddress, 
        ...(storeLogoUrl ? { storeLogoUrl } : {})
      };
      updateAuthUser(updates);
      if (user?.id) {
        updateGlobalUser(user.id, updates);
      }
      setIsSaving(false);
      alert('تم حفظ معلومات المتجر بنجاح!');
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setStoreLogoUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] -m-4 lg:-m-8 p-6 md:p-10 space-y-10 text-right overflow-x-hidden" dir="rtl">
      {/* Top Action Bar */}
      <div className="flex justify-start">
        <Link to="/merchant" className="bg-[#0F3B73] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-[#0F3B73]/20 w-fit">
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>

      {/* Header */}
      <div className="relative pr-6">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0F3B73] rounded-full"></div>
        <p className="text-[#0F3B73] font-bold mb-2 text-sm">نظرة عامة</p>
        <h1 className="text-5xl font-black text-[#0F3B73] tracking-tight">إعدادات الحساب</h1>
        <p className="text-slate-500 font-bold mt-2">تعديل بياناتك الشخصية ومعلومات المتجر</p>
      </div>

      {/* Settings Container */}
      <div className="max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-3 py-6 px-4 font-black transition-all relative ${
                activeTab === tab.id 
                  ? 'text-[#0F3B73]' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-[#0F3B73]' : 'text-slate-300'}`} />
              <span className="text-lg">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F3B73] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-10 md:p-16 space-y-12">
          {activeTab === 'personal' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Merchant Name */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-700 font-black text-lg">
                  <User className="w-5 h-5 text-[#0F3B73]" />
                  <span>اسم التاجر</span>
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-800 focus:outline-none focus:border-[#0F3B73] focus:ring-4 focus:ring-[#0F3B73]/5 transition-all text-center text-xl"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-700 font-black text-lg">
                  <Smartphone className="w-5 h-5 text-[#0F3B73]" />
                  <span>رقم الهاتف</span>
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-en font-bold text-slate-800 focus:outline-none focus:border-[#0F3B73] focus:ring-4 focus:ring-[#0F3B73]/5 transition-all text-center text-xl tracking-wider"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-700 font-black text-lg">
                  <Building2 className="w-5 h-5 text-[#0F3B73]" />
                  <span>اسم المستخدم (لتسجيل الدخول)</span>
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-en font-bold text-slate-800 focus:outline-none focus:border-[#0F3B73] focus:ring-4 focus:ring-[#0F3B73]/5 transition-all text-center text-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-700 font-black text-lg">
                  <Key className="w-5 h-5 text-[#0F3B73]" />
                  <span>كلمة المرور</span>
                </label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-800 focus:outline-none focus:border-[#0F3B73] focus:ring-4 focus:ring-[#0F3B73]/5 transition-all text-center text-xl"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="md:col-span-2 flex justify-end pt-6">
                <button 
                  onClick={handleSavePersonalInfo}
                  disabled={isSaving}
                  className="bg-[#0F3B73] hover:bg-opacity-95 text-white px-12 py-5 rounded-[1.5rem] font-black text-xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-[#0F3B73]/20 group disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Right Side: Inputs */}
              <div className="space-y-10">
                {/* Store Name */}
                <div className="space-y-4">
                  <label className="block text-slate-700 font-black text-xl text-right">اسم المتجر</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="أدخل اسم المتجر التجاري"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-800 focus:outline-none focus:border-[#0F3B73] focus:ring-4 focus:ring-[#0F3B73]/5 transition-all text-right text-xl"
                    />
                  </div>
                </div>

                {/* Store Address */}
                <div className="space-y-4">
                  <label className="block text-slate-700 font-black text-xl text-right">عنوان المتجر / المقر</label>
                  <div className="relative">
                    <textarea 
                      rows={4}
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-800 focus:outline-none focus:border-[#0F3B73] focus:ring-4 focus:ring-[#0F3B73]/5 transition-all text-right text-xl resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Left Side: Logo Upload */}
              <div className="flex flex-col items-center justify-center space-y-6">
                <input 
                  type="file" 
                  id="logo-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label 
                  htmlFor="logo-upload"
                  className="w-full max-w-[320px] aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2.5rem] flex flex-col items-center justify-center p-8 group hover:border-[#0F3B73] hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden"
                >
                  {storeLogoUrl ? (
                    <div className="w-full h-full relative rounded-xl overflow-hidden group">
                      <img src={storeLogoUrl} alt="Store logo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold">تغيير الصورة</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#0F3B73]/10 transition-colors">
                        <Store className="w-12 h-12 text-slate-400 group-hover:text-[#0F3B73]" />
                      </div>
                      <p className="text-slate-500 font-black text-lg">تحميل شعار المتجر</p>
                    </>
                  )}
                </label>
                <p className="text-slate-400 font-bold text-sm">يفضل مقاس 512x512 بكسل</p>
              </div>

              {/* Save Button */}
              <div className="md:col-span-2 flex justify-end pt-6">
                <button 
                  onClick={handleSaveStoreInfo}
                  disabled={isSaving}
                  className="bg-[#0F3B73] hover:bg-opacity-95 text-white px-12 py-5 rounded-[1.5rem] font-black text-xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-[#0F3B73]/20 group disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
