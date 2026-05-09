import React from 'react';
import { Bell, Send } from 'lucide-react';

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">الإشعارات</h1>
          <p className="text-slate-500 font-medium mt-1">إرسال تعميمات وإشعارات للمستخدمين والفروع</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Send className="w-5 h-5 text-blue-600" /> إرسال إشعار جديد
           </h3>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الفئة المستهدفة</label>
                <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none">
                   <option>جميع المندوبين</option>
                   <option>جميع الفروع</option>
                   <option>جميع التجار</option>
                   <option>شخص محدد</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الإشعار</label>
                <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none" placeholder="اكتب العنوان..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">نص الإشعار</label>
                <textarea rows={4} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none" placeholder="اكتب التفاصيل هنا..."></textarea>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors">
                إرسال الإشعار
              </button>
           </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
           <h3 className="font-bold text-slate-800 mb-6">سجل الإشعارات المرسلة</h3>
           <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-slate-800">تحديث أسعار التوصيل</h4>
                   <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded shadow-sm">قبل يومين</span>
                 </div>
                 <p className="text-sm text-slate-600">تم إرساله إلى: جميع التجار</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
