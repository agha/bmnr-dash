import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const days = req.query.days?.toString() ?? 'max'; // 1,7,30,90,365,max
    const url = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}`;
    const r = await fetch(url,{headers:{'User-Agent':'bmnr-dash/1.0'}});
    const j = await r.json();
    const out = (j?.prices??[]).map((p:any)=>({ t:p[0], v:p[1] }));
    res.status(200).json(out);
  }catch(e:any){res.status(500).json({error:e.message});}
}
