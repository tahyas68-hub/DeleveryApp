import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, LayoutDashboard, Truck, Users, Settings, 
  Bell, Search, Menu, X, LogOut, FileText, Inbox, Star,
  Warehouse, Building2, ClipboardList, Calculator, Wallet,
  Briefcase, UserCircle, ArrowDown, History, Store,
  Bike, Percent, DollarSign, Shield, Tags, ChevronLeft, ChevronDown, Activity, ArrowRightLeft, PlusCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
      active 
        ? "bg-white/10 text-white font-medium" 
        : "text-white/70 hover:bg-white/5"
    )}
  >
    <Icon className="w-5 h-5 opacity-80" />
    <span>{label}</span>
  </Link>
);

export default function DashboardLayout({ role = 'merchant' }: { role?: 'merchant' | 'admin' | 'warehouse' | 'driver' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    switch(role) {
      case 'admin':
        return [
          { label: 'لوحة التحكم', icon: LayoutDashboard, to: '/admin' },
          { 
            label: 'الطلبات', 
            icon: Package, 
            to: '/admin/orders',
          },
          { label: 'الشحنات الواردة', icon: ArrowDown, to: '/admin/incoming-merchant' },
          { label: 'المخزن الرئيسي', icon: Warehouse, to: '/admin/main-warehouse' },
          { label: 'رواجع الفروع', icon: ArrowRightLeft, to: '/admin/returns' },
          { label: 'الفروع', icon: Building2, to: '/admin/branches' },
          { label: 'المستخدمين', icon: Users, to: '/admin/users' },
          { 
            label: 'التجار', 
            icon: Store, 
            subItems: [
              { label: 'قائمة التجار', to: '/admin/merchants' },
              { label: 'طباعة الستكرات', to: '/admin/stickers' },
            ]
          },
          { 
            label: 'المندوبين', 
            icon: Bike, 
            to: '/admin/drivers',
            subItems: [
              { label: 'عمولة المندوب', icon: Percent, to: '/admin/driver-commission' },
            ]
          },
          { 
            label: 'الحسابات', 
            icon: DollarSign, 
            subItems: [
              { label: 'الحسابات المالية', to: '/admin/finance' },
              { label: 'حسابات التجار', to: '/admin/merchant-accounts' },
              { label: 'واردات الفروع', to: '/admin/branch-incomes' },
              { label: 'الصندوق المالي', icon: Wallet, to: '/admin/treasury' },
            ]
          },
          { label: 'التقارير', icon: FileText, to: '/admin/reports' },
          { label: 'بوابة العمليات', icon: Activity, to: '/admin/operations' },
          { label: 'سجل العمليات', icon: History, to: '/admin/history' },
          { label: 'تسعير التجار', icon: Tags, to: '/admin/merchant-pricing' },
          { label: 'الإشعارات', icon: Bell, to: '/admin/notifications' },
          { label: 'الإعدادات', icon: Settings, to: '/admin/settings' },
        ];
      case 'warehouse':
        return [
          { label: 'قائمة العمليات', icon: ClipboardList, to: '/warehouse' },
          { 
            label: 'المخزن', 
            icon: Warehouse, 
            subItems: [
              { label: 'استلام من المركز الرئيسي', icon: ArrowDown, to: '/warehouse/incoming' },
              { label: 'تحويل إلى مندوب', icon: Truck, to: '/warehouse/dispatch' },
              { label: 'سحب الراجع من مندوب', icon: History, to: '/warehouse/returns' },
              { label: 'تحويل الطلبات الراجعة', icon: ArrowRightLeft, to: '/warehouse/returns-transfer' },
              { label: 'كل الطلبات', icon: Package, to: '/warehouse/all-orders' },
            ]
          },
          { 
            label: 'الحسابات', 
            icon: Calculator, 
            subItems: [
              { label: 'حسابات الفرع', icon: DollarSign, to: '/warehouse/finance' },
              { label: 'مقبوضات من المناديب', icon: Users, to: '/warehouse/incomes' },
            ]
          },
          { label: 'المندوبين', icon: Bike, to: '/warehouse/drivers' },
          { label: 'التقارير', icon: FileText, to: '/warehouse/reports' },
        ];
      case 'driver':
        return [
          { label: 'الرئيسية', icon: LayoutDashboard, to: '/driver' },
          { 
            label: 'العمليات', 
            icon: Package,
            subItems: [
              { label: 'طلبات قيد التوصيل', to: '/driver/delivery-orders' },
              { label: 'تسليم طلب', to: '/driver/deliver-order' },
              { label: 'تسليم جزئي', to: '/driver/partial-delivery' },
              { label: 'إرجاع طلب', to: '/driver/return-order' },
              { label: 'تأجيل طلب', to: '/driver/postpone-order' },
              { label: 'الطلبات المؤجلة الراجعة', to: '/driver/postponed-returned-orders' }
            ]
          },
          { label: 'التقارير', icon: FileText, to: '/driver/reports' },
          { label: 'الحسابات', icon: Wallet, to: '/driver/accounts' },
          { label: 'السجل', icon: History, to: '/driver/history' },
          { label: 'الإعدادات', icon: Settings, to: '/driver/settings' },
        ];
      default: // merchant
        return [
          { label: 'الرئيسية', icon: LayoutDashboard, to: '/merchant' },
          { label: 'الطلبات', icon: Package, to: '/merchant/orders' },
          { label: 'تتبع الشحنات', icon: Truck, to: '/merchant/tracking' },
          { label: 'الكشوفات المالية', icon: FileText, to: '/merchant/finance' },
          { label: 'الإعدادات', icon: Settings, to: '/merchant/settings' },
        ];
    }
  };

  const menuItems = getMenuItems();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'الطلبات': true,
    'التجار': true,
    'المندوبين': true,
    'الحسابات': true,
    'العمليات': true,
  });

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.to || (location.pathname === '/warehouse' && item.to === '/warehouse/incoming');
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openMenus[item.label];

    if (hasSubItems) {
      return (
        <div key={item.label} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all duration-200 text-blue-100/70 hover:bg-white/10 hover:text-white`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.label}
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          
          {isOpen && (
            <div className="pr-10 space-y-1 mt-1">
              {item.subItems.map((subItem: any) => {
                const isSubActive = location.pathname === subItem.to;
                return (
                  <Link
                    key={subItem.to}
                    to={subItem.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isSubActive 
                      ? 'bg-blue-600/30 text-white shadow-sm' 
                      : 'text-blue-100/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {subItem.icon && <subItem.icon className="w-4 h-4 opacity-80" />}
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.to || item.label}
        to={item.to || '#'}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
          isActive 
          ? 'bg-blue-600/30 text-white shadow-sm' 
          : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <item.icon className="w-5 h-5" />
        {item.label}
      </Link>
    );
  };

  const getRoleTitle = () => {
    if (role === 'admin') return 'الإدارة الرئيسية';
    if (role === 'warehouse') return 'مستودع فرع الشمال';
    if (role === 'driver') return 'مندوب توصيل';
    return user?.name || 'بوتيك نايا';
  };
  const getRoleUser = () => {
    if (role === 'admin') return 'مدير نظام';
    if (role === 'warehouse') return 'مدير فرع';
    if (role === 'driver') return 'مندوب';
    return 'تاجر';
  };

  return (
    <div className="min-h-screen bg-background flex text-slate-800 dark:text-white dir-rtl">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 right-0 h-screen w-72 bg-[#0F3B73] text-white flex flex-col transition-transform duration-300 z-50 print:hidden",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-white/10 flex items-start justify-between lg:justify-start">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-black text-blue-400">برنامج الادارة</span>
            <span className="text-sm font-medium text-slate-300">
              {role === 'admin' ? 'بوابة الإدارة' : 
               role === 'warehouse' ? 'بوابة المخزن' : 
               role === 'driver' ? 'بوابة المندوب' : 'بوابة التاجر'}
            </span>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="h-px bg-white/10 w-full mb-4"></div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <p className="text-xs text-slate-300 uppercase font-bold">المنطقة الحالية</p>
          </div>
          <button className="w-full bg-white/5 p-3 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors group">
            <span className="text-sm font-bold text-white">{getRoleTitle()}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-white transition-colors"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-2 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl font-bold transition-colors w-full"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F3F4F6] print:h-auto print:overflow-visible">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex flex-shrink-0 items-center justify-between px-4 lg:px-8 z-30 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative w-64 lg:w-80">
              <input 
                type="text" 
                placeholder="بحث عام سريع..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0F3B73] focus:border-transparent transition-all" 
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-2.5" />
            </div>
            
            <div className="flex items-center gap-3 border-r border-slate-200 pr-6 mr-2">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors text-right group">
                <div className="text-left hidden sm:block rtl:text-right">
                  <p className="text-sm font-bold text-slate-800">{role === 'merchant' ? (user?.name || 'بوتيك نايا') : 'أحمد المسؤول'}</p>
                  <p className="text-xs text-slate-500">{getRoleUser()}</p>
                </div>
                <div className="w-10 h-10 bg-[#0F3B73]/10 text-[#0F3B73] rounded-full flex items-center justify-center font-bold text-lg border border-[#0F3B73]/20">
                  {role === 'merchant' ? (user?.name?.charAt(0) || 'ب') : 'أ'}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600 hidden sm:block"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
