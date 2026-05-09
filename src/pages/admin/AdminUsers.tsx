import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Shield, X } from 'lucide-react';
import { useUsers, UserRole } from '../../context/UserContext';

export default function AdminUsers() {
  const { users, addUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'driver' as UserRole,
    phone: '',
    branch: '',
  });

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return { label: 'إدارة', color: 'bg-red-50 text-red-600 border-red-100' };
      case 'merchant': return { label: 'تاجر', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 'driver': return { label: 'مندوب', color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'warehouse': return { label: 'مخزن', color: 'bg-orange-50 text-orange-600 border-orange-100' };
      default: return { label: 'مستخدم', color: 'bg-slate-50 text-slate-600 border-slate-100' };
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.phone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف");
      return;
    }
    addUser({
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      status: 'active',
      ...(newUser.role === 'merchant' ? { balance: 0 } : {}),
      ...((newUser.role === 'driver' || newUser.role === 'warehouse') ? { branch: newUser.branch } : {}),
      ...(newUser.role === 'driver' ? { vehicleType: 'van', maxLoad: 50, currentLoad: 0, rating: 5.0 } : {})
    });
    setNewUser({ name: '', role: 'driver', phone: '', branch: '' });
    setIsModalOpen(false);
    alert('تم إضافة المستخدم بنجاح');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">إدارة المستخدمين</h1>
          <p className="text-slate-500 font-medium mt-1">تعديل وإضافة جميع مستخدمي النظام (تجار، مندوبين، مخازن، إدارة)</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> إضافة مستخدم
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input type="text" placeholder="بحث بالاسم أو الهاتف..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">الاسم</th>
                <th className="px-6 py-4 font-bold text-slate-600">الدور</th>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الهاتف</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const roleInfo = getRoleLabel(user.role);
                return (
                 <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                    {user.branch && (
                      <div className="mt-2 text-xs font-medium text-slate-500">
                        {user.branch}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-en font-bold text-slate-600">{user.phone}</td>
                  <td className="px-6 py-4 text-center">
                    {user.status === 'active' ? (
                      <span className="text-emerald-500 font-bold">نشط</span>
                    ) : (
                      <span className="text-slate-400 font-bold">غير نشط</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors">
                      تعديل
                    </button>
                  </td>
                 </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">إضافة مستخدم جديد</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">الاسم الكامل</label>
                  <input 
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  placeholder="أدخل اسم المستخدم"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">الدور</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white font-bold" 
                >
                  <option value="driver">مندوب</option>
                  <option value="merchant">تاجر</option>
                  <option value="warehouse">أمين مخزن فرعي</option>
                  <option value="admin">إدارة</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">رقم الهاتف</label>
                <input 
                  type="text" 
                  value={newUser.phone}
                  onChange={e => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-left font-en font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  placeholder="07XXXXXXXXX"
                  dir="ltr"
                />
              </div>

              {(newUser.role === 'driver' || newUser.role === 'warehouse') && (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-bold text-sm">الفرع (اختياري)</label>
                  <select 
                    value={newUser.branch}
                    onChange={e => setNewUser({...newUser, branch: e.target.value})}
                    className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white font-bold" 
                  >
                    <option value="">جميع الفروع / غير محدد</option>
                    <option value="بغداد - الرصافة">بغداد - الرصافة</option>
                    <option value="بغداد - الكرخ">بغداد - الكرخ</option>
                    <option value="البصرة">البصرة</option>
                    <option value="أربيل">أربيل</option>
                    <option value="الموصل">الموصل</option>
                  </select>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={handleAddUser}
                className="flex-1 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white py-3 rounded-xl font-bold transition-all"
              >
                حفظ وإضافة
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
