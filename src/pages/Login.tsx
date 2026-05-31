import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import { useSettings } from "../context/SettingsContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { users } = useUsers();
  const { companyName, companyLogo } = useSettings();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      login(user.name, user.role, user.id, user.username);
      navigate(user.role === "branch_manager" ? "/warehouse" : `/${user.role}`);
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="mb-8 flex flex-col items-center gap-3">
        {companyLogo ? (
          <img src={companyLogo} alt={companyName} className="w-24 h-24 object-contain rounded-xl shadow-lg border border-slate-100 bg-white p-2" />
        ) : (
          <div className="w-20 h-20 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-4xl font-bold text-white tracking-tighter">
              {companyName ? companyName.charAt(0) : "D"}
            </span>
          </div>
        )}
        <h1 className="text-4xl font-bold text-[#0F3B73] font-en tracking-tight text-center">
          {companyName || "Delevary"}
        </h1>
        <p className="text-slate-500 text-center max-w-sm mt-2 font-medium">
          المنصة اللوجستية المتكاملة لإدارة مستودعاتك، وتتبع مناديبك بسلاسة.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8">
        <h2 className="text-xl font-bold text-[#0F3B73] mb-6 text-center uppercase tracking-widest">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#0F3B73] transition-colors font-bold text-right"
                placeholder="أدخل اسم المستخدم"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#0F3B73] transition-colors font-bold text-right"
                placeholder="••••••••"
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

        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-center text-xs font-bold text-slate-500 mb-4 px-2 uppercase tracking-wide">
            أزرار اختبار التطبيق (دخول سريع)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const user = users.find(u => u.role === 'admin');
                if (user) {
                  login(user.name, user.role, user.id, user.username);
                  navigate('/admin');
                }
              }}
              className="bg-purple-50 text-purple-700 hover:bg-purple-100 py-3 rounded-xl font-bold text-sm transition-colors border border-purple-100 shadow-sm"
              type="button"
            >
              بوابة الإدارة
            </button>
            <button
              onClick={() => {
                const user = users.find(u => u.role === 'branch_manager');
                if (user) {
                  login(user.name, user.role, user.id, user.username);
                  navigate('/warehouse');
                } else {
                  login('مدير مخزن تجريبي', 'branch_manager', 'demo-branch', 'branch');
                  navigate('/warehouse');
                }
              }}
              className="bg-orange-50 text-orange-700 hover:bg-orange-100 py-3 rounded-xl font-bold text-sm transition-colors border border-orange-100 shadow-sm"
              type="button"
            >
              بوابة المخزن الفرعي
            </button>
            <button
              onClick={() => {
                const user = users.find(u => u.role === 'driver');
                if (user) {
                  login(user.name, user.role, user.id, user.username);
                  navigate('/driver');
                } else {
                  login('مندوب تجريبي', 'driver', 'demo-driver', 'driver');
                  navigate('/driver');
                }
              }}
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 py-3 rounded-xl font-bold text-sm transition-colors border border-blue-100 shadow-sm"
              type="button"
            >
              بوابة المندوب
            </button>
            <button
              onClick={() => {
                const user = users.find(u => u.role === 'merchant');
                if (user) {
                  login(user.name, user.role, user.id, user.username);
                  navigate('/merchant');
                } else {
                  login('تاجر تجريبي', 'merchant', 'demo-merchant', 'merchant');
                  navigate('/merchant');
                }
              }}
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-3 rounded-xl font-bold text-sm transition-colors border border-emerald-100 shadow-sm"
              type="button"
            >
              بوابة التاجر
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
        v4.2.0-Alpha • Delevary 2026
      </p>
    </div>
  );
}
