import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Phone,
  Truck,
  Lock,
  MapPin,
  Star,
  Activity,
  Save,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUsers, AppUser } from "../../context/UserContext";

export default function DriverSettings() {
  const { user } = useAuth();
  const { users, updateUser } = useUsers();

  // Find the driver's full profile
  const driverProfile = users.find((u) => u.id === user?.id) as
    | AppUser
    | undefined;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (driverProfile) {
      setUsername(driverProfile.username || "");
      setPassword(driverProfile.password || "");
    }
  }, [driverProfile]);

  const handleSave = () => {
    if (!driverProfile) return;
    setIsSaving(true);

    setTimeout(() => {
      updateUser(driverProfile.id, { username, password });
      setIsSaving(false);
      setSuccessMsg("تم تحديث بيانات الدخول بنجاح!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 500);
  };

  if (!driverProfile) return null;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto px-4 mt-4">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            إعدادات الحساب
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            تحديث بيانات الدخول ومشاهدة بيانات الحساب
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-center font-bold">
          {successMsg}
        </div>
      )}

      {/* Editable Section: Login Details */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-400" />
          بيانات الدخول (قابلة للتعديل)
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand font-bold text-right"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">
              كلمة المرور
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand font-bold text-right tracking-widest"
              dir="ltr"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-brand text-white font-bold py-3 mt-4 rounded-xl flex items-center justify-center gap-2 disabled:bg-slate-300 transition-colors"
          >
            {isSaving ? (
              "جاري الحفظ..."
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ بيانات الدخول
              </>
            )}
          </button>
        </div>
      </div>

      {/* Read-Only Section: Info entered by admin */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-slate-400" />
          بيانات المندوب (للعرض فقط)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                الاسم الكامل
              </p>
            </div>
            <p className="font-bold text-slate-800">{driverProfile.name}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                رقم الهاتف
              </p>
            </div>
            <p className="font-bold text-slate-800 font-en" dir="ltr">
              {driverProfile.phone}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                الفرع المرتبط به
              </p>
            </div>
            <p className="font-bold text-slate-800">
              {driverProfile.branch || "الفرع الرئيسي"}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                الحالة
              </p>
            </div>
            <p className="font-bold text-slate-800 uppercase text-xs tracking-wider">
              {driverProfile.status === "active"
                ? "متصل"
                : driverProfile.status === "busy"
                  ? "مشغول"
                  : "غير متصل"}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                المركبة والحمولة
              </p>
            </div>
            <p className="font-bold text-slate-800">
              {driverProfile.vehicleType === "van"
                ? "شاحنة مغلقة"
                : driverProfile.vehicleType === "motorcycle"
                  ? "دراجة نارية"
                  : "دينا"}
              <span className="text-slate-400 mx-2">|</span>
              حمولة الطرود القصوى:{" "}
              <span className="font-en">{driverProfile.maxLoad || 50}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
