import NodeCache from 'node-cache';
const cache = new NodeCache();
const ttlShort = Number(process.env.CACHE_TTL_SHORT ?? 8);
const ttlMed = Number(process.env.CACHE_TTL_MED ?? 30);

async function getJSON(url: string, ttl = ttlShort) {
  const key = `json:${url}`;
  const hit = cache.get(key);
  if (hit) return hit as any;
  const res = await fetch(url, { headers: { 'User-Agent': 'bmnr-dash/1.0' } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const data = await res.json();
  cache.set(key, data, ttl);
  return data;
}

// Yahoo Finance quote (unofficial, server-side only)
export async function fetchYahooQuote(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
  const data = await getJSON(url, ttlShort);
  const q = data?.quoteResponse?.result?.[0];
  return {
    symbol,
    price: q?.regularMarketPrice ?? null,
    change: q?.regularMarketChange ?? null,
    changePct: q?.regularMarketChangePercent ?? null,
    dayHigh: q?.regularMarketDayHigh ?? null,
    dayLow: q?.regularMarketDayLow ?? null,
    prevClose: q?.regularMarketPreviousClose ?? null,
    marketCap: q?.marketCap ?? null,
    volume: q?.regularMarketVolume ?? null,
    fiftyTwoWeekHigh: q?.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: q?.fiftyTwoWeekLow ?? null,
    timestamp: Date.now(),
  };
}

// ETH price (CoinGecko public, server-side)
export async function fetchEthUSD() {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;
  const data = await getJSON(url, ttlShort);
  return { symbol: 'ETH', price: data?.ethereum?.usd ?? null, timestamp: Date.now() };
}