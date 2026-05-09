import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { dummyOrders } from '../lib/dummy';

export default function CustomerTracking() {
  const { id } = useParams();
  const order = dummyOrders.find(o => o.trackingNumber === id) || dummyOrders[0];
  const [rating, setRating] = useState(0);

  const steps = [
    { label: 'تم استلام الطلب', icon: Package, status: 'completed', time: '10:00 ص' },
    { label: 'في المستودع الرئيسي', icon: CheckCircle2, status: 'completed', time: '11:30 ص' },
    { label: 'في الطريق إليك', icon: Truck, status: order.status === 'shipped' || order.status === 'delivered' ? 'completed' : 'current', time: '02:15 م' },
    { label: 'تم التسليم', icon: MapPin, status: order.status === 'delivered' ? 'completed' : 'pending', time: '' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans dir-rtl">
      {/* Header */}
      <header className="bg-[#0F3B73] text-white p-4">
        <div className="container mx-auto max-w-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B00] rounded text-white flex items-center justify-center font-bold text-lg">D</div>
            <span className="font-bold tracking-tight">Delevary</span>
          </div>
          <div className="text-sm font-medium">تتبع الشحنة</div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-lg p-4 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
          <p className="text-slate-500 text-sm font-medium mb-1">شحنة رقم</p>
          <h2 className="text-2xl font-en font-black text-slate-800 mb-4">{order.trackingNumber}</h2>
          
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold">
            {order.status === 'delivered' ? 'تم التسليم بنجاح' : order.status === 'shipped' ? 'في الطريق إليك' : 'جاري التجهيز'}
          </div>

          <p className="mt-4 text-slate-500 text-sm">
            موعد التسليم المتوقع: <span className="font-bold text-slate-800">اليوم، 04:00 مساءً</span>
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-6">مسار الشحنة</h3>
          
          <div className="relative">
            <div className="absolute top-0 right-5 w-0.5 h-full bg-slate-100"></div>
            
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 shrink-0 border-4 border-white ${
                    step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                    step.status === 'current' ? 'bg-brand text-white shadow-lg shadow-brand/30' : 
                    'bg-slate-200 text-slate-400'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="pt-2 flex-1">
                    <p className={`font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{step.label}</p>
                    {step.time && <p className="text-xs text-slate-500 mt-1">{step.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action / Map placeholder */}
        {order.status === 'shipped' && (
          <div className="bg-white rounded-2xl shadow-sm border border-brand-200 p-6">
            <h3 className="font-bold text-slate-800 mb-2">المندوب في الطريق</h3>
            <p className="text-sm text-slate-500 mb-4">يمكنك تتبع المندوب على الخريطة الآن.</p>
            <div className="h-48 bg-slate-100 rounded-xl mb-4 relative overflow-hidden border border-slate-200">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
               <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-brand rounded-full shadow-[0_0_15px_#FF6B00] animate-pulse"></div>
            </div>
            <button className="w-full bg-[#0F3B73] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" /> تأكيد الاستلام (OTP)
            </button>
          </div>
        )}

        {/* Rating */}
        {order.status === 'delivered' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <h3 className="font-bold text-slate-800 mb-2">كيف كانت تجربتك؟</h3>
            <p className="text-sm text-slate-500 mb-4">قيم المندوب لمساعدتنا على تحسين الخدمة.</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1,2,3,4,5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`text-3xl ${rating >= star ? 'text-amber-400' : 'text-slate-200'} hover:scale-110 transition-transform`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button className="w-full bg-brand text-white py-3 rounded-xl font-bold transition-transform active:scale-95">
                إرسال التقييم
              </button>
            )}
          </div>
        )}
      </main>
      
      <footer className="text-center p-4 text-xs font-bold text-slate-400 tracking-wider">
        Powered by Delevary Logistics
      </footer>
    </div>
  );
}
