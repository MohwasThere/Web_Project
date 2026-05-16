'use client';

import { useSubscription } from '@/app/context/SubscriptionContext';
import { Check, Crown } from 'lucide-react';

const plans = [
  { name: "Free", price: 0, period: "forever", popular: false },
  { name: "Basic", price: 9, period: "month", popular: false },
  { name: "Premium", price: 19, period: "month", popular: true },
  { name: "Pro", price: 39, period: "month", popular: false },
];

export default function SubscriptionPage() {
  const { currentPlan, upgradePlan } = useSubscription();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-zinc-400">Current Plan: <span className="text-emerald-400 font-bold">{currentPlan}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlan;
            return (
              <div
                key={plan.name}
                className={`relative bg-zinc-900 border rounded-3xl p-8 ${plan.popular ? 'border-emerald-500 scale-105' : 'border-zinc-800'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-6 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Crown size={16} /> MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-5xl font-bold mb-6">
                  ${plan.price}<span className="text-lg font-normal text-zinc-400">/{plan.period}</span>
                </p>

                <ul className="space-y-3 mb-10 text-zinc-300">
                  {plan.name === "Free" && (
                    <>
                      <li>✓ Basic Features</li>
                      <li>✓ 3 AI Predictions / day</li>
                    </>
                  )}
                  {plan.name === "Basic" && (
                    <>
                      <li>✓ Unlimited AI Predictions</li>
                      <li>✓ Watchlist (30 stocks)</li>
                      <li>✓ Real-time alerts</li>
                    </>
                  )}
                  {plan.name === "Premium" && (
                    <>
                      <li>✓ Everything in Basic</li>
                      <li>✓ Advanced AI Analysis</li>
                      <li>✓ Unlimited Watchlist</li>
                      <li>✓ Portfolio Analytics</li>
                    </>
                  )}
                  {plan.name === "Pro" && (
                    <>
                      <li>✓ Everything in Premium</li>
                      <li>✓ Custom AI Strategies</li>
                      <li>✓ Priority Support</li>
                      <li>✓ No Limits</li>
                    </>
                  )}
                </ul>

                <button
                  onClick={() => upgradePlan(plan.name as any)}
                  disabled={isCurrent}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg ${
                    isCurrent 
                      ? 'bg-zinc-700 cursor-default' 
                      : plan.popular 
                        ? 'bg-emerald-600 hover:bg-emerald-500' 
                        : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}