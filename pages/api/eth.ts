import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchEthUSD } from '@/lib/fetchers';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try { const eth = await fetchEthUSD(); res.status(200).json(eth); }
  catch (e:any) { res.status(500).json({ error: e.message }); }
}