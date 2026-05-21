export interface TipInput {
  bill: number;
  billCurrency: string;
  homeCurrency: string;
  tipPercent: number;
  splitBetween: number;
  roundUp: boolean;
}

export interface LocalTipResult {
  tipAmount: number;
  total: number;
  perPersonBill: number;
  perPersonTip: number;
  perPersonTotal: number;
  effectiveTipPercent: number;
}

export interface TipResult extends LocalTipResult {
  tipAmountHome: number | null;
  totalHome: number | null;
  perPersonTotalHome: number | null;
}
