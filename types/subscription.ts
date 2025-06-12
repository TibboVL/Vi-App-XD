export type Subscription = {
  subscriptionId: number;
  userId: number;
  planId: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  autoRenew: boolean;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxAIRequestsPerDay: number;
  maxAIResultsShown: number;
};

export type Plan = {
  planId: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxAIRequestsPerDay: number;
  maxAIResultsShown: number;
  isActive: boolean;
};
