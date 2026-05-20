const MAX_DECIMALS = 3;
const FACTOR = 10 ** MAX_DECIMALS;

export const formatAmount = (n: number): string => {
  if (!Number.isFinite(n)) return '0';
  const rounded = Math.round(n * FACTOR) / FACTOR;
  return rounded.toString();
};
