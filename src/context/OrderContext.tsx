import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OrderStatus = 
  | 'merchant_pending' // merchant created, pending admin pickup 
  | 'main_warehouse'   // arrived at main warehouse
  | 'branch_transfering' // optionally: transferring to branch
  | 'branch_warehouse' // arrived at branch warehouse
  | 'driver_assigned'  // with driver
  | 'delivered'        // delivered
  | 'returned_partial'
  | 'returned'
  | 'postponed';

export interface MainOrder {
  id: string;
  trackingNumber: string;
  merchantName: string;
  customerName: string;
  customerPhone: string;
  address: string;
  province: string;
  amount: number;
  deliveryFee: number;
  totalAmount: number;
  date: string;
  pieces: number;
  status: OrderStatus;
  branchName?: string;
  driverId?: string;
  driverName?: string;
}

const defaultOrders: MainOrder[] = [
  {
    id: 'ORD-1001',
    trackingNumber: 'SHP-992123',
    merchantName: 'بوتيك نايا',
    customerName: 'أحمد محمد',
    customerPhone: '07700000000',
    address: 'المنصور، شارع 14 رمضان',
    province: 'بغداد',
    amount: 15000,
    deliveryFee: 5000,
    totalAmount: 20000,
    date: '2026-05-02',
    pieces: 1,
    status: 'merchant_pending'
  },
  {
    id: 'ORD-1002',
    trackingNumber: 'SHP-992124',
    merchantName: 'سوق الجملة',
    customerName: 'سارة أحمد',
    customerPhone: '07800000000',
    address: 'البصرة، حي الجزائر',
    province: 'البصرة',
    amount: 25000,
    deliveryFee: 6000,
    totalAmount: 31000,
    date: '2026-05-02',
    pieces: 2,
    status: 'main_warehouse'
  },
  {
    id: 'ORD-1003',
    trackingNumber: 'SHP-992125',
    merchantName: 'الكترونيات بغداد',
    customerName: 'محمود علي',
    customerPhone: '07900000000',
    address: 'أربيل، عينكاوا',
    province: 'أربيل',
    amount: 150000,
    deliveryFee: 8000,
    totalAmount: 158000,
    date: '2026-05-02',
    pieces: 1,
    status: 'branch_warehouse',
    branchName: 'فرع أربيل'
  }
];

interface OrderContextType {
  orders: MainOrder[];
  addOrder: (order: MainOrder) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus, extra?: Partial<MainOrder>) => void;
  getOrdersByStatus: (status: OrderStatus) => MainOrder[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<MainOrder[]>(defaultOrders);

  const addOrder = (order: MainOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus, extra?: Partial<MainOrder>) => {
    setOrders((prev) => 
      prev.map(o => o.id === id ? { ...o, status: newStatus, ...extra } : o)
    );
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(o => o.status === status);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrdersByStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
