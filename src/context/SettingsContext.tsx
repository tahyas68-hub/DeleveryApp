import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface SettingsContextType {
  governorates: GovernoratePrice[];
  updateGovernorate: (id: number, data: Partial<GovernoratePrice>) => void;
  bulkUpdateGovernorates: (govs: GovernoratePrice[]) => void;
  merchants: MerchantPrice[];
  updateMerchant: (id: string, data: Partial<MerchantPrice>) => void;
  getDeliveryFee: (province: string, merchantId?: string) => number;
  getDriverCommission: (province: string) => number;
  defaultDriverCommission: number;
  updateDefaultDriverCommission: (val: number) => void;
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
  { id: 13, name: 'الأنبار', base: 6500, commission: 0, peak: 0, hours: '-', active: false },
  { id: 14, name: 'صلاح الدين', base: 6000, commission: 0, peak: 0, hours: '-', active: false },
  { id: 15, name: 'ديالى', base: 5500, commission: 0, peak: 0, hours: '-', active: false },
  { id: 16, name: 'كركوك', base: 6000, commission: 0, peak: 0, hours: '-', active: false },
  { id: 17, name: 'السليمانية', base: 7000, commission: 0, peak: 0, hours: '-', active: false },
  { id: 18, name: 'دهوك', base: 7000, commission: 0, peak: 0, hours: '-', active: false },
  { id: 19, name: 'حلبجة', base: 7000, commission: 0, peak: 0, hours: '-', active: false },
  { id: 20, name: 'أطراف بغداد', base: 6000, commission: 0, peak: 0, hours: '-', active: false },
];

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [defaultDriverCommission, setDefaultDriverCommission] = useState<number>(() => {
    const saved = localStorage.getItem('app_default_driver_commission');
    return saved ? Number(saved) : 3000;
  });

  const [governorates, setGovernorates] = useState<GovernoratePrice[]>(() => {
    const saved = localStorage.getItem('app_governorates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultGovernorates;
  });

  const [merchants, setMerchants] = useState<MerchantPrice[]>(() => {
    const saved = localStorage.getItem('app_merchants_pricing');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem('app_governorates', JSON.stringify(governorates));
  }, [governorates]);

  React.useEffect(() => {
    localStorage.setItem('app_merchants_pricing', JSON.stringify(merchants));
  }, [merchants]);

  React.useEffect(() => {
    localStorage.setItem('app_default_driver_commission', String(defaultDriverCommission));
  }, [defaultDriverCommission]);

  const updateGovernorate = (id: number, data: Partial<GovernoratePrice>) => {
    setGovernorates(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  };

  const updateMerchant = (id: string, data: Partial<MerchantPrice>) => {
    setMerchants(prev => {
      const exists = prev.find(m => m.id === id);
      if (exists) {
        return prev.map(m => m.id === id ? { ...m, ...data } : m);
      } else {
        return [...prev, { id, name: data.name || '', provincePrices: data.provincePrices || {} } as MerchantPrice];
      }
    });
  };

  const getDeliveryFee = (province: string, merchantId?: string) => {
    // 1) First check merchant specific price for this province
    if (merchantId) {
       const m = merchants.find(m => m.id === merchantId);
       if (m && m.provincePrices && m.provincePrices[province] !== undefined && m.provincePrices[province] >= 0) {
         return m.provincePrices[province]; // overwrite the governorate price
       }
    }
    // 2) Fallback to default governorate price
    const gov = governorates.find(g => g.name === province);
    return gov?.base || 0;
  };

  const getDriverCommission = (province: string) => {
    const gov = governorates.find(g => g.name === province);
    return gov?.commission || defaultDriverCommission;
  };

  const bulkUpdateGovernorates = (newGovs: GovernoratePrice[]) => {
    setGovernorates(newGovs);
  };

  return (
    <SettingsContext.Provider value={{
      governorates, updateGovernorate, bulkUpdateGovernorates, merchants, updateMerchant,
      getDeliveryFee, getDriverCommission, defaultDriverCommission, updateDefaultDriverCommission: setDefaultDriverCommission
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
