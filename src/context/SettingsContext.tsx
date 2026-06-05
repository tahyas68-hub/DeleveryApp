import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

export interface GovernoratePrice {
  id: number;
  name: string;
  base: number;
  commission: number;
  peak: number;
  hours: string;
  active: boolean;
}

export interface MerchantPrice {
  id: string; // The merchant user id
  name: string; // Not strictly necessary but keeping for logs if needed
  provincePrices: Record<string, number>;
}

export interface DriverPrice {
  id: string; // The driver user id
  name: string;
  defaultCommission: number;
  provincePrices: Record<string, number>;
}

interface SettingsContextType {
  governorates: GovernoratePrice[];
  updateGovernorate: (id: number, data: Partial<GovernoratePrice>) => void;
  bulkUpdateGovernorates: (govs: GovernoratePrice[]) => void;
  merchants: MerchantPrice[];
  updateMerchant: (id: string, data: Partial<MerchantPrice>) => void;
  driversPricing: DriverPrice[];
  updateDriverPricing: (id: string, data: Partial<DriverPrice>) => void;
  getDeliveryFee: (province: string, merchantId?: string) => number;
  getDriverCommission: (province: string, driverId?: string) => number;
  defaultDriverCommission: number;
  updateDefaultDriverCommission: (val: number) => void;
  requireMerchantApproval: boolean;
  updateRequireMerchantApproval: (val: boolean) => void;
  companyName: string;
  updateCompanyName: (val: string) => void;
  companyLogo: string;
  updateCompanyLogo: (val: string) => void;
  companyPhone: string;
  updateCompanyPhone: (val: string) => void;
  companyAddress: string;
  updateCompanyAddress: (val: string) => void;
}

const defaultGovernorates: GovernoratePrice[] = [
  { id: 1, name: 'بغداد', base: 5000, commission: 0, peak: 20, hours: '04:00 PM - 09:00 PM', active: true },
  { id: 2, name: 'البصرة', base: 6000, commission: 0, peak: 15, hours: '05:00 PM - 10:00 PM', active: true },
  { id: 3, name: 'نينوى', base: 6500, commission: 0, peak: 10, hours: '03:00 PM - 08:00 PM', active: true },
  { id: 4, name: 'أربيل', base: 7000, commission: 0, peak: 25, hours: '06:00 PM - 11:00 PM', active: true },
  { id: 5, name: 'بابل', base: 5500, commission: 0, peak: 0, hours: '-', active: true },
  { id: 6, name: 'النجف', base: 5500, commission: 0, peak: 15, hours: '04:00 PM - 08:00 PM', active: true },
  { id: 7, name: 'ذي قار', base: 6000, commission: 0, peak: 0, hours: '-', active: true },
  { id: 8, name: 'كربلاء', base: 5500, commission: 0, peak: 20, hours: '05:00 PM - 10:00 PM', active: true },
  { id: 9, name: 'واسط', base: 5500, commission: 0, peak: 0, hours: '-', active: true },
  { id: 10, name: 'ميسان', base: 6000, commission: 0, peak: 0, hours: '-', active: true },
  { id: 11, name: 'القادسية', base: 5500, commission: 0, peak: 0, hours: '-', active: true },
  { id: 12, name: 'المثنى', base: 6000, commission: 0, peak: 0, hours: '-', active: true },
  { id: 13, name: 'الأنبار', base: 6500, commission: 0, peak: 0, hours: '-', active: true },
  { id: 14, name: 'صلاح الدين', base: 6000, commission: 0, peak: 0, hours: '-', active: true },
  { id: 15, name: 'ديالى', base: 5500, commission: 0, peak: 0, hours: '-', active: true },
  { id: 16, name: 'كركوك', base: 6000, commission: 0, peak: 0, hours: '-', active: true },
  { id: 17, name: 'السليمانية', base: 7000, commission: 0, peak: 0, hours: '-', active: true },
  { id: 18, name: 'دهوك', base: 7000, commission: 0, peak: 0, hours: '-', active: true },
  { id: 19, name: 'حلبجة', base: 7000, commission: 0, peak: 0, hours: '-', active: true }
];

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const parseLocal = (key: string, def?: any) => {
  const v = localStorage.getItem(key);
  if (v) {
    try { return JSON.parse(v); } catch(e) {}
  }
  return def;
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [defaultDriverCommission, setDefaultDriverCommission] = useFirebaseSync<number>('settings', 'driverCommission', parseInt(localStorage.getItem('app_default_driver_commission') || '0'));
  const [governorates, setGovernorates] = useFirebaseSync<GovernoratePrice[]>('settings', 'governorates', parseLocal('app_governorates', defaultGovernorates));
  const [merchants, setMerchants] = useFirebaseSync<MerchantPrice[]>('settings', 'merchants', parseLocal('app_merchants_pricing', []));
  const [driversPricing, setDriversPricing] = useFirebaseSync<DriverPrice[]>('settings', 'driversPricing', parseLocal('app_drivers_pricing', []));
  const [requireMerchantApproval, setRequireMerchantApproval] = useFirebaseSync<boolean>('settings', 'requireMerchantApproval', localStorage.getItem('app_require_merchant_approval') === 'true' || true);
  const [companyName, setCompanyName] = useFirebaseSync<string>('settings', 'companyName', localStorage.getItem('app_company_name') || '');
  const [companyLogo, setCompanyLogo] = useFirebaseSync<string>('settings', 'companyLogo', localStorage.getItem('app_company_logo') || '');
  const [companyPhone, setCompanyPhone] = useFirebaseSync<string>('settings', 'companyPhone', localStorage.getItem('app_company_phone') || '');
  const [companyAddress, setCompanyAddress] = useFirebaseSync<string>('settings', 'companyAddress', localStorage.getItem('app_company_address') || '');

  const updateGovernorate = (id: number, data: Partial<GovernoratePrice>) => {
    setGovernorates(prev => (prev || []).map(g => g.id === id ? { ...g, ...data } : g));
  };

  const updateMerchant = (id: string, data: Partial<MerchantPrice>) => {
    setMerchants(prev => {
      const p = prev || [];
      const exists = p.find(m => m.id === id);
      if (exists) {
        return p.map(m => m.id === id ? { ...m, ...data } : m);
      } else {
        return [...p, { id, name: data.name || '', provincePrices: data.provincePrices || {} } as MerchantPrice];
      }
    });
  };

  const getDeliveryFee = (province: string, merchantId?: string) => {
    if (merchantId) {
       const normalizedId = merchantId === 'm-1' ? 'merch-1' : merchantId;
       const m = (merchants || []).find(m => m.id === normalizedId);
       if (m && m.provincePrices && m.provincePrices[province] !== undefined && m.provincePrices[province] >= 0) {
         return m.provincePrices[province];
       }
    }
    const gov = (governorates || []).find(g => g.name === province);
    return gov?.base || 0;
  };

  const updateDriverPricing = (id: string, data: Partial<DriverPrice>) => {
    setDriversPricing(prev => {
      const p = prev || [];
      const exists = p.find(d => d.id === id);
      if (exists) {
        return p.map(d => d.id === id ? { ...d, ...data } : d);
      } else {
        return [...p, { id, name: data.name || '', defaultCommission: data.defaultCommission ?? defaultDriverCommission, provincePrices: data.provincePrices || {} } as DriverPrice];
      }
    });
  };

  const getDriverCommission = (province: string, driverId?: string) => {
    if (driverId) {
      const d = (driversPricing || []).find(d => d.id === driverId);
      if (d) {
        if (d.provincePrices && d.provincePrices[province] !== undefined && d.provincePrices[province] >= 0) {
          return d.provincePrices[province];
        }
        if (typeof d.defaultCommission === 'number' && d.defaultCommission > 0) {
          return d.defaultCommission;
        }
      }
    }
    return typeof defaultDriverCommission === 'number' ? defaultDriverCommission : 0;
  };

  const bulkUpdateGovernorates = (newGovs: GovernoratePrice[]) => {
    setGovernorates(newGovs);
  };

  return (
    <SettingsContext.Provider value={{
      governorates: governorates || defaultGovernorates, updateGovernorate, bulkUpdateGovernorates, 
      merchants: merchants || [], updateMerchant,
      driversPricing: driversPricing || [], updateDriverPricing,
      getDeliveryFee, getDriverCommission, 
      defaultDriverCommission: typeof defaultDriverCommission === 'number' ? defaultDriverCommission : 0, updateDefaultDriverCommission: setDefaultDriverCommission,
      requireMerchantApproval: requireMerchantApproval ?? true, updateRequireMerchantApproval: setRequireMerchantApproval,
      companyName: companyName || '', updateCompanyName: setCompanyName,
      companyLogo: companyLogo || '', updateCompanyLogo: setCompanyLogo,
      companyPhone: companyPhone || '', updateCompanyPhone: setCompanyPhone,
      companyAddress: companyAddress || '', updateCompanyAddress: setCompanyAddress
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
