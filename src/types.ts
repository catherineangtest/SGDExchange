export type TabType = 'dashboard' | 'converter' | 'alerts' | 'analysis';
export type PairDirection = 'foreign_to_sgd' | 'sgd_to_foreign';

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  rateToSGD: number; // 1 Foreign Currency = X SGD (e.g. 1 USD = 1.3452 SGD)
  changePercent: number; // e.g. +0.2, -0.1
  changeAmount: number;
  flagUrl?: string;
  sparkline: number[]; // Array of normalized points 0..100 or rates
  historical30d: { date: string; rate: number }[];
  historical90d: { date: string; rate: number }[];
  high30d: number;
  low30d: number;
  avg30d: number;
  high90d: number;
  low90d: number;
  avg90d: number;
}

export interface AlertItem {
  id: string;
  currencyCode: string;
  targetCurrency: string; // "SGD" or foreign code e.g. "USD", "MYR"
  baseCurrency?: string;  // "USD", "SGD", etc.
  direction?: PairDirection; // 'foreign_to_sgd' or 'sgd_to_foreign'
  condition: 'rises' | 'falls' | 'high_1y' | 'low_1y';
  targetRate: number;
  status: 'active' | 'triggered';
  triggeredAt?: string;
  createdAt: string;
}

export interface ConversionRecord {
  id: string;
  fromCode: string;
  fromAmount: number;
  toCode: string;
  toAmount: number;
  rate: number;
  timestamp: string;
  relativeTime: string;
}
