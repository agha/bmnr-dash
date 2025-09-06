import { ReactNode } from "react";
export default function KpiCard({ title, value, sub, right }: { title: string; value: ReactNode; sub?: ReactNode; right?: ReactNode; }) {
  return (
    <div className="rounded-2xl shadow-soft p-4 bg-white flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {sub && <div className="text-sm text-gray-600 mt-1">{sub}</div>}
      </div>
      {right}
    </div>
  );
}