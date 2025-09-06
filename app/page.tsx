'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import KpiCard from '@/components/KpiCard';
import PremiumBadge from '@/components/PremiumBadge';
import Sparkline from '@/components/Sparkline';

const POLL_MS = 10_000; // 10 seconds

async function j<T>(u:string){ const r = await fetch(u); if(!r.ok) throw new Error(await r.text()); return r.json() as Promise<T>; }

export default function Page(){
  const [bmnr,setBmnr]=useState<any>(null);
  const [eth,setEth]=useState<any>(null);
  const [treasury,setTreasury]=useState<any>(null);
  const [news,setNews]=useState<any[]>([]);
  const [history,setHistory]=useState<{t:number; bmnr:number|null; eth:number|null; navps:number|null;}[]>([]);
  const timer=useRef<any>(null);

  const refresh = async ()=>{
    const [b,e] = await Promise.all([ j<any>('/api/bmnr'), j<any>('/api/eth') ]);
    setBmnr(b); setEth(e);
    const t = await j<any>(`/api/treasury?ethPrice=${e.price}&stockPrice=${b.price}`);
    setTreasury(t);
    const n = await j<any>('/api/news'); setNews(n);
    setHistory(h=> [...h.slice(-120), { t: Date.now(), bmnr: b.price??null, eth: e.price??null, navps: t.navPerShare??null }]);
  };

  useEffect(()=>{ refresh(); timer.current=setInterval(refresh,POLL_MS); return ()=>clearInterval(timer.current); },[]);

  const premium = treasury?.premiumPct ?? null;
  const sparkBMNR = useMemo(()=> history.map((p,i)=>({i, v:p.bmnr})), [history]);
  const sparkNAV = useMemo(()=> history.map((p,i)=>({i, v:p.navps})), [history]);
  const sparkETH = useMemo(()=> history.map((p,i)=>({i, v:p.eth})), [history]);

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">BMNR Treasury Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={refresh} className="px-3 py-1.5 rounded-xl bg-black text-white">Refresh</button>
          <span className="text-sm text-gray-500">Auto: 10s</span>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="BMNR" value={<span>${bmnr?.price?.toFixed?.(2) ?? '—'}</span>} sub={<span>{bmnr?.changePct? bmnr.changePct.toFixed(2):'—'}%</span>} right={<Sparkline data={sparkBMNR}/>}/>
        <KpiCard title="ETH" value={<span>${eth?.price?.toLocaleString?.() ?? '—'}</span>} right={<Sparkline data={sparkETH}/>}/>
        <KpiCard title="NAV / Share" value={<span>${treasury?.navPerShare?.toFixed?.(2) ?? '—'}</span>} right={<Sparkline data={sparkNAV}/>}/>
        <KpiCard title="Premium / Discount" value={<PremiumBadge premium={premium}/>}
          sub={<span className="text-xs text-gray-500">Inputs: ETH {treasury?.inputs?.ethHeld?.toLocaleString?.()} • Cash ${treasury?.inputs?.cashUSD?.toLocaleString?.()}</span>}/>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-4 bg-white shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Overview</h2>
            <div className="text-xs text-gray-500">Shares out: {treasury?.inputs?.sharesOut?.toLocaleString?.()}</div>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>ETH value: ${treasury?.ethValue?.toLocaleString?.()}</li>
            <li>Total NAV: ${treasury?.nav?.toLocaleString?.()}</li>
          </ul>
        </div>
        <div className="rounded-2xl p-4 bg-white shadow-soft">
          <h2 className="font-semibold mb-2">Latest News</h2>
          <ul className="space-y-2">
            {news?.slice(0,8).map((n,i)=> (
              <li key={i} className="text-sm"><a className="underline" href={n.link} target="_blank" rel="noreferrer">{n.title}</a><div className="text-xs text-gray-500">{n.pubDate}</div></li>
            ))}
            {(!news||news.length===0) && <div className="text-sm text-gray-500">No recent items.</div>}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl p-4 bg-white shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Options Snapshot (beta)</h2>
          <button onClick={async()=>{ const d = await j<any>('/api/options'); alert(JSON.stringify(d?.calls?.slice?.(0,5) ?? d, null, 2)); }} className="px-3 py-1.5 rounded-xl border">Fetch</button>
        </div>
        <p className="text-sm text-gray-500">Click fetch to preview current chain (top 5 calls). Wire this to your own strike / OI tables later.</p>
      </section>

      <footer className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} BMNR Dash — refreshes every 10s</footer>
    </main>
  );
}