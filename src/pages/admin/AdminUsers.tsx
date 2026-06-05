import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Shield, X, MapPin } from 'lucide-react';
import { useUsers, UserRole } from '../../context/UserContext';
import { useBranches } from '../../context/BranchContext';

export default function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { branches } = useBranches();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'driver' as UserRole,
    phone: '',
    branch: '',
    username: '',
    password: '',
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return { label: 'إدارة', color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'merchant': return { label: 'تاجر', color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'driver': return { label: 'مندوب', color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'branch_manager': return { label: 'مدير فرع', color: 'bg-blue-50 text-blue-600 border-blue-100' };
      default: return { label: 'مستخدم', color: 'bg-slate-50 text-slate-600 border-slate-100' };
    }
  };

  const handleEditUser = (user: any) => {
    setNewUser({
      name: user.name || '',
      role: user.role || 'driver',
      phone: user.phone || '',
      branch: user.branch || '',
      username: user.username || '',
      password: user.password || '',
    });
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.phone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف");
      return;
    }
    
    if (editingUserId) {
      updateUser(editingUserId, {
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        branch: newUser.branch,
        username: newUser.username,
        password: newUser.password,
      });
      alert('تم تعديل المستخدم بنجاح');
    } else {
      addUser({
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        branch: newUser.branch,
        username: newUser.username,
        password: newUser.password,
        status: 'active',
        ...(newUser.role === 'merchant' ? { balance: 0 } : {}),
        ...(newUser.role === 'driver' ? { vehicleType: 'van', maxLoad: 50, currentLoad: 0, rating: 5.0 } : {})
      });
      alert('تم إضافة المستخدم بنجاح');
    }
    
    setNewUser({ name: '', role: 'driver', phone: '', branch: '', username: '', password: '' });
    setEditingUserId(null);
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUserToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
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
                <th className="px-6 py-4 font-bold text-slate-600">اسم المستخدم (User)</th>
                <th className="px-6 py-4 font-bold text-slate-600">كلمة المرور (Pass)</th>
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
                      <div className="mt-2 text-xs font-medium text-slate-500 whitespace-nowrap">
                        <MapPin className="w-3 h-3 inline ml-1"/> {user.branch}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-en font-bold text-slate-600">{user.phone}</td>
                  <td className="px-6 py-4 font-en font-bold text-slate-600">{user.username || '-'}</td>
                  <td className="px-6 py-4 font-en font-bold text-slate-600">{user.password || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {user.status === 'active' ? (
                      <span className="text-blue-500 font-bold">نشط</span>
                    ) : (
                      <span className="text-slate-400 font-bold">غير نشط</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
                      >
                        تعديل
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
                      >
                        حذف
                      </button>
                    </div>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-800">{editingUserId ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
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
                  <option value="branch_manager">مدير فرع</option>
                  <option value="admin">إدارة</option>
                </select>
              </div>

              {(newUser.role === 'branch_manager' || newUser.role === 'driver') && (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-bold text-sm">الفرع التابع له (اختياري للمندوب)</label>
                  <select 
                    value={newUser.branch}
                    onChange={e => setNewUser({...newUser, branch: e.target.value})}
                    className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white font-bold" 
                  >
                    <option value="">اختر الفرع...</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

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

              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">اسم المستخدم للولوج</label>
                <input 
                  type="text" 
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-left font-en font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  placeholder="username"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">كلمة المرور</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-left font-en focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  placeholder="********"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
              <button 
                onClick={handleAddUser}
                className="flex-1 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white py-3 rounded-xl font-bold transition-all"
              >
                {editingUserId ? 'حفظ التعديلات' : 'حفظ وإضافة'}
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

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">حذف المستخدم</h2>
              <p className="text-slate-500 text-sm">
                هل أنت متأكد من حذف المستخدم <span className="font-bold text-slate-700">{userToDelete.name}</span>؟<br/> لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all"
              >
                تأكيد الحذف
              </button>
              <button 
                onClick={() => setUserToDelete(null)}
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
