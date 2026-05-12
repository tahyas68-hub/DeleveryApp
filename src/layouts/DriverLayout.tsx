import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Map, ListTodo, Wallet, User, Bell, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const NavItem = ({ icon: Icon, label, to, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-colors",
      active ? "text-brand" : "text-slate-500 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-6 h-6", active && "fill-brand/20")} />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </Link>
);

export default function DriverLayout() {
  const location = useLocation();

  const navItems = [
    { label: 'المهام', icon: ListTodo, to: '/driver' },
    { label: 'التقارير', icon: FileText, to: '/driver/reports' },
    { label: 'الخريطة', icon: Map, to: '/driver/map' },
    { label: 'المحفظة', icon: Wallet, to: '/driver/wallet' },
    { label: 'حسابي', icon: User, to: '/driver/profile' },
  ];

  return (
    <div className="h-screen w-full bg-[#F8F9FA] flex flex-col font-sans dir-rtl max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-slate-200">
      {/* iOS Status Bar Spacer (Simulated for PWA) */}
      <div className="h-12 w-full bg-[#0F3B73] text-white flex items-end px-4 pb-2 justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight">Delevary Driver</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
            متصل
          </div>
          <Bell className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full h-20 bg-white border-t border-slate-200 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        {navItems.map((item) => (
          <React.Fragment key={item.to}>
            <NavItem 
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
            />
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}
