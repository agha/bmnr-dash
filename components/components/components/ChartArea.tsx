'use client';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function ChartArea({data, yfmt}:{data:any[]; yfmt?:(n:number)=>string;}) {
  return (
    <div className="h-64 card p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{left:12,right:12,top:12,bottom:0}}>
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.6}/>
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="t" tick={{fill:'#94a3b8'}} tickFormatter={(v)=> new Date(v).toLocaleDateString()} />
          <YAxis tick={{fill:'#94a3b8'}} tickFormatter={yfmt}/>
          <Tooltip contentStyle={{background:'#0f1424',border:'1px solid rgba(255,255,255,.08)'}}/>
          <Area dataKey="v" type="monotone" stroke="#a78bfa" fill="url(#g1)" strokeWidth={2}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
