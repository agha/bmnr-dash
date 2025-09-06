export type TreasuryInputs = {
  ethHeld: number;     // total ETH tokens held
  cashUSD: number;     // cash and equivalents in USD
  sharesOut: number;   // shares outstanding
  ethPrice: number;    // USD
  stockPrice?: number; // optional for premium/discount
};

export function calcTreasury(i: TreasuryInputs) {
  const ethValue = i.ethHeld * i.ethPrice;
  const nav = ethValue + i.cashUSD;
  const navPerShare = i.sharesOut > 0 ? nav / i.sharesOut : 0;
  const premiumPct = i.stockPrice ? ((i.stockPrice - navPerShare) / navPerShare) * 100 : null;
  return { ethValue, nav, navPerShare, premiumPct };
}