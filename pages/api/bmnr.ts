import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchYahooQuote } from '@/lib/fetchers';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try { const quote = await fetchYahooQuote('BMNR'); res.status(200).json(quote); }
  catch (e:any) { res.status(500).json({ error: e.message }); }
}