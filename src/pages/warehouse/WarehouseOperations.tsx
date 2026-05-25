import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowDownLeft, 
  Truck, 
  RotateCcw, 
  Send, 
  Box, 
  Calculator,
  ChevronLeft,
  FileText,
  UserX
} from 'lucide-react';
import { motion } from 'motion/react';

const operationCards = [
  {
    id: 'receive',
    title: 'استلام التجهيزات',
    description: 'استلام وتدقيق الطلبات الواصلة من المخزن الرئيسي.',
    icon: ArrowDownLeft,
    to: '/warehouse/incoming',
    color: 'from-blue-500 to-blue-600 shadow-blue-500/20'
  },
  {
    id: 'dispatch',
    title: 'تجهيز المندوبين',
    description: 'تحويل الطلبات المتوفرة للتوزيع والمندوبين.',
    icon: Truck,
    to: '/warehouse/dispatch',
    color: 'from-indigo-500 to-indigo-600 shadow-indigo-500/20'
  },
  {
    id: 'pull_orders',
    title: 'سحب من المندوب',
    description: 'إرجاع الطلبات من ذمة المندوب إلى المخزن الفرعي.',
    icon: UserX,
    to: '/warehouse/pull-orders',
    color: 'from-pink-500 to-pink-600 shadow-pink-500/20'
  },
  {
    id: 'returns',
    title: 'سحب الراجع',
    description: 'استلام المرتجعات من المندوبين إلى المخزن.',
    icon: RotateCcw,
    to: '/warehouse/returns',
    color: 'from-rose-500 to-rose-600 shadow-rose-500/20'
  },
  {
    id: 'transfer',
    title: 'رجوع للمركز',
    description: 'إرسال الراجع إلى المخزن الرئيسي.',
    icon: Send,
    to: '/warehouse/returns-transfer',
    color: 'from-orange-500 to-orange-600 shadow-orange-500/20'
  },
  {
    id: 'inventory',
    title: 'جرد المخزن',
    description: 'عرض كافة الطلبات بالفرع ومراجعة الحالات.',
    icon: Box,
    to: '/warehouse/all-orders',
    color: 'from-violet-500 to-violet-600 shadow-violet-500/20'
  },
  {
    id: 'finance',
    title: 'الحسابات',
    description: 'إدارة المالية وعمولات المناديب والمطالبات.',
    icon: Calculator,
    to: '/warehouse/finance',
    color: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20'
  },
  {
    id: 'reports',
    title: 'التقارير',
    description: 'عرض إحصائيات وتقارير عامة عن طلبات وحالات الفرع.',
    icon: FileText,
    to: '/warehouse/reports',
    color: 'from-amber-500 to-amber-600 shadow-amber-500/20'
  }
];

export default function WarehouseOperations() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-8" dir="rtl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-[#0F3B73]">قائمة العمليات</h1>
        <p className="text-slate-500 font-bold">مركز إدارة المخزن والعمليات اللوجستية للفرع</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
        {operationCards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(card.to)}
            className={`group relative bg-gradient-to-br ${card.color} rounded-3xl p-6 text-right transition-all duration-300 flex items-start gap-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden`}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -left-4 -bottom-4 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity group-hover:scale-110 duration-500 pointer-events-none">
              <card.icon className="w-32 h-32 text-white" />
            </div>

            <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center bg-white/20 text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
              <card.icon className="w-7 h-7" />
            </div>

            <div className="flex flex-col space-y-1.5 relative z-10 w-full pr-1">
              <h3 className="text-lg sm:text-xl font-black text-white">{card.title}</h3>
              <p className="text-white/80 font-medium text-sm leading-relaxed max-w-[200px]">
                {card.description}
              </p>
            </div>
            
            <div className="absolute top-6 left-6 p-2 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
