'use client';
import { useEffect, useRef, useState } from 'react';
import Header, { RangeKey } from '@/components/Header';
import Progress from '@/components/Progress';
import ChartArea from '@/components/ChartArea';
import PremiumBadge from '@/components/PremiumBadge';
import KpiCard from '@/components/KpiCard';

const POLL_MS = 10_000;
async function j<T>(u:string){ const r = await fetch(u); if(!r.ok) throw new Error(await r.text()); return r.json() as Promise<T>; }

export default function Page(){
  const [bmnr,setBmnr]=useState<any>(null);
  const [eth,setEth]=useState<any>(null);
  const [treasury,setTreasury]=useState<any>(null);
  const [news,setNews]=useState<any[]>([]);
  const [histBMNR,setHistBMNR]=useState<any[]>([]);
  const [histETH,setHistETH]=useState<any[]>([]);
  const [range,setRange]=useState<RangeKey>('ALL');
  const timer=useRef<any>(null);

  const fetchRange = async (r:RangeKey)=>{
    const days = r==='1D'?1: r==='1W'?7: r==='1M'?30: r==='3M'?90: r==='YTD'?365: 'max';
    const yh = r==='1D'? '5d': r==='1W'? '1mo': r==='1M'? '3mo': r==='3M'? '6mo': r==='YTD'? '1y': 'max';
    const [be, ee] = await Promise.all([
      j<any>(`/api/history/bmnr?range=${yh}`),
      j<any>(`/api/history/eth?days=${days}`)
    ]);
    setHistBMNR(be); setHistETH(ee);
  };

  const refresh = async ()=>{
    const [b,e] = await Promise.all([ j<any>('/api/bmnr'), j<any>('/api/eth') ]);
    setBmnr(b); setEth(e);
    const t = await j<any>(`/api/treasury?ethPrice=${e.price}&stockPrice=${b.price}`);
    setTreasury(t);
    const n = await j<any>('/api/news'); setNews(n);
  };

  useEffect(()=>{ refresh(); fetchRange(range); timer.current=setInterval(refresh,POLL_MS); return ()=>clearInterval(timer.current); },[]);

  const premium = treasury?.premiumPct ?? null;
  const progressPct = Math.min(100, ((treasury?.inputs?.ethHeld ?? 0) / 6_000_000) * 100);

  return (
    <main className="mx-auto max-w-7xl p-4 space-y-4">
      <Header onRange={(r)=>{setRange(r); fetchRange(r);}}/>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Price per Share" value={bmnr?.price?.toFixed?.(2) ?? '—'} />
        <KpiCard label="ETH Price" value={eth?.price?.toLocaleString?.() ?? '—'} />
        <KpiCard label="NAV per Share" value={treasury?.navPerShare?.toFixed?.(2) ?? '—'} />
        <div className="card kpi"><h4>Premium / Discount</h4><div><PremiumBadge premium={premium}/></div></div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><ChartArea data={histBMNR} yfmt={(n)=>`$${n.toFixed(2)}`}/></div>
        <div className=""><ChartArea data={histETH} yfmt={(n)=>`$${n.toFixed(0)}`}/></div>
      </section>

      <section className="card p-4 space-y-3">
        <div className="flex items-center justify-between"><div className="font-semibold">Current accumulation goal</div><div className="text-sm text-gray-300">1866K / 6M ETH</div></div>
        <Progress value={progressPct}/>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Average ETH Buy Price" value="$3,999" />
        <KpiCard label="Unrealized Profit" value={((treasury?.ethValue ?? 0) - (treasury?.inputs?.ethHeld ?? 0)*3999).toLocaleString?.()} />
        <KpiCard label="ETH / 1K Shares" value={((treasury?.inputs?.ethHeld ?? 0) / ((treasury?.inputs?.sharesOut ?? 1)/1000)).toFixed(1)} />
        <KpiCard label="Total USD Holdings" value={treasury?.nav?.toLocaleString?.()} />
        <KpiCard label="Total ETH Value" value={treasury?.ethValue?.toLocaleString?.()} />
        <div className="card p-4"><div className="font-semibold mb-2">Latest News</div><ul className="space-y-2 text-sm">{news?.slice(0,6).map((n,i)=>(<li key={i}><a className="underline" href={n.link} target="_blank" rel="noreferrer">{n.title}</a></li>))}</ul></div>
      </section>

      <footer className="py-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} BMNR Dash — refreshes every 10s</footer>
    </main>
  );
}
