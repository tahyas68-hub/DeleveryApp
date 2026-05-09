import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'merchant' | 'warehouse' | 'driver';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  status: 'active' | 'inactive' | 'busy' | 'offline';
  // Driver & Warehouse specific
  branch?: string;
  // Driver specific
  rating?: number;
  vehicleType?: 'van' | 'motorcycle' | 'truck';
  maxLoad?: number;
  currentLoad?: number;
  lat?: number;
  lng?: number;
  // Merchant specific
  balance?: number;
  lastClearance?: string;
  // Warehouse specific
  city?: string;
}

interface UserContextType {
  users: AppUser[];
  addUser: (user: Omit<AppUser, 'id'>) => void;
  updateUser: (id: string, data: Partial<AppUser>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialUsers: AppUser[] = [
  { id: '1', name: 'أحمد محمود', role: 'admin', phone: '0770000000', status: 'active' },
  { id: 'MER-1', name: 'بوتيك نايا', role: 'merchant', phone: '0780000000', status: 'active', balance: 500000, lastClearance: '2026-04-28' },
  { id: 'MER-2', name: 'عالم الأزياء', role: 'merchant', phone: '0780000001', status: 'active', balance: 1250000, lastClearance: '2026-05-01' },
  { id: 'MER-3', name: 'متجر الإلكترونيات', role: 'merchant', phone: '0780000002', status: 'active', balance: -25000, lastClearance: '2026-04-30' },
  { id: 'd1', name: 'يوسف ياسين', role: 'driver', phone: '0501234567', branch: 'بغداد - الرصافة', rating: 4.8, vehicleType: 'van', maxLoad: 50, currentLoad: 12, status: 'active', lat: 24.7136, lng: 46.6753 },
  { id: 'd2', name: 'عمر فهد', role: 'driver', phone: '0551234567', branch: 'بغداد - الكرخ', rating: 4.5, vehicleType: 'motorcycle', maxLoad: 10, currentLoad: 10, status: 'busy', lat: 24.7236, lng: 46.6853 },
  { id: 'd3', name: 'محمد علي', role: 'driver', phone: '0561234567', branch: 'البصرة', rating: 4.9, vehicleType: 'truck', maxLoad: 200, currentLoad: 0, status: 'offline' },
  { id: '4', name: 'علي (مخزن البصرة)', role: 'warehouse', phone: '0790000000', branch: 'البصرة', status: 'active', city: 'البصرة' },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);

  const addUser = (user: Omit<AppUser, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, data: Partial<AppUser>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within UserProvider');
  return context;
};
