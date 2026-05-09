import { OrderStatus } from '../lib/dummy';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleType: 'van' | 'motorcycle' | 'truck';
  maxLoad: number;
  currentLoad: number;
  lat?: number;
  lng?: number;
  status: 'active' | 'offline' | 'busy';
}

export interface Warehouse {
  id: string;
  name: string;
  type: 'main' | 'sub';
  city: string;
}

export const dummyDrivers: Driver[] = [
  { id: 'd1', name: 'يوسف ياسين', phone: '0501234567', rating: 4.8, vehicleType: 'van', maxLoad: 50, currentLoad: 12, status: 'active', lat: 24.7136, lng: 46.6753 },
  { id: 'd2', name: 'عمر فهد', phone: '0551234567', rating: 4.5, vehicleType: 'motorcycle', maxLoad: 10, currentLoad: 10, status: 'busy', lat: 24.7236, lng: 46.6853 },
  { id: 'd3', name: 'محمد علي', phone: '0561234567', rating: 4.9, vehicleType: 'truck', maxLoad: 200, currentLoad: 0, status: 'offline' },
];

export const dummyWarehouses: Warehouse[] = [
  { id: 'w1', name: 'المستودع الرئيسي - بغداد', type: 'main', city: 'بغداد' },
  { id: 'w2', name: 'فرع الشمال', type: 'sub', city: 'أربيل' },
  { id: 'w3', name: 'مستودع البصرة المركزي', type: 'main', city: 'البصرة' },
];
