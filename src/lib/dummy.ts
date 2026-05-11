export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'postponed';

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  address: string;
  amount: number;
  status: OrderStatus;
  date: string;
  driver?: string;
  city: string;
}

export const dummyOrders: Order[] = [];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 }).format(amount);
};

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'delivered': return 'bg-emerald-100 text-emerald-800';
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-slate-200 text-slate-800';
    case 'processing': return 'bg-brand-100 text-brand-800';
    case 'returned': return 'bg-red-100 text-red-800';
    case 'postponed': return 'bg-amber-100 text-amber-800';
    default: return 'bg-slate-200 text-slate-800';
  }
};

export const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'delivered': return 'تم التوصيل';
    case 'shipped': return 'مع المندوب';
    case 'pending': return 'قيد الانتظار';
    case 'processing': return 'قيد التجهيز';
    case 'returned': return 'مرتجع';
    case 'postponed': return 'مؤجل';
    default: return status;
  }
};
