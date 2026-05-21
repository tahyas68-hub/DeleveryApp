import React from 'react';
import { Truck } from 'lucide-react';

interface PrintHeaderProps {
  title: string;
  date?: string;
  reportNumber?: string;
  stats?: { label: string; value: string | number }[];
}

export function PrintHeader({ title, date, reportNumber, stats }: PrintHeaderProps) {
  const currentDate = date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const refNumber = reportNumber || Math.floor(100000 + Math.random() * 900000).toString();

  return (
    <div className="hidden print:block w-full bg-white text-black mb-6" dir="rtl">
      {/* Top Section: Date & Number (Left) and Company (Right) */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-left flex flex-col gap-1">
          <div className="text-sm font-bold">التاريخ: <span className="font-en">{currentDate}</span></div>
          <div className="text-sm font-bold">رقم التقرير: <span className="font-en">{refNumber}</span></div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0F3B73' }}>شركة الراصد</h1>
            <p className="text-sm font-bold text-slate-600 mt-1">للشحن والتوصيل اللوجستي</p>
          </div>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0F3B73' }}>
            <Truck className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
      
      {/* Stats Boxes (if provided) */}
      {stats && stats.length > 0 && (
        <div className="flex border-2 border-black w-full mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`flex-1 text-center py-2 ${idx !== 0 ? 'border-r-2 border-black' : ''}`}>
              <div className="text-sm font-bold text-black border-b-2 border-black pb-1 mb-1">{stat.label}</div>
              <div className="text-xl font-black font-en">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Report Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black inline-block border-b-2 border-black px-8 pb-1 tracking-wider">{title}</h2>
      </div>
    </div>
  );
}
