import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OrderStatus = 
  | 'merchant_pending' // merchant created, pending admin pickup 
  | 'main_warehouse'   // arrived at main warehouse
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
  driverId?: string;
  driverName?: string;
}

const defaultOrders: MainOrder[] = [];

interface OrderContextType {
  orders: MainOrder[];
  addOrder: (order: MainOrder) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus, extra?: Partial<MainOrder>) => void;
  getOrdersByStatus: (status: OrderStatus) => MainOrder[];
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<MainOrder[]>(() => {
    const saved = localStorage.getItem('app_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
      }
    }
    return defaultOrders;
  });

  React.useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

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

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter(o => o.id !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrdersByStatus, deleteOrder }}>
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
