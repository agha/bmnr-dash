export default function PremiumBadge({ premium }: { premium: number | null }){
  if (premium === null || !isFinite(premium)) return null;
  const pos = premium >= 0; const fmt = premium.toFixed(2)+"%";
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${pos? 'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{pos? 'Premium ':'Discount '}{fmt}</span>
  );
}