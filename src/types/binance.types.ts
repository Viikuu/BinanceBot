export type FetchedTrade = {
  a: number;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
  M: boolean;
}

export type ParsedTrade = {
  id: number;
  price: number;
  quantity: number;
  firstTradeId: number;
  lastTradeId: number;
  timestamp: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export type TrendDirection = 'increasing' | 'decreasing' | null;