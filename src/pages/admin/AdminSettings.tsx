import React, { useState } from 'react';
import { Save, Plus, MapPin, Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'delivery' | 'general'>('delivery');
  const { governorates, updateGovernorate } = useSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إعدادات النظام والتسعير</h1>
          <p className="text-slate-500">إدارة تسعيرة التوصيل، أوقات الذروة، والمحافظات.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform flex items-center gap-2 whitespace-nowrap">
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button 
            className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'delivery' ? 'text-primary border-b-2 border-primary bg-primary-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('delivery')}
          >
            تسعيرة التوصيل (المحافظات)
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'general' ? 'text-primary border-b-2 border-primary bg-primary-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('general')}
          >
            الإعدادات العامة
          </button>
        </div>

        {activeTab === 'delivery' && (
          <div>
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <input type="text" placeholder="البحث عن منطقة أو محافظة..." className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
                <button className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors">
                  <Plus className="w-4 h-4" /> إضافة تسعيرة محافظة
                </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">المحافظة</th>
                    <th className="px-6 py-4">السعر الأساسي للتوصيل</th>
                    <th className="px-6 py-4">عمولة النقل</th>
                    <th className="px-6 py-4">زيادة وقت الذروة (%)</th>
                    <th className="px-6 py-4">أوقات الذروة</th>
                    <th className="px-6 py-4">حالة التوصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {governorates.map((gov) => (
                    <tr key={gov.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <MapPin className="w-4 h-4 text-primary" /> {gov.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-24">
                          <input 
                            type="number" 
                            value={gov.base} 
                            onChange={(e) => updateGovernorate(gov.id, { base: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-md px-2 py-1 pr-8 font-en focus:outline-none focus:ring-1 focus:ring-primary" 
                          />
                          <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-bold">د.ع</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-24">
                          <input 
                            type="number" 
                            value={gov.commission} 
                            onChange={(e) => updateGovernorate(gov.id, { commission: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-md px-2 py-1 pr-8 font-en focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                          />
                          <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-bold">د.ع</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-20">
                          <input 
                            type="number" 
                            value={gov.peak} 
                            onChange={(e) => updateGovernorate(gov.id, { peak: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-md px-2 py-1 pr-6 font-en focus:outline-none focus:ring-1 focus:ring-primary" 
                          />
                          <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-bold">%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-en text-slate-600 text-xs font-bold">{gov.hours}</td>
                      <td className="px-6 py-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={gov.active} 
                            onChange={(e) => updateGovernorate(gov.id, { active: e.target.checked })}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 font-medium">
              * يمكن تحديد أسعار خاصة لكل تاجر من خلال <a href="#" className="text-primary hover:underline font-bold">إدارة التجار</a>. الأسعار أعلاه هي الأسعار الافتراضية.
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">سياسة العمولات المحددة من الإدارة</h3>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عمولة المندوب الافتراضية (استقطاع أو نسبة)</label>
                  <div className="relative w-32">
                    <input type="number" defaultValue={20} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-en focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    <span className="absolute left-4 top-2 text-slate-400 font-bold">%</span>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عمولة التاجر الافتراضية</label>
                  <div className="relative w-32">
                    <input type="number" defaultValue={5} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-en focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    <span className="absolute left-4 top-2 text-slate-400 font-bold">%</span>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عمولة النقل للمحافظات</label>
                  <div className="relative w-32">
                    <input type="number" defaultValue={10} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-en focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    <span className="absolute left-4 top-2 text-slate-400 font-bold">%</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">الضريبة والقيمة المضافة</h3>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">نسبة ضريبة القيمة المضافة (VAT)</label>
                  <div className="relative w-32">
                    <input type="number" defaultValue={15} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-en focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    <span className="absolute left-4 top-2 text-slate-400 font-bold">%</span>
                  </div>
               </div>
               <div>
                 <label className="relative inline-flex items-center cursor-pointer mt-2">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-3 text-sm font-bold text-slate-700 mr-3">تضمين الضريبة في سعر التوصيل النهائي</span>
                 </label>
               </div>
            </div>
            
            <div className="space-y-4 md:col-span-2">
               <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">سياسة التوزيع الآلي</h3>
               <div className="flex flex-col md:flex-row gap-8">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الحد الأقصى للطلبات لكل مندوب (في نفس الوقت)</label>
                    <input type="number" defaultValue={40} className="w-full max-w-[200px] bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-en focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">نطاق التوزيع الذكي (كيلومتر)</label>
                    <div className="relative max-w-[200px]">
                      <input type="number" defaultValue={15} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-en focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                      <span className="absolute left-4 top-2 text-slate-400 font-bold text-xs pt-0.5">KM</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
