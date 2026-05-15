import React, { useState, useRef } from 'react';
import { DollarSign, Search, CarFront, ArrowUpRight, ArrowDownLeft, X, Printer, Package } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';
import { useReactToPrint } from 'react-to-print';

export default function WarehouseDriverIncomes() {
  const { orders } = useOrders();
  const { users } = useUsers();
  const { getDriverCommission } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const [docModal, setDocModal] = useState<{
    isOpen: boolean;
    type: 'receipt' | 'disbursement';
    driver: { name: string; amount: number } | null;
    docNumber: string;
    docDate: string;
  }>({
    isOpen: false,
    type: 'receipt',
    driver: null,
    docNumber: '',
    docDate: ''
  });

  // Get drivers
  const drivers = users.filter((u: any) => u.role === 'driver');

  // Calculate incomes per driver
  const driverIncomes = drivers.map((driver: any) => {
    const driverOrders = orders.filter(o => 
      o.driverId === driver.id && 
      (o.status === 'delivered' || o.status === 'returned_partial')
    );
    
    // Amount collected from customers
    const totalAmount = driverOrders.reduce((sum, o) => {
      // For returned_partial, we assume o.amount is the partial amount collected
      return sum + (o.amount || 0);
    }, 0);

    // Driver's commission
    const totalCommission = driverOrders.reduce((sum, order) => sum + getDriverCommission(order.province), 0);

    return {
      ...driver,
      deliveredOrdersCount: driverOrders.length,
      totalAmount,
      totalCommission,
    };
  });

  const filteredDrivers = driverIncomes.filter((d: any) => 
    d.name.includes(searchTerm) || d.phone?.includes(searchTerm)
  );

  const grandTotal = filteredDrivers.reduce((sum, d) => sum + d.totalAmount, 0);

  const generateDocNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleCreateReceipt = (driverName: string, amount: number) => {
    if (amount <= 0) {
      alert('لا توجد مبالغ مستحقة للقبض من هذا المندوب');
      return;
    }
    setDocModal({
      isOpen: true,
      type: 'receipt',
      driver: { name: driverName, amount },
      docNumber: generateDocNumber(),
      docDate: new Date().toLocaleDateString('ar-IQ')
    });
  };

  const handleCreateDisbursement = (driverName: string, amount: number) => {
    if (amount <= 0) {
      alert('لا توجد عمولات مستحقة لهذا المندوب');
      return;
    }
    setDocModal({
      isOpen: true,
      type: 'disbursement',
      driver: { name: driverName, amount },
      docNumber: generateDocNumber(),
      docDate: new Date().toLocaleDateString('ar-IQ')
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: docModal.type === 'receipt' ? 'سند-قبض' : 'مستند-صرف',
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Remove previous inline style block and replace it down below */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-[#0F3B73]" />
            الواردات المالية من المندوبين
          </h1>
          <p className="text-slate-500 mt-1 font-medium">متابعة واستلام المبالغ المحصلة وصرف عمولات المناديب</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
             <DollarSign className="w-5 h-5 text-emerald-600" />
           </div>
           <div>
             <p className="text-xs font-bold text-emerald-600/80">إجمالي المبالغ المستلمة</p>
             <p className="text-xl font-black font-en">{grandTotal.toLocaleString()} <span className="text-sm">د.ع</span></p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="بحث باسم المندوب أو الهاتف..." 
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
                <th className="px-6 py-4 font-bold text-slate-600">المندوب</th>
                <th className="px-6 py-4 font-bold text-slate-600">الهاتف</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الطلبات المسلمة</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-left">المبالغ المستلمة من الزبائن</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-left">عمولة المندوب</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">لا يوجد مناديب مطابقين للبحث</td>
                </tr>
              ) : (
                filteredDrivers.map((driver: any) => (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                           <CarFront className="w-4 h-4" />
                         </div>
                         {driver.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold font-en text-slate-600">{driver.phone || '-'}</td>
                    <td className="px-6 py-4 font-en font-bold text-slate-600 text-center">{driver.deliveredOrdersCount}</td>
                    <td className="px-6 py-4 font-en font-black text-[#0F3B73] text-left">{driver.totalAmount.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4 font-en font-black text-amber-600 text-left">{driver.totalCommission.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleCreateReceipt(driver.name, driver.totalAmount)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          title="استلام مبالغ الزبائن من المندوب"
                        >
                          <ArrowDownLeft className="w-4 h-4" />
                          سند قبض
                        </button>
                        <button 
                          onClick={() => handleCreateDisbursement(driver.name, driver.totalCommission)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          title="صرف عمولة المندوب"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          مستند صرف
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

      {docModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-100 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col relative overflow-hidden text-right">
            <div className="p-4 flex justify-between items-center bg-white border-b border-slate-200 no-print z-10 shrink-0">
              <button 
                onClick={handlePrint}
                className="bg-[#0F3B73] hover:bg-[#0F3B73]/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors"
              >
                <Printer className="w-5 h-5" />
                طباعة المستند
              </button>
              <button onClick={() => setDocModal({ ...docModal, isOpen: false })} className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-auto">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Scrollable Area */}
            <div className="overflow-auto flex-1 p-4 sm:p-8 flex justify-center items-start print:p-0 print:overflow-visible">
              
              {/* Actual Document Sheet */}
              <div ref={printRef} className="bg-white text-slate-800 border-[8px] border-double border-slate-200 relative shrink-0 mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}>
                <style>{`
                  @media print {
                    @page { size: A4; margin: 0; }
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; background-color: white !important; }
                  }
                `}</style>
                
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Package className="w-[400px] h-[400px]" />
                </div>

                {/* Header */}
                <div className="grid grid-cols-3 gap-4 items-start border-b-2 border-slate-800 pb-6 mb-10">
                  {/* Right: Info */}
                  <div className="space-y-3 text-right pt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-600 text-sm">رقم المستند:</span>
                      <span className="font-en font-black text-xl">{docModal.docNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-600 text-sm">التاريخ:</span>
                      <span className="font-en font-bold text-lg">{docModal.docDate}</span>
                    </div>
                  </div>

                  {/* Center: Title */}
                  <div className="text-center flex flex-col items-center justify-center pt-2">
                    <h2 className="text-3xl font-black text-[#0F3B73] border-b-[3px] border-[#0F3B73] pb-2 inline-block px-4">
                      {docModal.type === 'receipt' ? 'سند قبض مالــي' : 'مستند صـرف مالــي'}
                    </h2>
                  </div>

                  {/* Left: Company Logo */}
                  <div className="flex flex-col items-end text-left pr-4 border-r-2 border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <h3 className="font-black text-xl text-[#0F3B73]">الشركة اللوجستية</h3>
                        <p className="text-xs font-bold text-slate-500">للتوصيل السريع</p>
                      </div>
                      <Package className="w-10 h-10 text-[#0F3B73]" />
                    </div>
                  </div>
                </div>

                {/* Amount Box */}
                <div className="flex mb-12 border border-slate-300 rounded overflow-hidden max-w-[400px]">
                  <div className="bg-slate-100 py-4 px-6 border-l border-slate-300 flex items-center justify-center whitespace-nowrap">
                    <span className="font-bold text-lg text-slate-700">المبلغ رقماً</span>
                  </div>
                  <div className="py-4 px-6 flex-1 flex items-center bg-slate-50">
                    <span className="text-3xl font-black font-en text-[#0F3B73]">{docModal.driver?.amount.toLocaleString()}</span>
                    <span className="text-lg font-bold text-slate-600 mr-3">د.ع</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="space-y-10 text-xl leading-loose">
                  <div className="flex gap-4 items-end border-b-2 border-dotted border-slate-300 pb-3">
                    <span className="font-bold whitespace-nowrap text-slate-600 w-44">السيد / المندوب المكرم:</span>
                    <span className="font-black text-2xl flex-1 text-center pb-1">{docModal.driver?.name}</span>
                  </div>

                  <div className="flex gap-4 items-end border-b-2 border-dotted border-slate-300 pb-3">
                    <span className="font-bold whitespace-nowrap text-slate-600 w-44">وذلك عن طريق:</span>
                    <span className="font-bold text-slate-800 flex-1 text-center pb-1">
                      {docModal.type === 'receipt' 
                        ? 'تسليم المبالغ المحصلة من الزبائن للطلبات المسلمة والمسلمة جزئياً.'
                        : 'استلام عمولات وأجور التوصيل للطلبات التي تم تسليمها بنجاح.'
                      }
                    </span>
                  </div>

                  <div className="flex gap-4 items-end border-b-2 border-dotted border-slate-300 pb-3">
                    <span className="font-bold whitespace-nowrap text-slate-600 w-44">البيان المالي:</span>
                    <span className="font-bold text-slate-800 flex-1 text-center pb-1">
                      {docModal.type === 'receipt' 
                        ? `تم استلام مبلغ وقدره (${docModal.driver?.amount.toLocaleString()} دينار عراقي) كاملة غير منقوصة.`
                        : `تم صرف مبلغ وقدره (${docModal.driver?.amount.toLocaleString()} دينار عراقي) كعمولات مستحقة.`
                      }
                    </span>
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-32 pt-8 flex justify-between px-16 border-t-2 border-slate-200">
                  <div className="text-center space-y-12">
                    <p className="font-bold text-xl text-slate-600">توقيع مسؤول المخزن الفرعي</p>
                    <div className="border-b-2 border-slate-800 w-64 mx-auto"></div>
                  </div>
                  <div className="text-center space-y-12">
                    <p className="font-bold text-xl text-slate-600">توقيع المندوب المستلم / المسلّم</p>
                    <div className="border-b-2 border-slate-800 w-64 mx-auto"></div>
                  </div>
                </div>
                
                {/* Footer Note */}
                <div className="absolute bottom-6 left-0 right-0 text-center text-sm font-bold text-slate-400">
                  طبع من خلال نظام إدارة المخازن اللوجستية - {docModal.docDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

