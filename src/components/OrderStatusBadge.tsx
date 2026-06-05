import React from 'react';
import { Package, Truck, CheckCircle2, AlertTriangle, RotateCcw, Clock, Building2, UserCircle2, Share, CheckCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

export const getStatusText = (status: string) => {
  switch(status) {
    case 'merchant_pending': return 'قيد التنفيذ'; // Using pending for all active processing
    case 'main_warehouse': return 'في المخزن الرئيسي';
    case 'branch_transfering': return 'قيد النقل للفرع';
    case 'branch_warehouse': return 'في مخزن الفرع';
    case 'driver_assigned': return 'بحوزة المندوب';
    case 'delivered': return 'تم التسليم';
    case 'delivered_partial': return 'واصل جزئي';
    case 'returned': return 'رفض';
    case 'returned_partial': return 'راجع جزئي';
    case 'returned_to_merchant': return 'محول للتاجر (راجع)';
    case 'merchant_received_return': return 'راجع مستلم';
    case 'postponed': return 'مؤجل';
    default: return status;
  }
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch(status) {
      case 'merchant_pending': 
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          border: 'border-amber-200',
          icon: <Package className="w-3.5 h-3.5" />
        };
      case 'main_warehouse': 
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          icon: <Building2 className="w-3.5 h-3.5" />
        };
      case 'branch_transfering': 
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          icon: <Share className="w-3.5 h-3.5" />
        };
      case 'branch_warehouse': 
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          icon: <Building2 className="w-3.5 h-3.5" />
        };
      case 'driver_assigned': 
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          icon: <Truck className="w-3.5 h-3.5" />
        };
      case 'delivered': 
        return {
          bg: 'bg-[#E5F5D0]',
          text: 'text-[#10b981]',
          border: 'border-[#10b981]/20',
          icon: <CheckCircle className="w-3.5 h-3.5" />
        };
      case 'returned': 
        return {
          bg: 'bg-red-50',
          text: 'text-red-600',
          border: 'border-red-200',
          icon: <RotateCcw className="w-3.5 h-3.5" />
        };
      case 'returned_partial': 
        return {
          bg: 'bg-red-50',
          text: 'text-red-500',
          border: 'border-red-200',
          icon: <AlertTriangle className="w-3.5 h-3.5" />
        };
      case 'delivered_partial': 
        return {
          bg: 'bg-[#E5F5D0]',
          text: 'text-[#10b981]',
          border: 'border-[#10b981]/20',
          icon: <Package className="w-3.5 h-3.5" />
        };
      case 'returned_to_merchant': 
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-300',
          icon: <RotateCcw className="w-3.5 h-3.5" />
        };
      case 'merchant_received_return':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-200',
          icon: <RotateCcw className="w-3.5 h-3.5" />
        };
      case 'postponed': 
        return {
          bg: 'bg-[#ffedd5]',
          text: 'text-[#ea580c]',
          border: 'border-[#ea580c]/20',
          icon: <Clock className="w-3.5 h-3.5" />
        };
      default: 
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-600',
          border: 'border-slate-200',
          icon: <Package className="w-3.5 h-3.5" />
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${style.bg} ${style.text} border ${style.border} rounded-xl text-[11px] font-bold tracking-wide whitespace-nowrap shadow-sm`}>
      {style.icon}
      <span>{getStatusText(status)}</span>
    </div>
  );
};
