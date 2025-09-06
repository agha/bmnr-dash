'use client';
import { useState } from 'react';
const ranges = ["1D","1W","1M","3M","YTD","ALL"] as const;
export type RangeKey = typeof ranges[number];

export default function Header({ onRange }:{ onRange:(r:RangeKey)=>void}) {
  const [r,setR]=useState<RangeKey>('ALL');
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="text-2xl font-bold">BMNR Dashboard</div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Updating every 10s</span>
        <div className="flex bg-[rgba(255,255,255,.06)] rounded-xl overflow-hidden">
          {ranges.map(x=> (
            <button key={x} onClick={()=>{setR(x);onRange(x);}}
              className={`px-3 py-1 ${x===r? 'bg-[var(--accent)] text-white':'text-gray-300'}`}>{x}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
