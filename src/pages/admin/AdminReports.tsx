import React from 'react';
import { FileText, Download, BarChart2 } from 'lucide-react';

export default function AdminReports() {
  const reportsList: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">التقارير</h1>
          <p className="text-slate-500 font-medium mt-1">توليد واستعراض تقارير النظام الشاملة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {reportsList.map(report => (
           <div key={report.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm group hover:border-[#0F3B73]/30 transition-colors">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                 <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{report.title}</h3>
              <p className="text-xs text-slate-500 mb-4 inline-block bg-slate-100 px-2 py-1 rounded">{report.type}</p>
              <button className="w-full flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-bold transition-colors">
                <Download className="w-4 h-4" /> تحميل PDF
              </button>
           </div>
         ))}
      </div>
    </div>
  );
}
