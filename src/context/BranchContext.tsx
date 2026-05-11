import React, { createContext, useContext, useState } from 'react';

export interface Branch {
  id: string;
  name: string;
  city: string;
  manager: string;
  phone: string;
  status: 'active' | 'inactive';
  drivers?: number;
  orders?: number;
}

interface BranchContextType {
  branches: Branch[];
  addBranch: (branch: Omit<Branch, 'id' | 'drivers' | 'orders'>) => void;
  updateBranch: (id: string, data: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('app_branches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse branches from localStorage", e);
      }
    }
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem('app_branches', JSON.stringify(branches));
  }, [branches]);

  const addBranch = (branch: Omit<Branch, 'id' | 'drivers' | 'orders'>) => {
    const newBranch = {
      ...branch,
      id: Math.random().toString(36).substr(2, 9),
      drivers: 0,
      orders: 0
    };
    setBranches(prev => [...prev, newBranch as Branch]);
  };

  const updateBranch = (id: string, data: Partial<Branch>) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BranchContext.Provider value={{ branches, addBranch, updateBranch, deleteBranch }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranches() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranches must be used within a BranchProvider');
  }
  return context;
}
