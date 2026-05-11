import React, { useState } from 'react';
import { Building2, Search, Plus, MapPin, Phone, Users, Package, MoreVertical, Edit2, Trash2, Truck } from 'lucide-react';
import { useBranches } from '../../context/BranchContext';

export default function AdminBranches() {
  const { branches, addBranch, deleteBranch } = useBranches();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    city: '',
    manager: '',
    phone: '',
    status: 'active' as const
  });

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.city || !newBranch.manager || !newBranch.phone) {
      alert('الرجاء إكمال جميع الحقول');
      return;
    }
    addBranch(newBranch);
    setIsAddModalOpen(false);
    setNewBranch({ name: '', city: '', manager: '', phone: '', status: 'active' });
    alert('تم إضافة الفرع بنجاح');
  };

  const handleDeleteBranch = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف فرع ${name}؟`)) {
      deleteBranch(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الفروع</h1>
          <p className="text-slate-500 mt-1">تتبع وإدارة جميع فروع الشركة ومراكز التوزيع</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث عن فرع..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 border border-slate-200 rounded-xl pr-10 pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-4 py-2 rounded-xl transition-colors font-bold shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">إضافة فرع</span>
          </button>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#0F3B73]/30 transition-colors">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-bl-full pointer-events-none -z-10" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0F3B73] to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800">{branch.name}</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{branch.status === 'active' ? 'نشط' : 'غير نشط'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteBranch(branch.id, branch.name)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>المدير</span>
                </div>
                <span className="font-bold text-slate-800">{branch.manager}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span>المدينة</span>
                </div>
                <span className="font-bold text-slate-800">{branch.city || '-'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-4 h-4" />
                  <span>الهاتف</span>
                </div>
                <span className="font-en font-bold text-slate-800">{branch.phone}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-slate-500 text-xs mb-1">المناديب</div>
                  <div className="font-black text-xl text-slate-800 flex items-center justify-center gap-1">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span className="font-en">{branch.drivers || 0}</span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-blue-600 text-xs mb-1">الطلبات</div>
                  <div className="font-black text-xl text-[#0F3B73] flex items-center justify-center gap-1">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="font-en">{branch.orders || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {branches.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            <Building2 className="w-16 h-16 mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-500">لا توجد فروع</h3>
            <p className="mt-2 text-center text-sm">قم بإضافة الفرع الأول للشركة بالضغط على الزر أعلاه</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">إضافة فرع جديد</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                X
              </button>
            </div>
            
            <form onSubmit={handleAddBranch} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">اسم الفرع</label>
                <input 
                  type="text" 
                  value={newBranch.name}
                  onChange={e => setNewBranch({...newBranch, name: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  placeholder="مثال: فرع بغداد - الكرخ"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">المحافظة / المدينة</label>
                <input 
                  type="text" 
                  value={newBranch.city}
                  onChange={e => setNewBranch({...newBranch, city: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  placeholder="مثال: بغداد"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">مدير الفرع</label>
                <input 
                  type="text" 
                  value={newBranch.manager}
                  onChange={e => setNewBranch({...newBranch, manager: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  placeholder="اسم مدير الفرع"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">رقم الهاتف</label>
                <input 
                  type="text" 
                  value={newBranch.phone}
                  onChange={e => setNewBranch({...newBranch, phone: e.target.value})}
                  className="w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left font-en" 
                  placeholder="07XX XXX XXXX"
                  dir="ltr"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 px-4 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 font-bold text-white bg-[#0F3B73] hover:bg-[#0F3B73]/90 rounded-xl transition-colors shrink-0"
                >
                  حفظ الفرع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
