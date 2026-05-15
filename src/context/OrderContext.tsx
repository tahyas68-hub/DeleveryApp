import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OrderStatus = 
  | 'merchant_pending' // merchant created, pending admin pickup 
  | 'main_warehouse'   // arrived at main warehouse
  | 'branch_transfering'
  | 'branch_warehouse'
  | 'driver_assigned'  // with driver
  | 'delivered'        // delivered
  | 'delivered_partial' // واصل جزئي
  | 'returned_partial' // راجع جزئي
  | 'returned'
  | 'returned_to_merchant'
  | 'postponed';

export type FinancialStatus = 
  | 'pending'
  | 'collected_from_driver'
  | 'branch_transferred'
  | 'merchant_paid'
  | 'driver_commission_paid';

export interface MainOrder {
  id: string;
  trackingNumber: string;
  merchantId?: string;
  merchantName: string;
  customerName: string;
  customerPhone: string;
  address: string;
  province: string;
  
  // Financial Fields
  totalAmount: number; // الإجمالي المكتوب (شامل التوصيل)
  deliveryFee: number; // مبلغ التوصيل
  orderAmount: number; // مبلغ الطلب الحقيقي (بدون توصيل)
  collectedAmount: number; // ما تم تحصيله فعلياً
  merchantDue: number; // مستحقات التاجر
  driverCommission: number; // عمولة المندوب
  companyProfit: number; // ربح الشركة
  financialStatus: FinancialStatus;

  // Legacy/Alias Fields for compatibility
  amount: number; 
  
  date: string;
  pieces: number;
  status: OrderStatus;
  driverId?: string;
  driverName?: string;
  branchName?: string;
  isPartial?: boolean;
}

export interface FinancialTransaction {
  id: string;
  type: 'receipt' | 'payment' | 'transfer'; // قبض | صرف | تحويل
  amount: number;
  fromEntity: string; // e.g. branch, driver, admin
  toEntity: string; // e.g. merchant, Admin, driver
  referenceId: string; // orderId
  userId: string;
  timestamp: string;
  description: string;
}

const defaultOrders: MainOrder[] = [];

export interface OrderLog {
  id: string;
  orderId: string;
  trackingNumber?: string;
  action: string;
  details?: string;
  timestamp: string;
  user?: string;
}

interface OrderContextType {
  orders: MainOrder[];
  logs: OrderLog[];
  addOrder: (order: MainOrder) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus, extra?: Partial<MainOrder>) => void;
  getOrdersByStatus: (status: OrderStatus) => MainOrder[];
  deleteOrder: (id: string) => void;
  addLog: (log: Omit<OrderLog, 'id' | 'timestamp'>) => void;
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

  const [logs, setLogs] = useState<OrderLog[]>(() => {
    const saved = localStorage.getItem('app_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse logs from localStorage", e);
      }
    }
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    localStorage.setItem('app_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (log: Omit<OrderLog, 'id' | 'timestamp'>) => {
    const newLog: OrderLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addOrder = (order: MainOrder) => {
    setOrders((prev) => [order, ...prev]);
    addLog({
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      action: 'تم إضافة الطلب',
      details: `بواسطة المتجر ${order.merchantName}`
    });
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus, extra?: Partial<MainOrder>) => {
    setOrders((prev) => 
      prev.map(o => {
        if (o.id === id) {
          addLog({
            orderId: id,
            trackingNumber: o.trackingNumber,
            action: `تحديث حالة الطلب إلى: ${newStatus}`,
            details: extra ? JSON.stringify(extra) : ''
          });
          return { ...o, status: newStatus, ...extra };
        }
        return o;
      })
    );
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(o => o.status === status);
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => {
      const order = prev.find(o => o.id === id);
      if (order) {
        addLog({
          orderId: id,
          trackingNumber: order.trackingNumber,
          action: 'تم حذف الطلب',
          user: 'Admin'
        });
      }
      return prev.filter(o => o.id !== id);
    });
  };

  return (
    <OrderContext.Provider value={{ orders, logs, addOrder, updateOrderStatus, getOrdersByStatus, deleteOrder, addLog }}>
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
