import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { Clock, Search, Filter, History, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const keyTranslations: Record<string, string> = {
  driverId: 'رمز المندوب',
  driverName: 'اسم المندوب',
  branchName: 'اسم الفرع',
  financialStatus: 'الحالة المالية',
  companyProfit: 'ربح الشركة',
  merchantDue: 'مستحقات التاجر',
  driverCommission: 'عمولة المندوب',
  collectedAmount: 'المبلغ المحصل',
  customerName: 'اسم العميل',
  customerPhone: 'رقم العميل',
  address: 'العنوان',
  province: 'المحافظة',
  status: 'الحالة',
  trackingNumber: 'رقم التتبع',
  totalAmount: 'مبلغ الطلب الإجمالي',
};

const translateKey = (key: string) => keyTranslations[key] || key;

export default function ActionHistory() {
  const { logs } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort logs from newest to oldest
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const filteredLogs = sortedLogs.filter(log => 
    log.orderId.includes(searchTerm) || 
    (log.trackingNumber && log.trackingNumber.includes(searchTerm)) ||
    log.action.includes(searchTerm)
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">سجل العمليات</h1>
            <p className="text-slate-500 font-medium mt-1">تتبع الحركات والتغييرات على الطلبات</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="بحث برقم الطلب، رقم التتبع أو نوع العملية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-right"
            dir="rtl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold text-lg">لا توجد عمليات سابقة</p>
            <p className="text-slate-500 text-sm mt-1">لم يتم تسجيل أي عمليات أو حركات بعد.</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1" dir="ltr">
                    {formatDate(log.timestamp)}
                  </span>
                  <h3 className="font-bold text-slate-800">{log.action}</h3>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold font-en inline-flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {log.orderId}
                  </span>
                  {log.trackingNumber && (
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-md text-xs font-bold font-en">
                      {log.trackingNumber}
                    </span>
                  )}
                  {log.user && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                      {log.user}
                    </span>
                  )}
                </div>
                {log.details && log.details !== '""' && (
                  <div className="text-slate-500 text-sm mt-2 p-3 bg-slate-50 rounded-xl leading-relaxed">
                    {(() => {
                      try {
                        if (log.details.trim().startsWith('{')) {
                          const parsed = JSON.parse(log.details);
                          return (
                            <div className="flex flex-col gap-1 items-start">
                              {Object.entries(parsed).map(([key, value]) => (
                                <span key={key} className="text-slate-600">
                                  <span className="font-bold text-slate-700">{translateKey(key)}:</span> {String(value)}
                                </span>
                              ))}
                            </div>
                          );
                        }
                      } catch (e) {
                        // ignore error
                      }
                      return <span>{log.details.replace(/"/g, '')}</span>;
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
