import React from 'react';
import { MainOrder } from '../context/OrderContext';
import { OrderStatusBadge } from './OrderStatusBadge';
import { MessageCircle, MapPin } from 'lucide-react';

export const OrderTableHeaders = ({ showMerchant = false }) => (
  <>
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">رقم الطلب</th>
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">رقم الشحنة</th>
    {showMerchant && <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">التاجر</th>}
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">العميل</th>
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">العنوان</th>
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">المبلغ</th>
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap text-center">القطع</th>
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">التاريخ</th>
    <th className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap">الحالة</th>
  </>
);

export const OrderTableCells = ({ order, showMerchant = false }: { order: MainOrder, showMerchant?: boolean }) => (
  <>
    <td className="px-4 py-4 font-bold font-en text-[#0F3B73] whitespace-nowrap">{order.id}</td>
    <td className="px-4 py-4 font-bold font-en text-slate-500 whitespace-nowrap">{order.trackingNumber || '-'}</td>
    {showMerchant && (
      <td className="px-4 py-4 font-bold text-slate-700 whitespace-nowrap">{order.merchantName}</td>
    )}
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex flex-col items-start gap-1">
        <span className="font-bold text-slate-800">{order.customerName}</span>
        <div className="flex items-center gap-1 text-slate-500 text-xs font-en">
          <MessageCircle className="w-3 h-3 text-[#10b981]" />
          <span dir="ltr">{order.customerPhone}</span>
        </div>
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex flex-col items-start gap-1">
        <span className="font-bold text-slate-800">{order.province}</span>
        {order.address && (
          <div className="flex items-center gap-1 text-slate-500 text-xs max-w-[150px] truncate" title={order.address}>
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{order.address}</span>
          </div>
        )}
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="font-black text-[#10b981] font-en">
        {order.amount.toLocaleString()} <span className="text-xs font-ar text-slate-500 font-bold">د.ع</span>
      </div>
      {(order.remainingAmount !== undefined || order.receivedAmount !== undefined) && (
        <div className="flex flex-col gap-1 mt-1 font-sans">
          {order.remainingAmount !== undefined && (
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
              المتبقي: {order.remainingAmount.toLocaleString()} د.ع
            </span>
          )}
          {order.receivedAmount !== undefined && (
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
              تم استلام: {order.receivedAmount.toLocaleString()} د.ع
            </span>
          )}
        </div>
      )}
    </td>
    <td className="px-4 py-4 font-black text-slate-800 text-center whitespace-nowrap">{order.pieces || 1}</td>
    <td className="px-4 py-4 text-sm font-bold text-slate-500 font-en whitespace-nowrap">{order.date}</td>
    <td className="px-4 py-4 whitespace-nowrap">
      <OrderStatusBadge status={order.status} />
    </td>
  </>
);
