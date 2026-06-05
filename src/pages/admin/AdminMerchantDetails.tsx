import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store, Package, DollarSign, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useUsers } from '../../context/UserContext';
import { useOrders } from '../../context/OrderContext';

export default function AdminMerchantDetails() {
  const { id } = useParams<{ id: string }>();
  const { users } = useUsers();
  const { orders } = useOrders();

  const merchant = users.find(u => u.id === id && u.role === 'merchant');
  
  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Store className="w-16 h-16 mb-4 text-slate-300" />
        <h2 className="text-xl font-bold">التاجر غير موجود</h2>
        <Link to="/admin/merchants" className="mt-4 text-blue-600 hover:underline">العودة لقائمة التجار</Link>
      </div>
    );
  }

  const merchantOrders = orders.filter(o => o.merchantId === id);
  const deliveredOrders = merchantOrders.filter(o => o.status === 'delivered');
  const returnedOrders = merchantOrders.filter(o => o.status.includes('returned'));
  
  const totalBalance = merchantOrders.reduce((sum, o) => {
    if (o.status === 'delivered') {
      return sum + (o.amount - (o.deliveryFee || 0));
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/merchants" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Store className="w-6 h-6 text-[#0F3B73]" />
              {merchant.name}
            </h1>
            <p className="text-slate-500 mt-1">تفاصيل وحسابات التاجر</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Merchant Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1 border-t-4 border-t-[#0F3B73]">
          <h2 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">معلومات التاجر</h2>
          <div className="space-y-4">
            <div>
               <p className="text-sm text-slate-500 mb-1">اسم المتجر / التاجر</p>
               <p className="font-bold text-slate-800">{merchant.name}</p>
            </div>
            <div>
               <p className="text-sm text-slate-500 mb-1">رقم الهاتف</p>
               <p className="font-en font-bold text-slate-800" dir="ltr">{merchant.phone || 'غير متوفر'}</p>
            </div>
            <div>
               <p className="text-sm text-slate-500 mb-1">اسم المستخدم</p>
               <p className="font-bold text-slate-800 font-en">{merchant.username || 'غير متوفر'}</p>
            </div>
            <div>
               <p className="text-sm text-slate-500 mb-1">حالة الحساب</p>
               {merchant.status === 'active' ? (
                 <span className="text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded text-sm">نشط</span>
               ) : (
                 <span className="text-slate-400 font-bold text-sm">غير نشط</span>
               )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold">إجمالي الطلبات</span>
            </div>
            <p className="text-3xl font-black text-slate-800 font-en">{merchantOrders.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold">الطلبات الواصلة</span>
            </div>
            <p className="text-3xl font-black text-slate-800 font-en">{deliveredOrders.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <ArrowLeft className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold">المرتجعات</span>
            </div>
            <p className="text-3xl font-black text-slate-800 font-en">{returnedOrders.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-slate-400 text-sm font-bold">المستحقات الحالية</span>
            </div>
            <div className="flex items-end gap-1">
              <p className="text-3xl font-black text-slate-800 font-en">{totalBalance.toLocaleString()}</p>
              <span className="text-slate-500 font-bold pb-1">د.ع</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-400" />
            قائمة الطلبات الخاصة بالتاجر
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#0F3B73]/5 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">العميل</th>
                <th className="px-6 py-4 font-bold text-slate-600">المنطقة</th>
                <th className="px-6 py-4 font-bold text-slate-600">المبلغ الكلي</th>
                <th className="px-6 py-4 font-bold text-slate-600">أجور التوصيل</th>
                <th className="px-6 py-4 font-bold text-slate-600">مبلغ الطلب</th>
                <th className="px-6 py-4 font-bold text-slate-600">تاريخ الإنشاء</th>
                <th className="px-6 py-4 font-bold text-slate-600">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {merchantOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-bold">لا توجد طلبات لهذا التاجر</td>
                </tr>
              ) : (
                merchantOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-en font-bold text-[#0F3B73]">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-xs text-slate-500 font-en">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {order.province}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-slate-700">
                      {(order.totalAmount || 0).toLocaleString()} د.ع
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-amber-600">
                      {(order.deliveryFee || 0).toLocaleString()} د.ع
                    </td>
                    <td className="px-6 py-4 font-en font-bold text-blue-600">
                      {(order.amount || 0).toLocaleString()} د.ع
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span className="font-en text-xs">{order.date ? new Date(order.date).toLocaleDateString('en-US') : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                        order.status.includes('returned') ? 'bg-blue-100 text-blue-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status === 'delivered' ? 'واصل' :
                         order.status === 'returned' ? 'راجع كلي' :
                         order.status === 'returned_partial' ? 'راجع جزئي' :
                         'قيد التوصيل'}
                      </span>
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
