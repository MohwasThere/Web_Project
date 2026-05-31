'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Plan = 'Free' | 'Basic' | 'Premium' | 'Pro';

interface SubscriptionContextType {
  currentPlan: Plan;
  upgradePlan: (newPlan: Plan) => Promise<void>;
  resetUsage: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<Plan>('Free');

  useEffect(() => {
    const loadSubscription = async () => {
      const response = await fetch('/api/subscription', { cache: 'no-store' });
      if (!response.ok) return;

      const payload = (await response.json()) as { plan?: Plan };
      if (payload.plan) {
        setCurrentPlan(payload.plan);
      }
    };

    void loadSubscription();
  }, []);

  const upgradePlan = async (newPlan: Plan) => {
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: newPlan }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    setCurrentPlan(newPlan);
    alert(`🎉 Successfully upgraded to ${newPlan} Plan!`);
  };

  const resetUsage = () => {
    // Quota is tracked server-side; nothing to reset locally.
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
