'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Plan = 'Free' | 'Basic' | 'Premium' | 'Pro';

interface SubscriptionContextType {
  currentPlan: Plan;
  upgradePlan: (newPlan: Plan) => void;
  resetUsage: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<Plan>('Free');

  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan') as Plan;
    if (savedPlan) setCurrentPlan(savedPlan);
  }, []);

  const upgradePlan = (newPlan: Plan) => {
    setCurrentPlan(newPlan);
    localStorage.setItem('userPlan', newPlan);
    localStorage.setItem('predictionsUsed', '0'); // Reset usage on upgrade
    alert(`🎉 Successfully upgraded to ${newPlan} Plan!`);
  };

  const resetUsage = () => {
    localStorage.setItem('predictionsUsed', '0');
  };

  return (
    <SubscriptionContext.Provider value={{ currentPlan, upgradePlan, resetUsage }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
};