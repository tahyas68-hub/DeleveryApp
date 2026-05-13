import React, { useState } from 'react';
import { Store, Search, Shield, X, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useUsers, UserRole, AppUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';

export default function AdminMerchants() {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const merchants = users.filter((u: AppUser) => u.role === 'merchant');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'merchant' as UserRole,
    phone: '',
    username: '',
    password: '',
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const handleEditUser = (user: AppUser) => {
    setNewUser({
      name: user.name || '',
      role: 'merchant',
      phone: user.phone || '',
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
        username: newUser.username,
        password: newUser.password,
      });
      alert('تم تعديل التاجر بنجاح');
    } else {
      addUser({
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        username: newUser.username,
        password: newUser.password,
        status: 'active',
        balance: 0
      });
      alert('تم إضافة التاجر بنجاح');
    }
    
    setNewUser({ name: '', role: 'merchant', phone: '', username: '', password: '' });
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

  const filteredMerchants = merchants.filter(merchant => 
    merchant.name.includes(searchTerm) || (merchant.phone && merchant.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">قائمة التجار</h1>
          <p className="text-slate-500 font-medium mt-1">تضم كل مستخدم بدور تاجر يتم إضافته من قبل الإدارة</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="بحث باسم التاجر أو رقم الهاتف..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#0F3B73]/20" 
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#0F3B73]/5 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">الاسم / المتجر</th>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الهاتف</th>
                <th className="px-6 py-4 font-bold text-slate-600">اسم المستخدم (User)</th>
                <th className="px-6 py-4 font-bold text-slate-600">كلمة المرور (Pass)</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">لا يوجد تجار مسجلين</td>
                </tr>
              ) : (
                filteredMerchants.map((acc: AppUser) => (
                  <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                           <Store className="w-4 h-4" />
                         </div>
                         {acc.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-slate-600">{acc.phone || '-'}</td>
                    <td className="px-6 py-4 font-en font-bold text-slate-600">{acc.username || '-'}</td>
                    <td className="px-6 py-4 font-en font-bold text-slate-600">{acc.password || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      {acc.status === 'active' ? (
                        <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded">نشط</span>
                      ) : (
                        <span className="text-slate-400 font-bold">غير نشط</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          to={`/admin/merchants/${acc.id}`}
                          className="text-[#0F3B73] bg-[#0F3B73]/10 hover:bg-[#0F3B73]/20 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> عرض التفاصيل
                        </Link>
                        <button 
                          onClick={() => handleEditUser(acc)}
                          className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> تعديل
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(acc.id, acc.name)}
                          className="text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Add User Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-emerald-50">
              <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                <Store className="w-5 h-5"/>
                {editingUserId ? 'تعديل بيانات التاجر' : 'إضافة تاجر جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-100 text-emerald-600 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">اسم التاجر / المتجر</label>
                  <input 
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                  placeholder="أدخل اسم المتجر أو التاجر"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">رقم الهاتف</label>
                <input 
                  type="text" 
                  value={newUser.phone}
                  onChange={e => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-left font-en font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
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
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-left font-en font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
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
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-left font-en focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                  placeholder="********"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
              <button 
                onClick={handleAddUser}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all"
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
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">حذف التاجر</h2>
              <p className="text-slate-500 text-sm">
                هل أنت متأكد من حذف التاجر <span className="font-bold text-slate-700">{userToDelete.name}</span>؟<br/> لا يمكن التراجع عن هذا الإجراء وسيتم مسح كافة البيانات المرتبطة به.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all"
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
