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

export const dummyDrivers: Driver[] = [];

export const dummyWarehouses: Warehouse[] = [];
