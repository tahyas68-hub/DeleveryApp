import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'merchant' | 'driver';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  username?: string;
  password?: string;
  status: 'active' | 'inactive' | 'busy' | 'offline';
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
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialUsers: AppUser[] = [
  {
    id: 'admin-1',
    name: 'أحمد المسؤول',
    username: 'admin',
    password: '123',
    role: 'admin',
    phone: '0700000000',
    status: 'active'
  },
  {
    id: 'merch-1',
    name: 'بوتيك نايا',
    username: 'merchant',
    password: '123',
    role: 'merchant',
    phone: '0711111111',
    status: 'active',
    balance: 0
  }
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure default users have their credentials if they were saved without them
        let hasAdmin = false;
        const mappedUsers = parsed.map((u: AppUser) => {
          if (u.role === 'admin') {
            hasAdmin = true;
            if (!u.username) {
              return { ...u, username: 'admin', password: '123' };
            }
          }
          if (u.role === 'merchant' && !u.username) {
            return { ...u, username: 'merchant', password: '123' };
          }
          return u;
        });

        if (!hasAdmin) {
          mappedUsers.unshift(initialUsers[0]);
        }
        return mappedUsers;
      } catch (e) {
        console.error("Failed to parse users from localStorage", e);
      }
    }
    return initialUsers;
  });

  React.useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

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

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within UserProvider');
  return context;
};
