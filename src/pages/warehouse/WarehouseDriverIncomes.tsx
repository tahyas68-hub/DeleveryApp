import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Wallet, 
  DollarSign, 
  ClipboardList,
  ChevronDown
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

export default function WarehouseDriverIncomes() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { users } = useUsers();
  const { getDriverCommission } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');

  // Get drivers
  const driversList = users.filter((u) => u.role === 'driver');

  // Calculate accounts per driver
  const driverAccounts = driversList.map((driver) => {
    const driverOrders = orders.filter(o => 
      o.driverId === driver.id && 
      (o.status === 'delivered' || o.status === 'returned_partial')
    );
    
    // Amount collected from customers (Debt)
    const totalCollected = driverOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    // Driver's commission
    const totalCommission = driverOrders.reduce((sum, order) => sum + getDriverCommission(order.province), 0);

    return {
      ...driver,
      orderCount: driverOrders.length,
      debt: totalCollected,
      commission: totalCommission,
    };
  });

  const filteredDrivers = driverAccounts.filter((d) => 
    (d.name || '').includes(searchTerm) || (d.phone || '').includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#0F3B73]">حسابات المندوبين</h1>
          <p className="text-slate-500 font-bold">إدارة الذمم المالية والعمولات للمناديب</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => navigate('/warehouse')}
             className="flex items-center gap-2 bg-white text-[#0F3B73] border-2 border-[#0F3B73]/20 px-6 py-2.5 rounded-xl font-black hover:bg-slate-50 transition-colors"
           >
             <ArrowLeft className="w-5 h-5" />
             العودة
           </button>
        </div>
      </div>

      {/* Table Box */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                <th className="px-4 py-4 font-black text-slate-400">المندوب</th>
                <th className="px-4 py-4 font-black text-slate-400">الذمة (مبالغ للقبض)</th>
                <th className="px-4 py-4 font-black text-slate-400">العمولة المستحقة</th>
                <th className="px-4 py-4 font-black text-slate-400 text-center flex-1">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm p-4">
              {filteredDrivers.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-4 py-12 text-center text-slate-400 font-bold">لا يوجد مناديب حالياً متاحين</td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-4">
                       <div className="flex flex-col">
                          <span className="text-lg md:text-xl font-black text-[#0F3B73]">{driver.name}</span>
                          <span className="text-slate-400 font-en font-bold text-xs">{driver.email}</span>
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex flex-col">
                          <span className="text-xl md:text-2xl font-black text-orange-500 font-en">{driver.debt.toLocaleString()} د.ع</span>
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">ذمة المندوبين</span>
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex flex-col">
                          <span className="text-lg md:text-xl font-black text-emerald-500 font-en">{driver.commission.toLocaleString()} د.ع</span>
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{driver.orderCount} طلب</span>
                       </div>
                    </td>
                    <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
                           <button className="flex items-center gap-1.5 bg-[#0F3B73] text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-black text-xs md:text-sm hover:bg-[#0F3B73]/90 transition-all flex-1 whitespace-nowrap justify-center">
                              <ClipboardList className="w-4 h-4" />
                              سجل
                           </button>
                           <button className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-black text-xs md:text-sm hover:bg-blue-600 transition-all flex-1 whitespace-nowrap justify-center">
                              <Wallet className="w-4 h-4" />
                              مستند قبض
                           </button>
                           <button className="flex items-center gap-1.5 bg-[#9333ea] text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-black text-xs md:text-sm hover:bg-[#7e22ce] transition-all flex-1 whitespace-nowrap justify-center">
                              <DollarSign className="w-4 h-4" />
                              صرف عمولة
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
    </div>
  );
}
