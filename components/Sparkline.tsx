'use client';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
export default function Sparkline({ data, dataKey='v' }: { data: any[]; dataKey?: string }){
  return (
    <div className="w-24 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}><Line type="monotone" dataKey={dataKey} dot={false} strokeWidth={2} /></LineChart>
      </ResponsiveContainer>
    </div>
  );
}