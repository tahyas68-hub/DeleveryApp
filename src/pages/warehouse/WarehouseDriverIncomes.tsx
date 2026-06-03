import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Wallet, 
  DollarSign, 
  ClipboardList,
  ChevronDown,
  FileText,
  Printer,
  X,
  CheckCircle,
  Inbox
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';
import { useFinance } from '../../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

export default function WarehouseDriverIncomes() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  const { getDriverCommission } = useSettings();
  const { addTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [ledgerDriver, setLedgerDriver] = useState<any>(null);

  // Get drivers
  const driversList = users.filter((u) => u.role === 'driver');

  // Calculate accounts
  const driverAccounts = driversList.map((driver) => {
    const driverOrders = orders.filter(o => 
      o.driverId === driver.id && 
      (o.status === 'delivered' || o.status === 'delivered_partial' || o.status === 'returned_partial') &&
      (o.financialStatus === 'pending' || o.financialStatus === 'driver_cleared')
    );
    
    // Amount collected from customers (Debt)
    const totalCollected = driverOrders.reduce((sum, o) => {
      // For partial delivery/return, the collected amount might be less than the total amount
      const amountToCollect = o.collectedAmount !== undefined ? o.collectedAmount : (o.amount || 0);
      return sum + amountToCollect;
    }, 0);

    return {
      ...driver,
      driverOrders,
      orderCount: driverOrders.length,
      debt: totalCollected
    };
  }).filter(d => d.orderCount > 0 || searchTerm !== ''); // Only show drivers with relevant orders if no search term

  const filteredDrivers = driverAccounts.filter((d) => 
    (d.name || '').includes(searchTerm) || (d.phone || '').includes(searchTerm)
  );

  const handleConfirmStorage = () => {
    if (!selectedDriver) return;
    
    const driver = selectedDriver;

    // 1. Add receipt transaction for debt
    addTransaction({
      type: 'receipt',
      amount: driver.debt,
      fromEntity: driver.name,
      toEntity: 'warehouse',
      referenceId: `settlement-${Date.now()}`,
      description: `قبض مبالغ من المندوب: ${driver.name} عن ${driver.orderCount} طلب/طلبات`,
      userId: 'session-user'
    });

    // 2. Mark orders as collected_from_driver (in safe)
    driver.driverOrders.forEach((order: any) => {
      updateOrderStatus(order.id, order.status, { financialStatus: 'collected_from_driver' });
    });

    // Add a slight delay before opening the print dialog, then close modal after
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setSelectedDriver(null);
      }, 500);
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#0F3B73]">مقبوضات من المناديب</h1>
          <p className="text-slate-500 font-bold">استلام الغلة وإصدار مستندات القبض</p>
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
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                <th className="px-4 py-4 font-black text-slate-400">المندوب</th>
                <th className="px-4 py-4 font-black text-slate-400">المبلغ المحصل (الذمة)</th>
                <th className="px-4 py-4 font-black text-slate-400 text-center flex-1">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm p-4">
              {filteredDrivers.length === 0 ? (
                <tr>
                   <td colSpan={3} className="px-4 py-12 text-center text-slate-400 font-bold">لا توجد مبالغ حالياً في هذه القائمة</td>
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
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{driver.orderCount} طلب/شحنة</span>
                       </div>
                    </td>
                    <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
                           <button onClick={() => setLedgerDriver(driver)} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-slate-200 transition-all whitespace-nowrap justify-center">
                              <ClipboardList className="w-4 h-4" />
                              سجل
                           </button>
                           <button 
                             onClick={() => setSelectedDriver(driver)}
                             disabled={driver.orderCount === 0 || driver.debt === 0}
                             className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-black text-xs md:text-sm hover:bg-emerald-700 transition-all whitespace-nowrap justify-center disabled:opacity-50 shadow-lg shadow-emerald-200"
                           >
                              <FileText className="w-4 h-4" />
                              استلام المبالغ وإصدار وصل
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

      {/* Receipt Modal (Also acts as Print View) */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm print:static print:bg-white">
          <div className="flex min-h-full items-center justify-center p-4 print:p-0 print:block">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none">
            
            {/* Header / Actions - Hidden in Print */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 print:hidden bg-slate-50">
              <h2 className="text-xl font-black text-[#0F3B73]">استخراج مستند قبض</h2>
              <button 
                onClick={() => setSelectedDriver(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Printable Area */}
            <div className="p-8 space-y-6">
              {/* Receipt Header */}
              <div className="text-center space-y-2 border-b-2 border-dashed border-slate-300 pb-6">
                <div className="w-16 h-16 bg-[#0F3B73] text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">مستند قبض</h1>
                <p className="text-slate-500 font-bold font-en">{new Date().toLocaleString('ar-IQ')}</p>
                <div className="pt-2 text-sm font-bold text-slate-400">
                  رقم المستند: <span className="font-en">REC-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>

              {/* Driver Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 font-bold">اسم المندوب</span>
                  <span className="text-lg font-black text-slate-800">{selectedDriver.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 font-bold">عدد الطلبات المسلمة والراجعة جزئياً</span>
                  <span className="text-lg font-black font-en text-slate-800">{selectedDriver.orderCount}</span>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="font-bold text-orange-800">إجمالي المبالغ المستلمة (الذمة)</span>
                  <span className="text-xl font-black font-en text-orange-600">{selectedDriver.debt.toLocaleString()} د.ع</span>
                </div>
                
                <div className="border-t-2 border-slate-800 my-4"></div>

                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900 text-white">
                  <span className="text-lg font-black">الصافي لقبضه بالصندوق</span>
                  <span className="text-3xl font-black font-en tracking-tight">{selectedDriver.debt.toLocaleString()} د.ع</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between mt-12 pt-8 text-center text-slate-600 font-bold">
                <div className="w-32 border-t-2 border-slate-300 pt-2">توقيع المستلم (المخزن)</div>
                <div className="w-32 border-t-2 border-slate-300 pt-2">توقيع المندوب</div>
              </div>
            </div>

            {/* Footer Actions - Hidden in Print */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 print:hidden">
              <button 
                onClick={handleConfirmStorage}
                className="flex-1 bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-5 h-5" />
                تأكيد وتسوية وتصدير السند
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Ledger Modal */}
      {ledgerDriver && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-[#0F172A] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]">
              <h2 className="text-xl font-black text-white">سجل المندوب: {ledgerDriver.name}</h2>
              <button 
                onClick={() => setLedgerDriver(null)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-[#0F172A]">
              <div className="bg-white rounded-2xl p-4 shadow-inner border border-slate-800/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">رقم الطلب</th>
                        <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">العميل</th>
                        <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">المبلغ المحصل (ذمة)</th>
                        <th className="px-4 py-3 font-black text-slate-700 text-xs border-l border-slate-100">الحالة</th>
                        <th className="px-4 py-3 font-black text-slate-700 text-xs font-sans">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerDriver.driverOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-bold text-sm">
                            لا توجد طلبات مسلمة ومستحقة التسوية
                          </td>
                        </tr>
                      ) : (
                        ledgerDriver.driverOrders.map((o: any) => {
                          const collected = o.collectedAmount !== undefined ? o.collectedAmount : (o.amount || 0);
                          return (
                            <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-bold font-en text-slate-800 text-xs">{o.id}</td>
                              <td className="px-4 py-3 font-bold text-slate-700 text-xs">{o.customerName}</td>
                              <td className="px-4 py-3 font-bold font-en text-orange-600 text-xs">{collected.toLocaleString()}</td>
                              <td className="px-4 py-3 font-bold text-xs">{o.status === 'delivered' ? 'واصل كلي' : o.status === 'delivered_partial' ? 'واصل جزئي' : 'راجع جزئي'}</td>
                              <td className="px-4 py-3 font-bold font-en text-slate-500 text-xs">{o.date ? o.date.split('T')[0] : 'N/A'}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end bg-[#1E293B]">
              <button 
                onClick={() => setLedgerDriver(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2 rounded-xl transition-all"
              >
                إغلاق السجل
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
