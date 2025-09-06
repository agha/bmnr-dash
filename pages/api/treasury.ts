import type { NextApiRequest, NextApiResponse } from 'next';
import { calcTreasury } from '@/lib/calc';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ethHeld = Number(process.env.BMNR_TREASURY_ETH ?? 0);
    const cashUSD = Number(process.env.BMNR_CASH_USD ?? 0);
    const sharesOut = Number(process.env.BMNR_SHARES_OUTSTANDING ?? 0);

    const { ethPrice, stockPrice } = req.query;
    const i = calcTreasury({
      ethHeld,
      cashUSD,
      sharesOut,
      ethPrice: Number(ethPrice ?? 0),
      stockPrice: stockPrice ? Number(stockPrice) : undefined,
    });
    res.status(200).json({ ...i, inputs: { ethHeld, cashUSD, sharesOut } });
  } catch (e:any) { res.status(500).json({ error: e.message }); }
}