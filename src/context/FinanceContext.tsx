import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FinancialTransaction } from './OrderContext';

interface FinanceContextType {
  transactions: FinancialTransaction[];
  addTransaction: (transaction: Omit<FinancialTransaction, 'id' | 'timestamp'>) => void;
  getTransactionsByOrder: (orderId: string) => FinancialTransaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('app_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem('app_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<FinancialTransaction, 'id' | 'timestamp'>) => {
    const newTx: FinancialTransaction = {
      ...transaction,
      id: "TXN-" + Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const getTransactionsByOrder = (orderId: string) => {
    return transactions.filter(t => t.referenceId === orderId);
  };

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, getTransactionsByOrder }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
