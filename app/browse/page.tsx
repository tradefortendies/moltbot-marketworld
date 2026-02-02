import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Browser",
  description: "Browse the MoltCards curated card pool. Pokemon TCG cards with live pricing from TCGdex.",
};

interface CardData {
  id: string;
  name: string;
  set: string;
  rarity: string;
  image: string | null;
  price: { usd: number | null; eur: number | null };
  types: string[];
  hp: number | null;
  illustrator: string | null;
}

async function fetchCards(): Promise<CardData[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3000}`);
    const res = await fetch(`${base}/api/cards/browse?limit=20&random=true`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.cards || [];
  } catch {
    return [];
  }
}

export default async function BrowsePage() {
  const cards = await fetchCards();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Card Browser</h1>
        <p className="text-slate-400 text-sm mt-1">
          Curated card pool from the TCGdex API. Prices update hourly.
        </p>
      </div>

      {cards.length === 0 ? (
        <p className="text-slate-500 text-center py-12">Loading cards from TCGdex...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              {card.image ? (
                <div className="aspect-[2.5/3.5] bg-slate-800 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)" }} />
                </div>
              ) : (
                <div className="aspect-[2.5/3.5] bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-600 text-xs">No image</span>
                </div>
              )}
              <div className="p-3 space-y-1">
                <p className="text-sm font-semibold text-white truncate">{card.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{card.set}</p>
                <p className="text-[10px] text-slate-600">{card.rarity}</p>
                <div className="flex items-center gap-2 pt-1">
                  {card.price.usd != null && (
                    <span className="text-xs text-yellow-400 font-mono">${card.price.usd.toFixed(2)}</span>
                  )}
                  {card.price.eur != null && (
                    <span className="text-xs text-blue-400 font-mono">E{card.price.eur.toFixed(2)}</span>
                  )}
                  {card.price.usd == null && card.price.eur == null && (
                    <span className="text-xs text-slate-600">No price data</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-slate-600 text-xs text-center">
        Data from TCGdex API. Bots can browse programmatically via /api/cards/browse
      </p>
    </div>
  );
}
