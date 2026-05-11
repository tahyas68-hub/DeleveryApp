import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import DriverLayout from './layouts/DriverLayout';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import MerchantOverview from './pages/merchant/MerchantOverview';
import MerchantFinance from './pages/merchant/MerchantFinance';
import MerchantSettings from './pages/merchant/MerchantSettings';
import TrackingMap from './pages/merchant/TrackingMap';
import DriverApp from './pages/driver/DriverApp';
import CustomerTracking from './pages/CustomerTracking';
import WarehouseIncomingOrders from './pages/warehouse/WarehouseIncomingOrders';

import WarehouseDispatch from './pages/warehouse/WarehouseDispatch';

import DriverMap from './pages/driver/DriverMap';
import DriverWallet from './pages/driver/DriverWallet';

import AdminWarehouses from './pages/admin/AdminWarehouses';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminSettings from './pages/admin/AdminSettings';

import DriverProfile from './pages/driver/DriverProfile';

import DeliveryOrders from './pages/driver/DeliveryOrders';
import DeliverOrder from './pages/driver/DeliverOrder';
import PartialDelivery from './pages/driver/PartialDelivery';
import ReturnOrder from './pages/driver/ReturnOrder';
import PostponeOrder from './pages/driver/PostponeOrder';
import PostponedReturnedOrders from './pages/driver/PostponedReturnedOrders';

import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { UserProvider } from './context/UserContext';
import { BranchProvider } from './context/BranchContext';

import IncomingMerchant from './pages/admin/IncomingMerchant';
import AdminUsers from './pages/admin/AdminUsers';
import Stickers from './pages/admin/Stickers';
import AdminBranches from './pages/admin/AdminBranches';
import DriverCommission from './pages/admin/DriverCommission';
import AdminFinance from './pages/admin/AdminFinance';
import AdminMerchantAccounts from './pages/admin/AdminMerchantAccounts';
import AdminTreasury from './pages/admin/AdminTreasury';
import AdminReports from './pages/admin/AdminReports';
import AdminOperations from './pages/admin/AdminOperations';
import AdminMerchantPricing from './pages/admin/AdminMerchantPricing';
import AdminNotifications from './pages/admin/AdminNotifications';

// Placeholder Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h2>
      <p className="text-slate-500">جاري تطوير هذه الصفحة...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BranchProvider>
          <OrderProvider>
            <BrowserRouter>
          <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/track/:id" element={<CustomerTracking />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="incoming-merchant" element={<IncomingMerchant />} />
          <Route path="warehouses" element={<AdminWarehouses />} />
          <Route path="branches" element={<AdminBranches />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stickers" element={<Stickers />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="driver-commission" element={<DriverCommission />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="merchant-accounts" element={<AdminMerchantAccounts />} />
          <Route path="treasury" element={<AdminTreasury />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="operations" element={<AdminOperations />} />
          <Route path="merchant-pricing" element={<AdminMerchantPricing />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>



        {/* Sub-Warehouse Routes */}
        <Route path="/warehouse" element={<DashboardLayout role="warehouse" />}>
          <Route index element={<WarehouseIncomingOrders />} />
          <Route path="incoming" element={<WarehouseIncomingOrders />} />
          <Route path="dispatch" element={<WarehouseDispatch />} />
          <Route path="returns" element={<PlaceholderPage title="إدارة المرتجعات" />} />
        </Route>

        {/* Merchant Routes */}
        <Route path="/merchant" element={<DashboardLayout role="merchant" />}>
          <Route index element={<MerchantOverview />} />
          <Route path="orders" element={<MerchantDashboard />} />
          <Route path="tracking" element={<TrackingMap />} />
          <Route path="finance" element={<MerchantFinance />} />
          <Route path="settings" element={<MerchantSettings />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/driver" element={<DashboardLayout role="driver" />}>
          <Route index element={<DriverApp />} />
          <Route path="delivery-orders" element={<DeliveryOrders />} />
          <Route path="deliver-order" element={<DeliverOrder />} />
          <Route path="partial-delivery" element={<PartialDelivery />} />
          <Route path="return-order" element={<ReturnOrder />} />
          <Route path="postpone-order" element={<PostponeOrder />} />
          <Route path="postponed-returned-orders" element={<PostponedReturnedOrders />} />
          <Route path="reports" element={<PlaceholderPage title="التقارير" />} />
          <Route path="wallet" element={<DriverWallet />} />
          <Route path="history" element={<PlaceholderPage title="السجل" />} />
          <Route path="finance" element={<PlaceholderPage title="الحسابات" />} />
          <Route path="settings" element={<PlaceholderPage title="الإعدادات" />} />
          <Route path="profile" element={<DriverProfile />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
        </OrderProvider>
        </BranchProvider>
      </UserProvider>
    </AuthProvider>
  );
}

