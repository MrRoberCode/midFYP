export type BillingPlanId = 'free' | 'trial' | 'plus' | 'pro';

export interface BillingPlan {
  id: BillingPlanId;
  name: string;
  description: string;
  price: number;
  interval: 'month';
  stripeLookupKey?: string;
  features: string[];
}
