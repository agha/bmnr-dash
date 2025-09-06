import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = `https://query2.finance.yahoo.com/v7/finance/options/BMNR`;
    const r = await fetch(url, { headers: { 'User-Agent': 'bmnr-dash/1.0' } });
    const j = await r.json();
    const chains = j?.optionChain?.result?.[0]?.options?.[0] ?? {};
    res.status(200).json(chains);
  } catch (e:any) { res.status(500).json({ error: e.message }); }
}