import React, { useState } from 'react';
import { Package, Search, History, Building2, Truck, Star, ArrowLeftRight, Check, X } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useBranches } from '../../context/BranchContext';

export default function WarehouseIncomingOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  
  const drivers = users.filter(u => u.role === 'driver');
  
  const branchOrders = orders.filter(o => 
    o.status === 'branch_transfering' || o.status === 'branch_warehouse'
  );

  const [activeTab, setActiveTab] = useState<'new' | 'delivering'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});

  const handleReceiveOrder = (id: string) => {
    updateOrderStatus(id, 'branch_warehouse');
  };

  const handleReceiveSelected = () => {
    selectedIds.forEach(id => updateOrderStatus(id, 'branch_warehouse'));
    setSelectedIds([]);
  };

  const handleAssignToDriver = (id: string) => {
    const driverId = selectedDrivers[id];
    if (!driverId) {
      alert("الرجاء اختيار مندوب");
      return;
    }
    const driver = drivers.find(d => d.id === driverId);
    if(driver) {
       updateOrderStatus(id, 'driver_assigned', { driverId: driver.id, driverName: driver.name });
       alert(`تم تحويل الطلب إلى المندوب ${driver.name}`);
    }
  };

  const filteredOrders = branchOrders.filter(o => {
    const matchesSearch = o.id.includes(searchQuery) || o.merchantName.includes(searchQuery);
    if (!matchesSearch) return false;
    
    if (activeTab === 'new') return o.status === 'branch_transfering';
    if (activeTab === 'delivering') return o.status === 'branch_warehouse';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'branch_transfering': return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold border border-yellow-100">وارد من المخزن الرئيسي</span>;
      case 'branch_warehouse': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">في الفرع </span>;
      case 'driver_assigned': return <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold border border-purple-100">قيد التوصيل</span>;
      default: return <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-200">غير معروف</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الطلبات الواردة</h1>
          <p className="text-slate-500 mt-1">إستلام الطلبات من المخزن الرئيسي وتوزيعها للمناديب</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-3xl border transition-all cursor-pointer ${activeTab === 'new' ? 'bg-[#0F3B73] border-[#0F3B73] text-white shadow-lg shadow-blue-900/20' : 'bg-white border-slate-200 hover:border-[#0F3B73]/30'}`} onClick={() => setActiveTab('new')}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'new' ? 'bg-white/20' : 'bg-blue-50 text-[#0F3B73]'}`}>
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-bold ${activeTab === 'new' ? 'text-blue-100' : 'text-slate-500'}`}>طلبات واردة (جديدة)</p>
              <h3 className="text-2xl font-black mt-1 font-en">{branchOrders.filter(o => o.status === 'branch_transfering').length}</h3>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-all cursor-pointer ${activeTab === 'delivering' ? 'bg-[#0F3B73] border-[#0F3B73] text-white shadow-lg shadow-blue-900/20' : 'bg-white border-slate-200 hover:border-[#0F3B73]/30'}`} onClick={() => setActiveTab('delivering')}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'delivering' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-bold ${activeTab === 'delivering' ? 'text-blue-100' : 'text-slate-500'}`}>في الفرع (بانتظار التوزيع)</p>
              <h3 className="text-2xl font-black mt-1 font-en">{branchOrders.filter(o => o.status === 'branch_warehouse').length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث برقم الطلب او اسم التاجر..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
            />
          </div>
          
          {selectedIds.length > 0 && activeTab === 'new' && (
            <button 
              onClick={handleReceiveSelected}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              تأكيد استلام ({selectedIds.length}) طلب
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                {activeTab === 'new' && (
                  <th className="px-6 py-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-[#0F3B73] focus:ring-[#0F3B73]"
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredOrders.map(o => o.id));
                        else setSelectedIds([]);
                      }}
                      checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                    />
                  </th>
                )}
                <th className="px-6 py-4 font-bold">رقم الطلب</th>
                <th className="px-6 py-4 font-bold">التاجر</th>
                <th className="px-6 py-4 font-bold">المخزن المحول منه</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="font-bold">لا توجد طلبات في هذا القسم حالياً</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(order.id) ? 'bg-blue-50/50' : ''}`}>
                    {activeTab === 'new' && (
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-[#0F3B73] focus:ring-[#0F3B73]"
                          checked={selectedIds.includes(order.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, order.id]);
                            else setSelectedIds(selectedIds.filter(id => id !== order.id));
                          }}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 font-en font-bold text-slate-800">{order.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.merchantName}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">المخزن الرئيسي</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                       {order.status === 'branch_transfering' ? (
                          <button 
                            onClick={() => handleReceiveOrder(order.id)}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-colors text-xs"
                          >
                            <Check className="w-4 h-4" /> تأكيد استلام
                          </button>
                       ) : (
                         <div className="flex items-center gap-2 max-w-[250px] mx-auto">
                           <select 
                             className="border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none w-full text-xs font-bold"
                             onChange={(e) => setSelectedDrivers(prev => ({...prev, [order.id]: e.target.value}))}
                             value={selectedDrivers[order.id] || ""}
                           >
                             <option value="" disabled>اختر المندوب...</option>
                             {Array.from(new Set(drivers.map(d => d.branch || 'غير محدد'))).map(branch => (
                               <optgroup key={branch} label={branch}>
                                 {drivers.filter(d => (d.branch || 'غير محدد') === branch).map(d => (
                                   <option key={d.id} value={d.id}>{d.name} ({d.vehicleType})</option>
                                 ))}
                               </optgroup>
                             ))}
                           </select>
                           <button 
                             onClick={() => handleAssignToDriver(order.id)}
                             className="text-white bg-[#0F3B73] hover:bg-[#0F3B73]/90 px-3 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center shrink-0"
                             title="توزيع"
                           >
                             <Truck className="w-4 h-4" />
                           </button>
                         </div>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
