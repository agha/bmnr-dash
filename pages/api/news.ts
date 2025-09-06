import type { NextApiRequest, NextApiResponse } from 'next';
import { parseStringPromise } from 'xml2js';
import NodeCache from 'node-cache';
const cache = new NodeCache();

async function fetchXML(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': 'bmnr-dash/1.0' } });
  const xml = await res.text();
  return parseStringPromise(xml);
}

const defaultSources = [
  'https://feeds.finance.yahoo.com/rss/2.0/headline?s=BMNR&region=US&lang=en-US',
  'https://www.prnewswire.com/rss/news-releases-list.rss',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const key = 'news';
    const hit = cache.get(key);
    if (hit) return res.status(200).json(hit);

    const sources = (process.env.NEWS_SOURCES?.split(',') ?? defaultSources);
    const items: any[] = [];
    for (const url of sources) {
      try {
        const feed = await fetchXML(url);
        const entries = (feed as any)?.rss?.channel?.[0]?.item ?? [];
        for (const it of entries) {
          const title = it.title?.[0] ?? '';
          const link = it.link?.[0] ?? '';
          if (/BMNR|BitMine Immersion|Bitmine/iu.test(title)) {
            items.push({ title, link, pubDate: it.pubDate?.[0] ?? null });
          }
        }
      } catch {}
    }
    items.sort((a,b)=> (new Date(b.pubDate||0).getTime() - new Date(a.pubDate||0).getTime()));
    cache.set(key, items, Number(process.env.CACHE_TTL_MED ?? 30));
    res.status(200).json(items);
  } catch (e:any) { res.status(500).json({ error: e.message }); }
}