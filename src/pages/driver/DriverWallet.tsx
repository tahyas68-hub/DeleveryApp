import React, { useState } from 'react';
import { Wallet, Package, MapPin, Calendar, CheckCircle2, PercentCircle, Printer } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';

export default function DriverWallet() {
  const { orders } = useOrders();
  const { governorates } = useSettings();
  
  // Filter only the delivered orders (either fully or partially)
  const liabilityOrders = orders.filter(o => o.status === 'delivered' || o.status === 'delivered_partial');

  const totalLiability = liabilityOrders.reduce((sum, order) => {
    const net = typeof order.collectedAmount === 'number' 
      ? order.collectedAmount 
      : ((order.amount || 0) + (order.deliveryFee || 0));
    return sum + net;
  }, 0);

  const totalCommission = liabilityOrders.reduce((sum, order) => {
    return sum + (order.deliveryFee || 0);
  }, 0);

  const displayLiability = totalLiability;
  const displayCommission = totalCommission;

  // For demonstration, let's assume received commissions and delivered to company are 0 for now
  // since DriverWallet doesn't yet track payment transactions.
  // We remove the hardcoded 600,000 and 34,000
  const deliveredToCompany = 0;
  const receivedCommissions = 0;

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-4 sm:px-0 mt-4">
      {/* Page Header */}
      <div className="flex items-center justify-between mt-8 mb-6 print:hidden">
        <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md transition-colors">
          <span className="hidden sm:inline">طباعة الكشف</span>
          <Printer className="w-5 h-5" />
        </button>
        <div className="text-right flex-1 ml-4 justify-end">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">كشف الحساب المالي</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">الموقف المالي والعمولات</p>
        </div>
      </div>

      {/* The 4 large statistic cards */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Card 1: Liability (Blue) */}
        <div className="bg-white border-r-[4px] border-r-blue-600 rounded-[20px] p-4 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <h3 className="text-[13px] font-bold text-slate-500 mb-1 text-right">الذمة المالية (عليه)</h3>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-xl sm:text-2xl font-black font-en text-slate-800 tracking-tight">{displayLiability.toLocaleString()}</span>
            <span className="text-xs font-bold text-blue-600">د.ع</span>
          </div>
        </div>

        {/* Card 2: Delivered to company (Purple) */}
        <div className="bg-white border-r-[4px] border-r-[#9333ea] rounded-[20px] p-4 shadow-sm relative overflow-hidden text-right flex flex-col justify-center">
          <h3 className="text-[13px] font-bold text-slate-500 mb-1">تم تسليمه (للشركة)</h3>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-xl sm:text-2xl font-black font-en text-slate-800 tracking-tight">{deliveredToCompany.toLocaleString()}</span>
            <span className="text-xs font-bold text-[#9333ea]">د.ع</span>
          </div>
        </div>

        {/* Card 3: Net Commission (Green) */}
        <div className="bg-white border-r-[4px] border-r-emerald-500 rounded-[20px] text-right p-4 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <h3 className="text-[13px] font-bold text-slate-500 mb-1">مجموع مبلغ التوصيل</h3>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-xl sm:text-2xl font-black font-en text-slate-800 tracking-tight">{displayCommission.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-500">د.ع</span>
          </div>
        </div>

        {/* Card 4: Received Commissions (Orange) */}
        <div className="bg-white border-r-[4px] border-r-orange-500 rounded-[20px] text-right p-4 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <h3 className="text-[13px] font-bold text-slate-500 mb-1">عمولات مقبوضة</h3>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-xl sm:text-2xl font-black font-en text-slate-800 tracking-tight">{receivedCommissions.toLocaleString()}</span>
            <span className="text-xs font-bold text-orange-500">د.ع</span>
          </div>
        </div>

      </div>

      {/* Financial Details Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-center table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-4 font-bold text-slate-600 text-[15px]">الصافي</th>
                <th className="px-3 py-4 font-bold text-slate-600 text-[15px] border-x border-slate-200">أجور التوصيل</th>
                <th className="px-3 py-4 font-bold text-slate-600 text-[15px]">مبلغ الطلب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liabilityOrders.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-[15px]">لا توجد طلبات مسلمة</p>
                  </td>
                </tr>
              ) : (
                liabilityOrders.map((order) => {
                  const net = typeof order.collectedAmount === 'number'
                    ? order.collectedAmount 
                    : ((order.amount || 0) + (order.deliveryFee || 0));
                  const fee = order.deliveryFee || 0;
                  const itemAmount = net - fee > 0 ? net - fee : 0;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-4 font-en font-bold text-slate-900 bg-slate-50 text-base border-l border-slate-100">
                        {net.toLocaleString()}
                      </td>
                      <td className="px-3 py-4 font-en font-medium text-slate-700 text-base border-x border-slate-100">
                        {fee.toLocaleString()}
                      </td>
                      <td className="px-3 py-4 font-en font-medium text-slate-700 text-base border-r border-slate-100">
                        {itemAmount.toLocaleString()}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            {/* Table Footer with sums */}
            {liabilityOrders.length > 0 && (
              <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                <tr>
                  <td className="px-3 py-4 font-en font-black text-slate-900 bg-slate-100/50 text-lg border-l border-slate-200">
                    {liabilityOrders.reduce((sum, o) => sum + (typeof o.collectedAmount === 'number' ? o.collectedAmount : ((o.amount || 0) + (o.deliveryFee || 0))), 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-4 font-en font-black text-slate-800 border-x border-slate-200 text-lg">
                    {liabilityOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-4 font-en font-black text-slate-800 text-lg border-r border-slate-200">
                    {liabilityOrders.reduce((sum, o) => {
                      const net = typeof o.collectedAmount === 'number' 
                        ? o.collectedAmount 
                        : ((o.amount || 0) + (o.deliveryFee || 0));
                      const fee = o.deliveryFee || 0;
                      const itemAmt = net - fee > 0 ? net - fee : 0;
                      return sum + itemAmt;
                    }, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
