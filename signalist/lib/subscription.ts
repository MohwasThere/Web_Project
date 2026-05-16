// lib/subscription.ts
export type SubscriptionPlan = 'Free' | 'Basic' | 'Premium' | 'Pro';

export const subscriptionFeatures = {
  Free: {
    maxPredictions: 3,
    refreshHours: 24,
    hasAdvancedAnalysis: false,
  },
  Basic: {
    maxPredictions: 10,
    refreshHours: 6,
    hasAdvancedAnalysis: true,
  },
  Premium: {
    maxPredictions: 999,
    refreshHours: 1,
    hasAdvancedAnalysis: true,
  },
  Pro: {
    maxPredictions: 999,
    refreshHours: 0.5,
    hasAdvancedAnalysis: true,
  },
};