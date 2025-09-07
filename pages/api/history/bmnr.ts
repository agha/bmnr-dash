import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const range = req.query.range?.toString() ?? '1mo'; // 1d,5d,1mo,3mo,1y,ytd,max
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/BMNR?range=${range}&interval=1d`;
    const r = await fetch(url,{headers:{'User-Agent':'bmnr-dash/1.0'}});
    const j = await r.json();
    const t = j?.chart?.result?.[0];
    const ts = t?.timestamp??[]; const c = t?.indicators?.quote?.[0]?.close??[];
    const out = ts.map((x:number,i:number)=>({ t:x*1000, v:c[i] }));
    res.status(200).json(out);
  }catch(e:any){res.status(500).json({error:e.message});}
}
