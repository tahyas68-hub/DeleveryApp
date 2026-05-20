import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role: "admin" | "merchant" | "warehouse" | "driver";
  email?: string;
  phone?: string;
  storeName?: string;
  storeAddress?: string;
  storeLogoUrl?: string;
  username?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: string, id: string, username?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (name: string, role: string, id: string, username?: string) => {
    const newUser: User = { id, name, role: role as any, username };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
