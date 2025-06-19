
import React, { createContext, useContext, useState } from 'react';

interface SecurityContextType {
  batteryLevel: number;
  isLowPowerMode: boolean;
  threatLevel: 'low' | 'medium' | 'high';
  lastScanTime: string;
  isVPNActive: boolean;
  setBatteryLevel: (level: number) => void;
  setIsVPNActive: (active: boolean) => void;
  runQuickScan: () => void;
  toggleLowPowerMode: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [lastScanTime, setLastScanTime] = useState('Never');
  const [isVPNActive, setIsVPNActive] = useState(false);

  const runQuickScan = () => {
    setLastScanTime(new Date().toLocaleString());
    console.log('Running quick scan...');
  };

  const toggleLowPowerMode = () => {
    setIsLowPowerMode(!isLowPowerMode);
  };

  // Auto enable low power mode when battery is below 15%
  React.useEffect(() => {
    if (batteryLevel < 15) {
      setIsLowPowerMode(true);
    }
  }, [batteryLevel]);

  return (
    <SecurityContext.Provider value={{
      batteryLevel,
      isLowPowerMode,
      threatLevel,
      lastScanTime,
      isVPNActive,
      setBatteryLevel,
      setIsVPNActive,
      runQuickScan,
      toggleLowPowerMode
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};
