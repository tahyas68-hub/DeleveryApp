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

export const dummyOrders: Order[] = [
  { id: '1', trackingNumber: 'TRK-98234-DZ', customerName: 'أحمد محمود', address: 'الجادرية', city: 'بغداد', amount: 35000, status: 'delivered', date: '2023-10-25', driver: 'محمد علي' },
  { id: '2', trackingNumber: 'TRK-23490-SA', customerName: 'سارة خالد', address: 'المنصور', city: 'بغداد', amount: 12000, status: 'shipped', date: '2023-10-26', driver: 'يوسف ياسين' },
  { id: '3', trackingNumber: 'TRK-11234-KU', customerName: 'فهد العتيبي', address: 'شارع الجزائر', city: 'البصرة', amount: 50000, status: 'pending', date: '2023-10-27' },
  { id: '4', trackingNumber: 'TRK-88934-BH', customerName: 'نورة الدوسري', address: 'عنكاوا', city: 'أربيل', amount: 24000, status: 'returned', date: '2023-10-24', driver: 'عمر فهد' },
  { id: '5', trackingNumber: 'TRK-77421-QA', customerName: 'زينب عادل', address: 'كورنيش الموصل', city: 'نينوى', amount: 18000, status: 'processing', date: '2023-10-27' },
  { id: '6', trackingNumber: 'TRK-44321-OM', customerName: 'عبدالله السعيد', address: 'الحلة', city: 'بابل', amount: 9000, status: 'postponed', date: '2023-10-26', driver: 'سعيد القحطاني' },
];

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
